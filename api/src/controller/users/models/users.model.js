const crypto = require('crypto')
const uuid = require('uuid').v1

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const collectionName = 'users'

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    firstName: {
      type: String,
      trim: true,
      required: true
    },
    lastName: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    accountType: {
      type: Number,
      default: 0
    },
    verificationCode: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    deviceId: {
      type: String,
      default: ''
    },
    hashed_password: {
      type: String,
      default: null
    },
    resetToken: {
      type: String,
      default: null
    },
    expireToken: Date,
    salt: String,
    isActive: {
      type: Boolean,
      required: true,
      default: false
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: false
    },
    adminStatus: {
      type: String,
      default: null
    },
    verificationRemarks: {
      type: String,
      default: null
    },
    isCityUpdated: {
      type: Boolean,
      required: true,
      default: true
    },
    dateCreated: Date,
    googleSignIn: {
      type: Boolean,
      default: false
    },
    facebookSignIn: {
      type: Boolean,
      default: false
    },
    googleId: {
      type: String,
      trim: true,
      default: null
    },
    facebookId: {
      type: String,
      trim: true,
      default: null
    },
    isNotifOn: {
      type: Boolean,
      default: false
    },
    mustChangePassword: {
      type: Boolean,
      default: false
    },
    tempPasswordHash: {
      type: String,
      default: null
    },
    tempPasswordExpiresAt: {
      type: Date,
      default: null
    },
    tempPasswordUsed: {
      type: Boolean,
      default: false
    },
    canPost: {type: Boolean, default: true}
  },
  {timestamps: true}
)

userSchema
  .virtual('password') // Here 'password' is now a property on User documents.
  .set(function (pass) {
    this._password = pass
    this.salt = uuid()
    this.hashed_password = this.encryptPassword(pass)
  })
  .get(function () {
    return this._password
  })

userSchema.methods.authenticate = function (plainText) {
  return this.encryptPassword(plainText) === this.hashed_password
}

userSchema.methods.encryptPassword = function (password) {
  if (!password) return ''
  try {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
  } catch (err) {
    return ''
  }
}
userSchema.methods.validateTempPassword = function (plainPassword) {
  if (!this.tempPasswordHash || this.tempPasswordUsed || this.tempPasswordExpiresAt < new Date()) {
    return false
  }

  const [salt, storedHash] = this.tempPasswordHash.split(':')
  const hash = crypto.createHmac('sha1', salt).update(plainPassword).digest('hex')

  return hash === storedHash
}

userSchema.methods.consumeTempPassword = function () {
  this.tempPasswordUsed = true
  this.tempPasswordHash = null
  this.tempPasswordExpiresAt = null
}

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({email}).exec()
  console.log('🚀 ~ user:', user)
  if (!user) return false

  if (user.tempPasswordHash && user.tempPasswordExpiresAt && new Date() > user.tempPasswordExpiresAt) {
    throw new Error('Temporary password expired')
  }

  const normalHash = crypto.createHmac('sha1', user.salt).update(password).digest('hex')
  if (normalHash === user.hashed_password) {
    return {user, usedTempPassword: false}
  }
  console.log(user.tempPasswordHash)
  if (user.tempPasswordHash && user.validateTempPassword(password)) {
    user.hashed_password = crypto.createHmac('sha1', user.salt).update(password).digest('hex')

    user.consumeTempPassword()
    user.mustChangePassword = true
    await user.save()
    return {user, usedTempPassword: true}
  }

  return false
}

module.exports = mongoose.model('User', userSchema, collectionName)
