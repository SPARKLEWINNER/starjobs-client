const mongoose = require('mongoose')

const Freelancers = require('../models/freelancers.model')
const Users = require('../models/users.model')

const Ratings = require('../../gigs/models/gig-ratings.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')
const requestToken = require('../../../common/jwt')

var controllers = {
  post_account_details: async function (req, res) {
    const {id} = req.params
    const user = Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec() // validate if data exists
    if (!user || !Users.length < 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const now = new Date()
    let result
    const {
      firstName,
      lastName,
      middleInitial,
      gender,
      religion,
      civilStatus,
      citizenship,
      samePermanentAddress,
      presentBlkNo,
      presentZipCode,
      presentStreetName,
      presentCity,
      permanentBlkNo,
      permanentZipCode,
      permanentStreetName,
      permanentCity,
      emergencyName,
      emergencyContact,
      emergencyRelation,
      work,
      expertise,
      education,
      rate,
      payment,
      photo
    } = req.body

    const accountObj = new Freelancers({
      uuid: mongoose.Types.ObjectId(id),
      firstName,
      lastName,
      middleInitial,
      gender,
      religion,
      civilStatus,
      citizenship,
      samePermanentAddress,
      presentBlkNo,
      presentZipCode,
      presentStreetName,
      presentCity,
      permanentBlkNo,
      permanentZipCode,
      permanentStreetName,
      permanentCity,
      emergencyName,
      emergencyContact,
      emergencyRelation,
      work,
      expertise,
      education,
      rate,
      payment,
      photo,
      dateCreated: now.toDateString()
    })

    try {
      result = await Freelancers.create(accountObj).catch((err) => console.log(err))

      if (result) {
        await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isActive: true})
      }
    } catch (error) {
      await logger.logError(error, 'Freelancers.post_account_details', accountObj, id, 'POST')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const updated_user = await Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    let {accessToken: token, refreshToken} = requestToken.create_token(id)
    result = {
      token: token,
      refreshToken: refreshToken,
      ...updated_user[0]
    }

    return res.status(201).json(result)
  },

  patch_account_details: async function (req, res) {
    const {id} = req.params
    let user, result
    await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists
    const {
      firstName,
      lastName,
      middleInitial,
      gender,
      religion,
      civilStatus,
      citizenship,
      samePermanentAddress,
      presentBlkNo,
      presentZipCode,
      presentStreetName,
      presentCity,
      permanentBlkNo,
      permanentZipCode,
      permanentStreetName,
      permanentCity,
      emergencyName,
      emergencyContact,
      emergencyRelation,
      work,
      expertise,
      education,
      rate,
      payment,
      photo
    } = req.body

    const details = {
      firstName,
      lastName,
      middleInitial,
      gender,
      religion,
      civilStatus,
      citizenship,
      samePermanentAddress,
      presentBlkNo,
      presentZipCode,
      presentStreetName,
      presentCity,
      permanentBlkNo,
      permanentZipCode,
      permanentStreetName,
      permanentCity,
      emergencyName,
      emergencyContact,
      emergencyRelation,
      work,
      expertise,
      education,
      rate,
      payment,
      photo
    }

    const oldDetails = await Freelancers.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    try {
      await Freelancers.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, details)
      user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
        .lean()
        .exec()
      await logger.logAccountHistory(user[0]?.accountType, details, id, oldDetails[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    let {accessToken: token, refreshToken} = requestToken.create_token(Freelancers.uuid)
    result = {
      ...user[0],
      photo: Freelancers.photo,
      token,
      refreshToken
    }

    return res.status(200).json(result)
  },

  patch_account_specific: async function (req, res) {
    // const updates = req.body
    const {id} = req.params
    const presentCity = req.body
    console.log(presentCity)
    console.log(id)

    try {
      await Freelancers.findOneAndUpdate({uuid: mongoose.Types.ObjectId(id)}, presentCity)
        .lean()
        .exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    console.log(presentCity)
    console.log(id)
  },

  get_account_details: async function (req, res) {
    const {id} = req.params
    let result
    try {
      const account = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      const ratings = await Ratings.find({uid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      if (!ratings) {
        result = account
      } else {
        let efficiency = 0,
          onTime = 0,
          completeness = 0,
          showRate = 0

        ratings &&
          ratings.length > 0 &&
          ratings.map((value) => {
            let rates = value.rates

            efficiency = rates.efficiency + efficiency
            onTime = rates.onTime + onTime
            completeness = rates.completeness + completeness
            showRate = rates.showRate + showRate
          })

        let totalEfficiency = parseFloat(ratings.length * efficiency) / 100
        let totalOnTime = parseFloat(ratings.length * onTime) / 100
        let totalCompleteness = parseFloat(ratings.length * completeness) / 100
        let totalShowRate = parseFloat(ratings.length * showRate) / 100

        result = {
          ...account,
          ratings: {
            efficiency: totalEfficiency,
            onTime: totalOnTime,
            completeness: totalCompleteness,
            showRate: totalShowRate
          }
        }
      }

      if (!result) {
        return res.status(502).json({success: false, msg: 'User not found'})
      }
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Accounts', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    return res.status(200).json(result)
  }
}

module.exports = controllers
// if(ObjectId.isValid(req.params.id)) {
//   db.collections('book')
//     .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
//     .then(result => {
//       res.status(200).json(result)
//     })
//     .catch(err => {
//       res.status(500).json({error: 'could not update document'})
//     })
// } else {
//   res.status(500).json({error: ' not a valid doc'})
// }
