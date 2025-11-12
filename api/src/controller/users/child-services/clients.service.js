const mongoose = require('mongoose')
const moment = require('moment')

const Gigs = require('../../gigs/models/gigs.model')
const History = require('../../gigs/models/gig-histories.model')

const Users = require('../models/users.model')
const Freelancers = require('../models/freelancers.model')
const Contracts = require('../../gigs/models/gig-contracts.model')
const Clients = require('../models/clients.model')
const ClientBranches = require('../models/client_branches')

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
      regCompanyAddress,
      tin,
      accountingEmail,
      storeEmail,
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
      pointOfContactId,
      businessPermit,
      expirationDate,
      personInCharge,
      accountingNumber,
      accountingName,
      contactNumber
    } = req.body
    const now = new Date()

    const clientObj = new Clients({
      uid: mongoose.Types.ObjectId(id),
      firstName,
      lastName,
      middleInitial,
      email,
      companyName,
      regCompanyAddress,
      tin,
      accountingEmail,
      storeEmail,
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
      pointOfContactId,
      businessPermit,
      expirationDate,
      personInCharge,
      accountingNumber,
      accountingName,
      contactNumber,
      dateCreated: now.toISOString()
    })

    try {
      result = await Clients.create(clientObj)
      if (result) {
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(id)},
          {adminStatus: 'Pending', verificationRemarks: 'New client created', firstName: firstName, lastName: lastName}
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
      regCompanyAddress,
      tin,
      accountingEmail,
      storeEmail,
      brandName,
      location,
      website,
      companyPosition,
      personInCharge,
      accountingNumber,
      accountingName,
      contactNumber,
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
      regCompanyAddress,
      tin,
      accountingEmail,
      storeEmail,
      brandName,
      location,
      website,
      companyPosition,
      personInCharge,
      accountingNumber,
      accountingName,
      contactNumber,
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
        // const oldUserData = await Users.findOne({_id: mongoose.Types.ObjectId(result.uid)})
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(result.uid)},
          {
            firstName: firstName,
            lastName: lastName,
            verificationRemarks: 'Client details updated',
            // ...(oldUserData.adminStatus !== 'Verified' && {adminStatus: 'Pending'})
            adminStatus: 'Pending'
          }
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

    const {documents, pointOfContactId, businessPermit, expirationDate} = req.body

    const docsObject = {
      documents,
      pointOfContactId,
      businessPermit,
      expirationDate
    }
    const oldDetails = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    try {
      result = await Clients.findOneAndUpdate({uid: mongoose.Types.ObjectId(id)}, docsObject)
      if (result) {
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(result.uid)},
          {verificationRemarks: 'Client documents updated', adminStatus: 'Pending'}
        )
      }
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
    if (!id || id === 'undefined') return res.status(502).json({success: false, msg: 'User id missing'})

    try {
      // Convert to ObjectId once
      const userId = mongoose.Types.ObjectId(id)

      // 🔹 Date range: 7 days before and 7 days after today
      const today = new Date()
      const format = (d) => d.toISOString().split('T')[0]
      const startDateStr = format(new Date(today.getTime() - 7 * 864e5))
      const endDateStr = format(new Date(today.getTime() + 7 * 864e5))

      // 🔹 Run queries in parallel
      const [user, contracts, gigs] = await Promise.all([
        Clients.find({uid: userId}).lean(),

        // ⚡ Contracts with linked gigs
        Contracts.aggregate([
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
              category: 1,
              commissionRate: 1,
              gigFeeType: 1,
              position: '$gigs.position',
              shift: '$gigs.shift',
              time: '$gigs.time',
              hours: '$gigs.hours',
              breakHr: '$gigs.breakHr',
              date: '$gigs.date',
              dateCreated: '$gigs.dateCreated',
              status: '$gigs.status',
              location: '$gigs.location',
              applicants: '$gigs.applicants',
              user: '$gigs.user',
              updatedAt: 1,
              createdAt: 1
            }
          }
        ]),

        // ⚡ Gigs filtered by date range and joined with extended + history
        Gigs.aggregate([
          {
            $match: {
              uid: userId,
              date: {$gte: startDateStr, $lte: endDateStr}
            }
          },
          {
            $lookup: {
              from: 'extended',
              localField: '_id',
              foreignField: 'gigId',
              as: 'extended',
              pipeline: [{$project: {maximumApplicants: 1, applicants: 1}}]
            }
          },
          {
            $lookup: {
              from: 'gigs-histories',
              localField: '_id',
              foreignField: 'gid',
              as: 'history',
              pipeline: [{$project: {gid: 1, status: 1, createdAt: 1}}]
            }
          },
          {
            $project: {
              _id: 1,
              position: 1,
              hours: 1,
              breakHr: 1,
              category: 1,
              from: 1,
              time: 1,
              shift: 1,
              fee: 1,
              user: 1,
              uid: 1,
              isExtended: 1,
              isApprove: 1,
              status: 1,
              date: 1,
              dateCreated: 1,
              createdAt: 1,
              applicants: 1,
              fees: 1,
              gigOffered: 1,
              commissionRate: 1,
              gigFeeType: 1,
              location: 1,
              maximumApplicants: {$arrayElemAt: ['$extended.maximumApplicants', 0]},
              history: {$arrayElemAt: ['$history', 0]}
            }
          }
        ])
      ])

      // 🔹 Merge contracts & gigs results
      const gigData = contracts.length > 0 ? [contracts[0], ...gigs] : gigs

      // 🔹 Final formatted response
      const client = {
        details: user?.[0] || {},
        gigs: gigData,
        gigCategory: [...new Set(gigData.map((item) => item.category))]
      }

      return res.status(200).json(client)
    } catch (error) {
      console.error('Error in get_client_gigs:', error)
      try {
        await logger.logError(error, 'Clients.get_client_gigs', null, id, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Client gig details'})
    }
  },

  get_client_status_gigs: async function (req, res) {
    const {id, status} = req.params
    const {page = 1, limit = 20} = req.query
    const statusArray = status.split(',')

    if (!id || id === 'undefined') {
      return res.status(502).json({success: false, msg: 'User id missing'})
    }

    try {
      const userId = mongoose.Types.ObjectId(id)

      // Run user + client fetch in parallel
      const [userData, clientData] = await Promise.all([
        getSpecificData({_id: userId}, Users, 'User', id),
        Clients.find({uid: userId}).lean()
      ])

      console.log('🚀 ~ clientData:', clientData[0])
      if (!clientData || clientData.length === 0) {
        return res.status(404).json({success: false, msg: 'Client not found'})
      }

      // === 1️⃣ Compute 7-day date range based on client's main date (obj.date) ===
      // Assuming `clientData[0].date` or any date field from client — adjust as needed
      const today = new Date()
      const format = (d) => d.toISOString().split('T')[0]
      const startDateStr = format(new Date(today.getTime() - 7 * 864e5))
      const endDateStr = format(new Date(today.getTime() + 7 * 864e5))

      // Contracts aggregation (kept but optimized)
      const contractsPromise = Contracts.aggregate([
        {
          $lookup: {
            from: 'gigs',
            localField: 'gid',
            foreignField: '_id',
            as: 'gig'
          }
        },
        {$unwind: '$gig'},
        {$replaceRoot: {newRoot: '$gig'}}
      ])

      // === 2️⃣ Add matchStage with date range filter ===
      const matchStage = {
        $match: {
          uid: userId,
          status: {$in: statusArray},
          date: {$gte: startDateStr, $lte: endDateStr} // <- added date filter
        }
      }

      // === 3️⃣ Keep your lookup logic as-is ===
      let lookupStages = []

      if (status === 'Waiting,Pending') {
        lookupStages = [
          {
            $lookup: {
              from: 'extended',
              localField: '_id',
              foreignField: 'gigId',
              as: 'extended'
            }
          },
          {$unwind: {path: '$extended', preserveNullAndEmptyArrays: true}},
          {
            $lookup: {
              from: 'gigs-histories',
              localField: '_id',
              foreignField: 'gid',
              as: 'history'
            }
          }
        ]
      } else {
        lookupStages = [
          {
            $lookup: {
              from: 'gigs-dropoffs',
              localField: 'dropOffs',
              foreignField: '_id',
              as: 'dropOffDetails'
            }
          }
        ]
      }

      // === 4️⃣ Add date-filtered aggregation pipeline ===
      const aggregationPipeline = [
        matchStage,
        ...lookupStages,
        {$sort: {createdAt: -1}},
        {$skip: (parseInt(page) - 1) * parseInt(limit)},
        {$limit: parseInt(limit)},
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
            commissionRate: 1,
            gigFeeType: 1,
            applicants: 1,
            fees: 1,
            dropOffs: 1,
            dropOffDetails: 1,
            extended: 1,
            history: 1,
            numberOfRiders: 1,
            remarks: 1,
            ridersFee: 1,
            riderType: 1,
            vehicleType: 1,
            type: 1
          }
        }
      ]

      // === 5️⃣ Run aggregations ===
      const [gigs, contracts] = await Promise.all([Gigs.aggregate(aggregationPipeline), contractsPromise])

      // === 6️⃣ Batch fetch accounts + histories ===
      const auids = gigs.map((g) => g.auid).filter(Boolean)
      const gigIds = gigs.map((g) => g._id)

      const [accounts, histories] = await Promise.all([
        Freelancers.find({uuid: {$in: auids.map((a) => mongoose.Types.ObjectId(a))}}).lean(),
        History.find({gid: {$in: gigIds}, status: {$in: ['Waiting', 'Applying']}})
          .select('uid status gid createdAt')
          .lean()
      ])

      const accountMap = new Map(accounts.map((a) => [a.uuid.toString(), a]))
      const historyMap = histories.reduce((acc, h) => {
        const gid = h.gid.toString()
        acc[gid] = acc[gid] || []
        acc[gid].push(h)
        return acc
      }, {})

      const gigsMerged = gigs.map((g) => {
        const acc = accountMap.get(g.auid?.toString())
        const hist = historyMap[g._id.toString()] || []
        return {...g, account: acc, applicants: hist}
      })

      const uniqueGigs = []
      const seen = new Set()
      for (const g of gigsMerged) {
        const idStr = g._id.toString()
        if (!seen.has(idStr)) {
          seen.add(idStr)
          uniqueGigs.push(g)
        }
      }

      const gigData = contracts.length > 0 ? [contracts[0], ...uniqueGigs] : uniqueGigs

      const client = {
        details: userData || {},
        gigs: gigData,
        gigCategory: [...new Set(gigData.map((item) => item.category))]
      }

      return res.status(200).json(client)
    } catch (error) {
      console.error('Error in get_client_status_gigs:', error)
      try {
        await logger.logError(error, 'Clients.get_client_gigs', null, id, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Failed to get client gigs'})
    }
  },

  get_client_gigs_count: async function (req, res) {
    const {id} = req.params

    if (!id || id === 'undefined') {
      return res.status(502).json({success: false, msg: 'User id missing'})
    }

    try {
      const userId = mongoose.Types.ObjectId(id)

      // === Fetch user + client in parallel ===
      const [userData, clientData] = await Promise.all([
        getSpecificData({_id: userId}, Users, 'User', id),
        Clients.find({uid: userId}).lean()
      ])

      if (!clientData || clientData.length === 0) {
        return res.status(404).json({success: false, msg: 'Client not found'})
      }

      // === Date window (7 days before & after today) ===
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + 7) //
      const format = (d) => d.toISOString().split('T')[0]
      const startDateStr = format(new Date(today.getTime() - 7 * 864e5))
      const endDateStr = format(new Date(today.getTime() + 7 * 864e5))

      const statusGroups = {
        current: ['Confirm-Arrived', 'End-Shift', 'Contracts'],
        incoming: ['Accepted'],
        pending: ['Applying', 'Waiting'],
        billing: ['Confirm-End-Shift']
      }

      // === Count queries in parallel ===
      const [current, incoming, pendingApplying, pendingWaiting, billing] = await Promise.all([
        // 🟢 current
        Gigs.countDocuments({
          uid: userId,
          status: {$in: statusGroups.current},
          date: {$gte: startDateStr, $lte: endDateStr}
        }),

        // 🟢 incoming
        Gigs.countDocuments({
          uid: userId,
          status: {$in: statusGroups.incoming},
          date: {$gte: startDateStr, $lte: endDateStr}
        }),

        // 🟢 pending (Applying)
        Gigs.countDocuments({
          uid: userId,
          status: 'Applying',
          date: {$gte: startDateStr, $lte: endDateStr}
        }),

        // 🟢 pending (Waiting) — exclude gigs where "from" < today
        Gigs.countDocuments({
          uid: userId,
          status: 'Waiting',
          $expr: {
            $and: [
              {
                $gte: [
                  {
                    $dateFromString: {
                      dateString: '$from',
                      onError: new Date(0), // fallback to epoch if invalid
                      onNull: new Date(0)
                    }
                  },
                  today
                ]
              },
              {
                $lte: [
                  {
                    $dateFromString: {
                      dateString: '$from',
                      onError: new Date(0),
                      onNull: new Date(0)
                    }
                  },
                  endDate
                ]
              }
            ]
          }
        }),

        // 🟢 billing
        Gigs.countDocuments({
          uid: userId,
          status: {$in: statusGroups.billing},
          date: {$gte: startDateStr, $lte: endDateStr}
        })
      ])

      const reports = {
        current,
        incoming,
        pending: pendingApplying + pendingWaiting,
        billing
      }
      return res.status(200).json({
        success: true,
        client: userData || {},
        reports
      })
    } catch (error) {
      console.error('Error in get_client_gigs_count:', error)
      try {
        await logger.logError(error, 'Clients.get_client_gigs_count', null, id, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Failed to get client gig counts'})
    }
  },

  get_selected_gig: async function (req, res) {
    const {id} = req.params

    try {
      const gigData = await Gigs.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(id)}},
        {
          $lookup: {
            from: 'gigs-dropoffs',
            localField: 'dropOffs',
            foreignField: '_id',
            as: 'dropOffDetails'
          }
        }
      ])
      if (!gigData || gigData.length === 0) {
        return res.status(404).json({message: 'Gig not found'})
      }
      const gig = gigData[0]
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
  get_client_branches: async function (req, res) {
    const {id} = req.params
    console.log('🚀 ~ idxx:', id)
    try {
      const branches = await ClientBranches.find({clientId: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()
      console.log('🚀 ~ branchesbranches:', branches)

      res.status(200).json({success: true, branches})
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
