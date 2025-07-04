const mongoose = require('mongoose')
const {Schema, Types} = mongoose
const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const collectionName = 'client-branches'

const branchSchema = new Schema(
  {
    name: String
  },
  {_id: false}
)

const clientBranchSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client', // or whatever your client model is
      required: true
    },
    branches: [branchSchema],
    createdBy: {
      type: String,
      required: true
    }
  },
  {timestamps: true}
)

module.exports = mongoose.model('ClientBranch', clientBranchSchema, collectionName)
