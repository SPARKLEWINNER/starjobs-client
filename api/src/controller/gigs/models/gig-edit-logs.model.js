const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'gig-edit-logs'

const historySchema = new Schema({
  gigId: {type: Types.ObjectId, required: true, ref: 'Gigs'},
  action: {type: String, required: true},
  status: {type: String, required: true},
  remarks: {type: String},
  performedBy: {type: Types.ObjectId, required: true, ref: 'User'},
  timestamp: {type: Date, default: Date.now}
})
module.exports = mongoose.model('GigEditLogs', historySchema, collectionName)
