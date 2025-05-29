const express = require('express');
const {
  getNgos,
  getNgo,
  createNgo,
  updateNgo,
  deleteNgo,
  getNgosInRadius,
  addNgoRequirement,
  uploadDocuments,
  verifyNgo
} = require('../controllers/ngoController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/').get(getNgos);
router.route('/:id').get(getNgo);
router.get('/radius/:zipcode/:distance', getNgosInRadius);

// Protected routes
router.use(protect);

// NGO and admin can create NGOs
router.route('/').post(authorize('ngo', 'admin'), createNgo);

// NGO owners and admins can update/delete their NGOs
router.route('/:id')
  .put(authorize('ngo', 'admin'), updateNgo)
  .delete(authorize('ngo', 'admin'), deleteNgo);

// NGO owners and admins can add requirements and upload documents
router.post('/:id/requirements', authorize('ngo', 'admin'), addNgoRequirement);
router.put('/:id/documents', authorize('ngo', 'admin'), uploadDocuments);

// Only admins can verify NGOs
router.put('/:id/verify', authorize('admin'), verifyNgo);

module.exports = router; 