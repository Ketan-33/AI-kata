const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const episodesController = require('../controllers/episodesController');
const {
  validate,
  validateQuery,
  createEpisodeSchema,
  updateEpisodeSchema,
  episodeFilterSchema,
} = require('../utils/validation');

const router = express.Router();

// All episode routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/episodes
 * @desc    Get all episodes for authenticated user (with filtering/pagination)
 * @access  Private
 */
router.get('/', validateQuery(episodeFilterSchema), asyncHandler(episodesController.getEpisodes));

/**
 * @route   GET /api/episodes/:id
 * @desc    Get single episode by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(episodesController.getEpisode));

/**
 * @route   POST /api/episodes
 * @desc    Create a new episode
 * @access  Private
 */
router.post('/', validate(createEpisodeSchema), asyncHandler(episodesController.createEpisode));

/**
 * @route   PUT /api/episodes/:id
 * @desc    Update an episode
 * @access  Private
 */
router.put('/:id', validate(updateEpisodeSchema), asyncHandler(episodesController.updateEpisode));

/**
 * @route   DELETE /api/episodes/:id
 * @desc    Delete an episode
 * @access  Private
 */
router.delete('/:id', asyncHandler(episodesController.deleteEpisode));

module.exports = router;
