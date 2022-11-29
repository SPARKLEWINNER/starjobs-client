const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const collectionName = 'gig-extends'

const schema = new Schema(
  {
    gigId: {
      type: Types.ObjectId,
      ref: 'Gigs'
    },
    additionalFees: {
      sss: {
        type: Number
      },
      philhealth: {
        type: Number
      },
      pagibig: {
        type: Number
      },
      regularOTPay: {
        type: Number
      },
      specialOTPAy: {
        type: Number
      },
      ndOT: {
        type: Number
      },
      specialNDOTPay: {
        type: Number
      },
      nsd: {
        type: Number
      },
      specialNSDOT: {
        type: Number
      },
      specialHolidayPay: {
        type: Number
      }
    },
    applicants: {
      type: Array
    },
    maximumApplicants: Number,
    dateCreated: Date
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Extends', schema, collectionName)
