const mongoose = require('mongoose')
const moment = require('moment')

const Gigs = require('../../gigs/models/gigs.model')
const History = require('../../gigs/models/gig-histories.model')

const Users = require('../models/users.model')
const Freelancers = require('../models/freelancers.model')
const Contracts = require('../../gigs/models/gig-contracts.model')
const Clients = require('../models/clients.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')
const jwt = require('../../../common/jwt')

const {BUCKET_URL} = process.env

var controllers = {
  post_client_details: async function (req, res) {
    const {id} = req.params
    let result

    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'Client', id) // validate if data exists

    const {
      firstName,
      lastName,
      middleInitial,
      email,
      companyName,
      brandName,
      location,
      website,
      companyPosition,
      contact,
      industry,
      rate,
      payment,
      photo,
      documents
    } = req.body
    const now = new Date()

    const clientObj = new Clients({
      uid: mongoose.Types.ObjectId(id),
      firstName,
      lastName,
      middleInitial,
      email,
      companyName,
      brandName,
      location,
      website,
      companyPosition,
      contact,
      industry,
      rate,
      payment,
      photo,
      documents,
      dateCreated: now.toISOString()
    })

    try {
      result = await Clients.create(clientObj)
      if (result) {
        await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isActive: true})
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Clients.post_client_details', req.body, id, 'POST')
      return res.status(502).json({success: false, msg: 'User to save details'})
    }

    clientObj.photo = BUCKET_URL + photo

    let document_url = clientObj.documents.split('=>').map((v) => {
      return BUCKET_URL + v
    })

    clientObj.documents = document_url

    const updated_user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    let {accessToken: token, refreshToken} = jwt.create_token(id)
    result = {
      token,
      refreshToken,
      ...updated_user[0]
    }

    return res.status(201).json(result)
  },

  patch_client_details: async function (req, res) {
    const {id} = req.params
    let result, user

    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'Client', id) // validate if data exists

    const {
      firstName,
      lastName,
      middleInitial,
      email,
      companyName,
      brandName,
      location,
      website,
      companyPosition,
      contact,
      industry,
      rate,
      payment,
      photo
    } = req.body

    const clientObj = {
      firstName,
      lastName,
      middleInitial,
      email,
      companyName,
      brandName,
      location,
      website,
      companyPosition,
      contact,
      industry,
      rate,
      payment,
      photo
    }

    const oldDetails = await Clients.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    try {
      result = await Clients.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, clientObj)
      user = await Users.find({_id: mongoose.Types.ObjectId(result.uid)})
        .lean()
        .exec()
      await logger.logAccountHistory(user[0].accountType, clientObj, id, oldDetails[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Clients.patch_client_details', clientObj, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User to save details'})
    }

    let {accessToken: token, refreshToken} = jwt.create_token(result.uid)
    result = {
      ...user[0],
      photo: result.photo,
      token,
      refreshToken
    }

    return res.status(201).json(result)
  },

  patch_client_documents: async function (req, res) {
    const {id} = req.params
    let result, user

    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'Client', id) // validate if data exists

    const {documents} = req.body

    const oldDetails = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    try {
      result = await Clients.findOneAndUpdate({uid: mongoose.Types.ObjectId(id)}, {documents: documents})
      user = await Users.find({_id: mongoose.Types.ObjectId(result.uid)})
        .lean()
        .exec()
      await logger.logAccountHistory(user[0].accountType, {documents: documents}, id, oldDetails[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Clients.patch_client_documents', {documents: documents}, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User to save new documents'})
    }

    return res.status(200).json({msg: 'New Documents will be reviewed by our staff', status: 'success'})
  },

  get_client: async function (req, res) {
    const {id} = req.params
    let client

    try {
      client = await getSpecificData({uid: mongoose.Types.ObjectId(id)}, Clients, 'Client', id)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Client', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'User to get details'})
    }
    return res.status(200).json(client)
  },

  get_client_gigs: async function (req, res) {
    const {id} = req.params
    let gigs, client
    if (!id || id === 'undefined') return res.status(502).json({success: false, msg: 'User id missing'})

    try {
      await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Users, 'User', id)
      let user = await Clients.find({uid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      if (user) {
        const contracts = await Contracts.aggregate([
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
              _id: '$gigs._id',
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

        gigs = await Gigs.aggregate([
          {
            $lookup: {
              localField: 'gigs._id',
              from: 'extended',
              foreignField: 'gigId',
              as: 'extended'
            }
          },
          {
            $unwind: {
              path: '$extended',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              localField: 'gigs._id',
              from: 'gigs-histories',
              foreignField: 'gid',
              as: 'history'
            }
          },
          {
            $unwind: {
              path: '$history',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              position: 1,
              hours: 1,
              nation: 1,
              from: 1,
              late: 1,
              time: 1,
              status: 1,
              shift: 1,
              fee: 1,
              user: 1,
              uid: 1,
              isExtended: 1,
              isApprove: 1,
              category: 1,
              createdAt: 1,
              date: 1,
              dateCreated: 1,
              auid: 1,
              history: 1,
              commissionRate: 1,
              gigFeeType: 1,
              applicants: 1,
              maximumApplicants: '$extended.maximumApplicants',
              numberofApplicants: {
                $filter: {
                  input: '$extended.applicants',
                  as: 's',
                  cond: [
                    {
                      $eq: ['$$s.status', 'Applying']
                    },
                    '$s.auid',
                    []
                  ]
                }
              }
            }
          }
        ])
          .match({
            uid: mongoose.Types.ObjectId(id)
            // status: {$in: ['Waiting', 'Applying']} MQ: 03-09-2022 Fixed issue of pending gigs not showing
          })
          .exec()

        gigs = await Promise.all(
          gigs &&
            gigs
              .filter((obj) => {
                if (!moment(new Date(obj.time)).isBefore(moment(), 'day')) {
                  if (contracts.length > 0 && obj.status != 'Contracts') return obj
                  if (contracts.length == 0) return obj
                }
              })
              .map(async (obj) => {
                if (!obj.isExtended) {
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
                } else {
                  return obj
                }
              })
        )

        let gigData = gigs
        if (contracts.length > 0) {
          gigData = [contracts[0], ...gigs]
        }
        client = {
          details: user ? user[0] : {},
          gigs: gigData,
          gigCategory: [...new Set(gigData.map((item) => item.category))]
        }
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Clients.get_client_gigs', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'User to get details'})
    }

    return res.status(200).json(client)
  },

  get_client_edit_profile: async function (req, res) {
    const {id} = req.params
    if (!id || id === 'undefined') return res.status(502).json({success: false, msg: 'User id missing'})

    const user = await Users.find({id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    if (!user) return res.status(502).json({success: false, msg: 'User not found'})

    let client = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    return res.status(201).json({
      ...user,
      ...client
    })
  }
}

module.exports = controllers
