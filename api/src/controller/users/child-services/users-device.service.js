const mongoose = require('mongoose')
const jwt_decode = require('jwt-decode')

const Users = require('../models/users.model')
const UsersDevices = require('../models/users-devices.model')
const Freelancers = require('../models/freelancers.model')
const Clients = require('../models/clients.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')

var controllers = {
  get_user_device: async function (req, res) {
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

  patch_device_id: async function (req, res) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})
    const id = jwt_decode(token)['id']
    let data = {}

    const {device_id, device_type} = req.body

    await getSpecificData({id: mongoose.Types.ObjectId(id)}, Users, 'User', id) // validate if data exists

    const checkExistingDevice = await UsersDevices.findOne({userId: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (device_type == 'android') {
      data['androidDeviceId'] = device_id
    } else if (device_type == 'ios') {
      data['iosDeviceId'] = device_id
    } else {
      data['webDeviceId'] = device_id
    }

    if (!checkExistingDevice) {
      const deviceData = new UsersDevices({userId: mongoose.Types.ObjectId(id), ...data})
      await UsersDevices.create(deviceData)
    } else {
      await UsersDevices.findByIdAndUpdate(
        {
          _id: mongoose.Types.ObjectId(id)
        },
        {
          $set: data
        }
      )
    }

    let updatedToken
    try {
      updatedToken = await Users.findByIdAndUpdate({
        _id: mongoose.Types.ObjectId(id)
      }, {
        deviceId: device_id
      })
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'FCM.patch_token', null, id, 'PATCH')

      return res.status(502).json({success: false, msg: 'Unable to patch fcm'})
    }

    return res.status(200).json(updatedToken)
  }
}

module.exports = controllers
