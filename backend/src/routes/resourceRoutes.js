const express = require('express');
const {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
  requestExchange,
  respondToExchange,
  rateExchange
} = require('../controllers/resourceController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Resource CRUD routes
router.route('/')
  .get(getResources)
  .post(authorize('ngo', 'admin'), createResource);

router.route('/:id')
  .get(getResource)
  .put(authorize('ngo', 'admin'), updateResource)
  .delete(authorize('ngo', 'admin'), deleteResource);

// Exchange routes
router.post('/:id/exchange', authorize('ngo', 'admin'), requestExchange);
router.put('/:id/exchange/:exchangeId', authorize('ngo', 'admin'), respondToExchange);
router.put('/:id/exchange/:exchangeId/rate', authorize('ngo', 'admin'), rateExchange);

module.exports = router; 