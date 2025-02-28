const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Donation = require('../models/Donation');
const Request = require('../models/Request');

/**
 * @route   GET /api/analytics
 * @desc    Get donation and request analytics
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Get total donations sum
    const donationStats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get donation type breakdown
    const donationByType = await Donation.aggregate([
      {
        $group: {
          _id: '$donationType',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total requests count
    const requestStats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total requests
    const totalRequests = await Request.countDocuments();

    // Get recent activity
    const recentDonations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('donor', 'name');

    const recentRequests = await Request.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('requester', 'name');

    res.json({
      success: true,
      data: {
        donations: {
          total: donationStats.length > 0 ? donationStats[0].totalAmount : 0,
          count: donationStats.length > 0 ? donationStats[0].count : 0,
          byType: donationByType
        },
        requests: {
          total: totalRequests,
          byStatus: requestStats
        },
        recent: {
          donations: recentDonations,
          requests: recentRequests
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

module.exports = router;
