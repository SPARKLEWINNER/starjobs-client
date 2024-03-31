const logger = require('../../../common/loggers')
const FCMTOKEN = require('../models/fcm-tokens')
const Users = require('../models/users.model')
const mongoose = require('mongoose')

var controllers = {
  register_fcm_token: async function (req, res) {
    const {id} = req.params
    try {
      console.log(req.body)

      const {fcmToken, device} = req.body

      if (!fcmToken || !device) {
        return res.status(400).json({success: false, msg: 'Invalid request'})
      }

      let token = new FCMTOKEN({
        userId: id,
        fcmToken: fcmToken,
        device: device
      })

      await token.save()

      await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isNotifOn: true})

      return res.status(200).json({success: true, msg: 'Successfully registered fcm token', data: token})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'fcm-registration.service.register_fcm_token', null, id, 'POST')

      return res.status(502).json({success: false, msg: 'Unable to get details'})
    }
  },

  unregister_fcm_token: async function (req, res) {
    const {id} = req.params
    try {
      let {fcmToken} = req.body
      if (fcmToken == undefined) {
        fcmToken = req.query.fcmToken
      }

      if (!fcmToken) {
        return res.status(400).json({success: false, msg: 'Invalid request'})
      }

      await FCMTOKEN.deleteOne({
        fcmToken: fcmToken
      })

      return res.status(200).json({success: true, msg: 'Successfully unregistered fcm token'})
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'fcm-registration.service.unregister_fcm_token', null, id, 'DELETE')

      return res.status(502).json({success: false, msg: 'Unable to get details'})
    }
  },
  get_active_fcm_token: async function (req, res) {
    try {
      const userId = req.params.id
      console.log('🚀 ~ file: fcm-registration.service.js:57 ~ userId:', userId)
      // const thresholdTime = 24 * 60 * 60 * 1000

      const token = await FCMTOKEN.find({userId: mongoose.Types.ObjectId(userId)})
        // .sort({createdAt: -1})
        .exec()
      console.log('🚀 ~ file: fcm-registration.service.js:61 ~ token:', token)

      if (token) {
        return res.json({success: true, fcmToken: token.fcmToken})

        // const currentTime = new Date()
        // const tokenUpdateTime = new Date(token.updatedAt)

        // if (currentTime - tokenUpdateTime < thresholdTime) {
        //   console.log('active token return')

        // } else {
        //   return res.json({success: false, message: 'Inactive FCM token.'})
        // }
      } else {
        return res.json({success: false, message: 'No FCM token found for the user.'})
      }
    } catch (error) {
      console.error('Error fetching FCM token:', error)
      return res.status(500).json({success: false, message: 'Internal server error.'})
    }
  }
}

module.exports = controllers
