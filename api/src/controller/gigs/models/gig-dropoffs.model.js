const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const collectionName = 'gigs-dropoffs'

const DropOffSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  route: String,
  lat: Number,
  long: Number,
  status: {
    type: String,
    enum: [
      'Pending',
      'Applying',
      'Accepted',
      'Confirm-Arrived',
      'End-Shift',
      'Cancelled',
      'Confirm-End-Shift',
      'Unavailable'
    ], // Add other statuses as needed
    default: 'Pending'
  },
  gig: [{type: mongoose.Schema.Types.ObjectId, ref: 'Gigs'}],
  rider: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference the riders who took the drop-off
    }
  ],
  proof: {
    type: String
  },
  timeStampProof: {
    type: [String], // Array of strings
    default: []
  },
  parkingTicket: {
    type: [String], // Array of strings
    default: []
  },
  parkingFee: {type: Number, default: 0},
  perDropKm: {type: String},
  timeArrived: {type: String},
  timeDeparture: {type: String},
  waitingTime: {type: String},
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('DropOffs', DropOffSchema, collectionName)
