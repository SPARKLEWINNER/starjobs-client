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
  jobsterNotes: String,
  remarks: String,
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
    // default: 'NCR',
    type: String
    // enum: ['NCR', 'Provincial', 'Not applicable']
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
    computedDaily: String,
    computedHourly: String,
    grossGigDaily: String,
    grossGigHourly: String,
    grossGigFee: String,
    grossVAT: String,
    grossWithHolding: String,
    serviceCost: String,
    jobsterTotal: String,
    proposedRate: String,
    proposedWorkTime: String,
    proposedLateMin: String,
    proposedExtensionHr: String,
    proposedNightSurgeHr: String,
    nightSurge: String,
    gigExtension: String,
    jobsterFinal: String,
    holidaySurge: String,
    holidayPercentage: String,
    proposedHolidaySurge: String,
    proposedHolidayPercentage: String,
    premiumFee: String,
    lateDeduction: String
  },
  gigFeeType: String,
  gigOffered: String,
  commissionRate: String,
  applicants: [],
  records: [],
  numberOfGigs: {
    type: Number,
    default: null
  },
  pickup: {
    name: {type: String},
    phone: {type: String},
    lat: {type: String},
    long: {type: String},
    address: {type: String},
    timeArrived: {type: String},
    timeDeparture: {type: String},
    waitingTime: {type: String},
    proof: {type: String},
    parkingFee: {type: Number, default: 0},
    parkingTicket: {
      type: [String], // Array of strings
      default: []
    }
  },
  deliveryProof: {
    type: [String],
    default: []
  },
  dropOffs: [{type: mongoose.Schema.Types.ObjectId, ref: 'DropOffs'}],
  numberOfRiders: {
    type: Number,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  vehicleType: {
    type: String,
    default: null
  },
  rateType: {
    type: String,
    default: null
  },
  ridersFee: {
    baseFare: String,
    gigRatePerKm: String,
    totalKm: String,
    perKmFee: String,
    addPerDrop: String,
    allowance: String,
    expectedPayment: String,
    totalPayment: String,
    totalWaitingTimePay: String,
    holidaySurge: Number,
    totalParkingFee: Number
  },
  payment: {
    paymentType: {type: String, default: null},
    accountName: {type: String, default: null},
    accountNumber: {type: String, default: null}
  }
}

const gigsSchema = new Schema(gigsData, {timestamps: true})
module.exports = mongoose.model('Gigs', gigsSchema, collectionName)
