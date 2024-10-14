const mongoose = require('mongoose')
const collectionName = 'store-pickup'

const StorePickupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    location: {
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

module.exports = mongoose.model('store-pickup', StorePickupSchema, collectionName)
