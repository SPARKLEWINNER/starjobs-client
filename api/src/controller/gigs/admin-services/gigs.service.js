const mongoose = require('mongoose')

const Gigs = require('../models/gigs.model')

const logger = require('../../../common/loggers')

var controllers = {
  get_admin_gigs: async function (req, res) {
    let query = Gigs.find({}, null, {sort: {dateCreated: -1}})

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 100
    const skip = (page - 1) * pageSize
    const total = await Gigs.countDocuments()
    const reports = await Gigs.aggregate([
      {
        $group: {
          _id: {$month: '$dateCreated'},
          numberOfGigs: {$sum: 1}
        }
      }
    ])

    try {
      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize)

      if (page > pages) {
        return res.status(404).json({
          status: 'fail',
          message: 'No page found'
        })
      }

      const result = await query

      res.status(200).json({
        status: 'success',
        count: result.length,
        page,
        pages,
        total: total,
        data: result,
        reports: reports.sort((a, b) => a._id - b._id)
      })
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.get_admin_gigs', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },
  patch_admin_status_gig: async function (req, res) {
    const {id} = req.params
    const {status, uid} = req.body
    const now = new Date()
    try {
      const gigs = await Gigs.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      let history = new History({
        status: status,
        gid: mongoose.Types.ObjectId(id),
        date_created: now.toISOString(),
        uid: mongoose.Types.ObjectId(uid)
      })

      history.uid = mongoose.Types.ObjectId(uid)
      await Gigs.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {status: status})
      await History.create(history)
      return res.status(200).json(gigs)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_archived_gig', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },
  get_admin_gigs_exports: async function (req, res) {
    try {
      let query = await Gigs.find(
        {},
        {
          position: 1,
          _id: 1,
          fee: 1,
          status: 1,
          category: 1,
          from: 1,
          time: 1,
          shift: 1,
          dateCreated: 1
        }
      )
        .lean()
        .exec()

      res.status(200).json({
        status: 'success',
        data: query
      })
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.get_admin_gigs_exports', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },
  get_admin_search_users: async function (req, res) {
    let query = Gigs.find({position: {$regex: '.*' + req.query.keyword + '.*'}})
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 100
    const skip = (page - 1) * pageSize
    const totalUsers = await Gigs.countDocuments()
    const total = await Gigs.length
    const reports = await Gigs.aggregate([
      {
        $group: {
          _id: {$month: '$dateCreated'},
          numberOfGigs: {$sum: 1}
        }
      }
    ])

    try {
      const pages = Math.ceil(total / pageSize)

      query = query.skip(skip).limit(pageSize)

      if (page > pages) {
        return res.status(404).json({
          status: 'fail',
          message: 'No page found'
        })
      }

      const result = await query
      res.status(200).json({
        status: 'success',
        count: result.length,
        page,
        pages,
        total: totalUsers,
        data: result,
        reports: reports.sort((a, b) => a._id - b._id)
      })
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'USER.get_users', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },
  patch_admin_gig_details: async function (req, res) {
    const {id} = req.params
    const {time, shift, hours, fee, date, category, position, from, status, uid} = req.body
    const now = new Date()
    try {
      const gigs = await Gigs.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      if (gigs[0].status !== status) {
        let history = new History({
          status: status,
          gid: mongoose.Types.ObjectId(id),
          date_created: now.toISOString(),
          uid: mongoose.Types.ObjectId(uid)
        })

        history.uid = mongoose.Types.ObjectId(uid)
        await History.create(history)
      }

      const gigsObj = {
        time,
        from,
        shift,
        hours,
        fee,
        date,
        category,
        position,
        status
      }

      await Gigs.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, gigsObj)
      return res.status(200).json(gigsObj)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_archived_gig', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  }
}

module.exports = controllers
