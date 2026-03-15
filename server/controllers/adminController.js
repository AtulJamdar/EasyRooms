const User = require('../models/User');
const RoomPost = require('../models/RoomPost');
const Report = require('../models/Report');

// Returns basic platform-wide statistics for admin dashboard
const getStats = async (req, res) => {
  const [userCount, postCount, reportCount] = await Promise.all([
    User.countDocuments(),
    RoomPost.countDocuments(),
    Report.countDocuments(),
  ]);

  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('reportedBy', 'name email')
    .populate({
      path: 'reportedPost',
      select: 'title description postedBy',
      populate: { path: 'postedBy', select: 'name email' },
    });

  const topLocations = await RoomPost.aggregate([
    { $match: { location: { $exists: true, $ne: '' } } },
    { $group: { _id: '$location', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { _id: 0, location: '$_id', count: 1 } },
  ]);

  // Rooms posted per week (last 8 weeks)
  const today = new Date();
  const eightWeeksAgo = new Date(today);
  eightWeeksAgo.setDate(today.getDate() - 7 * 8);

  const roomsPerWeek = await RoomPost.aggregate([
    { $match: { createdAt: { $gte: eightWeeksAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          week: { $isoWeek: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
  ]);

  const formattedRoomsPerWeek = roomsPerWeek.map((item) => ({
    week: `${item._id.year}-W${String(item._id.week).padStart(2, '0')}`,
    count: item.count,
  }));

  res.json({
    userCount,
    postCount,
    reportCount,
    reports,
    topLocations,
    roomsPerWeek: formattedRoomsPerWeek,
  });
};

// List all users (for admin review)
const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
};

// List all posts
const getPosts = async (req, res) => {
  const posts = await RoomPost.find().sort({ createdAt: -1 });
  res.json({ posts });
};

// List all reports
const getReports = async (req, res) => {
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .populate('reportedBy', 'name email')
    .populate('reportedPost');
  res.json({ reports });
};

// Delete reported post and mark report resolved
const deleteReportedPost = async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id).populate('reportedPost');
  if (!report) return res.status(404).json({ message: 'Report not found' });

  if (report.reportedPost) {
    await RoomPost.findByIdAndDelete(report.reportedPost._id);
  }

  report.isResolved = true;
  await report.save();

  res.json({ message: 'Reported post deleted and report marked resolved' });
};

// Block the user who made the report (and mark report resolved)
const blockReporter = async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id).populate('reportedBy');
  if (!report) return res.status(404).json({ message: 'Report not found' });

  if (report.reportedBy) {
    await User.findByIdAndUpdate(report.reportedBy._id, { isBlocked: true });
  }

  report.isResolved = true;
  await report.save();

  res.json({ message: 'Reporter blocked and report marked resolved' });
};

// Resolve a report (mark as handled)
const resolveReport = async (req, res) => {
  const { id } = req.params;
  const report = await Report.findById(id);
  if (!report) return res.status(404).json({ message: 'Report not found' });

  report.isResolved = true;
  await report.save();

  res.json({ message: 'Report marked resolved' });
};

module.exports = {
  getStats,
  getUsers,
  getPosts,
  getReports,
  deleteReportedPost,
  blockReporter,
  resolveReport,
};
