const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');
const { validateQuery, analyticsFilterSchema } = require('../utils/validation');

const router = express.Router();

// All analytics routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/analytics
 * @desc    Get full analytics dashboard data
 * @access  Private
 */
router.get('/', validateQuery(analyticsFilterSchema), asyncHandler(analyticsController.getAnalytics));

/**
 * @route   GET /api/analytics/summary
 * @desc    Get quick summary stats for dashboard cards
 * @access  Private
 */
router.get('/summary', asyncHandler(analyticsController.getSummary));

module.exports = router;
