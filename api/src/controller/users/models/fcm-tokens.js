const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'fcm-tokens'

const userDeviceSchema = new Schema(
  {
    userId: {type: Types.ObjectId, ref: 'User'},
    fcmToken: {
      default: '',
      type: String
    },
    device: {
      default: '',
      type: String
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('FCMTOKEN', userDeviceSchema, collectionName)
