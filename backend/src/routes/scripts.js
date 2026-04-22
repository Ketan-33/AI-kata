const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const scriptsController = require('../controllers/scriptsController');
const { validate, generateScriptSchema } = require('../utils/validation');

const router = express.Router();

// All script routes require authentication
router.use(requireAuth);

/**
 * @route   POST /api/scripts/generate
 * @desc    Generate AI script for an episode
 * @access  Private
 */
router.post('/generate', validate(generateScriptSchema), asyncHandler(scriptsController.generateScript));

/**
 * @route   GET /api/scripts/:episodeId
 * @desc    Get script for an episode
 * @access  Private
 */
router.get('/:episodeId', asyncHandler(scriptsController.getScript));

/**
 * @route   PUT /api/scripts/:episodeId
 * @desc    Update script content manually
 * @access  Private
 */
router.put('/:episodeId', asyncHandler(scriptsController.updateScript));

/**
 * @route   DELETE /api/scripts/:episodeId
 * @desc    Delete script for an episode
 * @access  Private
 */
router.delete('/:episodeId', asyncHandler(scriptsController.deleteScript));

module.exports = router;
