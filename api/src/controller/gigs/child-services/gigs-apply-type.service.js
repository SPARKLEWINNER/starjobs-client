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

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')
const calculations = require('../../../common/computations')

const {FCM_SERVER_KEY} = process.env

const client = ['Applying', 'Confirm-Gig', 'Confirm-Arrived', 'On-going', 'End-Shift', 'Cancelled']
const freelancer = ['Accepted', 'Confirm-End-Shift']

async function sendNotification(request, gigs, status) {
  let user
  try {
    let messageList = [
      {status: 'Applying', type: '2', description: `Applicant has sent a gig request`},
      {status: 'Accepted', type: '1', description: `Congratulations, your gig has been accepted.`},
      {status: 'Confirm-Gig', type: '0', description: `Jobster has confirmed pushing thru the gig.`},
      {status: 'Confirm-Arrived', type: '1', description: `The jobster has arrived.`},
      {status: 'End-Shift', type: '1', description: `The jobster have Ended the shift`},
      {
        status: 'Confirm-End-Shift',
        type: '0',
        description: `You will receive your gig fee in the next three (3) days. Thank you for using Starjobs.`
      }
    ]

    if (client.includes(status)) {
      user = await Users.find({_id: Types.ObjectId(gigs.uid)})
        .lean()
        .exec()
    } else if (freelancer.includes(status)) {
      let jobster_id = {_id: Types.ObjectId(request.uid)} // client

      // individual gig postings
      if (status === 'Confirm-Arrived') {
        jobster_id = {_id: Types.ObjectId(gigs.auid)} // jobster
      }

      user = await Users.find(jobster_id).lean().exec()
    }

    if (user && user.length > 0) {
      let message = messageList.filter((obj) => {
        if (obj.status === status) return obj
      })

      // return still to process top level request.
      if (!message) return true
      if (!user || !user[0].deviceId) return true

      message = message.pop()

      await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + FCM_SERVER_KEY
        },
        data: {
          notification: {
            title: message.description,
            icon: 'https://app.starjobs.com.ph/images/72x72.png',
            click_action: message.type
          },
          to: user[0].deviceId
        }
      })
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
