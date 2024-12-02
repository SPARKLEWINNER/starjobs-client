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
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(id)},
          {isActive: true, firstName: firstName, lastName: lastName}
        )
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

    await getSpecificData({_id: mongoose.Types.ObjectId(id)}, Clients, 'Client', id) // validate if data exists

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
      if (result) {
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(result.uid)},
          {firstName: firstName, lastName: lastName}
        )
      }

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

    const now = moment().toDate()
    const fifteenDaysAgo = moment().subtract(30, 'days').toDate()
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

        // gigs = await Gigs.aggregate([
        //   {
        //     $lookup: {
        //       localField: 'gigs._id',
        //       from: 'extended',
        //       foreignField: 'gigId',
        //       as: 'extended'
        //     }
        //   },
        //   {
        //     $unwind: {
        //       path: '$extended',
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   {
        //     $lookup: {
        //       localField: 'gigs._id',
        //       from: 'gigs-histories',
        //       foreignField: 'gid',
        //       as: 'history'
        //     }
        //   },
        //   {
        //     $unwind: {
        //       path: '$history',
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       position: 1,
        //       hours: 1,
        //       nation: 1,
        //       from: 1,
        //       late: 1,
        //       time: 1,
        //       status: 1,
        //       shift: 1,
        //       fee: 1,
        //       user: 1,
        //       uid: 1,
        //       isExtended: 1,
        //       isApprove: 1,
        //       category: 1,
        //       createdAt: 1,
        //       date: 1,
        //       dateCreated: 1,
        //       auid: 1,
        //       history: 1,
        //       commissionRate: 1,
        //       gigFeeType: 1,
        //       applicants: 1,
        //       maximumApplicants: '$extended.maximumApplicants',
        //       numberofApplicants: {
        //         $filter: {
        //           input: '$extended.applicants',
        //           as: 's',
        //           cond: [
        //             {
        //               $eq: ['$$s.status', 'Applying']
        //             },
        //             '$s.auid',
        //             []
        //           ]
        //         }
        //       }
        //     }
        //   }
        // ])
        //   .match({
        //     uid: mongoose.Types.ObjectId(id)
        //     // status: {$in: ['Waiting', 'Applying']} MQ: 03-09-2022 Fixed issue of pending gigs not showing
        //   })
        //   .exec()

        // gigs = await Gigs.aggregate([
        //   {
        //     $match: {
        //       uid: mongoose.Types.ObjectId(id)
        //       // status: { $in: ['Waiting', 'Applying'] }  // Uncomment if needed
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'extended',
        //       localField: '_id',
        //       foreignField: 'gigId',
        //       as: 'extended'
        //     }
        //   },
        //   {
        //     $unwind: {
        //       path: '$extended',
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: 'gigs-histories',
        //       localField: '_id',
        //       foreignField: 'gid',
        //       as: 'history'
        //     }
        //   },
        //   {
        //     $unwind: {
        //       path: '$history',
        //       preserveNullAndEmptyArrays: true
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       position: 1,
        //       hours: 1,
        //       nation: 1,
        //       location: 1,
        //       breakHr: 1,
        //       from: 1,
        //       late: 1,
        //       time: 1,
        //       status: 1,
        //       shift: 1,
        //       fee: 1,
        //       user: 1,
        //       uid: 1,
        //       isExtended: 1,
        //       isApprove: 1,
        //       category: 1,
        //       createdAt: 1,
        //       date: 1,
        //       dateCreated: 1,
        //       auid: 1,
        //       history: 1,
        //       commissionRate: 1,
        //       gigFeeType: 1,
        //       gigOffered: 1,
        //       applicants: 1,
        //       fees: 1,
        //       maximumApplicants: '$extended.maximumApplicants',
        //       numberofApplicants: {
        //         $cond: [
        //           {
        //             $and: [
        //               {$eq: ['$extended.applicants.status', 'Applying']},
        //               {$gt: ['$extended.applicants.auid', null]}
        //             ]
        //           },
        //           1,
        //           0
        //         ]
        //       }
        //     }
        //   }
        // ])

        gigs = await Gigs.aggregate([
          {
            $match: {
              uid: mongoose.Types.ObjectId(id),
              dateCreated: {
                $gte: fifteenDaysAgo, // Greater than or equal to 15 days ago
                $lte: now // Less than or equal to now
              }
            }
          },
          {
            $lookup: {
              from: 'extended',
              localField: '_id',
              foreignField: 'gigId',
              as: 'extended'
            }
          },
          {
            $lookup: {
              from: 'gigs-histories',
              localField: '_id',
              foreignField: 'gid',
              as: 'history'
            }
          },
          {
            $project: {
              _id: 1,
              position: 1,
              hours: 1,
              nation: 1,
              location: 1,
              breakHr: 1,
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
              history: {$arrayElemAt: ['$history', 0]},
              commissionRate: 1,
              gigFeeType: 1,
              gigOffered: 1,
              applicants: 1,
              fees: 1,
              maximumApplicants: {$arrayElemAt: ['$extended.maximumApplicants', 0]},
              numberofApplicants: {
                $cond: [
                  {
                    $and: [
                      {$eq: [{$arrayElemAt: ['$extended.applicants.status', 0]}, 'Applying']},
                      {$gt: [{$arrayElemAt: ['$extended.applicants.auid', 0]}, null]}
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        ])

        gigs = await Promise.all(
          gigs &&
            gigs
              .filter((obj) => {
                // console.log('🚀 ~ .filter ~ obj.time: 426', obj.time)
                // console.log('🚀 ~ .filter ~ obj.time length: 426', obj.time.length)

                // Check if obj.time is a valid date format
                const timeDate = moment(obj.time, moment.ISO_8601, true)
                if (!timeDate.isValid()) {
                  console.warn('Invalid date format:', obj.time)
                  return false // Skip this object
                }

                const previousDays = moment(obj.date).subtract(7, 'days')
                const aheadDays = timeDate.add(7, 'days')
                const range = moment().range(previousDays, aheadDays)

                if (range.contains(moment())) {
                  if (contracts.length > 0 && obj.status !== 'Contracts') return obj
                  if (contracts.length === 0) return obj
                }

                return false // Skip this object if not in range
              })
              .map(async (obj) => {
                if (!obj.isExtended) {
                  const account = await Freelancers.find({uuid: mongoose.Types.ObjectId(obj.auid)})
                    .lean()
                    .exec()

                  // Add applicant list to prevent re-apply of jobsters
                  if (obj.status === 'Applying' || obj.status === 'Waiting') {
                    const history = await History.find(
                      {
                        gid: mongoose.Types.ObjectId(obj._id),
                        status: ['Waiting', 'Applying']
                      },
                      {uid: 1, status: 1, _id: 1, createdAt: 1}
                    ).lean()

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

        // const filteredGigs = gigs
        //   ? await Promise.all(
        //       gigs
        //         .filter((obj) => {
        //           if (!moment(new Date(obj.time)).isBefore(moment(), 'day')) {
        //             if (contracts.length > 0 && obj.status !== 'Contracts') return true
        //             if (contracts.length === 0) return true
        //           }
        //           return false
        //         })
        //         .map(async (obj) => {
        //           if (!obj.isExtended) {
        //             const account = await Freelancers.findOne({uuid: mongoose.Types.ObjectId(obj.auid)})
        //               .lean()
        //               .exec()
        //             console.log(account)
        //             if (obj.status === 'Applying' || obj.status === 'Waiting') {
        //               const history = await History.find(
        //                 {
        //                   gid: mongoose.Types.ObjectId(obj._id),
        //                   status: {$in: ['Waiting', 'Applying']}
        //                 },
        //                 {uid: 1, status: 1, _id: 1, createdAt: 1}
        //               ).lean()

        //               return {
        //                 ...obj,
        //                 applicants: history,
        //                 account
        //               }
        //             }

        //             return {
        //               ...obj,
        //               account
        //             }
        //           } else {
        //             return obj
        //           }
        //         })
        //     )
        //   : []

        // // You can use filteredGigs as needed

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

  get_client_status_gigs: async function (req, res) {
    console.log('🚀 ~ get_client_status_gigs:')
    const {id, status} = req.params
    const {page, limit} = req.query
    const statusArray = status.split(',')
    // console.log(, ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
    // console.log(req.body, ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXbodyXXX')
    // console.log(req.params, ' XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXbodyXXX')

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

        if (status === 'Waiting,Pending') {
          console.log(status, '--------------status')
          let aggregationPipeline = [
            {
              $match: {
                uid: mongoose.Types.ObjectId(id),
                status: {$in: statusArray} // Uncomment if needed
              }
            },
            {
              $lookup: {
                from: 'extended',
                localField: '_id',
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
                from: 'gigs-histories',
                localField: '_id',
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
                location: 1,
                breakHr: 1,
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
                gigOffered: 1,
                applicants: 1,
                fees: 1,
                maximumApplicants: '$extended.maximumApplicants',
                numberofApplicants: {
                  $cond: [
                    {
                      $and: [
                        {$eq: ['$extended.applicants.status', 'Applying']},
                        {$gt: ['$extended.applicants.auid', null]}
                      ]
                    },
                    1,
                    0
                  ]
                }
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]

          if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit)
            aggregationPipeline.push({$skip: skip})
            aggregationPipeline.push({$limit: parseInt(limit)})
          }

          gigs = await Gigs.aggregate(aggregationPipeline)
        } else {
          let aggregationPipeline = [
            {
              $match: {
                uid: mongoose.Types.ObjectId(id),
                status: {$in: statusArray} // Uncomment if needed
              }
            },
            {
              $lookup: {
                from: 'gigs-dropoffs', // The name of the DropOffs collection
                localField: 'dropOffs', // The field in the Gigs collection referencing dropOffs
                foreignField: '_id', // The field in the DropOffs collection to join on
                as: 'dropOffDetails' // The name for the joined data in the result
              }
            },
            {
              $addFields: {
                dropOffDetails: {
                  $map: {
                    input: '$dropOffs',
                    as: 'id',
                    in: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$dropOffDetails',
                            as: 'detail',
                            cond: {$eq: ['$$detail._id', '$$id']}
                          }
                        },
                        0
                      ]
                    }
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                position: 1,
                hours: 1,
                nation: 1,
                location: 1,
                breakHr: 1,
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
                gigOffered: 1,
                applicants: 1,
                fees: 1,
                pickup: 1,
                dropOffs: 1, // Original dropOffs reference
                dropOffDetails: 1, // Include detailed dropOffs data
                numberOfRiders: 1,
                remarks: 1,
                ridersFee: 1,
                riderType: 1,
                vehicleType: 1,
                type: 1
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]
          // if (page && limit) {
          //   const skip = (parseInt(page) - 1) * parseInt(limit)
          //   aggregationPipeline.push({$skip: skip})
          //   aggregationPipeline.push({$limit: parseInt(limit)})
          // }

          gigs = await Gigs.aggregate(aggregationPipeline)
        }

        gigs = await Promise.all(
          gigs &&
            gigs
              .filter((obj, index, self) => {
                const firstIndex = self.findIndex((t) => t._id === obj._id)
                if (index !== firstIndex) {
                  console.log(`Duplicate Gig found: ${JSON.stringify(obj)}`)
                  return false // Skip duplicate objects
                }
                const timeDate = moment(obj.time)

                const previousDays = moment(obj.date).subtract(7, 'days')
                const aheadDays = moment(timeDate).add(7, 'days')
                const range = moment().range(previousDays, aheadDays)
                // between 0 days and 2 days before current day
                if (range.contains(moment())) {
                  if (contracts.length > 0 && obj.status != 'Contracts') return obj
                  if (contracts.length == 0) return obj
                  // return obj
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
        console.log('🚀 ~ gigData:', gigData)
        if (contracts.length > 0) {
          gigData = [contracts[0], ...gigs]
        }

        const gigsObject = gigData.reduce((acc, curr) => {
          acc[curr._id] = curr
          return acc
        }, {})

        // let filtered_gig = gigsObject.filter(
        //   (gig, index, self) => index === self.findIndex((obj) => obj._id === gig._id)
        // )
        // console.log(filtered_gig, ' filtered_gig')
        // console.log(gigsObject.length, ' filtered_gig Length')
        const gigsArray = Object.entries(gigsObject).map(([key, value]) => ({
          _id: key,
          ...value
        }))

        // const dataLast = []
        // filtered_gig &&
        //   filtered_gig.map((value) => {
        //     return dataLast.push(value)
        //   })

        client = {
          details: user ? user[0] : {},
          gigs: gigsArray,
          gigCategory: [...new Set(gigsArray.map((item) => item.category))]
        }
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Clients.get_client_gigs', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'User to get details'})
    }

    return res.status(200).json(client)
  },
  get_selected_gig: async function (req, res) {
    const {id} = req.params

    try {
      const gig = await Gigs.findById(id) // Fetch gig by ID

      let user = await Clients.find({uid: gig.uid}).lean().exec()
      if (!gig) {
        return res.status(404).json({message: 'Gig not found'})
      }

      res.status(200).json({success: true, gig, details: user ? user[0] : {}})
    } catch (error) {
      console.error(error)
      res.status(500).json({success: false, message: 'Server error'})
    }
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
