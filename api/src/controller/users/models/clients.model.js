const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const collectionName = 'users-clients'

const clientSchema = new Schema(
  {
    uid: {type: Types.ObjectId, ref: 'Users'},
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    middleInitial: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: true
    },
    brandName: {
      type: String,
      required: true
    },
    accountingEmail: {
      type: String
      // required: true
    },
    managerEmail: {
      type: String
      // required: true
    },
    location: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    companyPosition: {
      type: String,
      required: true
    },
    contact: {
      type: Array,
      default: []
    },
    industry: {
      industryType: {
        type: String
      },
      skillLooking: {},
      workType: {
        type: String
      },
      othersExpertise: {
        type: String
      }
    },
    rate: {
      rateAmount: {
        type: Number
      },
      rateType: {
        type: String
      }
    },
    payment: {
      accountPaymentType: {
        type: String
      },
      acccountPaymentName: {
        type: String
      },
      acccountPaymentNumber: {
        type: String
      }
    },
    photo: {
      type: String
    },
    documents: {
      type: String
    },
    pointOfContactId: {
      type: String
    },
    businessPermit: {
      type: String
    },
    expirationDate: {
      type: Date,
      timezone: timezone
    }
  },
  {timestamps: true}
)
module.exports = mongoose.model('Client', clientSchema, collectionName)
