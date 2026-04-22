const prisma = require('../config/database');
const { notFound, forbidden } = require('../utils/errors');

/**
 * Get all episodes for the authenticated user
 * GET /api/episodes
 */
const getEpisodes = async (req, res) => {
  const { status, search, page, pageSize } = req.validatedQuery;
  const skip = (page - 1) * pageSize;

  // Build where clause
  const where = {
    ownerId: req.user.id,
  };

  if (status && status !== 'all') {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  // Get episodes with pagination
  const [episodes, total] = await Promise.all([
    prisma.episode.findMany({
      where,
      include: {
        guest: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        script: {
          select: {
            id: true,
            contentType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.episode.count({ where }),
  ]);

  // Parse JSON fields
  const data = episodes.map(ep => ({
    ...ep,
    tags: ep.tags ? JSON.parse(ep.tags) : [],
  }));

  res.json({
    data,
    page,
    pageSize,
    total,
  });
};

/**
 * Get a single episode by ID
 * GET /api/episodes/:id
 */
const getEpisode = async (req, res) => {
  const { id } = req.params;

  const episode = await prisma.episode.findUnique({
    where: { id },
    include: {
      guest: true,
      script: true,
      outline: true,
      questions: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!episode) {
    notFound('Episode not found');
  }

  // Ownership check
  if (episode.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  // Parse JSON fields
  const data = {
    ...episode,
    tags: episode.tags ? JSON.parse(episode.tags) : [],
  };

  res.json(data);
};

/**
 * Create a new episode
 * POST /api/episodes
 */
const createEpisode = async (req, res) => {
  const { tags, guestId, ...data } = req.validated;

  // If guestId provided, verify ownership
  if (guestId) {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest || guest.ownerId !== req.user.id) {
      notFound('Guest not found');
    }
  }

  const episode = await prisma.episode.create({
    data: {
      ...data,
      tags: tags ? JSON.stringify(tags) : null,
      guestId,
      ownerId: req.user.id,
    },
    include: {
      guest: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.status(201).json({
    ...episode,
    tags: episode.tags ? JSON.parse(episode.tags) : [],
  });
};

/**
 * Update an episode
 * PUT /api/episodes/:id
 */
const updateEpisode = async (req, res) => {
  const { id } = req.params;
  const { tags, guestId, ...data } = req.validated;

  // Find episode and verify ownership
  const existing = await prisma.episode.findUnique({ where: { id } });

  if (!existing) {
    notFound('Episode not found');
  }

  if (existing.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  // If guestId provided, verify ownership
  if (guestId) {
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest || guest.ownerId !== req.user.id) {
      notFound('Guest not found');
    }
  }

  const updateData = { ...data };
  if (tags !== undefined) {
    updateData.tags = tags ? JSON.stringify(tags) : null;
  }
  if (guestId !== undefined) {
    updateData.guestId = guestId;
  }

  const episode = await prisma.episode.update({
    where: { id },
    data: updateData,
    include: {
      guest: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      script: {
        select: {
          id: true,
          contentType: true,
        },
      },
    },
  });

  res.json({
    ...episode,
    tags: episode.tags ? JSON.parse(episode.tags) : [],
  });
};

/**
 * Delete an episode
 * DELETE /api/episodes/:id
 */
const deleteEpisode = async (req, res) => {
  const { id } = req.params;

  // Find episode and verify ownership
  const existing = await prisma.episode.findUnique({ where: { id } });

  if (!existing) {
    notFound('Episode not found');
  }

  if (existing.ownerId !== req.user.id) {
    forbidden('You do not have access to this episode');
  }

  await prisma.episode.delete({ where: { id } });

  res.status(204).send();
};

module.exports = {
  getEpisodes,
  getEpisode,
  createEpisode,
  updateEpisode,
  deleteEpisode,
};
