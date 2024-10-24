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

const discord = require('../../services/discord-notif.service')

var controllers = {
  get_gigs: async function (req, res) {
    const {page, limit} = req.query // Default to page 1 and limit 10
    let filter_gig = []
    try {
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
        category: 1,
        createdAt: 1
      }

      // Fetch the data with pagination
      const initial_find = await Gigs.find(filter, projection)
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean()
        .exec()

      // Filter the gigs based on 'from' field validity
      filter_gig = initial_find.filter((obj) => moment(obj.from, moment.ISO_8601, true).isValid())
      console.log('Filter gig', filter_gig.length)
      if (initial_find.length === 0) {
        return res.status(404).json({success: false, msg: 'No gigs found'})
      }

      const totalGigs = await Gigs.countDocuments(filter).exec()
      const totalPages = Math.ceil(totalGigs / limit)
      console.log(totalGigs)
      console.log(totalPages)
      return res.status(200).json({filter_gig, totalGigs, totalPages})
      //return res.status(200).json(filter_gig, page:)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.get_gigs_categorized', filter_gig, null, 'GET')
      return res.status(502).json({success: false, msg: 'Failed to fetch gigs'})
    }
  },

  get_gigs_search: async function (req, res) {
    const {page = 1, limit = 10, query = ''} = req.query // Default to page 1, limit 10, and empty search query
    let filter_gig = []

    try {
      const today = moment.utc().startOf('day')

      // Base filter for time and status (applied in both queries)
      const baseFilter = {
        status: {$in: ['Waiting', 'Applying', 'Contracts']},
        $or: [
          {time: {$gte: today.toISOString()}}, // Time filter
          {time: {$gte: today}}
        ]
      }

      // Empty array to store both query results
      let gigsByPosition = []
      let gigsByLocation = []

      // Perform the first query for 'position'
      if (query) {
        gigsByPosition = await Gigs.find({
          ...baseFilter,
          position: {$regex: query, $options: 'i'} // Search by position
        })
          .sort({createdAt: -1})
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .lean()
          .exec()

        // Perform the second query for 'user.location'
        gigsByLocation = await Gigs.find({
          ...baseFilter,
          location: {$regex: query, $options: 'i'} // Search by user location
        })
          .sort({createdAt: -1})
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .lean()
          .exec()
      }

      // Combine both arrays (gigsByPosition and gigsByLocation)
      let combinedGigs = [...gigsByPosition, ...gigsByLocation]

      // Remove duplicates based on the gig '_id'
      const uniqueGigs = combinedGigs.filter((gig, index, self) => {
        return index === self.findIndex((g) => g._id.toString() === gig._id.toString())
      })

      // Filter the gigs based on 'from' field validity
      filter_gig = uniqueGigs.filter((obj) => moment(obj.from, moment.ISO_8601, true).isValid())

      // If no gigs found, return 404
      if (filter_gig.length === 0) {
        return res.status(404).json({success: false, msg: 'No gigs found'})
      }

      // Count total gigs
      const totalGigs = await Gigs.countDocuments(baseFilter).exec()
      const totalPages = Math.ceil(totalGigs / limit)

      // Return the results
      return res.status(200).json({filter_gig, totalGigs, totalPages})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.get_gigs_search', filter_gig, null, 'GET')
      return res.status(502).json({success: false, msg: 'Failed to fetch gigs'})
    }
  },

  get_gig: async function (req, res) {
    const {id} = req.params
    console.log('🚀 ~ Get Gig id:', id)
    let gigs

    try {
      if (!id) {
        console.log('ID is undefined or null')
        return res.status(400).json({success: false, msg: 'ID is required'})
      }

      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid ObjectId')
        return res.status(400).json({success: false, msg: 'Invalid ObjectId format'})
      }

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

      if (!gigs || gigs.length === 0) {
        return res.status(404).json({success: false, msg: 'Gig not found'})
      }
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
    const {page, limit} = req.query
    const skip = (page - 1) * 10

    let categ_gigs = []

    try {
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

      const initial_find = await Gigs.find(filter, projection).skip(skip).limit(Number(limit)).lean().exec()

      categ_gigs = initial_find.filter((obj) => {
        return moment(obj.from, moment.ISO_8601, true).isValid()
      })

      const totalGigs = await Gigs.countDocuments(filter).exec()
      const totalPages = Math.ceil(totalGigs / limit)

      return res.status(200).json({
        categ_gigs,
        page: Number(page),
        totalPages,
        totalGigs
      })
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Gigs.get_gigs_categorized', category, null, 'GET')
      return res.status(502).json({success: false, msg: 'Error fetching gigs'})
    }
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

  get_gigs_history_status: async function (req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const {id} = jwt_decode(token)
    const {status} = req.params
    console.log('🚀 ~ status:', status)
    const statusArray = status.split(',')

    // await getSpecificData({uuid: mongoose.Types.ObjectId(id)}, Freelancers, 'Account', id)

    let details
    let reports
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

        if (status === 'Confirm-End-Shift') {
          console.log('Confirm-End-Shift')
          // Confirm-End-Shift
          reports = await Gigs.aggregate([
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
              auid: mongoose.Types.ObjectId(id),
              status: status
            })
            .sort({createdAt: 1})
            .exec()
          console.log('🚀 ~ Confirm End Shift reports:', reports)
        } else {
          console.log('Others')
          // Other Status
          reports = await Gigs.aggregate([
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
              'records.auid': mongoose.Types.ObjectId(id),
              status: {$in: statusArray}
            })
            .sort({createdAt: 1})
            .exec()
        }

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
    const {time, shift, hours, fee, date, category, position, from, notes, breakHr} = req.body
    console.log(req.body)
    const isGigOwner = await Gigs.find({_id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(owner_id)})
      .lean()
      .exec()
    if (!isGigOwner || isGigOwner.length <= 0) {
      return res.status(502).json({success: false, msg: 'Not Gig owner'})
    }
    console.log(isGigOwner, 'GIGGG DETAISLSS')
    try {
      const gigsObj = {
        time,
        from,
        shift,
        breakHr,
        hours,
        fee,
        date,
        category,
        position,
        notes
      }

      await Gigs.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, gigsObj)
      discord.send_editGig(isGigOwner, time, from, shift, breakHr, hours, fee, date, category, position, notes)

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
  },
  get_gig_status: async function (req, res) {
    try {
      const {gig_id} = req.params // Extract the gig ID from the request parameters

      // Validate that the gigId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(gig_id)) {
        return res.status(400).json({error: 'Invalid gig ID'})
      }

      // Find the gig by ID
      const gig = await Gigs.findById(gig_id).select('status')

      // If the gig does not exist, return a 404 error
      if (!gig) {
        return res.status(404).json({error: 'Gig not found'})
      }

      // Respond with the gig status
      res.status(200).json({status: gig.status})
    } catch (error) {
      // Handle any errors that occur
      console.error('Error fetching gig status:', error)
      res.status(500).json({error: 'Internal server error'})
    }
  }
}

module.exports = controllers
