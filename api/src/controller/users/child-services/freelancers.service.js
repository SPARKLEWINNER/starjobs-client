const mongoose = require('mongoose')

const Freelancers = require('../models/freelancers.model')
const Users = require('../models/users.model')

// const Ratings = require('../../gigs/models/gig-user-ratings.model')
const GigRating = require('../../gigs/models/gig-user-ratings.model')

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
    // Check if uuid already exists in Freelancers collection
    const existingFreelancer = await Freelancers.findOne({uuid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    if (existingFreelancer) {
      return res.status(409).json({success: false, msg: 'Freelancer account already exists'})
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
      photo,
      requirement_files,
      selfie
    } = req.body
    console.log('🚀 ~ rate:', rate)
    console.log('🚀 ~ selfie:', selfie)
    console.log('🚀 ~ requirement_files:', requirement_files)

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
      requirementFiles: {
        nbi: requirement_files.nbiClearance || '',
        nbiExpirationDate: requirement_files.nbiExpirationDate || '',
        validId1: requirement_files.validId1 || '',
        validId2: requirement_files.validId2 || '',
        vaccinationCard: requirement_files.vaccinationCard || '',
        brgyClearance: requirement_files.barangayClearance || '',
        brgyExpirationDate: requirement_files.brgyExpirationDate || '',
        map: requirement_files.residencyMap || ''
      },
      selfie,
      dateCreated: now.toDateString()
    })

    try {
      result = await Freelancers.create(accountObj).catch((err) => console.log(err))

      if (result) {
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(id)},
          {adminStatus: 'Pending', verificationRemarks: 'New jobster created', firstName: firstName, lastName: lastName}
        )
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
    // Check if uuid already exists in Freelancers collection
    const existingFreelancer = await Freelancers.findOne({uuid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    if (existingFreelancer) {
      return res.status(409).json({success: false, msg: 'Freelancer account already exists'})
    }
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
      photo,
      requirement_files,
      selfie
    } = req.body
    console.log('🚀 ~ requirement_files:', requirement_files)

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
      isRequirementsEdited: false,
      ...(rate && {rate}),
      ...(payment && {payment}),
      ...(photo && {photo}),
      ...(requirement_files && {
        requirementFiles: {
          nbi: requirement_files.nbiClearance,
          nbiExpirationDate: requirement_files.nbiExpirationDate,
          validId1: requirement_files.validId1,
          validId2: requirement_files.validId2,
          vaccinationCard: requirement_files.vaccinationCard,
          brgyClearance: requirement_files.barangayClearance,
          brgyExpirationDate: requirement_files.brgyExpirationDate,
          map: requirement_files.residencyMap
        }
      }),
      ...(selfie && {selfie})
    }

    const oldDetails = await Freelancers.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    try {
      result = await Freelancers.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, details)
      if (result) {
        const oldUserData = await Users.findOne({_id: mongoose.Types.ObjectId(result.uuid)})
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(result.uuid)},
          {
            firstName: firstName,
            lastName: lastName,
            verificationRemarks: 'Jobster Details Updated',
            ...(oldUserData.adminStatus !== 'Verified' && {adminStatus: 'Pending'})
          }
        )
      }

      user = await Users.find({_id: mongoose.Types.ObjectId(result.uuid)})
        .lean()
        .exec()
      await logger.logAccountHistory(user[0]?.accountType, details, id, oldDetails[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    let {accessToken: token, refreshToken} = requestToken.create_token(result.uuid)
    result = {
      ...user[0],
      photo: result.photo,
      token,
      refreshToken
    }

    return res.status(200).json(result)
  },

  patch_requirements: async function (req, res) {
    const {id} = req.params
    let user, result
    await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists

    const {requirement_files} = req.body

    if (!requirement_files) {
      return res.status(400).json({success: false, msg: 'No requirement files provided'})
    }

    const oldDetails = await Freelancers.findOne({uuid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!oldDetails) {
      return res.status(404).json({success: false, msg: 'Freelancer not found'})
    }

    const details = {
      requirementFiles: {
        nbi: requirement_files.nbiClearance || oldDetails.requirementFiles.nbi,
        nbiExpirationDate: requirement_files.nbiExpirationDate || oldDetails.requirementFiles.nbiExpirationDate,
        brgyClearance: requirement_files.barangayClearance || oldDetails.requirementFiles.brgyClearance,
        brgyExpirationDate: requirement_files.brgyExpirationDate || oldDetails.requirementFiles.brgyExpirationDate,
        // Keep other old details if new details are not provided
        validId1: oldDetails.requirementFiles.validIds
          ? oldDetails.requirementFiles.validIds
          : oldDetails.requirementFiles.validId1,
        validId2: oldDetails.requirementFiles.validIds
          ? oldDetails.requirementFiles.validIds
          : oldDetails.requirementFiles.validId2,
        vaccinationCard: oldDetails.requirementFiles.vaccinationCard,
        map: oldDetails.requirementFiles.map
      },
      isRequirementsEdited: true
    }
    // const details = {
    //   requirementFiles: {
    //     nbi: requirement_files.nbiClearance,
    //     nbiExpirationDate: requirement_files.nbiExpirationDate,
    //     validId1: requirement_files.validId1,
    //     validId2: requirement_files.validId2,
    //     vaccinationCard: requirement_files.vaccinationCard,
    //     brgyClearance: requirement_files.barangayClearance,
    //     brgyExpirationDate: requirement_files.brgyExpirationDate,
    //     map: requirement_files.residencyMap
    //   }
    // }

    // const oldDetails = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
    //   .lean()
    //   .exec()

    try {
      result = await Freelancers.findOneAndUpdate({uuid: mongoose.Types.ObjectId(id)}, details)
      if (result) {
        await Users.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(result.uuid)},
          {adminStatus: 'Pending', verificationRemarks: 'Requirement files updated'}
        )
      }
      console.log('🚀 ~ result:', result)

      user = await Users.find({_id: mongoose.Types.ObjectId(result.uuid)})
        .lean()
        .exec()

      await logger.logAccountHistory(user[0]?.accountType, details, id, oldDetails[0])
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_requirements', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    let {accessToken: token, refreshToken} = requestToken.create_token(result.uuid)
    result = {
      ...user[0],
      photo: result.photo,
      token,
      refreshToken,
      details
    }

    return res.status(200).json(result)
  },

  patch_requirement_expiration: async function (req, res) {
    const {id} = req.params
    const {nbiExpirationDate, brgyExpirationDate} = req.body
    let result

    const oldDetails = await Freelancers.findOne({uuid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()

    if (!oldDetails) {
      return res.status(404).json({success: false, msg: 'Freelancer not found'})
    }

    const details = {
      requirementFiles: {
        nbi: oldDetails.requirementFiles.nbi,
        nbiExpirationDate: nbiExpirationDate || oldDetails.requirementFiles.nbiExpirationDate,
        brgyClearance: oldDetails.requirementFiles.brgyClearance,
        brgyExpirationDate: brgyExpirationDate || oldDetails.requirementFiles.brgyExpirationDate,
        validId1: oldDetails.requirementFiles.validId1,
        validId2: oldDetails.requirementFiles.validId2,
        vaccinationCard: oldDetails.requirementFiles.vaccinationCard,
        map: oldDetails.requirementFiles.map
      }
    }

    try {
      // Update Jobster
      result = await Freelancers.findOneAndUpdate({uuid: mongoose.Types.ObjectId(id)}, details)
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_specific', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    return res.status(200).json(result)
  },

  patch_account_specific: async function (req, res) {
    const {id} = req.params
    const newCity = req.body

    const isExisting = await Freelancers.find({uuid: id}).exec()
    if (isExisting.length === 0)
      return res.status(400).json({
        success: false,
        msg: `` // Email doesn't exists
      })

    try {
      let result = await Freelancers.findByIdAndUpdate(
        {_id: mongoose.Types.ObjectId(isExisting[0]._id)},
        newCity
      ).exec()
      if (result) {
        await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isCityUpdated: true})
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Freelancers.patch_account_specific', null, id, 'PATCH')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
    const updated_user = await Users.find({_id: mongoose.Types.ObjectId(id)})

    return res.status(200).json(updated_user[0])
  },

  get_account_details: async function (req, res) {
    const {id} = req.params
    let result
    try {
      const account = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
        .lean()
        .exec()

      // const ratings = await Ratings.find({uid: mongoose.Types.ObjectId(id)})
      //   .populate('gid', 'uid user.thumbnail')
      //   .lean()
      //   .exec()
      // const rateComments = await Ratings.aggregate([
      //   {
      //     $match: {
      //       uid: mongoose.Types.ObjectId(id)
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'gigs',
      //       localField: 'gid',
      //       foreignField: '_id',
      //       as: 'gig'
      //     }
      //   },
      //   {
      //     $unwind: '$gig'
      //   },
      //   {
      //     $lookup: {
      //       from: 'users',
      //       localField: 'gig.uid',
      //       foreignField: '_id',
      //       as: 'user'
      //     }
      //   },
      //   {
      //     $unwind: '$user'
      //   },
      //   {
      //     $project: {
      //       _id: 0,
      //       comments: 1,
      //       'user.name': 1,
      //       'user.profile_photo': 1,
      //       'gig.user.thumbnail': 1
      //     }
      //   }
      // ]).exec()
      // const transformedResult = rateComments.map((item) => ({
      //   comment: item.comment,
      //   userName: item.user.name,
      //   profilePhoto: item.user.profile_photo
      // }))

      // if (!ratings) {
      //   result = account
      // } else {
      //   const comments = ratings.map(({gid, comments, uid}) => [gid, comments, uid])

      //   const ratesArray = ratings.map(({rates}) => rates)
      //   const countTotalValues = (...objects) => {
      //     const counts = {}
      //     for (const obj of objects) {
      //       for (const key in obj) {
      //         const value = obj[key]
      //         const color = value === '1' ? 'gold' : 'black'
      //         counts[key] = counts[key] || {black: 0, gold: 0}
      //         counts[key][color] = counts[key][color] + 1
      //       }
      //     }
      //     return counts
      //   }
      //   const valueCounts = countTotalValues(...ratesArray)
      //   console.log('valueCounts: ' + JSON.stringify(valueCounts))

      //   // let totalEfficiency = parseFloat(ratings.length * efficiency) / 100
      //   // let totalOnTime = parseFloat(ratings.length * onTime) / 100
      //   // let totalCompleteness = parseFloat(ratings.length * completeness) / 100
      //   // let totalShowRate = parseFloat(ratings.length * showRate) / 100

      const efficiency = {
        black: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.efficiency': '0'}),
        gold: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.efficiency': '1'})
      }

      const recommendable = {
        black: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.recommendable': '0'}),
        gold: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.recommendable': '1'})
      }

      const completeness = {
        black: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.completeness': '0'}),
        gold: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.completeness': '1'})
      }

      const showRate = {
        black: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.showRate': '0'}),
        gold: await GigRating.countDocuments({uid: mongoose.Types.ObjectId(id), 'rates.showRate': '1'})
      }

      console.log('Efficiency Rating Counts:', efficiency)
      console.log('Recommendable Rating Counts:', recommendable)
      console.log('Completeness Rating Counts:', completeness)
      console.log('ShowRate Rating Counts:', showRate)

      const rateComments = await GigRating.aggregate([
        {
          $match: {
            uid: mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'gigs',
            localField: 'gid',
            foreignField: '_id',
            as: 'gig'
          }
        },
        {
          $unwind: '$gig'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'gig.uid',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: '$user'
        },
        {
          $project: {
            _id: 0,
            comments: 1,
            'user.name': 1,
            'user.profile_photo': 1,
            'gig.user.thumbnail': 1
          }
        },
        {
          $match: {
            comments: {$ne: null}
          }
        }
      ]).exec()
      console.log('🚀 ~ comments:', rateComments)

      console.log('Efficiency Rating Counts:', efficiency)
      console.log('Recommendable Rating Counts:', recommendable)
      console.log('Completeness Rating Counts:', completeness)
      console.log('ShowRate Rating Counts:', showRate)

      const ratings = {
        efficiency,
        recommendable,
        completeness,
        showRate
      }
      // Fetch comments sorted by createdAt
      let comments = await GigRating.find({uid: mongoose.Types.ObjectId(id)})
        .sort({createdAt: -1})
        .select({comments: 1, uid: 1}) // Include comments and uid fields
        .lean()
        .exec()

      // Filter out null comments
      comments = comments.filter((comment) => comment.comments !== null)

      // Fetch user details
      const userComments = await Users.findOne({_id: mongoose.Types.ObjectId(id)})
        .select({name: 1}) // Include only the name field
        .lean()
        .exec()

      // Combine comments with user name
      const commentsWithUserName = comments.map((comment) => ({
        comments: comment.comments,
        userName: userComments ? userComments.name : null
      }))

      console.log(commentsWithUserName)
      result = {
        ...account,
        ratings,
        rateComments
      }

      if (!result) {
        return res.status(502).json({success: false, msg: 'User not found'})
      }
      return res.status(200).json(result)
    } catch (error) {
      console.error(error)

      await logger.logError(error, 'Accounts', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  }
}

module.exports = controllers
