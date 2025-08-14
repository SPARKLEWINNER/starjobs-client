// models/SOAFile.js
const mongoose = require('mongoose')
const {Schema} = mongoose
const collectionName = 'soa-files'
const soaFileSchema = new Schema({
  clientId: {type: Schema.Types.ObjectId, ref: 'Client'},
  fileKey: {type: String, required: true},
  uploadedAt: {type: Date, default: Date.now},
  archived: {
    type: Boolean,
    default: false
  },
  cutoffDate: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('SoaFile', soaFileSchema, collectionName)
