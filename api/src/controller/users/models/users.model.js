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
    }
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

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      return ''
    }
  }
}

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({email}).lean().exec()
  if (!user) return false
  let encryptPassword = crypto.createHmac('sha1', user.salt).update(password).digest('hex')
  if (encryptPassword !== user.hashed_password) return false

  return user
}

module.exports = mongoose.model('User', userSchema, collectionName)
