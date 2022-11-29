const jwt = require('jsonwebtoken') // to generate signed token
const Users = require('../users/models/users.model')
const mongoose = require('mongoose')

var controller = {
  require_sign_in: function (req, res, next) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})

    token = token.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err)
        return res.status(401).json({
          success: false,
          is_authorized: false,
          msg: 'Not authorized'
        })

      next()
    })
  },
  require_admin_access: function (req, res, next) {
    let token = req.headers['authorization']
    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})

    token = token.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded_token) => {
      if (err)
        return res.status(401).json({
          success: false,
          is_authorized: false,
          msg: 'Not authorized'
        })
      let user = await Users.find({_id: mongoose.Types.ObjectId(decoded_token.id)})
        .lean()
        .exec()
      if (!user || user[0].accountType !== 99)
        return res.status(401).json({
          success: false,
          is_authorized: false,
          msg: 'Not authorized'
        })

      next()
    })
  },
  is_authenticated: function (req, res, next) {
    let token = req.headers['authorization']

    if (!token || typeof token === 'undefined')
      return res.status(401).json({success: false, is_authorized: false, msg: 'Not authorized'})

    token = token.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded_token) => {
      if (err) {
        return res.status(401).json({
          error: 'Unauthorized'
        })
      }

      let user = await Users.find({
        _id: mongoose.Types.ObjectId(decoded_token.id)
      })
        .lean()
        .exec()

      if (!user) {
        return res.status(401).json({
          error: 'Unable to access'
        })
      }

      next()
    })
  }
}

module.exports = controller
