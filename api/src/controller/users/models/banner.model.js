const mongoose = require('mongoose')

// Define the Banner schema
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'], // Add other statuses if needed
    default: 'inactive'
  },

  image: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    enum: ['jobster', 'client'], // Only allow these two values
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model, adjust as per your user model
    required: true
  }
})

// Create the Banner model
const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner
