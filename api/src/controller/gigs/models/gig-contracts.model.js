const mongoose = require('mongoose')
const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const {Schema, Types} = mongoose
const collectionName = 'gigs-contracts'

const userSchema = new Schema(
  {
    _id: {type: Types.ObjectId, ref: 'Client'},
    location: String,
    companyName: String,
    website: String,
    thumbnail: String,
    rateType: String
  },
  {timestamps: true}
)

const contractSchema = new Schema(
  {
    auid: {
      type: Types.ObjectId,
      ref: 'Client'
    },
    uid: {
      type: Types.ObjectId,
      required: true,
      ref: 'Client'
    },
    user: [userSchema],
    gid: {
      type: Types.ObjectId,
      required: true,
      ref: 'Gigs'
    },
    category: String,
    commissionRate: Number,
    gigFeeType: String,
    records: {
      type: Array,
      required: true,
      default: []
    },
    date: {
      type: Date,
      timezone: timezone
    },
    dateCreated: {
      type: Date,
      timezone: timezone
    }
  },
  {timestamps: true}
)
module.exports = mongoose.model('Contracts', contractSchema, collectionName)
