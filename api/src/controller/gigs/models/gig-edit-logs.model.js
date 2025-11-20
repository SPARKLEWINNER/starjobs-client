const mongoose = require('mongoose')
const {Schema, Types} = mongoose

const collectionName = 'gig-edit-logs'

const historySchema = new Schema({
  gigId: {type: Types.ObjectId, required: true, ref: 'Gigs'},
  field: {type: String}, // "fee" or "volFee"
  oldValue: {type: Number},
  newValue: {type: Number},
  action: {type: String, required: true}, // e.g., "fee-updated"
  status: {type: String, required: true, default: 'success'},
  remarks: {type: String},
  performedBy: {type: Types.ObjectId, required: true, ref: 'User'},
  timestamp: {type: Date, default: Date.now}
})

module.exports = mongoose.model('GigEditLogs', historySchema, collectionName)
