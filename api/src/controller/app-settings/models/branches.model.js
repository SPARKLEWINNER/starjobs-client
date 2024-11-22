const mongoose = require('mongoose')
const collectionName = 'store-branches'

const StoreBranchSchema = new mongoose.Schema(
  {
    branch_code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    route: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    lat: {
      type: Number
      //   required: true
    },
    lng: {
      type: Number
      //   required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming there is a User model
      required: true
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('store-branch', StoreBranchSchema, collectionName)
