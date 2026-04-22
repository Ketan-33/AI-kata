const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const guestsController = require('../controllers/guestsController');
const {
  validate,
  validateQuery,
  createGuestSchema,
  updateGuestSchema,
  guestFilterSchema,
} = require('../utils/validation');

const router = express.Router();

// All guest routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/guests
 * @desc    Get all guests for authenticated user (with filtering/pagination)
 * @access  Private
 */
router.get('/', validateQuery(guestFilterSchema), asyncHandler(guestsController.getGuests));

/**
 * @route   GET /api/guests/:id
 * @desc    Get single guest by ID
 * @access  Private
 */
router.get('/:id', asyncHandler(guestsController.getGuest));

/**
 * @route   POST /api/guests
 * @desc    Create a new guest
 * @access  Private
 */
router.post('/', validate(createGuestSchema), asyncHandler(guestsController.createGuest));

/**
 * @route   PUT /api/guests/:id
 * @desc    Update a guest
 * @access  Private
 */
router.put('/:id', validate(updateGuestSchema), asyncHandler(guestsController.updateGuest));

/**
 * @route   DELETE /api/guests/:id
 * @desc    Delete a guest
 * @access  Private
 */
router.delete('/:id', asyncHandler(guestsController.deleteGuest));

module.exports = router;
