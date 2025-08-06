const mongoose = require('mongoose')
const uuid = require('uuid').v1
const crypto = require('crypto')

const Users = require('../users/models/users.model')
const Freelancers = require('../users/models/freelancers.model')
const Clients = require('../users/models/clients.model')
const CastToken = require('../users/models/cast-token.model')

const Guests = require('./models/guests.model')

const mailer = require('../../services/email/email.service')
const sms = require('../../services/sms.service')
const logger = require('../../common/loggers')
const requestToken = require('../../common/jwt')

var controllers = {
  sign_in: async function (req, res) {
    const {email, password} = req.body

    if (!email || !password) {
      res.status(400).json({success: false, msg: `Missing email or password field!`})
      return
    }
    try {
      const userData = await Users.login(email, password)
      if (!userData) {
        res.status(400).json({success: false, msg: `Invalid credentials!`})
        return
      }

      userData.hashed_password = userData.salt = undefined

      let {accessToken: token, refreshToken} = requestToken.create_token(userData._id)

      res.cookie('jwt', token, {expire: new Date() + 9999})
      if (userData.isActive) {
        if (userData.accountType === 0) {
          const account = await Freelancers.find(
            {uuid: mongoose.Types.ObjectId(userData._id)},
            {photo: 1, isGcashUpdated: 1}
          )
            .lean()
            .exec()

          return res.json({
            token,
            refreshToken,
            ...userData,
            photo: account[0]?.photo,
            isGcashUpdated: account[0]?.isGcashUpdated
          }) // freelancer
        } else {
          const client = await Clients.find({uid: mongoose.Types.ObjectId(userData._id)}, {photo: 1})
            .lean()
            .exec()
          return res.json({
            token,
            refreshToken,
            ...userData,
            photo: client[0]?.photo,
            isClient: true
          }) // client
        }
      }

      if (userData.accountType === 0) {
        return res.json({token, refreshToken, ...userData, photo: undefined}) // freelancer
      } else {
        return res.json({token, refreshToken, ...userData, isClient: true, photo: undefined}) // client
      }
    } catch (err) {
      console.log(err)
      await logger.logError(err, 'Auth.sign_in', null, null, 'POST')

      res.status(400).json({success: false, msg: err})
    }
  },

  social_sign_in: async function (req, res, next) {
    const {email, name, social_id, social_type} = req.body
    console.log(social_id)

    if (!email || !social_type) {
      res.status(400).json({success: false, msg: `Missing email!`})
      return
    }

    const checkAccountExists = await Users.find({
      email: email
    })
      .lean()
      .exec()

    // register the account
    if (checkAccountExists.length == 0) {
      let user_data = {
        email,
        name,
        verificationCode: null,
        dateCreated: new Date()
      }

      if (social_type == 'google') {
        user_data['googleId'] = social_id
        user_data['googleSignIn'] = true
      }

      if (social_type == 'facebook') {
        user_data['facebookId'] = social_id
        user_data['facebookSignIn'] = true
      }
      if (social_type == 'apple') {
        user_data['appleId'] = social_id
        user_data['appleSignIn'] = true
      }

      const new_user = new Users(user_data)
      let result = await Users.create(new_user)
      if (!result) {
        res.status(400).json({
          success: false,
          msg: 'Unable to sign up'
        })
      }

      let {accessToken: token, refreshToken} = requestToken.create_token(result._doc._id)

      return res.json({...result._doc, token, refreshToken, newAccount: true})
    }

    try {
      let {accessToken: token, refreshToken} = requestToken.create_token(checkAccountExists[0]._id)

      res.cookie('jwt', token, {expire: new Date() + 9999})

      if (checkAccountExists[0].isActive) {
        return res.json({
          token,
          refreshToken,
          onboardAccount: true,
          ...checkAccountExists[0]
        })
      }
      return res.json({
        token,
        refreshToken,
        ...checkAccountExists[0]
      })
    } catch (err) {
      console.log(err)
      await logger.logError(err, 'Auth.social_sign_in', null, null, 'POST')

      res.status(400).json({success: false, msg: err})
    } finally {
      next()
    }
  },

  sign_up: async function (req, res) {
    const {email, password, accountType, firstName, lastName, name, phone} = req.body

    if (
      !email ||
      !password ||
      accountType === null ||
      accountType === undefined ||
      !firstName ||
      !name ||
      !lastName ||
      !phone
    ) {
      res.status(400).json({success: false, msg: `Missing email or password field!`})
      return
    }

    const isExistingEmail = await Users.find({email: email}).lean().exec()
    const isExistingPhone = await Users.find({phone: phone}).lean().exec()

    if (isExistingEmail.length > 0)
      return res.status(400).json({
        success: false,
        msg: 'Email already exists'
      })
    if (isExistingPhone.length > 0)
      return res.status(400).json({
        success: false,
        msg: 'Phone number already exists'
      })

    try {
      let code = Math.floor(100000 + Math.random() * 900000)
      const new_user_data = {
        email,
        name,
        firstName,
        lastName,
        accountType,
        phone,
        verificationCode: code,
        password: password,
        dateCreated: new Date(),
        adminStatus: null
      }

      if (accountType === 0) {
        new_user_data.canPost = true // ✅ Default true for clients only
      }

      const new_user = new Users(new_user_data)
      let result = await Users.create(new_user)
      if (!result) {
        res.status(400).json({
          success: false,
          msg: 'Unable to sign up'
        })
      }

      sms.cast_sms(phone, `Starjobs verification code ${code}`)
      await mailer.send_mail({email, verifyCode: code, type: 'sign_up'})

      let {accessToken: token, refreshToken} = requestToken.create_token(result._doc._id)
      res.json({...result._doc, token, refreshToken})
    } catch (err) {
      await logger.logError(err, 'Auth.sign_up', null, null, 'POST')

      res.status(400).json({success: false, msg: err})
    }
  },

  resend_verification: async function (req, res) {
    const type = req.query.type
    const {email} = req.body

    let isExisting = await Users.find({email: email}).lean().exec()
    if (isExisting.length === 0)
      return res.status(400).json({
        success: false,
        msg: `Email doesn't exists`
      })

    if (isExisting[0].verificationCode) {
      let new_code = Math.floor(100000 + Math.random() * 900000)
      await Users.findOneAndUpdate({email: email}, {verificationCode: new_code}, {new: true})
      isExisting[0].verificationCode = new_code
      if (!isExisting)
        res.status(400).json({
          success: false,
          msg: `Unable to create verification code`
        })
    }

    try {
      if (type && type === 'sms') {
        let {phone: request_phone} = req.body
        let phone

        if (!isExisting[0].phone) {
          const numberFormat =
            String(request_phone).charAt(0) + String(request_phone).charAt(1) + String(request_phone).charAt(2)

          if (numberFormat !== '+63') {
            phone = '+63' + request_phone.substring(1)
          }
          await Users.findOneAndUpdate({email: email}, {phone: phone})
        } else {
          phone = request_phone
        }
        // const recipients = [
        //   {
        //     ContactNumber: phone
        //   }
        // ]

        await sms.cast_sms(phone, `Starjobs verification code ${isExisting[0].verificationCode}`)
      } else {
        await mailer.send_mail({email, verifyCode: isExisting[0].verificationCode, type: 'sign_up'})
      }

      res.status(200).json({success: true, msg: 'Request for verification code success'})
    } catch (err) {
      await logger.logError(err, 'Auth.resend_verification', null, null, 'POST')
      console.log(err)
      res.status(400).json({success: false, msg: err})
    }
  },

  verify_code: async function (req, res) {
    const {code, email} = req.body
    try {
      let isExisting = await Users.find({email: email, verificationCode: code}).lean().exec()
      if (isExisting.length === 0)
        return res.status(400).json({
          success: false,
          msg: `Invalid verification code`
        })

      const result = await Users.findOneAndUpdate({email: email}, {isVerified: true, verificationCode: null})
      if (!result)
        res.status(400).json({
          success: false,
          msg: `Unable to verify account ${email}`
        })

      res.status(200).json(isExisting[0])
    } catch (err) {
      await logger.logError(err, 'Auth.verify_code', null, null, 'POST')

      res.status(400).json({success: false, msg: err})
    }
  },

  sign_out: function (req, res) {
    res.clearCookie('jwt')
    res.json({message: 'Sign out success'})
  },

  verify_refresh_token: function (req, res) {
    const {id, refreshToken} = req.body
    const isValid = requestToken.verify_token(id, refreshToken)
    if (!isValid) {
      return res.status(401).json({success: false, error: 'Invalid token,try login again'})
    }

    let {accessToken: token} = requestToken.create_token(id)

    return res.status(200).json({success: true, token})
  },

  forgot_password: async function (req, res) {
    const {email} = req.body
    if (!email)
      return res.status(400).json({
        success: false,
        msg: `Email address is required`
      })

    const isExisting = await Users.find({email: email}).lean().exec()
    if (isExisting.length === 0)
      return res.status(400).json({
        success: false,
        msg: `` // Email doesn't exists
      })

    let token = await requestToken.reset_token(email)

    await Users.findByIdAndUpdate(
      {_id: mongoose.Types.ObjectId(isExisting[0]._id)},
      {resetToken: token.resetToken}
      // {hashed_password: null, salt: null, resetToken: token.resetToken}
    ).exec()

    try {
      await mailer.send_mail({email, token, type: 'forgot_password'})
      return res.json({success: true, msg: 'Email for reset password sent.'})
    } catch (err) {
      console.log(err)
    }
  },

  reset_password: async function (req, res) {
    const {token, password: newPassword} = req.body
    if (!token)
      return res.status(400).json({
        success: false,
        msg: `Reset token expired`
      })

    const current_user = await Users.find({resetToken: token}).lean().exec()
    if (current_user.length === 0)
      return res.status(400).json({
        success: false,
        msg: `Email doesn't exists` //
      })
    console.log(newPassword)
    const user_salt = uuid()
    const encrypt_password = crypto.createHmac('sha1', user_salt).update(newPassword).digest('hex')

    await Users.findOneAndUpdate(
      {resetToken: token},
      {hashed_password: encrypt_password, salt: user_salt, resetToken: null}
    )
      .lean()
      .exec()

    try {
      return res.json({success: true, msg: 'Change password success.'})
    } catch (err) {
      console.log(err)
    }
  },

  survey_guest: async function (req, res) {
    const {name, phone} = req.body

    if (!phone) {
      res.status(400).json({success: false, msg: `Missing phone number!`})
      return
    }

    try {
      const new_guest = new Guests({
        name: name ?? 'anonymous',
        phone
      })

      let result = await Guests.create(new_guest)
      if (!result) {
        res.status(400).json({
          success: false,
          msg: 'Unable to record guest accessed'
        })
      }

      res.status(200).json({...result._doc})
    } catch (err) {
      console.log(err)
      await logger.logError(err, 'Auth.survey_guest', null, null, 'POST')
      res.status(400).json({success: false, msg: err})
    }
  },
  cast_send_otp: async function (req, res) {
    const {phone, msg} = req.body

    try {
      const response = await sms.cast_sms_sparkle(phone, msg) // Await the response
      return res.status(200).json(response) // Respond with the result from cast_sms
    } catch (error) {
      console.error('Error in cast_send_otp:', error)
      return res.status(500).json({success: false, error: 'Internal server error'})
    }
  }
}

module.exports = controllers
