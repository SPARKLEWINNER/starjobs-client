// models/archive.model.js
const mongoose = require('mongoose')

const ArchiveSchema = new mongoose.Schema({
  originalId: {type: mongoose.Schema.Types.ObjectId, required: true},
  email: {type: String},
  name: {type: String},
  isActive: {type: Boolean, default: false},
  archivedAt: {type: Date, default: Date.now}
  // Add any other fields you want to archive
})

module.exports = mongoose.model('archived_users', ArchiveSchema)
