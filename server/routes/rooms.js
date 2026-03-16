const express = require('express');
const { body } = require('express-validator');
const {
  createRoom,
  getAllRooms,
  getMyRooms,
  getRoomsByUser,
  searchRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  reportRoom,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Create a room post (authenticated users only)
 */
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('rent').isFloat({ min: 0 }).withMessage('Rent must be a positive number'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('numberOfRoommatesNeeded')
      .isInt({ min: 0 })
      .withMessage('Number of roommates needed must be an integer'),
  ],
  createRoom
);

/**
 * Public: Get all active rooms
 */
router.get('/', getAllRooms);

/**
 * Public: Get all active rooms posted by a specific user
 */
router.get('/user/:userId', getRoomsByUser);

/**
 * Private: Get rooms posted by the authenticated user
 */
router.get('/mine', protect, getMyRooms);

/**
 * Public: Search rooms
 */
router.get('/search', searchRooms);

/**
 * Public: Get single room by ID
 */
router.get('/:id', getRoomById);

/**
 * Private: Report a room listing
 */
router.post('/:id/report', protect, reportRoom);

/**
 * Update room (owner or admin)
 */
router.put(
  '/:id',
  protect,
  [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description is required'),
    body('rent')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Rent must be a positive number'),
    body('location')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Location is required'),
    body('numberOfRoommatesNeeded')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Number of roommates needed must be an integer'),
  ],
  updateRoom
);

/**
 * Delete room (owner or admin)
 */
router.delete('/:id', protect, deleteRoom);

module.exports = router;
