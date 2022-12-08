const mongoose = require('mongoose')
const moment = require('moment-timezone')
const timezone = moment.tz(Date.now(), 'Asia/Manila')

const {Schema} = mongoose
const collectionName = 'notifications'

const notificationSchema = new Schema({
  title: String,
  body: String,
  dateCreated: {
    type: Date,
    timezone: timezone
  },
  targetUsers: {   //This field contains the list of users who will be able to see the notif
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    default: []
  },
  viewedBy: { //This contains the users that viewed the notification
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    default: []
  },
  slug: {
    type: String,
    default: ''
  },
  //Notification types each type will have a different handler in the frontend
  //[Notification] this type is for generic notification
  //[GigNotif] this type is use for gig updates
  //[ClientInterest] this type is use if the client sent an interest to the jobster
  type: {type: String, default: 'Notification', enum: ['Notification', 'GigNotif', 'ClientInterest']},
  // Notification target this will determine the notification audience
  // If target is [Selected] only users inside the [targetUsers] field can see the notification
  // If target is [General] all users in the system will be able to see the notification
  target: {
    type: String,
    default: 'General',
    enum: ['General', 'Selected']
  },
  additionalData: { //This will contain the stringify JSON data that can be parse on the client side
    type: String,
    default: ''
  }
}, {timestamps: true})

module.exports = mongoose.model('Notification', notificationSchema, collectionName)
