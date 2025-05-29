const express = require('express');
const {
  getDonations,
  getDonation,
  createMonetaryDonation,
  createGoodsDonation,
  createOrganDonation,
  updateDonationStatus,
  getDonationStats
} = require('../controllers/donationController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all donations and donation stats (admin only)
router.get('/', getDonations);
router.get('/stats', authorize('admin'), getDonationStats);

// Get single donation
router.get('/:id', getDonation);

// Create donation routes by type
router.post('/monetary', authorize('donor', 'admin'), createMonetaryDonation);
router.post('/goods', authorize('donor', 'admin'), createGoodsDonation);
router.post('/organ', authorize('donor', 'admin'), createOrganDonation);

// Update donation status (NGO and admin only)
router.put('/:id/status', authorize('ngo', 'admin'), updateDonationStatus);

module.exports = router; 