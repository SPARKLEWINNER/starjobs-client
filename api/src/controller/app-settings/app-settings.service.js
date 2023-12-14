const Advertisements = require('./models/advertisements.model')
const AppSettings = require('./models/app-settings.model')
const Categories = require('./models/categories.model')
const Logs = require('./models/loggers.model')

const logger = require('../../common/loggers')

const {BUCKET_URL} = process.env

var controllers = {
  get_app_settings: async function (req, res) {
    let result
    try {
      const ads = await Advertisements.find({}).lean().exec()
      const appSettings = await AppSettings.find({}).lean().exec()

      if (appSettings && appSettings.length > 0) {
        result = {
          ads,
          ...appSettings[0]
        }
      } else {
        result = {
          appVersions: undefined
        }
      }
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'AppSettings.get_app_settings', null, null, 'GET')
      return res.status(502).json({success: false, msg: 'Unable to get appSettings'})
    }

    return res.status(200).json(result)
  },

  get_category: async function (req, res) {
    const {id} = req.params
    let category
    try {
      category = await Categories.findById(id).lean().exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Category.get_category', null, id, 'GET')

      return res.status(502).json({success: false, msg: 'Unable to get category'})
    }

    return res.status(200).json(category)
  },

  get_categories: async function (req, res) {
    let categories
    try {
      categories = await Categories.find({status: 0}).lean().exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'Categories.get_categories', null, null, 'GET')

      return res.status(502).json({success: false, msg: 'Unable to get categories'})
    }

    let category = categories.map((item) => {
      item.image = BUCKET_URL + item.image
      return item
    })

    return res.status(200).json(category)
  },

  get_logs: async function (req, res) {
    let logs
    try {
      logs = await Logs.find({
        createdAt: {
          $lt: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - 1))
        }
      }).exec()
    } catch (error) {
      console.error(error)
      await logger.logError(error, 'LOGS.get_logs', null, null, 'GET')

      return res.status(502).json({success: false, msg: 'Unable to get details'})
    }

    return res.status(200).json(logs)
  }
}

module.exports = controllers
