const mongoose = require('mongoose')
const jwt_decode = require('jwt-decode')
const crypto = require('crypto')

const Users = require('./models/users.model')
const Freelancers = require('./models/freelancers.model')
const Clients = require('./models/clients.model')
const History = require('../gigs/models/gig-histories.model')
const Notification = require('../notifications/models/notifications.model')

const logger = require('../../common/loggers')
const FcmTokens = require('./models/fcm-tokens')
const fcm = require('../../services/fcm-notif.service')

var controllers = {
  get_user: async function (req, res) {
    let user, result
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    const id = jwt_decode(token)['id']

    try {
      user = await Users.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()
      if (!user || Users.length === 0)
        return res.status(404).json({success: false, is_authorized: false, msg: 'User not found'})

      if (user && user[0].accountType === 1) {
        result = await Clients.find({uid: mongoose.Types.ObjectId(id)}, {photo: 1})
          .lean()
          .exec()
      } else {
        result = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)}, {photo: 1})
          .lean()
          .exec()
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.get_user', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'Unable to get details'})
    }

    if (result.length > 0) {
      return res.status(200).json({...user[0], photo: result[0].photo})
    }

    return res.status(200).json({...user[0], photo: undefined})
  },

  get_users: async function (req, res) {
    let query = Users.find({accountType: {$ne: 99}}, null, {sort: {dateCreated: -1}})

    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 100
    const skip = (page - 1) * pageSize
    const total = await Users.countDocuments()
    const reports = await Users.aggregate([
      {
        $group: {
          _id: {$month: '$dateCreated'},
          numberOfRegisters: {$sum: 1}
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
      await logger.logError(error, 'Users.get_users', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },

  get_users_specific: async function (req, res) {
    let {id, type} = req.params

    try {
      if (JSON.parse(type) === 1) {
        await Users.aggregate([
          {
            $lookup: {
              from: 'users-clients',
              localField: '_id',
              foreignField: 'uid',
              as: 'profile'
            }
          }
        ])
          .match({_id: mongoose.Types.ObjectId(id)})
          .exec((err, data) => {
            if (err) return false

            return res.status(200).json(data[0])
          })
      } else {
        Users.aggregate([
          {
            $lookup: {
              from: 'users-freelancers',
              localField: '_id',
              foreignField: 'uuid',
              as: 'profile'
            }
          }
        ])
          .match({_id: mongoose.Types.ObjectId(id)})
          .exec((err, data) => {
            if (err) return false

            return res.status(200).json(data[0])
          })
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.get_users', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },

  patch_change_password: async function (req, res) {
    let update_user = {}
    const {id} = req.params
    let {oldPassword, newPassword} = req.body

    const user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    if (!user) {
      return res.status(502).json({success: false, msg: 'Unable to change password'})
    }

    let encryptPassword = crypto.createHmac('sha1', user[0].salt).update(oldPassword).digest('hex')
    if (encryptPassword !== user[0].hashed_password) {
      return res.status(402).json({success: false, msg: "Old password doesn't match."})
    }

    update_user['hashed_password'] = crypto.createHmac('sha1', user[0].salt).update(newPassword).digest('hex')
    try {
      update_user = await Users.findByIdAndUpdate({_id: mongoose.Types.ObjectId(id)}, update_user)
        .lean()
        .exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.get_user', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get details'})
    }

    return res.status(200).json(update_user)
  },

  get_search_users: async function (req, res) {
    let query = Users.find({accountType: {$ne: 99}, name: {$regex: '.*' + req.query.keyword + '.*'}})
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.limit) || 100
    const skip = (page - 1) * pageSize
    const totalUsers = await Users.countDocuments()
    const total = await Users.length
    const reports = await Users.aggregate([
      {
        $group: {
          _id: {$month: '$dateCreated'},
          numberOfRegisters: {$sum: 1}
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
      await logger.logError(error, 'Users.get_users', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },

  get_user_exports: async function (req, res) {
    try {
      let query = await Users.find(
        {accountType: {$ne: 99}},
        {name: 1, _id: 1, email: 1, isActive: 1, dateCreated: 1, accountType: 1}
      )
        .lean()
        .exec()

      res.status(200).json({
        status: 'success',
        data: query
      })
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.get_user_exports', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get lists'})
    }
  },

  patch_user_token: async function (req, res) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    let update_user
    const id = jwt_decode(token)['id']
    const user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!user) {
      return res.status(502).json({success: false, msg: 'Unable to update device token'})
    }

    const {deviceToken} = req.body

    try {
      update_user = await Users.findByIdAndUpdate(
        {_id: mongoose.Types.ObjectId(id)},
        {
          deviceId: deviceToken
        }
      )
        .lean()
        .exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.patch_user_token', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to patch new device token'})
    }

    return res.status(200).json(update_user)
  },

  patch_user: async function (req, res, next) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    let update_user
    const id = jwt_decode(token)['id']
    let user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!user) {
      return res.status(502).json({success: false, msg: 'Unable to update device token'})
    }
    try {
      update_user = await Users.findByIdAndUpdate(
        {_id: mongoose.Types.ObjectId(id)},
        {
          accountType: req.body.accountType,
          phone: req.body.phone,
          isVerified: true
        }
      )
        .lean()
        .exec()

      if (update_user) {
        user = await Users.find({_id: mongoose.Types.ObjectId(id)})
          .lean()
          .exec()
      }
      res.status(200).json({...user})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.patch_user', null, id, 'GET')
      res.status(502).json({success: false, msg: 'Unable to patch new device token'})
    } finally {
      next()
    }
  },

  patch_read_all_notification: async function (req, res, next) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    const id = jwt_decode(token)['id']

    let result
    try {
      const userType = await Users.find({_id: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()
      if (userType[0].accountType === 1) {
        // client
        result = await History.updateMany(
          {uid: mongoose.Types.ObjectId(id)},
          {
            $set: {
              readAuthor: true
            }
          },
          {multi: true, upsert: true}
        ).exec()
      } else {
        // jobster
        result = await History.updateMany(
          {uid: mongoose.Types.ObjectId(id)},
          {
            $set: {
              readUser: true
            }
          },
          {multi: true, upsert: true}
        ).exec()
      }

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      await Notification.updateMany(
        {
          targetUsers: {
            $in: [mongoose.Types.ObjectId(id)]
          }
        },
        {
          $addToSet: {
            viewedBy: id
          }
        },
        {
          multi: true,
          upsert: true
        }
      ).exec((err) => {
        if (err) {
          return res.status(400).json({
            error: `Error on updating notification: ${err}`
          })
        }
      })

      return res.status(200).json({success: false, data: result})
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Users.patch_read_all_notification', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    } finally {
      next()
    }
  },
  delete_user_account: async function (req, res, next) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    let update_user
    const id = jwt_decode(token)['id']
    const user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!user) {
      return res.status(502).json({success: false, msg: 'Unable to update user account'})
    }

    try {
      update_user = await Users.findByIdAndUpdate(
        {_id: mongoose.Types.ObjectId(id)},
        {
          email: null,
          name: null,
          isActive: false
        }
      )
        .lean()
        .exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Users.patch_user_account', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to patch user account'})
    }

    return res.status(200).json(update_user)
  },
  patch_account_name: async function (req, res) {
    console.log(req.body)
    const {id} = req.params
    console.log(id)
    const {firstName, lastName, acctType} = req.body
    let result, isExisting
    if (acctType === 1) {
      isExisting = await Clients.find({_id: id}).exec()
    } else {
      isExisting = await Freelancers.find({_id: id}).exec()
    }

    if (isExisting.length === 0)
      return res.status(400).json({
        success: false,
        msg: `` // Email doesn't exists
      })

    try {
      if (acctType === 1) {
        // Update Client
        result = await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(isExisting[0].uid)},
          {firstName: firstName, lastName: lastName}
        )
        if (result) {
          await Clients.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {firstName: firstName, lastName: lastName})
        }
      } else {
        // Update Jobster
        result = await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(isExisting[0].uuid)},
          {firstName: firstName, lastName: lastName}
        )
        if (result) {
          await Freelancers.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(id)},
            {firstName: firstName, lastName: lastName}
          )
        }
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_specific', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    const updated_user = await Users.find({_id: mongoose.Types.ObjectId(result._id)})
    console.log(updated_user)
    result = {
      ...updated_user[0]
    }
    return res.status(200).json(result)
  },
  test_notification: async function (req, res) {
    const {id} = req.params
    console.log(id)

    const message = {
      description: 'This is a test notification. Please Disregard',
      status: 'Testing',
      url: ''
    }

    const users_fcm = await FcmTokens.find({userId: mongoose.Types.ObjectId.ObjectId(id)})
      .lean()
      .exec()
    console.log('🚀 ~ file: users.service.js:485 ~ users_fcm:', users_fcm)
    const fcmTokenArray = users_fcm.map((userToken) => userToken.fcmToken)
    console.log('🚀 ~ file: users.service.js:487 ~ fcmTokenArray:', fcmTokenArray)

    if (fcmTokenArray.length > 0) {
      fcm.send_notif(fcmTokenArray, message.description, message.url, message.status)
      console.log('------------Sent Testing Notif----------')
    }
    const result = {
      ...fcmTokenArray
    }
    return res.status(200).json(result)
  }
}

module.exports = controllers
