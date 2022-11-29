const mongoose = require('mongoose')
const Gigs = require('../models/gigs.model')
const logger = require('../../../common/loggers')

var controllers = {
  // list of gigs by activity (payroll)
  get_gigs_activity: async function (req, res) {
    const {id} = req.params
    let result
    try {
      result = await Gigs.aggregate([
        {
          $lookup: {
            from: 'history',
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
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
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
    let result

    try {
      result = await Gigs.find({uid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: false, data: result})
    } catch (error) {
      await logger.logError(error, 'Gigs.get_gigs_activity_client', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  }
}

module.exports = controllers
