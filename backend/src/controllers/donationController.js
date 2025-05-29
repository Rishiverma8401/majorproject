const Donation = require('../models/Donation');
const Ngo = require('../models/Ngo');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin
exports.getDonations = async (req, res, next) => {
  try {
    // For admin - all donations
    // For NGO - only their donations
    // For donor - only their donations
    
    let query;
    
    if (req.user.role === 'admin') {
      query = Donation.find().populate([
        { path: 'ngo', select: 'organizationName' },
        { path: 'donor', select: 'name email' }
      ]);
    } else if (req.user.role === 'ngo') {
      const ngos = await Ngo.find({ user: req.user.id });
      const ngoIds = ngos.map(ngo => ngo._id);
      
      query = Donation.find({ ngo: { $in: ngoIds } }).populate([
        { path: 'ngo', select: 'organizationName' },
        { path: 'donor', select: 'name email' }
      ]);
    } else {
      // Donor
      query = Donation.find({ donor: req.user.id }).populate({
        path: 'ngo',
        select: 'organizationName'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Donation.countDocuments(query);
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const donations = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: donations.length,
      pagination,
      data: donations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id).populate([
      { path: 'ngo', select: 'organizationName mission' },
      { path: 'donor', select: 'name email' }
    ]);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `No donation found with id ${req.params.id}`
      });
    }
    
    // Make sure user is donation owner, NGO owner, or admin
    if (
      donation.donor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      const ngo = await Ngo.findById(donation.ngo);
      if (!ngo || ngo.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this donation'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create monetary donation
// @route   POST /api/donations/monetary
// @access  Private/Donor
exports.createMonetaryDonation = async (req, res, next) => {
  try {
    // Required fields for monetary donation
    const { ngo, amount, currency, paymentMethod } = req.body;
    
    // Check if ngo exists
    const ngoExists = await Ngo.findById(ngo);
    if (!ngoExists) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${ngo}`
      });
    }
    
    // Create a payment intent with Stripe (placeholder)
    // In a real application, you would process the payment and get a transaction ID
    let paymentIntent;
    let transactionId;
    
    try {
      // Placeholder Stripe integration - in a real app, this would be fully implemented
      paymentIntent = {
        id: `pi_${Date.now()}`,
        amount,
        currency,
        status: 'succeeded'
      };
      
      transactionId = paymentIntent.id;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Payment processing failed',
        error: err.message
      });
    }
    
    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      ngo,
      donationType: 'monetary',
      amount,
      currency: currency || 'USD',
      paymentMethod,
      paymentStatus: 'completed',
      transactionId,
      status: 'completed',
      notes: req.body.notes,
      isAnonymous: req.body.isAnonymous || false
    });
    
    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create goods donation
// @route   POST /api/donations/goods
// @access  Private/Donor
exports.createGoodsDonation = async (req, res, next) => {
  try {
    // Required fields for goods donation
    const { 
      ngo, 
      goods,
      logistics,
      notes,
      isAnonymous
    } = req.body;
    
    // Check if ngo exists
    const ngoExists = await Ngo.findById(ngo);
    if (!ngoExists) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${ngo}`
      });
    }
    
    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      ngo,
      donationType: 'goods',
      goods,
      logistics,
      notes,
      isAnonymous: isAnonymous || false,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create organ donation
// @route   POST /api/donations/organ
// @access  Private/Donor
exports.createOrganDonation = async (req, res, next) => {
  try {
    // Required fields for organ donation
    const { 
      ngo, 
      organ,
      notes,
      isAnonymous
    } = req.body;
    
    // Check if ngo exists
    const ngoExists = await Ngo.findById(ngo);
    if (!ngoExists) {
      return res.status(404).json({
        success: false,
        message: `No NGO found with id ${ngo}`
      });
    }
    
    // Ensure consent and legal disclaimer are accepted
    if (!organ.consentGiven || !organ.legalDisclaimerAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Consent and legal disclaimer acceptance are required for organ donations'
      });
    }
    
    // Create donation record
    const donation = await Donation.create({
      donor: req.user.id,
      ngo,
      donationType: 'organ',
      organ,
      notes,
      isAnonymous: isAnonymous || false,
      status: 'pending'
    });
    
    res.status(201).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
// @access  Private/NGO Owner/Admin
exports.updateDonationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }
    
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: `No donation found with id ${req.params.id}`
      });
    }
    
    // Check authorization
    if (req.user.role !== 'admin') {
      const ngo = await Ngo.findById(donation.ngo);
      if (!ngo || ngo.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this donation'
        });
      }
    }
    
    // Update status
    donation.status = status;
    
    // If donation type is monetary and status changed to completed, update payment status as well
    if (donation.donationType === 'monetary' && status === 'completed') {
      donation.paymentStatus = 'completed';
    }
    
    // Add review information
    donation.reviewedBy = req.user.id;
    donation.reviewDate = Date.now();
    
    // Add admin notes if provided
    if (req.body.adminNotes) {
      donation.adminNotes = req.body.adminNotes;
    }
    
    await donation.save();
    
    res.status(200).json({
      success: true,
      data: donation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin
exports.getDonationStats = async (req, res, next) => {
  try {
    // Get total stats
    const totalStats = await Donation.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: '$donationType',
          count: { $sum: 1 },
          totalAmount: {
            $sum: {
              $cond: [{ $eq: ['$donationType', 'monetary'] }, '$amount', 0]
            }
          }
        }
      }
    ]);
    
    // Get monthly stats for current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await Donation.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            donationType: '$donationType'
          },
          count: { $sum: 1 },
          totalAmount: {
            $sum: {
              $cond: [{ $eq: ['$donationType', 'monetary'] }, '$amount', 0]
            }
          }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalStats,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
}; 