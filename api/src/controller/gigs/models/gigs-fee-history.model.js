const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const collectionName = 'gigs-fee-history'
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

const feeHistorySchema = new Schema(
  {
    gigid: {type: Types.ObjectId, ref: 'Gigs'},
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
    notes: String,
    dateCreated: Date,
    user: [userSchema],
    locationRate: {
      default: 'NCR',
      type: String,
      enum: ['NCR', 'Provincial', 'Not applicable']
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
    }
  },
  {timestamps: true}
)
module.exports = mongoose.model('FeeHistory', feeHistorySchema, collectionName)
