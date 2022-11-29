const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'users-history'

const usersHistorySchema = new Schema(
  {
    uid: {type: Types.ObjectId, ref: 'User'},
    details: Object,
    prevDetails: Object,
    accountType: Number,
    dateCreated: Date
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('UserHistory', usersHistorySchema, collectionName)
