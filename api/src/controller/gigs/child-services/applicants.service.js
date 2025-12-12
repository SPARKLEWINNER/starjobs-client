const mongoose = require('mongoose')

const Gigs = require('../models/gigs.model')
const History = require('../models/gig-histories.model')
const Extends = require('../models/gigs-extends.model')

const Users = require('../../users/models/users.model')
const Freelancers = require('../../users/models/freelancers.model')
const GigRating = require('../../gigs/models/gig-user-ratings.model')

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

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, msg: 'Invalid ID format'})
    }
    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Gigs, 'Gigs', id)
    let details
    try {
      // Use aggregation to fetch the gig along with dropOffDetails
      let gigs = await Gigs.aggregate([
        {
          $match: {_id: mongoose.Types.ObjectId(id)}
        },
        {
          $lookup: {
            from: 'gigs-dropoffs', // Collection name for DropOffs
            let: {dropOffIds: {$ifNull: ['$dropOffs', []]}}, // Use an empty array if dropOffs doesn't exist
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {$in: ['$_id', '$$dropOffIds']}, // Match if _id is in dropOffIds (if present)
                      {$eq: ['$status', 'Applying']}, // Match status
                      {$in: [mongoose.Types.ObjectId(id), '$gig']} // Match gig ID
                    ]
                  }
                }
              }
            ],
            as: 'dropOffDetails'
          }
        }
      ]).exec()

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Invalid ID format'})
    }

    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'User', id)
    let account
    try {
      let user = await Users.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()
      account = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      const result = await GigRating.aggregate([
        {
          $match: {uid: mongoose.Types.ObjectId(id)}
        },
        {
          $facet: {
            efficiency: [{$group: {_id: '$rates.efficiency', count: {$sum: 1}}}],
            recommendable: [{$group: {_id: '$rates.recommendable', count: {$sum: 1}}}],
            completeness: [{$group: {_id: '$rates.completeness', count: {$sum: 1}}}],
            showRate: [{$group: {_id: '$rates.showRate', count: {$sum: 1}}}]
          }
        }
      ])

      // Helper function to format the result
      const formatCounts = (facet) => {
        const counts = {black: 0, gold: 0}
        facet.forEach((item) => {
          if (item._id === '0') counts.black = item.count
          if (item._id === '1') counts.gold = item.count
        })
        return counts
      }

      // Format the results
      const efficiency = formatCounts(result[0].efficiency)
      const recommendable = formatCounts(result[0].recommendable)
      const completeness = formatCounts(result[0].completeness)
      const showRate = formatCounts(result[0].showRate)

      const rateComments = await GigRating.aggregate([
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
            as: 'gig'
          }
        },
        {
          $unwind: '$gig'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'gig.uid',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            _id: 0,
            comments: 1,
            'user.name': 1,
            'user.profile_photo': 1,
            'gig.user.thumbnail': 1
          }
        },
        {
          $match: {
            comments: {$ne: null}
          }
        }
      ]).exec()
      console.log('🚀 ~ comments:', rateComments)

      console.log('Efficiency Rating Counts:', efficiency)
      console.log('Recommendable Rating Counts:', recommendable)
      console.log('Completeness Rating Counts:', completeness)
      console.log('ShowRate Rating Counts:', showRate)

      const ratings = {
        efficiency,
        recommendable,
        completeness,
        showRate
      }
      // Fetch comments sorted by createdAt
      let comments = await GigRating.find({uid: mongoose.Types.ObjectId(id)})
        .sort({createdAt: -1})
        .select({comments: 1, uid: 1}) // Include comments and uid fields
        .lean()
        .exec()

      // Filter out null comments
      comments = comments.filter((comment) => comment.comments !== null)

      // Fetch user details
      const userComments = await Users.findOne({_id: mongoose.Types.ObjectId(id)})
        .select({name: 1}) // Include only the name field
        .lean()
        .exec()

      // Combine comments with user name
      const commentsWithUserName = comments.map((comment) => ({
        comments: comment.comments,
        userName: userComments ? userComments.name : null
      }))

      console.log(commentsWithUserName)
      // Assign account details
      account[0].email = user[0].email
      account[0].deviceId = user[0].deviceId
      account[0].accountType = user[0].accountType

      // Return account details along with rating counts
      return res.status(200).json({account, ratings, rateComments})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Applicant', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_freelancer_list: async function (req, res) {
    const token = req.headers['authorization']
    if (!token) return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})

    try {
      const freelancers = await Users.aggregate([
        {
          $match: {
            accountType: 0,
            isActive: true,
            isVerified: true,
            adminStatus: {$ne: null}
          }
        },
        {
          $sort: {createdAt: -1}
        },
        {
          $lookup: {
            from: 'users-freelancers', // ⚠️ must match actual collection name
            localField: '_id',
            foreignField: 'uuid',
            as: 'details'
          }
        },
        {
          $project: {
            _id: 1,
            createdAt: 1,
            'details.uuid': 1,
            'details.firstName': 1,
            'details.middleInitial': 1,
            'details.lastName': 1,
            'details.presentCity': 1,
            'details.photo': 1,
            'details.expertise.skillOffer': 1,
            'details.gigRatings': 1
          }
        }
      ])

      return res.status(200).json(freelancers)
    } catch (error) {
      console.error('Error in get_freelancer_list:', error)
      try {
        await logger.logError(error, 'Applicant.get_freelancer_list', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'User not found'})
    }
  },
  post_freelancer_list_search: async function (req, res) {
    let freelancers
    let totalFreelancers
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
        totalFreelancers = await Users.countDocuments({
          accountType: 0,
          isActive: true,
          isVerified: true,
          $or: [{firstName: {$regex: searchTerm, $options: 'i'}}, {lastName: {$regex: searchTerm, $options: 'i'}}]
        })

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
    return res.json({success: true, totalFreelancers, freelancers})

    // return res.status(200).json(freelancers)
  }
}

module.exports = controllers
