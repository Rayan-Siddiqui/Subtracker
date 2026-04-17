// Import mongoose to create the schema and model
const mongoose = require('mongoose');

// Define the subscription structure
const subscriptionSchema = new mongoose.Schema({
  // Link each subscription to a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Name of the service
  serviceName: {
    type: String,
    required: true,
    trim: true
  },
  // Category like streaming, software, fitness, etc.
  category: {
    type: String,
    required: true,
    trim: true
  },
  // Monthly subscription cost
  monthlyCost: {
    type: Number,
    required: true,
    min: 0
  },
  // Billing date for the next charge
  billingDate: {
    type: Date,
    required: true
  },
  // Optional notes
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Export the Subscription model
module.exports = mongoose.model('Subscription', subscriptionSchema);