const jwt_decode = require('jwt-decode')
const mongoose = require('mongoose')

const Freelancers = require('../users/models/freelancers.model')
const Notification = require('./models/notifications.model')
const Users = require('../users/models/users.model')

const Gigs = require('../gigs/models/gigs.model')
const History = require('../gigs/models/gig-histories.model')

const logger = require('../../common/loggers')

var controllers = {
  get_notifications: async function (req, res) {
    const {id} = req.params
    let result
    try {
      result = await History.aggregate([
        {
          $lookup: {
            from: 'gigs',
            localField: 'gid',
            foreignField: '_id',
            as: 'details'
          }
        }
      ])
        .match({
          uid: mongoose.Types.ObjectId(id),
          createdAt: {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
          }
        })
        .sort({createdAt: -1})
        .exec()

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: false, data: result})
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.get_notifications', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_notifications_clients: async function (req, res) {
    const { id } = req.params;
    const { page = 1, pageSize = 10 } = req.query; 
    let result;

    try {
      const pageNum = parseInt(page, 10);
      const limit = parseInt(pageSize, 10);
      const skip = (pageNum - 1) * limit;

      if (isNaN(pageNum) || isNaN(limit) || pageNum <= 0 || limit <= 0) {
        return res.status(400).json({ success: false, msg: 'Invalid page or pageSize parameters' });
      }

      let query = await History.aggregate([
        {
          $lookup: {
            from: 'gigs',
            localField: 'gid',
            foreignField: '_id',
            as: 'details'
          }
        },
      {
        $match:{
          createdAt: {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
          },
            'details.uid': id
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $skip: skip
        },
        {
          $limit: limit 
        }
      ]).exec();

      if (!query || query.length === 0) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      result = query;
      return res.status(200).json({success: true, data: result})
    } catch (error) {
      console.error('error', error);
      await logger.logError(error, 'Freelancers.get_notifications_clients', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_notification_details: async function (req, res) {
    const {id} = req.params
    try {
      let result = await Gigs.aggregate([
        {
          $lookup: {
            from: 'gigs-histories',
            localField: '_id',
            foreignField: 'gid',
            as: 'history'
          }
        }
      ])
        .match({
          _id: mongoose.Types.ObjectId(id)
        })
        .exec()

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: true, data: result})
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.get_notification_details', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  patch_notification: async function (req, res) {
    const {id} = req.params
    const {uid} = req.body
    let result
    try {
      const userType = await Users.find({_id: mongoose.Types.ObjectId(uid)})
        .lean()
        .exec()
      if (userType[0].accountType === 1) {
        // client
        result = await History.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {readAuthor: true}).exec()
      } else {
        // jobster
        result = await History.findOneAndUpdate(
          {_id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(uid)},
          {readUser: true}
        ).exec()
      }

      if (!result) {
        return res.status(400).json({success: false, msg: 'Empty notifications'})
      }

      return res.status(200).json({success: false, data: result})
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.get_notification_details', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_notifications_v2: async function (req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const {id} = jwt_decode(token)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
      // await Notification.find({
      //   $or: [{targetUsers: id}, {target: 'General'}]
      // })
      //   .limit(30)
      //   .sort({createdAt: -1})
      //   .exec((err, data) => {
      //     if (err) {
      //       return res.status(400).json({
      //         error: err
      //       })
      //     }
      //     let finalData = []
      //     for (let index = 0; index < 30; index++) {
      //       finalData.push({...data[index]?._doc, isRead: data[index]?.viewedBy.includes(id)})
      //     }
      //     // return res.json(finalData);
      //     return res.status(200).json({success: true, data: finalData})
      //   })

      const skip = (page - 1) * limit;
      const [notifications, totalItems] = await Promise.all([
        Notification.find({
          $or: [{targetUsers: id}, {target: 'General'}],
          createdAt: {
            $gte: past24Hours,
            $lt: now
          }
        })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .exec(),
        Notification.countDocuments({
          $or: [{targetUsers: id}, {target: 'General'}],
          createdAt: {
            $gte: past24Hours,
            $lt: now
          }
        })
      ]);

      const finalData = notifications.map((notification) => ({
        ...notification._doc,
        isRead: notification.viewedBy.includes(id)
      }));

      return res.status(200).json({success: true, data: finalData, totalItems});
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.get_notifications', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },


  get_notifications_v3: async function (req, res) {
    const token = req.headers.authorization.split(' ')[1]
    const {id} = jwt_decode(token)
    const {length} = req.params
    try {
      const notifications = await Notification.find({
        $or: [{targetUsers: id}, {target: 'General'}]
      })
        .skip(length * 1)
        .sort({createdAt: -1})
        .limit(10)
        .exec()

      const finalData = notifications.map((notification) => ({
        ...notification._doc,
        isRead: notification.viewedBy.includes(id)
      }))

      return res.status(200).json({success: true, data: finalData})
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.get_notifications', null, id, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  post_notification_v2: async function (req, res) {
    try {
      const {title, body} = req.body

      if (!title || !body) {
        return res.status(400).json({
          error: `All fields must be filled`
        })
      }

      let notification = new Notification({
        ...req.body
      })

      notification.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: `Error on posting alert: ${err}`
          })
        }

        return res.json(result)
      })
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.post_notification', null, null, 'POST')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  put_notification_addviewer: async function (req, res) {
    try {
      Notification.findOneAndUpdate(
        {_id: req.params.notificationId},
        {$addToSet: {viewedBy: req.params.userId}},
        {new: true}
      ).exec((err, result) => {
        if (err) {
          return res.status(400).json({
            error: `Error on updating notification: ${err}`
          })
        }

        return res.json(result)
      })
    } catch (error) {
      console.error('error', error)
      await logger.logError(error, 'Freelancers.patch_notification_addviewer', null, null, 'put')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  },

  get_area_notification: async function (req, res) {
    try {
      const areas = await Freelancers.distinct('presentCity')
      let result =
        areas &&
        areas.length > 0 &&
        areas.map(function (item) {
          return typeof item === 'string' ? item.toString().toLowerCase().trim() : item
        })
      result = [...new Set(result)]
      return res.status(200).json({success: true, data: result})
    } catch (error) {
      console.log(error)
      await logger.logError(error, 'Freelancers.get_notifications', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'User not found'})
    }
  }
}

module.exports = controllers
