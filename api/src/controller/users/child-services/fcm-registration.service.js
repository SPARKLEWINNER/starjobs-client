const logger = require('../../../common/loggers')
const FCMTOKEN = require('../models/fcm-tokens')

var controllers = {
  register_fcm_token: async function (req, res) {
    const {id} = req.params
    try {
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
      const {fcmToken} = req.body

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
  }
}

module.exports = controllers
