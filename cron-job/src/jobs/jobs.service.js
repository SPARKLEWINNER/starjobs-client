const cronJob = require('node-cron')
const Moment = require('moment')
const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(Moment)

const mongoose = require('mongoose')

const Gigs = require('./../models/gigs.model')
const Jobs = require('./../models/jobs.model')

const {ObjectId} = mongoose.Types

async function getGigs(gig) {
  if (!gig) return []

  const getGigs = await Gigs.find({_id: ObjectId(gig.gid)})
    .lean()
    .exec()

  if (getGigs.length <= 0) return []
  return getGigs[0]
}

async function checkJobs() {
  const getJobs = await Jobs.find({repeatTimes: {$ne: 0}})
    .lean()
    .exec()
  const now = new Date()

  if(getJobs && getJobs[0]?.repeatTimes === 0) return false 

  if (getJobs.length > 0) {
    //  validate gig details if exists
    let gigDetails
    if (getJobs.length >= 1) {
      await getJobs.map(async (item) => {
        gigDetails = await getGigs(item)
      })
    } else {
      gigDetails = await getGigs(getJobs[0])
    }

    // automate gig creation without jobster
    if (!gigDetails) return false


    const gigsObj = new Gigs({
      user: gigDetails.user,
      time: gigDetails.time,
      from: gigDetails.from,
      shift: gigDetails.shift,
      hours: gigDetails.hours,
      fee: gigDetails.fee,
      date: gigDetails.date,
      category: gigDetails.category,
      position: gigDetails.position,
      breakHr: gigDetails.breakHr,
      category: gigDetails.category,
      fees: {
        ...gigDetails.fees,
        proposedWorkTime: 0,
        proposedRate: 0
      },
      location: gigDetails.location,
      contactNumber: gigDetails.contactNumber,
      notes: gigDetails.notes,
      locationRate: gigDetails.locationRate,
      uid: ObjectId(gigDetails.uid),
      dateCreated: now.toISOString()
    })

    await Gigs.create(gigsObj)

    await Jobs.findOneAndUpdate(
      {_id: ObjectId(getJobs[0]._id)},
      {
        repeatTimes: getJobs[0].repeatTimes - 1
      }
    )
  }
}

module.exports = (app) => {
  cronJob.schedule('*/5 * * * * *', () => {
    console.log('running a task every 5 seconds')
    checkJobs()
  })

  cronJob.schedule('00 00 12 * * 0-6', () => {
    console.log('running a task every 12 midnight')
  })
}
