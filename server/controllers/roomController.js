const { validationResult } = require('express-validator');
const RoomPost = require('../models/RoomPost');
const Report = require('../models/Report');
const { findMatchingRequirements } = require('../services/requirementMatcher');
const { notifyMatch } = require('../services/notificationService');

// Get rooms posted by a specific user (public)
const getRoomsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const rooms = await RoomPost.find({ postedBy: userId, isActive: true })
      .populate('postedBy', 'name email college phone')
      .sort({ createdAt: -1 });
    res.json({ rooms });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/rooms
 * @desc    Create a new room listing
 * @access  Private
 */
const createRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      rent,
      location,
      numberOfRoommatesNeeded,
      images,
    } = req.body;

    const room = await RoomPost.create({
      title,
      description,
      rent,
      location,
      numberOfRoommatesNeeded,
      images: images || [],
      postedBy: req.user._id,
    });

    // Find saved requirements that match this new room post and send email notifications.
    const matches = await findMatchingRequirements(room);
    if (matches.length > 0) {
      console.log(`✅ Found ${matches.length} saved requirement(s) matching this room`);
      await Promise.all(
        matches.map(async (match) => {
          const user = match.user;
          if (!user) return;
          await notifyMatch(user, room);
        })
      );
    }

    return res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/rooms
 * @desc    Get all active room listings
 * @access  Public
 */
const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await RoomPost.find({ isActive: true })
      .populate('postedBy', 'name email college phone')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/rooms/mine
 * @desc    Get room listings created by the authenticated user
 * @access  Private
 */
const getMyRooms = async (req, res, next) => {
  try {
    const rooms = await RoomPost.find({ postedBy: req.user._id })
      .populate('postedBy', 'name email college phone')
      .sort({ createdAt: -1 });

    res.json({ rooms });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/rooms/:id/report
 * @desc    Report a room listing for inappropriate content
 * @access  Private
 */
const reportRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Reason for report is required' });
    }

    const room = await RoomPost.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const alreadyReported = await Report.findOne({
      reportedPost: id,
      reportedBy: req.user._id,
      isResolved: false,
    });

    if (alreadyReported) {
      return res.status(409).json({ message: 'You have already reported this listing' });
    }

    const report = await Report.create({
      reportedPost: id,
      reason,
      reportedBy: req.user._id,
    });

    res.status(201).json({ report });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/rooms/search
 * @desc    Search room listings using query params
 * @access  Public
 */
const searchRooms = async (req, res, next) => {
  try {
const { location, query, minRent, maxRent, roommatesNeeded } = req.query;
  const filters = { isActive: true };

  // Allow searching by `query` (generic term) or `location`.
  const searchTerm = query || location;
  if (searchTerm) {
    filters.location = { $regex: searchTerm, $options: 'i' };
    }

    if (minRent) {
      filters.rent = { ...filters.rent, $gte: Number(minRent) };
    }

    if (maxRent) {
      filters.rent = { ...filters.rent, $lte: Number(maxRent) };
    }

    if (roommatesNeeded) {
      filters.numberOfRoommatesNeeded = Number(roommatesNeeded);
    }

    const rooms = await RoomPost.find(filters)
      .populate('postedBy', 'name email college phone')
      .sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/rooms/:id
 * @desc    Get single room listing by id
 * @access  Public
 */
const getRoomById = async (req, res, next) => {
  try {
    const room = await RoomPost.findById(req.params.id).populate(
      'postedBy',
      'name email college phone'
    );

    if (!room || !room.isActive) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/rooms/:id
 * @desc    Update a room post (owner or admin)
 * @access  Private
 */
const updateRoom = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const room = await RoomPost.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only allow owner or admin to update
    if (room.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    const {
      title,
      description,
      rent,
      location,
      numberOfRoommatesNeeded,
      images,
      isActive,
    } = req.body;

    if (title !== undefined) room.title = title;
    if (description !== undefined) room.description = description;
    if (rent !== undefined) room.rent = rent;
    if (location !== undefined) room.location = location;
    if (numberOfRoommatesNeeded !== undefined)
      room.numberOfRoommatesNeeded = numberOfRoommatesNeeded;
    if (images !== undefined) room.images = images;
    if (isActive !== undefined) room.isActive = isActive;

    await room.save();

    res.json(room);
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/rooms/:id
 * @desc    Delete a room post (owner or admin)
 * @access  Private
 */
const deleteRoom = async (req, res, next) => {
  try {
    const room = await RoomPost.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only allow owner or admin to delete
    if (room.postedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await room.deleteOne();
    res.json({ message: 'Room post deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getMyRooms,
  getRoomsByUser,
  searchRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  reportRoom,
};
