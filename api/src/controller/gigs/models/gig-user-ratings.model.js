const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'gigs-user-ratings'

const gigRatingSchema = new Schema(
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
    // cid: {
    //   type: Types.ObjectId,
    //   required: true,
    //   ref: 'Client'
    // },
    rates: {
      type: Object,
      required: true
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
module.exports = mongoose.model('Gig Ratings', gigRatingSchema, collectionName)
