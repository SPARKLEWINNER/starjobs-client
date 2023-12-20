const mongoose = require('mongoose')
const {Schema} = mongoose
const collectionName = 'rates'
const rateSchema = new Schema(
  {
    city: String,
    gigRate: Number,
    gigRatePerHour: Number,
    sssPerDay: Number,
    phicPerDay: Number,
    hmdfPerDay: Number,
    voluntaryBenefits: String,
    voluntaryBenefitsPerHour: Number,
    gigExtensionPerHour: Number,
    nightSurge: Number
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Rates', rateSchema, collectionName)
