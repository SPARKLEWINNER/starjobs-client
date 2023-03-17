const mongoose = require('mongoose')
const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const {Schema, Types} = mongoose
const collectionName = 'gigs'
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

const gigsData = {
  auid: {type: Types.ObjectId, ref: 'Client'},
  from: String,
  time: String,
  shift: String,
  hours: String,
  fee: String,
  date: String,
  breakHr: String,
  uid: {
    type: Types.ObjectId,
    required: true,
    ref: 'Client'
  },
  category: String,
  position: String,
  location: String,
  contactNumber: String,
  isApprove: {
    type: Boolean,
    default: false
  },
  notes: String,
  dateCreated: {
    type: Date,
    timezone: timezone
  },
  user: [userSchema],
  status: {
    type: String,
    default: 'Waiting',
    enum: [
      'Waiting',
      'Applying',
      'Accepted',
      'Confirm-Gig',
      'On-the-way',
      'Arrived',
      'Confirm-Arrived',
      'On-going',
      'End-Shift',
      'Confirm-End-Shift',
      'Paid',
      'Complete',
      'No-Appearance',
      'Cancelled',
      'Archived',
      'Contracts'
    ]
  },
  statusMessage: {
    type: String
  },
  locationRate: {
    default: 'NCR',
    type: String,
    enum: ['NCR', 'Provincial', 'Not applicable']
  },
  late: {
    type: String,
    default: null
  },
  fees: {
    computedFeeByHr: String,
    voluntaryFee: String,
    appFee: String,
    transactionFee: String,
    grossGigFee: String,
    grossVAT: String,
    grossWithHolding: String,
    serviceCost: String,
    jobsterTotal: String,
    proposedRate: String,
    proposedWorkTime: String
  },
  gigFeeType: String,
  commissionRate: String,
  applicants: [],
  records: []
}

const gigsSchema = new Schema(gigsData, {timestamps: true})
module.exports = mongoose.model('Gigs', gigsSchema, collectionName)
