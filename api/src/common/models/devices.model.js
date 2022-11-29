const mongoose = require('mongoose')
const {Schema} = mongoose

const collectionName = 'app-devices'

const appDevicesSchema = new Schema(
  {
    browser: String,
    source: String,
    version: String,
    os: String,
    platform: String,
    dateCreated: Date,
    uid: String
  },
  {timestamps: true}
)
module.exports = mongoose.model('AppDevices', appDevicesSchema, collectionName)
