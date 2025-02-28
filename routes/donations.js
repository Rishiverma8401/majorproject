const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Donation = require('../models/Donation'); // Assuming a Donation model exists

/**
 * @route   POST /api/donations
 * @desc    Create a new donation
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { amount, donationType } = req.body;
    
    // Create donation with logged-in user as donor
    const donation = await Donation.create({
      amount,
      donationType,
      donor: req.user.id
    });

    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
});

/**
 * @route   GET /api/donations
 * @desc    Get donations (all for admin, user's own for regular users)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let donations;
    
    // If admin, get all donations
    if (req.user.role === 'admin') {
      donations = await Donation.find().populate('donor', 'name email');
    } else {
      // Otherwise, get only user's donations
      donations = await Donation.find({ donor: req.user.id });
    }

    res.json({
      success: true,
      count: donations.length,
      data: donations
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
