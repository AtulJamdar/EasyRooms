const express = require('express');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const {
  getStats,
  getUsers,
  getPosts,
  getReports,
  deleteReportedPost,
  blockReporter,
  resolveReport,
} = require('../controllers/adminController');

const router = express.Router();

// All routes under /api/admin are protected and require an admin user
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/posts', getPosts);
router.get('/reports', getReports);
router.post('/reports/:id/delete-post', deleteReportedPost);
router.post('/reports/:id/block-reporter', blockReporter);
router.post('/reports/:id/resolve', resolveReport);

module.exports = router;
