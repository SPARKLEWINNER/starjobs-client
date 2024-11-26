const mongoose = require('mongoose')
const {Types} = mongoose

const Gigs = require('../models/gigs.model')
const Freelancers = require('../../users/models/freelancers.model')
const DropOffs = require('../../gigs/models/gig-dropoffs.model')
const History = require('../../gigs/models/gig-histories.model')

const {getSpecificData} = require('../../../common/validates')

const service = require('./gigs-apply-type.service')

var controllers = {
  gig_apply: async function (req, res, next) {
    const {uid, status} = req.body
    const {id} = req.params
    await getSpecificData({uuid: Types.ObjectId(uid)}, Freelancers, 'Account', uid)

    let gigs = await Gigs.find({_id: Types.ObjectId(id)})
      .lean()
      .exec()

    if (!gigs) res.status(400).json({success: false, msg: 'Gig not found'}) // gig not found
    gigs = gigs.pop()
    if (status !== 'Applying' || gigs.status == 'Contracts') {
      switch (gigs.gigFeeType) {
        case 'Commission':
          return await service.contract(req, res, next)
        default:
          return await service.default(req, res, next)
      }
    }

    return await service.default(req, res, next)
  },

  gig_decline: async function (req, res, next) {
    const {uid, status, category} = req.body
    const {id} = req.params
    const now = new Date()
    console.log(req.body, 'req.body')

    await getSpecificData({uuid: Types.ObjectId(uid)}, Freelancers, 'Account', uid)

    let gigs = await Gigs.find({_id: Types.ObjectId(id)})
      .lean()
      .exec()
    console.log(gigs, 'Decline')

    if (!gigs) res.status(400).json({success: false, msg: 'Gig not found'}) // gig not found
    gigs = gigs.pop()
    // if (status !== 'Applying' || gigs.status == 'Contracts') {
    //   switch (gigs.gigFeeType) {
    //     case 'Commission':
    //       return await service.contract(req, res, next)
    //     default:
    //       return await service.default(req, res, next)
    //   }
    // }

    if (category === 'parcels') {
      if (!gigs || !gigs.dropOffs || gigs.dropOffs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No drop-offs found for this gig.'
        })
      }

      await DropOffs.updateMany(
        {
          _id: {$in: gigs.dropOffs}
        },
        {
          $set: {status: 'Applying'},
          $pull: {rider: uid} // Remove the uid from the rider array
        }
      )
    }

    // First, remove the existing record with the specified uid
    await Gigs.findOneAndUpdate(
      {_id: Types.ObjectId(id)},
      {
        $pull: {records: {auid: Types.ObjectId(uid)}}
      }
    )
    console.log('records')

    // Then, add the new record with status 'Declined'
    // await Gigs.findOneAndUpdate(
    //   {_id: Types.ObjectId(id)},
    //   {
    //     $push: {
    //       records: {
    //         auid: Types.ObjectId(uid),
    //         status: 'Declined',
    //         date_created: now.toISOString()
    //       }
    //     }
    //   }
    // )
    await History.findOneAndUpdate(
      {gid: Types.ObjectId(id), uid: Types.ObjectId(uid), status: 'Applying'},
      {
        status: 'Declined'
      }
    )

    return res.status(200).json(gigs)
  }
}

module.exports = controllers
