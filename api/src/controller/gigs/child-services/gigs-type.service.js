const {BUCKET_URL} = process.env

const mongoose = require('mongoose')

const Users = require('../../users/models/users.model')
const Clients = require('../../users/models/clients.model')
const Jobs = require('../models/gig-queue-jobs.model')
const Gigs = require('../models/gigs.model')
const GigsInitial = require('../models/gigs-initial.model')
const DropOffs = require('../models/gig-dropoffs.model')

const logger = require('../../../common/loggers')
const notification = require('../../../common/notifications')

const services = {
  default: async function (req, res) {
    const {id} = req.params
    let {
      time,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      from,
      fees,
      location,
      gigOffered,
      contactNumber,
      notes,
      areas,
      isRepeatable,
      repeatTimes,
      repeatEvery,
      gigFeeType,
      commissionFee,
      riderType, // 'single' or 'multiple'
      vehicleType, // e.g., 'bike', 'motorcycle'
      pickup, // pickup details
      dropoff, // array of dropoff details
      numberOfRiders, // e.g., 1 or more for multiple riders
      numberOfGigs,
      baseFare,
      allowance,
      rateType, // e.g., 'Per KM' or 'Per trip'
      ratePerKm,
      addPerDrop
    } = req.body
    console.log('🚀 ~ req.body:', req.body)

    const now = new Date()
    const locationRate = req.body.locationRate || 'Not applicable'

    const isUserExists = await Users.find({_id: mongoose.Types.ObjectId(id), accountType: 1})
      .lean()
      .exec()

    if (!isUserExists || isUserExists.length === 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const client = await Clients.findOne({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!client) {
      return res.status(502).json({success: false, msg: 'Client not found'})
    }

    try {
      if (category === 'parcels') {
        if (!pickup || !pickup.location) {
          return res.status(400).json({success: false, message: 'Pickup location is required'})
        }

        if (dropoff.lenght === 0) {
          return res.status(400).json({success: false, message: 'Drop-Off location is required'})
        }

        console.log('🚀 ~ category:', category)
        const parseRiders = parseInt(numberOfRiders)

        // Create gigs for each rider
        const gigPromises = []
        console.log('🚀 ~ dropOffData ~ dropoff:', dropoff)

        const dropOffData = dropoff.map((d) => ({
          address: d.value,
          route: d.route,
          lat: d.lat,
          long: d.long,
          status: 'Pending' // Initial status
        }))

        const createdDropOffs = await DropOffs.insertMany(dropOffData)

        const label = vehicleType === 'motorcycle' ? 'Rider' : 'Driver'

        // for (let riderIndex = 0; riderIndex < parseRiders; riderIndex++) {
        // const uniqueCode = Math.random().toString(36).substr(2, 5) // Generate a random 5-character string
        // const uniquePosition = `Rider-${uniqueCode}`
        const uniqueCode = Math.random().toString(36).substr(2, 5) // Generate a random 5-character string
        for (let riderIndex = 1; riderIndex <= parseRiders; riderIndex++) {
          const uniquePosition = `${label}-${uniqueCode}-${riderIndex}` // Append the index to the unique code
          const singleGigData = {
            user: [
              {
                _id: mongoose.Types.ObjectId(client._id),
                location: client.location,
                companyName: client.companyName,
                website: client.website,
                thumbnail: BUCKET_URL + client.photo
              }
            ],
            time,
            from,
            hours,
            date,
            location: pickup?.location,
            category,
            position: uniquePosition,
            notes,
            uid: mongoose.Types.ObjectId(id),
            dateCreated: now.toISOString(),
            type: riderType,
            vehicleType: vehicleType,
            pickup: {
              address: pickup?.location,
              lat: pickup?.lat,
              long: pickup?.long
            },
            dropOffs: createdDropOffs.map((dropOff) => dropOff._id), // Link drop-offs by their IDs
            numberOfRiders,
            rateType: rateType,
            ridersFee: {
              baseFare,
              gigRatePerKm: ratePerKm,
              addPerDrop,
              allowance
            },
            gigRatePerKm: ratePerKm
          }
          console.log('🚀 ~ singleGigData:', singleGigData)

          // Add gig creation to the list of promises
          gigPromises.push(Gigs.create(singleGigData))
          // gigPromises.push(GigsInitial.create(singleGigData))
        }

        const postedGigs = await Promise.all(gigPromises)

        return res.status(201).json({
          success: true,
          message: `${postedGigs.length} gig(s) created successfully`,
          gig: postedGigs
        })
      } else {
        // Handle non-parcel categories
        const parseNumOfGigs = parseInt(numberOfGigs)
        console.log('🚀 ~ parseNumOfGigs:', parseNumOfGigs)

        // Create gigs for each rider
        const gigPromises = []

        for (let gigIndex = 1; gigIndex <= parseNumOfGigs; gigIndex++) {
          const uniquePosition = `${position}-${gigIndex}`
          const gigData = {
            _id: mongoose.Types.ObjectId(),
            user: [
              {
                _id: mongoose.Types.ObjectId(client._id),
                location: client.location,
                companyName: client.companyName,
                website: client.website,
                thumbnail: BUCKET_URL + client.photo
              }
            ],
            time,
            from,
            shift,
            hours,
            fee,
            date,
            category,
            position: uniquePosition,
            breakHr,
            fees: {
              ...fees,
              proposedWorkTime: 0,
              proposedRate: 0
            },
            location,
            contactNumber,
            notes,
            gigOffered,
            locationRate,
            numberOfGigs,
            uid: mongoose.Types.ObjectId(id),
            dateCreated: now.toISOString(),
            gigFeeType: gigFeeType || 'Daily',
            commissionRate: commissionFee
          }
          gigPromises.push(gigData)
        }

        // Insert all gigs in one call
        const postedGigs = await Gigs.insertMany(gigPromises)
        // await GigsInitial.insertMany(gigPromises)

        postedGigs.map(async (gig) => {
          // Send notifications for areas
          if (areas && areas.length > 0) {
            areas.map(async (area) => {
              notification.globalNotification(gig, area)
            })
          }
        })

        // Handle repeatable gigs
        if (isRepeatable) {
          const jobsObj = new Jobs({
            repeatTimes,
            repeatEvery,
            gid: mongoose.Types.ObjectId(postedGigs._id),
            uid: mongoose.Types.ObjectId(id),
            dateCreated: now.toISOString()
          })
          await Jobs.create(jobsObj)
        }

        return res.status(201).json({success: true, gig: postedGigs})
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.post_gig', null, id, 'POST')
      return res.status(502).json({success: false, msg: 'An error occurred while posting the gig'})
    }
  },
  contract: async function (req, res) {
    const {id} = req.params
    let {
      time,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      from,
      fees,
      location,
      contactNumber,
      notes,
      areas,
      isRepeatable,
      repeatTimes,
      repeatEvery,
      gigFeeType,
      commissionFee
    } = req.body
    const now = new Date()
    let locationRate = req.body.locationRate || 'Not applicable'

    const isUserExists = await Users.find({_id: mongoose.Types.ObjectId(id), accountType: 1})
      .lean()
      .exec()

    if (!isUserExists || isUserExists.length === 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const client = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!client) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const gigsObj = new Gigs({
      user: [
        {
          _id: mongoose.Types.ObjectId(client[0]._id),
          location: client[0].location,
          companyName: client[0].companyName,
          website: client[0].website,
          thumbnail: BUCKET_URL + client[0].photo
        }
      ],
      time,
      from,
      shift,
      hours,
      fee,
      date,
      category,
      position,
      breakHr,
      fees: {
        ...fees,
        proposedWorkTime: 0,
        proposedRate: 0
      },
      location,
      contactNumber,
      notes,
      locationRate: locationRate,
      uid: mongoose.Types.ObjectId(id),
      dateCreated: now.toISOString(),
      gigFeeType: gigFeeType,
      commissionRate: commissionFee
    })

    try {
      const postedGig = await Gigs.create(gigsObj)

      // global.pusher.trigger('notifications', 'new_notification', postedGig)

      if (areas && areas.length > 0) {
        if (areas.length > 1) {
          await areas.map(async (item) => {
            await notification.globalNotification(postedGig, item)
          })
        } else {
          await notification.globalNotification(postedGig, areas[0])
        }
      }

      if (isRepeatable) {
        const jobsObj = new Jobs({
          repeatTimes: repeatTimes,
          repeatEvery: repeatEvery,
          gid: mongoose.Types.ObjectId(postedGig._id),
          uid: mongoose.Types.ObjectId(id),
          dateCreated: now.toISOString()
        })

        await Jobs.create(jobsObj)
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Gigs.post_gig', gigsObj, client[0]._id, 'POST')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(201).json(gigsObj)
  }
}

module.exports = services
