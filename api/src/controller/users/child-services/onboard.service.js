const mongoose = require('mongoose')

const Freelancers = require('../models/freelancers.model')
const Users = require('../models/users.model')
const Clients = require('../models/clients.model')

const {getSpecificData} = require('../../../common/validates')
const logger = require('../../../common/loggers')

const now = new Date()

async function create_jobster_profile(id, data) {
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
    emergencyRelation
  } = data

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
    dateCreated: now.toDateString()
  })

  try {
    result = await Freelancers.create(accountObj).catch((err) => console.log(err))

    if (result) {
      await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isActive: true})
    }
  } catch (error) {
    await logger.logError(error, 'Freelancers.post_account_details', accountObj, id, 'POST')
  }

  const updated_user = await Users.find({_id: mongoose.Types.ObjectId(id)})
    .lean()
    .exec()

  return {
    ...updated_user[0]
  }
}

async function personal_information(id, data) {
  let user, account
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
    emergencyRelation
  } = data

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
    emergencyRelation
  }

  const oldDetails = await Freelancers.find({uuid: id}).lean().exec()

  try {
    account = await Freelancers.findOneAndUpdate({uuid: id}, details)
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...account[0],
    photo: Freelancers.photo
  }
}

async function work_information(id, data) {
  let user, account
  await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists

  const details = {
    work: {
      ...data
    }
  }

  const oldDetails = await Freelancers.find({uuid: id}).lean().exec()

  try {
    account = await Freelancers.findOneAndUpdate({uuid: id}, details, {
      new: true
    })
      .lean()
      .exec()
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...account[0],
    photo: Freelancers.photo
  }
}

async function expertise_information(id, data) {
  let user, account
  await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists

  const details = {
    expertise: {
      ...data
    }
  }

  const oldDetails = await Freelancers.find({uuid: id}).lean().exec()

  try {
    account = await Freelancers.findOneAndUpdate({uuid: id}, details, {
      new: true
    })
      .lean()
      .exec()
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...account[0],
    photo: Freelancers.photo
  }
}

async function education_information(id, data) {
  let user
  await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists

  const details = {
    education: {
      ...data
    }
  }

  const oldDetails = await Freelancers.find({_id: id}).lean().exec()

  try {
    await Freelancers.findOneAndUpdate({uuid: id}, details, {
      new: true
    })
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...user[0],
    photo: Freelancers.photo
  }
}

async function rate_information(id, data) {
  let user
  await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists
  const details = {
    rate: {
      rateAmount: data?.rateAmount,
      rateType: data?.rateType
    },
    payment: {
      accountPaymentType: data?.accountType,
      acccountPaymentName: data?.accountName,
      acccountPaymentNumber: data?.accountNumber
    }
  }

  const oldDetails = await Freelancers.find({_id: id}).lean().exec()

  try {
    await Freelancers.findOneAndUpdate({uuid: id}, details, {
      new: true
    })
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...user[0],
    photo: Freelancers.photo
  }
}

async function photo_information(id, data) {
  let user
  await getSpecificData({uuid: id}, Freelancers, 'User', id) // validate if data exists

  const details = {
    photo: data?.photo
  }

  const oldDetails = await Freelancers.find({_id: id}).lean().exec()

  try {
    await Freelancers.findOneAndUpdate({uuid: id}, details, {
      new: true
    })
    user = await Users.find({_id: mongoose.Types.ObjectId(Freelancers.uuid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Freelancers.patch_account_details', null, id, 'PATCH')
    return false
  }

  return {
    ...user[0],
    photo: Freelancers.photo
  }
}

// client

async function create_client_profile(id, data) {
  let result
  const {firstName, lastName, middleInitial, email, companyName, brandName, location, website, companyPosition} = data

  const accountObj = new Clients({
    uid: mongoose.Types.ObjectId(id),
    firstName,
    lastName,
    middleInitial,
    email,
    companyName,
    brandName,
    location,
    website,
    companyPosition,
    dateCreated: now.toDateString()
  })

  try {
    result = await Clients.create(accountObj).catch((err) => console.log(err))

    if (result) {
      await Users.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isActive: true})
    }
  } catch (error) {
    await logger.logError(error, 'Clients.create_client_profile', accountObj, id, 'POST')
  }

  const updated_user = await Users.find({_id: mongoose.Types.ObjectId(id)})
    .lean()
    .exec()

  return {
    ...updated_user[0]
  }
}

async function personal_client_information(id, data) {
  let user, client
  await getSpecificData({uid: id}, Clients, 'User', id) // validate if data exists
  const {firstName, lastName, middleInitial, email, companyName, brandName, location, website, companyPosition} = data

  const details = {
    firstName,
    lastName,
    middleInitial,
    email,
    companyName,
    brandName,
    location,
    website,
    companyPosition
  }

  const oldDetails = await Clients.find({uid: id}).lean().exec()

  try {
    client = await Clients.findOneAndUpdate({uid: id}, details)
    user = await Users.find({_id: mongoose.Types.ObjectId(Clients.uid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Clients.personal_client_information', null, id, 'PATCH')
    return false
  }

  return {
    ...client[0],
    photo: Clients.photo
  }
}

async function contact_client_information(id, data) {
  let user, client
  await getSpecificData({uid: id}, Clients, 'User', id) // validate if data exists

  const details = {
    contact: {
      ...data
    }
  }

  const oldDetails = await Clients.find({uid: id}).lean().exec()

  try {
    client = await Clients.findOneAndUpdate({uid: id}, details, {
      new: true
    })
      .lean()
      .exec()
    user = await Users.find({_id: mongoose.Types.ObjectId(Clients.uid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Clients.contact_client_information', null, id, 'PATCH')
    return false
  }

  return {
    ...client[0],
    photo: Clients.photo
  }
}

async function industry_client_information(id, data) {
  let user, client
  await getSpecificData({uid: id}, Clients, 'User', id) // validate if data exists

  const details = {
    industry: {
      ...data
    }
  }

  const oldDetails = await Clients.find({uid: id}).lean().exec()

  try {
    client = await Clients.findOneAndUpdate({uid: id}, details, {
      new: true
    })
      .lean()
      .exec()
    user = await Users.find({_id: mongoose.Types.ObjectId(Clients.uid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Clients.expertise_client_information', null, id, 'PATCH')
    return false
  }

  return {
    ...client[0],
    photo: Clients.photo
  }
}

async function rate_client_information(id, data) {
  let user
  await getSpecificData({uid: id}, Clients, 'User', id) // validate if data exists
  const details = {
    rate: {
      rateAmount: data?.rateAmount,
      rateType: data?.rateType
    },
    payment: {
      accountPaymentType: data?.accountType,
      acccountPaymentName: data?.accountName,
      acccountPaymentNumber: data?.accountNumber
    }
  }

  const oldDetails = await Clients.find({_id: id}).lean().exec()

  try {
    await Clients.findOneAndUpdate({uid: id}, details, {
      new: true
    })
    user = await Users.find({_id: mongoose.Types.ObjectId(Clients.uid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Clients.rate_client_information', null, id, 'PATCH')
    return false
  }

  return {
    ...user[0],
    photo: Clients.photo
  }
}

async function photo_client_information(id, data) {
  let user
  await getSpecificData({uid: id}, Clients, 'User', id) // validate if data exists

  const details = {
    photo: data?.photo
  }

  const oldDetails = await Clients.find({_id: id}).lean().exec()

  try {
    await Clients.findOneAndUpdate({uid: id}, details, {
      new: true
    })
    user = await Users.find({_id: mongoose.Types.ObjectId(Clients.uid)})
      .lean()
      .exec()
    await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0])
  } catch (error) {
    console.error(error)
    await logger.logError(error, 'Clients.photo_client_information', null, id, 'PATCH')
    return false
  }

  return {
    ...user[0],
    photo: Clients.photo
  }
}

var controllers = {
  update_jobster_profile: async function (req, res) {
    const {id} = req.params
    const user = Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec() // validate if data exists
    if (!user || !Users.length < 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const isAccountExist = await Freelancers.find({uuid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    let result = isAccountExist
    if (isAccountExist.length === 0) {
      result = await create_jobster_profile(id, req.body)
    } else {
      switch (req.body.step) {
        case 'personal':
          result = await personal_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'work':
          result = await work_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'expertise':
          result = await expertise_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'education':
          result = await education_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'rate':
          result = await rate_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'photo':
          result = await photo_information(mongoose.Types.ObjectId(id), req.body)
          break
        default:
          break
      }
    }

    return res.status(200).json(result)
  },

  update_client_profile: async function (req, res) {
    const {id} = req.params
    const user = Users.find({_id: mongoose.Types.ObjectId(id)})
      .lean()
      .exec() // validate if data exists
    if (!user || !Users.length < 0) {
      return res.status(502).json({success: false, msg: 'User not found'})
    }

    const isAccountExist = await Clients.find({uid: mongoose.Types.ObjectId(id)})
      .lean()
      .exec()
    let result = isAccountExist
    if (isAccountExist.length === 0) {
      result = await create_client_profile(id, req.body)
    } else {
      switch (req.body.step) {
        case 'personal':
          result = await personal_client_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'contact':
          result = await contact_client_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'industry':
          result = await industry_client_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'rate':
          result = await rate_client_information(mongoose.Types.ObjectId(id), req.body)
          break
        case 'photo':
          result = await photo_client_information(mongoose.Types.ObjectId(id), req.body)
          break
        default:
          break
      }
    }

    return res.status(200).json(result)
  }
}

module.exports = controllers
