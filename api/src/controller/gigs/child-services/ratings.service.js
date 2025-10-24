const mongoose = require('mongoose')

const Gigs = require('../models/gigs.model')
const Ratings = require('../models/gig-user-ratings.model')

const logger = require('../../../common/loggers')

var controllers = {
  post_rating_gig: async function (req, res) {
    const {id} = req.params
    const {efficiency, recommendable, completeness, showRate, comments} = req.body
    const now = new Date()

    const isGigExist = await Gigs.find({
      _id: mongoose.Types.ObjectId(id),
      status: {$in: ['Confirm-End-Shift', 'End-Shift-Deducted']}
    })
      .lean()
      .exec()

    if (!isGigExist || isGigExist.length === 0) {
      return res.status(502).json({success: false, msg: 'Gig not found'})
    }
    const ratingsObj = new Ratings({
      uid: mongoose.Types.ObjectId(isGigExist[0].auid),
      gid: mongoose.Types.ObjectId(id),
      rates: {
        efficiency: efficiency,
        recommendable: recommendable,
        completeness: completeness,
        showRate: showRate
      },
      comments: comments || null,
      skipped: false,
      dateCreated: now.toISOString()
    })

    try {
      await Ratings.create(ratingsObj)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Ratings.post_rating_gig', ratingsObj, id, 'POST')
      return res.status(502).json({success: false, msg: 'Rating unable to process'})
    }

    return res.status(201).json(ratingsObj)
  }
}

module.exports = controllers
