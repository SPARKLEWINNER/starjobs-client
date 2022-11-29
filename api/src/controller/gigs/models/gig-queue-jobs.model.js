const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const collectionName = 'gig-queue-jobs'

const jobsSchema = new Schema(
  {
    repeatTimes: Number,
    repeatEvery: [],
    gid: {
      type: Types.ObjectId,
      required: true,
      ref: 'Gigs'
    },
    uid: {
      type: Types.ObjectId,
      required: true,
      ref: 'Users'
    },
    dateCreated: Date
  },
  {timestamps: true}
)
module.exports = mongoose.model('Jobs', jobsSchema, collectionName)
