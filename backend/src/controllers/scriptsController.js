const prisma = require('../config/database');
const { notFound, forbidden, badRequest } = require('../utils/errors');
const aiService = require('../services/aiService');

/**
 * Generate a script for an episode
 * POST /api/scripts/generate
 */
const generateScript = async (req, res) => {
  const { episodeId, contentType, tone, length, customPrompt } = req.validated;

  // Find episode and verify ownership
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      guest: true,
      script: true,
    },
  });

  if (!episode) {
    notFound('Episode not found');
  }

  if (episode.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  // Generate content using AI service
  const generatedContent = await aiService.generateContent({
    episode,
    contentType,
    tone,
    length,
    customPrompt,
  });

  // Upsert script (create or update)
  const script = await prisma.script.upsert({
    where: { episodeId },
    update: {
      content: generatedContent,
      contentType,
      tone,
      length,
      prompt: customPrompt,
    },
    create: {
      episodeId,
      content: generatedContent,
      contentType,
      tone,
      length,
      prompt: customPrompt,
    },
  });

  // Update episode status if generating full script
  if (contentType === 'full_script' && episode.status === 'draft') {
    await prisma.episode.update({
      where: { id: episodeId },
      data: { status: 'scripted' },
    });
  }

  res.status(201).json({
    ...script,
    episode: {
      id: episode.id,
      title: episode.title,
    },
  });
};

/**
 * Get script for an episode
 * GET /api/scripts/:episodeId
 */
const getScript = async (req, res) => {
  const { episodeId } = req.params;

  // Find episode and verify ownership
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      script: true,
    },
  });

  if (!episode) {
    notFound('Episode not found');
  }

  if (episode.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  if (!episode.script) {
    notFound('No script found for this episode');
  }

  res.json(episode.script);
};

/**
 * Update script content manually
 * PUT /api/scripts/:episodeId
 */
const updateScript = async (req, res) => {
  const { episodeId } = req.params;
  const { content } = req.body;

  if (!content) {
    badRequest('Content is required');
  }

  // Find episode and verify ownership
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      script: true,
    },
  });

  if (!episode) {
    notFound('Episode not found');
  }

  if (episode.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  if (!episode.script) {
    notFound('No script found for this episode');
  }

  const script = await prisma.script.update({
    where: { episodeId },
    data: { content },
  });

  res.json(script);
};

/**
 * Delete script for an episode
 * DELETE /api/scripts/:episodeId
 */
const deleteScript = async (req, res) => {
  const { episodeId } = req.params;

  // Find episode and verify ownership
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      script: true,
    },
  });

  if (!episode) {
    notFound('Episode not found');
  }

  if (episode.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  if (!episode.script) {
    notFound('No script found for this episode');
  }

  await prisma.script.delete({ where: { episodeId } });

  // Revert episode status to draft
  await prisma.episode.update({
    where: { id: episodeId },
    data: { status: 'draft' },
  });

  res.status(204).send();
};

module.exports = {
  generateScript,
  getScript,
  updateScript,
  deleteScript,
};
