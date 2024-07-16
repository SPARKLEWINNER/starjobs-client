const mongoose = require('mongoose')
const Gigs = require('../models/gigs.model')
const logger = require('../../../common/loggers')
const Freelancers = require('../../users/models/freelancers.model')
const History = require('../../gigs/models/gig-histories.model')

var controllers = {
  // list of gigs by activity (payroll)
  get_gigs_activity: async function (req, res) {
    const {id} = req.params
    let result
    try {
      result = await Gigs.aggregate([
        {
          $lookup: {
            from: 'gigs-histories',
            localField: '_id',
            foreignField: 'gid',
            as: 'details'
          }
        }
      ])
        .match({
          auid: mongoose.Types.ObjectId(id),
          createdAt: {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          },
          status: 'Confirm-End-Shift'
        })
        .sort({createdAt: -1})
        .exec()

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: false, data: result})
    } catch (error) {
      await logger.logError(error, 'Gigs.get_gigs_activity', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },
  // list of gigs for client
  get_gigs_activity_client: async function (req, res) {
    const {id} = req.params
    let result, gigs

    try {
      result = await Gigs.find({uid: mongoose.Types.ObjectId(id), status: 'Confirm-End-Shift'})
        .sort({createdAt: -1})
        .limit(30)
        .lean()
        .exec()

      gigs = await Promise.all(
        result &&
          result.map(async (obj) => {
            const account = await Freelancers.find({uuid: mongoose.Types.ObjectId(obj.auid)})
              .lean()
              .exec()

            // add applicant list since to prevent re-apply of jobsters
            if (obj.status === 'Applying' || obj.status === 'Waiting') {
              const history = await History.find(
                {
                  gid: mongoose.Types.ObjectId(obj._id),
                  status: ['Waiting', 'Applying']
                },
                {uid: 1, status: 1, _id: 1, createdAt: 1}
              )
                .find()
                .lean()

              return {
                ...obj,
                applicants: history,
                account
              }
            }

            return {
              ...obj,
              account
            }
          })
      )

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: false, data: gigs})
    } catch (error) {
      console.log(error)
      await logger.logError(error, 'Gigs.get_gigs_activity_client', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_request_gigs_activity_client: async function (req, res) {
    const {id} = req.params
    const {from, time} = req.body
    let result, gigs

    try {
      const fromDate = new Date(from)
      const toDate = new Date(time)

      result = await Gigs.find({
        uid: mongoose.Types.ObjectId(id),
        status: 'Confirm-End-Shift'
      })
        .lean()
        .exec()

      result = result.filter((gig) => {
        const gigFromDate = new Date(gig.from) // Convert from string to date
        return gigFromDate >= fromDate && gigFromDate <= toDate
      })

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }
      gigs = await Promise.all(
        result &&
          result.map(async (obj) => {
            const account = await Freelancers.find({uuid: mongoose.Types.ObjectId(obj.auid)})
              .lean()
              .exec()

            // add applicant list since to prevent re-apply of jobsters
            if (obj.status === 'Applying' || obj.status === 'Waiting') {
              const history = await History.find(
                {
                  gid: mongoose.Types.ObjectId(obj._id),
                  status: ['Waiting', 'Applying']
                },
                {uid: 1, status: 1, _id: 1, createdAt: 1}
              )
                .find()
                .lean()

              return {
                ...obj,
                applicants: history,
                account
              }
            }

            return {
              ...obj,
              account
            }
          })
      )

      return res.status(200).json({success: false, data: gigs})
    } catch (error) {
      console.log(error)
      await logger.logError(error, 'Gigs.get_gigs_activity_client', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  }
}

module.exports = controllers
