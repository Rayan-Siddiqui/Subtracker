// Import mongoose to create the schema and model
const mongoose = require('mongoose');

// Define the user structure
const userSchema = new mongoose.Schema({
  // User's display name
  name: {
    type: String,
    required: true,
    trim: true
  },
  // User's email address
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // Hashed password for security
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Export the User model
module.exports = mongoose.model('User', userSchema);