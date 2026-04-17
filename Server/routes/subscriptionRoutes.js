// Import Express router
const express = require('express');

// Import controller functions
const {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscriptionController');

// Import auth protection middleware
const { protect } = require('../middleware/authMiddleware');

// Create router
const router = express.Router();

// Get all subscriptions
router.get('/', protect, getSubscriptions);

// Create a new subscription
router.post('/', protect, createSubscription);

// Update a subscription
router.put('/:id', protect, updateSubscription);

// Delete a subscription
router.delete('/:id', protect, deleteSubscription);

// Export router
module.exports = router;