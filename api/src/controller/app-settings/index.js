const Ads = require('../../models/Ads');
const AppSettings = require('../../models/appSettings');

const logger = require('../../services/logger');

const {BUCKET_URL} = process.env;

var controllers = {
    get_app_settings: async function (req, res) {
        let result;
        try {
            const ads = await Ads.find({}).lean().exec();
            const appSettings = await AppSettings.find({}).lean().exec()

            if(appSettings && appSettings.length > 0){
                result = {
                    ads,
                    ...appSettings[0]
                }
            } else{
                result = {
                    appVersions: undefined
                }
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'AppSettings.get_app_settings', null, null, 'GET');
            return res.status(502).json({success: false, msg: 'Unable to get appSettings'});
        }

        return res.status(200).json(result);
    },
};

module.exports = controllers;
