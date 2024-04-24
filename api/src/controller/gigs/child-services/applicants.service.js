const mongoose = require('mongoose')

const Gigs = require('../models/gigs.model')
const History = require('../models/gig-histories.model')
const Extends = require('../models/gigs-extends.model')

const Users = require('../../users/models/users.model')
const Freelancers = require('../../users/models/freelancers.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')

const {BUCKET_URL} = process.env

async function individual_gig(id, details) {
  let gig
  const history = await History.find({gid: mongoose.Types.ObjectId(id)})
    .lean()
    .exec()

  if (details) {
    gig = await Promise.all(
      history &&
        history.map(async (h) => {
          let users = await Freelancers.find({uuid: mongoose.Types.ObjectId(h.uid)})
            .lean()
            .exec()
          if (users.length > 0) {
            users[0].photo = BUCKET_URL + users[0].photo
            return {
              ...h,
              ...users[0]
            }
          }
        })
    )
  }

  if (gig.includes(undefined)) return {}

  return {
    history,
    gig
  }
}

async function extended_gig(id) {
  let gigExtended = await Extends.find({gigId: mongoose.Types.ObjectId(id)})
    .lean()
    .exec()

  if (!gigExtended) return false
  gigExtended = gigExtended.pop()

  let gig = await Promise.all(
    // let gig = await Object.values(gigExtended.applicants).forEach(async (h) => {
    gigExtended.applicants.map(async (h) => {
      let users = await Freelancers.find({uuid: mongoose.Types.ObjectId(h.auid)})
        .lean()
        .exec()

      users = users.pop()
      users.photo = BUCKET_URL + users.photo

      if (users) {
        return {
          ...h,
          ...users
        }
      }
    })
  )

  return {
    gigExtended,
    gig
  }
}

var controllers = {
  get_applicants: async function (req, res) {
    const {id} = req.params
    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Gigs, 'Gigs', id)
    let details
    try {
      let gigs = await Gigs.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      if (!gigs) return res.status(502).json({success: false, msg: 'Gig not found'})

      gigs = gigs.pop()

      if (gigs.isExtended !== undefined) {
        details = await extended_gig(id)
      } else {
        details = await individual_gig(id, gigs)
      }

      details = {
        ...gigs,
        applicants: gigs.status != 'Contracts' ? details.gig : gigs.applicants
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Applicants', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(details)
  },

  get_applicant_details: async function (req, res) {
    const {id} = req.params
    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'User', id)
    let account
    try {
      let user = await Users.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()
      account = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      account[0].email = user[0].email
      account[0].deviceId = user[0].deviceId
      account[0].accountType = user[0].accountType
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Applicant', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    return res.status(200).json(account)
  },

  get_freelancer_list: async function (req, res) {
    let freelancers
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    try {
      freelancers = await Users.aggregate([
        {
          $lookup: {
            from: 'users-freelancers',
            localField: '_id',
            foreignField: 'uuid',
            as: 'details'
          }
        }
      ])
        .match({
          accountType: 0,
          isActive: true,
          isVerified: true
        })
        .sort({createdAt: -1})
        .exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Applicant.get_freelancer_list', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(freelancers)
  },

  post_freelancer_list_search: async function (req, res) {
    let freelancers
    let {searchTerm, category, skip, sort} = req.body
    let skills
    // const oneWeekAgo = new Date()
    // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    if (category === 'Restaurant Services') {
      skills = 'Food and Restaurant'
    } else if (category === 'Sales & Marketing') {
      skills = 'Sales & Marketing'
    } else if (category === 'Parcels') {
      skills = 'Parcels and Logistics'
    } else if (category === 'Construction') {
      skills = 'Construction'
    } else {
      skills = 'Others'
    }

    let sortOptions = {createdAt: -1}
    if (sort) {
      sortOptions = {firstName: parseInt(sort)}
    }

    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})

    if (category) {
      try {
        freelancers = await Users.aggregate([
          {
            $lookup: {
              from: 'users-freelancers',
              localField: '_id',
              foreignField: 'uuid',
              as: 'details'
            }
          }
        ])
          .sort(sortOptions)
          .match({
            accountType: 0,
            isActive: true,
            isVerified: true,
            'details.expertise.skillQualification': skills,
            $or: [{firstName: {$regex: searchTerm, $options: 'i'}}, {lastName: {$regex: searchTerm, $options: 'i'}}]
          })
          .skip(skip * 1)
          .limit(5)
          .exec()
      } catch (error) {
        console.error(error)
        await logger.logError(error, 'Applicant.get_freelancer_category_list', null, null, 'GET')
        return res.status(502).json({success: false, msg: 'User not found'})
      }
    } else {
      try {
        freelancers = await Users.aggregate([
          {
            $lookup: {
              from: 'users-freelancers',
              localField: '_id',
              foreignField: 'uuid',
              as: 'details'
            }
          }
        ])
          .sort(sortOptions)
          .match({
            accountType: 0,
            isActive: true,
            isVerified: true,
            $or: [{firstName: {$regex: searchTerm, $options: 'i'}}, {lastName: {$regex: searchTerm, $options: 'i'}}]
          })
          .project({
            _id: 1,
            'details.uuid': 1,
            'details.firstName': 1,
            'details.middleInitial': 1,
            'details.lastName': 1,
            'details.presentCity': 1,
            'details.photo': 1,
            'details.expertise.skillOffer': 1,
            createdAt: 1
          })
          .skip(skip * 1)
          .limit(5)
          .exec()
      } catch (error) {
        console.error(error)
        await logger.logError(error, 'Applicant.get_freelancer_list', null, null, 'GET')
        return res.status(502).json({success: false, msg: 'User not found'})
      }
    }

    // Only Show active users from 1 week ago
    // const sortFreelancer = freelancers.filter((item) => {
    //   const updatedAtDAte = new Date(item?.updatedAt)
    //   return updatedAtDAte >= oneWeekAgo
    // })
    // console.log(sortFreelancer)
    return res.status(200).json(freelancers)
  }
}

module.exports = controllers
