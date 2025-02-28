const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Request = require('../models/Request'); // Assuming a Request model exists

/**
 * @route   POST /api/requests
 * @desc    Create a new donation request
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { description, neededAmount } = req.body;
    
    // Create request with logged-in user as requester
    const request = await Request.create({
      description,
      neededAmount,
      requester: req.user.id,
      status: 'pending' // Default status
    });

    res.status(201).json({
      success: true,
      data: request
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
 * @route   GET /api/requests
 * @desc    Get donation requests (all for admin, user's own for regular users)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let requests;
    
    // If admin, get all requests
    if (req.user.role === 'admin') {
      requests = await Request.find().populate('requester', 'name email');
    } else {
      // Otherwise, get only user's requests
      requests = await Request.find({ requester: req.user.id });
    }

    res.json({
      success: true,
      count: requests.length,
      data: requests
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
