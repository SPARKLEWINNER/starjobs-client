const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'users-feedbacks'

const feedbackSchema = new Schema(
  {
    uid: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    accountType: {
      type: Number,
      default: 0
    },
    comments: {
      type: String,
      default: null
    }
  },
  {timestamps: true}
)
module.exports = mongoose.model('Feedback', feedbackSchema, collectionName)
