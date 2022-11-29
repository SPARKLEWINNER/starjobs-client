const mongoose = require('mongoose')
const Schema = mongoose.Schema
const collectionName = 'users-guests'

const guestSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      default: null,
      required: true
    }
  },
  {timestamps: true}
)
module.exports = mongoose.model('Guest', guestSchema, collectionName)
