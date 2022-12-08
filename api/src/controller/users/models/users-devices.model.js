const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const collectionName = 'users-device'

const userDeviceSchema = new Schema(
  {
    userId: {type: Types.ObjectId, ref: 'User'},
    androidDeviceId: {
      type: String
    },
    iosDeviceId: {
      type: String
    },
    webDeviceId: {
      type: String
    },
    dateCreated: {
      type: Date,
      timezone: timezone
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('UsersDevice', userDeviceSchema, collectionName)
