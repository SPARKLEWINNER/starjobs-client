const Advertisements = require('./models/advertisements.model')
const AppSettings = require('./models/app-settings.model')
const Categories = require('./models/categories.model')
const Branches = require('./models/branches.model')
const Pickups = require('./models/pickups.model')

const Logs = require('./models/loggers.model')
const Rates = require('./models/rates.model')
const logger = require('../../common/loggers')

const {BUCKET_URL} = process.env

var controllers = {
  get_app_settings: async function (req, res) {
    let result
    try {
      // const ads = await Advertisements.find({}).lean().exec()
      const appSettings = await AppSettings.find({}).lean().exec()

      if (appSettings && appSettings.length > 0) {
        result = {
          // ads,
          ...appSettings[0]
        }
      } else {
        result = {
          appVersions: undefined
        }
      }
      console.log(`Fetched ${result.length} app settings`)
      return res.status(200).json(result)
    } catch (error) {
      console.error('Error in get_app_settings:', error)
      try {
        await logger.logError(error, 'AppSettings.get_app_settings', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get appSettings'})
    }
  },

  get_category: async function (req, res) {
    const {id} = req.params
    try {
      const category = await Categories.findById(id).lean().exec()
      console.log(`Fetched ${category.length} categories`)
      return res.status(200).json(category)
    } catch (error) {
      console.error('Error in get_category:', error)
      try {
        await logger.logError(error, 'Category.get_category', null, id, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get category'})
    }
  },

  get_branches: async function (req, res) {
    try {
      const branches = await Branches.find({status: 'active'}).lean().exec()
      console.log(`Fetched ${branches.length} active branches`)
      return res.status(200).json(branches)
    } catch (error) {
      console.error('Error in get_branches:', error)
      try {
        await logger.logError(error, 'Branches.get_branches', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get Branches'})
    }
  },
  get_pickups: async function (req, res) {
    try {
      const pickups = await Pickups.find().lean().exec()
      console.log(`Fecthed ${pickups.length} pickups`)
      return res.status(200).json(pickups)
    } catch (error) {
      console.error('Error in get_pickups:', error)
      try {
        await logger.logError(error, 'Pickups.get_pickups', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get Pickups'})
    }
  },
  get_categories: async function (req, res) {
    try {
      const categories = await Categories.find({status: 0}).lean().exec()
      console.log(`Fetched ${categories.length} categories`)
      return res.status(200).json(categories)
    } catch (error) {
      console.error('Error in get_categories:', error)
      try {
        await logger.logError(error, 'Categories.get_categories', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get categories'})
    }
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

      return res.status(500).json({success: false, msg: 'Unable to get details'})
    }

    return res.status(200).json(logs)
  },

  get_rates: async function (req, res) {
    try {
      const rates = await Rates.find({}).sort({city: 1}).exec()
      console.log(`Fetched ${rates.length} rates`)
      return res.status(200).json(rates)
    } catch (error) {
      console.error('Error in get_rates:', error)
      try {
        await logger.logError(error, 'Rates.get_rates', null, null, 'GET')
      } catch (logErr) {
        console.error('Logger failed:', logErr)
      }
      return res.status(500).json({success: false, msg: 'Unable to get rates'})
    }
  }
}

module.exports = controllers
