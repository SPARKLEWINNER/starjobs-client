const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Create Token Schema and Model
const tokenSchema = new mongoose.Schema(
  {
    token: String
  },
  {timestamps: true}
)

module.exports = mongoose.model('cast-token', tokenSchema)
