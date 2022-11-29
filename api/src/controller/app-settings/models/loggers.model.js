const mongoose = require('mongoose')
const {Schema} = mongoose
const collectionName = 'api-logs'
const logSchema = new Schema(
  {
    errorType: String,
    errorMessage: String,
    trace: String,
    requestOrigin: String,
    data: String,
    dateCreated: Date,
    uid: String,
    method: String
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Logs', logSchema, collectionName)
