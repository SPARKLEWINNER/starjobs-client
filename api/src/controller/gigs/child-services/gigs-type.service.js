const {BUCKET_URL} = process.env

const mongoose = require('mongoose')

const Users = require('../../users/models/users.model')
const Clients = require('../../users/models/clients.model')
const Jobs = require('../models/gig-queue-jobs.model')
const Gigs = require('../models/gigs.model')

const logger = require('../../../common/loggers')
const notification = require('../../../common/notifications')

const services = {
  default: async function (req, res) {
    const {id} = req.params
    let {
      time,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      from,
      fees,
      location,
      contactNumber,
      notes,
      areas,
      isRepeatable,
      repeatTimes,
      repeatEvery,
      gigFeeType,
      commissionFee
    } = req.body
    const now = new Date()

    let locationRate = req.body.locationRate || 'Not applicable'

    const isUserExists = await Users.find({_id: mongoose.Types.ObjectId(id), accountType: 1})
      .lean()
      .exec()

    if (!isUserExists || isUserExists.length === 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const client = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!client) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const gigData = {
      user: [
        {
          _id: mongoose.Types.ObjectId(client[0]._id),
          location: client[0].location,
          companyName: client[0].companyName,
          website: client[0].website,
          thumbnail: BUCKET_URL + client[0].photo
        }
      ],
      time,
      from,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      fees: {
        ...fees,
        proposedWorkTime: 0,
        proposedRate: 0
      },
      location,
      contactNumber,
      notes,
      locationRate: locationRate,
      uid: mongoose.Types.ObjectId(id),
      dateCreated: now.toISOString(),
      gigFeeType: gigFeeType,
      commissionRate: commissionFee
    }

    if (!gigFeeType || gigFeeType == 'undefined') {
      gigData['gigFeeType'] = 'Daily'
    }

    if (gigFeeType && gigFeeType !== 'Daily') {
      gigData['status'] = 'Contracts'
    }

    const gigsObj = new Gigs(gigData)
    try {
      const postedGig = await Gigs.create(gigsObj)

      global.pusher.trigger('notifications', 'new_notification', postedGig)

      if (areas && areas.length > 0) {
        if (areas.length > 1) {
          await areas.map(async (item) => {
            await notification.globalNotification(postedGig, item)
          })
        } else {
          await notification.globalNotification(postedGig, areas[0])
        }
      }

      if (isRepeatable) {
        const jobsObj = new Jobs({
          repeatTimes: repeatTimes,
          repeatEvery: repeatEvery,
          gid: mongoose.Types.ObjectId(postedGig._id),
          uid: mongoose.Types.ObjectId(id),
          dateCreated: now.toISOString()
        })

        await Jobs.create(jobsObj)
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.post_gig', gigsObj, client[0]._id, 'POST')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(201).json(gigsObj)
  },
  contract: async function (req, res) {
    const {id} = req.params
    let {
      time,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      from,
      fees,
      location,
      contactNumber,
      notes,
      areas,
      isRepeatable,
      repeatTimes,
      repeatEvery,
      gigFeeType,
      commissionFee
    } = req.body
    const now = new Date()
    let locationRate = req.body.locationRate || 'Not applicable'

    const isUserExists = await Users.find({_id: mongoose.Types.ObjectId(id), accountType: 1})
      .lean()
      .exec()

    if (!isUserExists || isUserExists.length === 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const client = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!client) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const gigsObj = new Gigs({
      user: [
        {
          _id: mongoose.Types.ObjectId(client[0]._id),
          location: client[0].location,
          companyName: client[0].companyName,
          website: client[0].website,
          thumbnail: BUCKET_URL + client[0].photo
        }
      ],
      time,
      from,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      fees: {
        ...fees,
        proposedWorkTime: 0,
        proposedRate: 0
      },
      location,
      contactNumber,
      notes,
      locationRate: locationRate,
      uid: mongoose.Types.ObjectId(id),
      dateCreated: now.toISOString(),
      gigFeeType: gigFeeType,
      commissionRate: commissionFee
    })

    try {
      const postedGig = await Gigs.create(gigsObj)

      global.pusher.trigger('notifications', 'new_notification', postedGig)

      if (areas && areas.length > 0) {
        if (areas.length > 1) {
          await areas.map(async (item) => {
            await notification.globalNotification(postedGig, item)
          })
        } else {
          await notification.globalNotification(postedGig, areas[0])
        }
      }

      if (isRepeatable) {
        const jobsObj = new Jobs({
          repeatTimes: repeatTimes,
          repeatEvery: repeatEvery,
          gid: mongoose.Types.ObjectId(postedGig._id),
          uid: mongoose.Types.ObjectId(id),
          dateCreated: now.toISOString()
        })

        await Jobs.create(jobsObj)
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.post_gig', gigsObj, client[0]._id, 'POST')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(201).json(gigsObj)
  }
}

module.exports = services
