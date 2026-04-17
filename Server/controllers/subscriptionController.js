// Import the subscription model
const Subscription = require('../models/Subscription');

// Get all subscriptions for the logged-in user
const getSubscriptions = async (req, res) => {
  try {
    // Find subscriptions that belong to the current user
    const subscriptions = await Subscription.find({ userId: req.user.id })
      .sort({ billingDate: 1 });

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    // Get data from request body
    const { serviceName, category, monthlyCost, billingDate, notes } = req.body;

    // Check for required fields
    if (!serviceName || !category || !monthlyCost || !billingDate) {
      return res.status(400).json({ message: 'All required fields must be filled out' });
    }

    // Create new subscription
    const subscription = await Subscription.create({
      userId: req.user.id,
      serviceName,
      category,
      monthlyCost,
      billingDate,
      notes
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing subscription
const updateSubscription = async (req, res) => {
  try {
    // Find subscription by ID
    const subscription = await Subscription.findById(req.params.id);

    // Make sure it exists
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Make sure it belongs to the logged-in user
    if (subscription.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update the subscription
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a subscription
const deleteSubscription = async (req, res) => {
  try {
    // Find subscription by ID
    const subscription = await Subscription.findById(req.params.id);

    // Make sure it exists
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Make sure it belongs to the logged-in user
    if (subscription.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the subscription
    await Subscription.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export controller functions
module.exports = {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};