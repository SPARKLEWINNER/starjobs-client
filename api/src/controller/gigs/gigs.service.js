const uuid = require('uuid').v1

const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)

const mongoose = require('mongoose')
const jwt_decode = require('jwt-decode')

const Users = require('../users/models/users.model')
const Freelancers = require('../users/models/freelancers.model')
const Gigs = require('./models/gigs.model')
const Contracts = require('./models/gig-contracts.model')

const {getSpecificData} = require('../../common/validates')
const logger = require('../../common/loggers')

const services = require('./child-services/gigs-type.service')

var controllers = {
  get_gigs: async function (req, res) {
    let gigs = []
    let filter_gig = []
    try {
      // let initial_find = await Gigs.find({
      //   status: ['Waiting', 'Applying', 'Contracts']

      // }, {position:1, uid:1, hours:1, fee:1, user:1, from:1, time:1, locationRate:1})
      //   .lean()
      //   .exec()

      // gigs = initial_find.filter((obj) => {
      //   return !moment(obj.time).isBefore(moment(), 'day')
      // })
      // gigs.sort((a, b) => (moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1))
      // filter_gig = gigs.filter((obj) => (moment(obj.from).isValid() ? obj : ''))
      // console.log(filter_gig.length)

      const today = moment.utc().startOf('day')
      const filter = {
        status: {$in: ['Waiting', 'Applying', 'Contracts']},
        $or: [{time: {$gte: today.toISOString()}}, {time: {$gte: today}}]
      }

      const projection = {
        position: 1,
        uid: 1,
        hours: 1,
        fee: 1,
        user: 1,
        from: 1,
        time: 1,
        fees: 1,
        locationRate: 1,
        category: 1
      }

      const initial_find = await Gigs.find(filter, projection).lean().exec()

      filter_gig = initial_find.filter((obj) => {
        return moment(obj.from).isValid()
      })

      if (!initial_find) res.status(502).json({success: false, msg: 'Gigs not found'})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.get_gigs_categorized', filter_gig, null, 'GET')
      return res.status(502).json({success: false, msg: 'Gigs not found'})
    }
    return res.status(200).json(filter_gig)
  },

  get_gig: async function (req, res) {
    const {id} = req.params
    let gigs

    try {
      // gigs = await Gigs.findById(id).lean().exec();
      gigs = await Gigs.aggregate([
        {
          $lookup: {
            from: 'users-freelancers',
            localField: 'auid',
            foreignField: 'uuid',
            as: 'account'
          }
        },
        {
          $lookup: {
            from: 'gigs-histories',
            localField: '_id',
            foreignField: 'gid',
            as: 'history'
          }
        }
      ])
        .match({
          _id: mongoose.Types.ObjectId(id)
        })
        .sort({createdAt: -1})
        .exec()
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Gigs.get_gig', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(gigs.pop())
  },

  get_contract: async function (req, res) {
    const {id} = req.params
    let gigs

    try {
      gigs = await Contracts.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gid',
            foreignField: '_id',
            as: 'gigs'
          }
        },
        {$unwind: '$gigs'},
        {
          $project: {
            _id: true,
            records: true,
            category: true,
            commissionRate: true,
            gigFeeType: true,
            from: '$gigs.from',
            time: '$gigs.time',
            shift: '$gigs.shift',
            hours: '$gigs.hours',
            breakHr: '$gigs.breakHr',
            dateCreated: '$gigs.dateCreated',
            position: '$gigs.position',
            notes: '$gigs.notes',
            contactNumber: '$gigs.contactNumber',
            location: '$gigs.location',
            isApprove: '$gigs.isApprove',
            status: '$gigs.status',
            date: '$gigs.date',
            applicants: '$gigs.applicants',
            updatedAt: true,
            createdAt: true,
            user: '$gigs.user'
          }
        }
      ]).exec()
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Gigs.get_contract', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    return res.status(200).json(gigs.pop())
  },

  get_gigs_categorized: async function (req, res) {
    const {category} = req.params
    console.log(category)
    let categ_gigs = []
    try {
      // let initial_find = await Gigs.find({
      //   category: category,
      //   status: ['Waiting', 'Applying', 'Contracts']
      // },{category:1, position:1, uid:1, hours:1, fee:1, user:1, from:1, time:1, locationRate:1})
      //   .lean()
      //   .exec()

      // gigs = initial_find.filter((obj) => {
      //   return !moment(obj.time).isBefore(moment(), 'day')
      // })
      // gigs.sort((a, b) => (moment(a.date + ' ' + a.time) > moment(b.date + ' ' + b.time) ? 1 : -1))
      // filter_gig = gigs.filter((obj) => (moment(obj.from).isValid() ? obj : ''))
      const today = moment.utc().startOf('day')

      const filter = {
        status: {$in: ['Waiting', 'Applying', 'Contracts']},
        $or: [{time: {$gte: today.toISOString()}}, {time: {$gte: today}}],
        category: category
      }

      const projection = {
        position: 1,
        uid: 1,
        hours: 1,
        fee: 1,
        user: 1,
        from: 1,
        time: 1,
        locationRate: 1,
        fees: 1,
        category: 1
      }

      const initial_find = await Gigs.find(filter, projection).lean().exec()

      categ_gigs = initial_find.filter((obj) => {
        return moment(obj.from).isValid()
      })

      if (!initial_find) res.status(502).json({success: false, msg: 'Gigs not found'})
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Gigs.get_gigs_categorized', category, null, 'GET')
      return res.status(502).json({success: false, msg: 'Gigs not found'})
    }

    return res.status(200).json(categ_gigs)
  },

  get_gigs_history: async function (req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const {id} = jwt_decode(token)
    // await getSpecificData({uuid: mongoose.Types.ObjectId(id)}, Freelancers, 'Account', id)

    let details
    try {
      const check_user = await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'User', id)

      if (!check_user[0]?.isActive) {
        details = {
          ...check_user,
          account: [],
          gigs: [],
          reports: {
            numberOfApplied: 0,
            numberOfCompleted: 0
          }
        }
      } else {
        // const result = await History.find({uid: id}).lean().exec()
        // console.log(result)
        // const user = await Users.aggregate([
        //   {
        //     $lookup: {
        //       from: 'users-freelancers',
        //       localField: '_id',
        //       foreignField: 'uuid',
        //       as: 'account'
        //     }
        //   }
        // ])
        //   .match({
        //     'account.uuid': mongoose.Types.ObjectId(id)
        //   })
        //   .exec()

        const contracts = await Contracts.aggregate([
          {
            $match: {
              uid: mongoose.Types.ObjectId(id)
            }
          },
          {
            $lookup: {
              from: 'gigs',
              localField: 'gid',
              foreignField: '_id',
              as: 'gigs'
            }
          },
          {$unwind: '$gigs'},
          {
            $project: {
              _id: true,
              records: true,
              category: true,
              commissionRate: true,
              gigFeeType: true,
              from: '$gigs.from',
              time: '$gigs.time',
              shift: '$gigs.shift',
              hours: '$gigs.hours',
              breakHr: '$gigs.breakHr',
              dateCreated: '$gigs.dateCreated',
              position: '$gigs.position',
              notes: '$gigs.notes',
              contactNumber: '$gigs.contactNumber',
              location: '$gigs.location',
              isApprove: '$gigs.isApprove',
              status: '$gigs.status',
              date: '$gigs.date',
              applicants: '$gigs.applicants',
              updatedAt: true,
              createdAt: true,
              user: '$gigs.user'
            }
          }
        ])
          .sort({createdAt: -1})
          .exec()

        const reports = await Gigs.aggregate([
          {
            $lookup: {
              from: 'gigs-histories',
              localField: '_id',
              foreignField: 'gid',
              as: 'history'
            }
          }
        ])
          .match({
            'records.auid': mongoose.Types.ObjectId(id)
          })
          .sort({createdAt: 1})
          .exec()

        let gigsData = reports.filter((obj) => {
          // console.log('🚀 ~ file: gigs.service.js:323 ~ gigsData ~ obj:', obj)
          //express as a duration
          const timeDate = moment(obj.time)
          const date = moment(obj.date)

          const previousDays = moment(date).subtract(7, 'days')
          const aheadDays = moment(timeDate).add(7, 'days')

          const range = moment().range(previousDays, aheadDays)

          // between 0 days and 2 days before current day
          if (range.contains(moment())) {
            return obj
          }
          return
        })
        // console.log('🚀 ~ file: gigs.service.js:335 ~ gigsData ~ gigsData:', gigsData)

        if (contracts.length > 0) {
          gigsData = [...gigsData, ...contracts]
        }

        details = {
          // ...user,
          // account: user && user.length > 0 && user[0].isActive ? user[0].account[0] : [],
          gigs: gigsData,
          reports: {
            numberOfApplied: reports.filter((obj) => obj.status === 'Applying').length,
            numberOfCompleted: reports.filter((obj) => obj.status === 'Confirm-End-Shift').length
          }
        }
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.get_gigs_history', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'Unable to get history details'})
    }

    return res.status(200).json(details)
  },

  post_gig: async function (req, res, next) {
    return await services.default(req, res, next)
  },

  patch_gig_details: async function (req, res) {
    const {id, uid: owner_id} = req.params
    const {time, shift, hours, fee, date, category, position, from} = req.body

    const isGigOwner = await Gigs.find({_id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(owner_id)})
      .lean()
      .exec()
    if (!isGigOwner || isGigOwner.length <= 0) {
      return res.status(502).json({success: false, msg: 'Not Gig owner'})
    }

    try {
      const gigsObj = {
        time,
        from,
        shift,
        hours,
        fee,
        date,
        category,
        position
      }

      await Gigs.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, gigsObj)
      return res.status(200).json(gigsObj)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_gig_details', null, null, 'PATCH')
      return res.status(502).json({success: false, msg: 'Unable to edit gig details'})
    }
  },

  patch_remove_gig: async function (req, res) {
    const {id, uid: owner_id} = req.params
    const {status} = req.body

    const isGigOwner = await Gigs.find({_id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(owner_id)})
      .lean()
      .exec()
    if (!isGigOwner || isGigOwner.length <= 0) {
      return res.status(502).json({success: false, msg: 'Not Gig owner'})
    }

    try {
      const gigsObj = {
        status
      }

      await Gigs.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, gigsObj)
      return res.status(200).json(gigsObj)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_remove_gig', null, null, 'PATCH')
      return res.status(502).json({success: false, msg: 'Unable to remove gig'})
    }
  },

  patch_record_sale: async function (req, res) {
    const {id} = req.params
    const {uid: jobster_id, saleCount, isConfirmed} = req.body
    const now = new Date()

    await getSpecificData({uuid: mongoose.Types.ObjectId(id)}, Freelancers, 'Freelancers', id)

    const isContractExists = await Contracts.find({
      _id: mongoose.Types.ObjectId(id),
      uid: mongoose.Types.ObjectId(jobster_id)
    })
      .lean()
      .exec()
    if (!isContractExists || isContractExists.length <= 0) {
      return res.status(502).json({success: false, msg: 'Not Contractor'})
    }

    let withTodayRecord = false
    await isContractExists[0]?.records?.filter((record) => {
      if (
        new Date(record.date).getFullYear() === now.getFullYear() &&
        new Date(record.date).getMonth() === now.getMonth() &&
        new Date(record.date).getDate() === now.getDate()
      ) {
        return (withTodayRecord = true)
      }
    })

    if (withTodayRecord) {
      return res.status(500).json({success: false, msg: 'You already have an existing today record'})
    }

    try {
      let newRecord = {
        _id: uuid(),
        date: now,
        sale: saleCount,
        isConfirmed: isConfirmed
      }

      await Contracts.findOneAndUpdate(
        {_id: mongoose.Types.ObjectId(id)},
        {
          $push: {records: newRecord}
        }
      )
      return res.status(200).json(newRecord)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_remove_gig', null, null, 'PATCH')
      return res.status(502).json({success: false, msg: 'Unable to remove gig'})
    }
  },

  patch_record_confirm_sale: async function (req, res) {
    const {id} = req.params
    const {saleCount, isConfirmed, recordId} = req.body

    try {
      const newRecord = await Contracts.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(id),
          'records._id': recordId
        },
        {
          $set: {
            'records.$.sale': saleCount,
            'records.$.isConfirmed': isConfirmed
          }
        }
      )

      return res.status(200).json(newRecord[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'GIGS.patch_remove_gig', null, null, 'PATCH')
      return res.status(502).json({success: false, msg: 'Unable to remove gig'})
    }
  }
}

module.exports = controllers
