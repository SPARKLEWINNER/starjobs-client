const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'gigs-ratings'

const ratingSchema = new Schema(
  {
    uid: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    gid: {
      type: Types.ObjectId,
      required: true,
      ref: 'Gigs'
    },
    rates: {
      type: Object,
      required: true
    },
    isClient: {
      type: Boolean,
      default: false
    },
    isJobster: {
      type: Boolean,
      default: false
    },
    comments: {
      type: String,
      default: null
    },
    skipped: {
      type: Boolean,
      default: false
    },
    dateCreated: Date
  },
  {timestamps: true}
)
module.exports = mongoose.model('Ratings', ratingSchema, collectionName)
