const fetch = require('axios')
const mongoose = require('mongoose')
const {Types} = mongoose

const Contracts = require('../../gigs/models/gig-contracts.model')
const Extends = require('../../gigs/models/gigs-extends.model')
const Freelancers = require('../../users/models/freelancers.model')
const FeeHistory = require('../../gigs/models/gigs-fee-history.model')
const Gigs = require('../../gigs/models/gigs.model')
const History = require('../../gigs/models/gig-histories.model')
const Users = require('../../users/models/users.model')
const FcmTokens = require('../../users/models/fcm-tokens')
const Notifications = require('../../notifications/models/notifications.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')
const calculations = require('../../../common/computations')
const fcm = require('../../../services/fcm-notif.service')

const {ENV} = process.env

const client = ['Applying', 'Confirm-Gig', 'Confirm-Arrived', 'On-going', 'End-Shift', 'Cancelled', 'Gig-Success']
const freelancer = ['Accepted', 'Confirm-End-Shift']

async function sendNotification(request, gigs, status) {
  let user, url
  let urlLink = ENV == 'staging' ? 'http://192.168.1.3:8000/' : 'https://app.starjobs.com.ph/'
  try {
    let messageList = [
      {status: 'Applying', type: 'pending', description: `Applicant has sent a gig request`},
      {status: 'Accepted', type: 'incoming', description: `Congratulations, your gig application has been accepted.`},
      {status: 'Confirm-Gig', type: 'current', description: `Jobster has confirmed pushing thru the gig.`},
      {status: 'Confirm-Arrived', type: 'current', description: `The jobster has arrived.`},
      {status: 'End-Shift', type: 'current', description: `The jobster have Ended the shift`},
      {status: 'Gig-Success', type: 'current', description: `To monitor gig fee View gig in progress`},
      {
        status: 'Gig-Taken',
        type: 'incoming',
        description: `This gig ${gigs.position} was already taken. Keep exploring other opportunities! `
      },

      {
        status: 'Confirm-End-Shift',
        type: 'billing',
        description: `You will receive your gig fee in the next three (3) days. Thank you for using Starjobs.`
      }
    ]

    if (client.includes(status)) {
      user = await Users.find({_id: Types.ObjectId(gigs.uid)})
        .lean()
        .exec()

      url = status === 'Gig Success' ? urlLink + 'client/gig/create?tab=4' : urlLink + 'freelancer/message'
    } else if (freelancer.includes(status)) {
      let jobster_id = {_id: Types.ObjectId(request.uid)} // client

      url = status === 'Confirm-End-Shift' ? urlLink + 'freelancer/dashboard?tab=4' : urlLink + 'freelancer/message'

      // individual gig postings
      if (status === 'Confirm-Arrived') {
        jobster_id = {_id: Types.ObjectId(gigs.auid)} // jobster
      }

      user = await Users.find(jobster_id).lean().exec()

      if (status === 'Accepted' && gigs.category === 'restaurant-services') {
        console.log('------Getting data of applying')
        console.log(gigs._id, 'Gig ID')
        const getApplying = await Gigs.findById(gigs._id).lean().exec()
        const recordsArray = getApplying.records
        // Extract the "auid" values from the recordsArray
        const auidValues = recordsArray.map((record) => record.auid)
        console.log(auidValues, 'auidValues')
        const acceptedRecords = recordsArray.filter((record) => record.status === 'Accepted')
        let acceptedAuid
        if (acceptedRecords.length > 0) {
          acceptedAuid = acceptedRecords[0].auid
          console.log('The auid with accepted status:', acceptedAuid)
        } else {
          console.log('No record with accepted status found.')
        }

        user = await Users.find({_id: {$in: auidValues}})
          .lean()
          .exec()

        console.log(user, 'users')
        let applyingUsers = []
        const acceptedAuidString = acceptedAuid.toString()
        if (user && user.length > 0) {
          user.forEach((data) => {
            console.log(typeof acceptedAuidString)

            console.log('data._id:', data._id)
            console.log('acceptedAuid:', acceptedAuid)

            if (!data._id.equals(acceptedAuid)) {
              console.log('push condition')
              applyingUsers.push(data._id)
            }
            console.log(applyingUsers, 'applyingUsers')
          })
          if (applyingUsers) {
            console.log('-------Notification for rejected jobster-------')
            const fcmTokenArray = await FcmTokens.find({userId: {$in: applyingUsers}})
              .lean()
              .exec()
              .then((users_fcm) => users_fcm.map((userToken) => userToken.fcmToken))
            console.log(fcmTokenArray)
            let message = messageList.filter((obj) => {
              if (obj.status === 'Gig-Taken') return obj
            })
            const notificationInput = new Notifications({
              title: 'Gig is already taken',
              body: message[0].description,
              targetUsers: applyingUsers,
              type: 'GigNotif',
              target: 'Selected',
              additionalData: JSON.stringify(gigs)
            })
            url = urlLink + 'freelancer/message'
            await Notifications.create(notificationInput)
            fcm.send_notif(fcmTokenArray, message[0].description, url)
          }
        }
      }
    }
    if (user && user.length > 0) {
      const users_fcm = await FcmTokens.find({userId: Types.ObjectId(user[0]._id)})
        .lean()
        .exec()
      const fcmTokenArray = users_fcm.map((userToken) => userToken.fcmToken)
      console.log(fcmTokenArray)

      let message = messageList.filter((obj) => {
        if (obj.status === status) return obj
      })
      // return still to process top level request.
      if (!message) return true

      // if (!user || !user[0].deviceId) return true

      if (fcmTokenArray.length != 0) {
        console.log('------------Sending Notif----------')
        fcm.send_notif(fcmTokenArray, message[0].description, url)
        // await fetch('https://fcm.googleapis.com/fcm/send', {
        //   method: 'post',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'key=' + process.env.FCM_SERVER_KEY
        //   },
        //   data: {
        //     notification: {
        //       title: 'Starjobs',
        //       body: message[0].description,
        //       icon: 'https://www.starjobs.com.ph/app-logo.png',
        //       sound: 1,
        //       vibrate: 1,
        //       content_available: true,
        //       show_in_foreground: true,
        //       priority: 'high'
        //     },
        //     data: {
        //       // status:  message[0].status,
        //       // gig_status: message[0].type,
        //       url: url,
        //       type: 'route'
        //     },
        //     registration_ids: fcmTokenArray
        //   }
        // })
      }
      // Send SMS Notif
      // sms.cast_sms(recipients, message[0].description)

      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
    await logger.logError(error, 'Apply.send_notification', user.deviceId, null, 'FETCH')
  }
}

var services = {
  default: async function (req, res) {
    const {uid, status, actualTime, actualRate, late} = req.body
    const {id} = req.params
    await getSpecificData({uuid: Types.ObjectId(uid)}, Freelancers, 'Account', uid)

    const now = new Date()
    let updatedGig
    const history_details = {
      status: status,
      gid: Types.ObjectId(id),
      date_created: now.toISOString(),
      uid: Types.ObjectId(uid),
      isExtended: false
    }

    try {
      let gigs = await Gigs.find({_id: Types.ObjectId(id)})
        .lean()
        .exec()

      if (!gigs) res.status(400).json({success: false, msg: 'Gig not found'}) // gig not found
      gigs = gigs.pop()

      if (gigs.isExtended) {
        // gig multiple applicants
        history_details.isExtended = true

        const {maximumApplicants, applicants, additionalFees} = gigs

        const acceptedApplicant =
          applicants &&
          Object.values(applicants).forEach((obj) => {
            if (obj.status === 'Accepted') return obj
          })

        if (acceptedApplicant && acceptedApplicant.length >= maximumApplicants)
          return res.status(202).json({
            success: false,
            message: 'Gig already reached the number of applicants to be accepted.'
          })

        if (status !== 'Accepted') {
          await Extends.findOneAndUpdate(
            {gigId: Types.ObjectId(gigs._id)},
            {
              $push: {
                applicants: {
                  auid: Types.ObjectId(uid),
                  status: status,
                  date_created: now.toISOString(),
                  additionalFees: additionalFees
                }
              }
            }
          )
        } else {
          await Extends.findOneAndUpdate(
            {
              gigId: Types.ObjectId(gigs._id),
              'applicants.auid': Types.ObjectId(uid)
            },
            {
              status: status
            }
          )
        }
      } else {
        // gig individual acceptance
        if (status === 'Accepted') {
          await Gigs.findOneAndUpdate(
            {_id: Types.ObjectId(id)},
            {
              auid: Types.ObjectId(uid),
              status: status
            }
          )
        } else {
          if (status === 'End-Shift') {
            await Gigs.findOneAndUpdate(
              {_id: Types.ObjectId(id)},
              {
                status: status,
                fees: {...gigs.fees, proposedWorkTime: actualTime, proposedRate: actualRate}
              }
            )
          } else if (status === 'Confirm-End-Shift') {
            const {
              computedFeeByHr,
              voluntaryFee,
              appFee,
              transactionFee,
              grossGigFee,
              grossVAT,
              grossWithHolding,
              serviceCost,
              jobsterTotal
            } = calculations.default_calculations(gigs.fees.proposedWorkTime, gigs.fees.proposedRate, gigs.locationRate)

            const feeHistoryInput = new FeeHistory({
              gigid: Types.ObjectId(id),
              ...gigs
            })

            await Gigs.findOneAndUpdate(
              {_id: Types.ObjectId(id)},
              {
                status: status,
                hours: gigs.fees.proposedWorkTime,
                fee: gigs.fees.proposedRate,
                fees: {
                  computedFeeByHr: computedFeeByHr,
                  voluntaryFee: voluntaryFee,
                  appFee: appFee,
                  transactionFee: transactionFee,
                  grossGigFee: grossGigFee,
                  grossVAT: grossVAT,
                  grossWithHolding: grossWithHolding,
                  serviceCost: serviceCost,
                  jobsterTotal: jobsterTotal
                },
                late: late ?? null
              }
            )

            await FeeHistory.create(feeHistoryInput)
          } else {
            await Gigs.findOneAndUpdate({_id: Types.ObjectId(id)}, {status: status, late: late ?? null})
          }
        }
      }

      await Gigs.findOneAndUpdate(
        {_id: Types.ObjectId(id)},
        {
          $push: {
            records: {
              auid: Types.ObjectId(uid),
              status: status,
              date_created: now.toISOString()
            }
          }
        }
      )
      let history = new History(history_details)
      await History.create(history)
      global.pusher.trigger('notifications', 'notify_gig', gigs)
      await sendNotification(req.body, gigs, status)
      updatedGig = gigs
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Apply.gig_apply', req.body, id, 'PATCH')

      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(updatedGig)
  },
  contract: async function (req, res) {
    const {uid, status} = req.body
    const {id} = req.params

    const applicant = await getSpecificData({uuid: Types.ObjectId(uid)}, Freelancers, 'Account', uid)

    const now = new Date()
    let updatedGig

    try {
      let gigs = await Gigs.find({_id: Types.ObjectId(id)})
        .lean()
        .exec()

      if (!gigs) res.status(400).json({success: false, msg: 'Gig not found'}) // gig not found
      gigs = gigs.pop()

      const contract_details = {
        gid: Types.ObjectId(id),
        date_created: now.toISOString(),
        uid: Types.ObjectId(uid)
      }

      // gig individual acceptance
      if (status === 'Accepted') {
        contract_details['records'] = []
        contract_details['category'] = gigs.category
        contract_details['commissionRate'] = gigs.commissionRate
        contract_details['gigFeeType'] = gigs.gigFeeType
        contract_details['gid'] = Types.ObjectId(gigs._id)
        contract_details['date'] = now

        const createContract = new Contracts(contract_details)
        const contract = await Contracts.create(createContract)
        await Gigs.findOneAndUpdate(
          {
            _id: Types.ObjectId(id),
            'applicants._id': Types.ObjectId(uid)
          },
          {
            $set: {
              'applicants.$.isHired': true,
              'applicants.$.contractId': contract._id
            }
          }
        )
      } else {
        const applicantData = {
          _id: Types.ObjectId(uid),
          full_name: `${applicant[0]?.firstName} ${applicant[0]?.lastName}`,
          firstName: applicant[0]?.firstName,
          lastName: applicant[0]?.lastName,
          photo: applicant[0]?.photo,
          isHired: false,
          contractId: undefined
        }

        await Gigs.findOneAndUpdate(
          {_id: Types.ObjectId(id)},
          {
            $push: {applicants: applicantData}
          }
        )
      }

      global.pusher.trigger('notifications', 'notify_gig', gigs)
      await sendNotification(req.body, gigs, status)
      updatedGig = gigs
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Apply.gig_apply', req.body, id, 'PATCH')

      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(updatedGig)
  }
}

module.exports = services
