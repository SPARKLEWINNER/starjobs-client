const Ads = require('../../models/Ads');

const logger = require('../../services/logger');

const {BUCKET_URL} = process.env;

var controllers = {
    get_app_settings: async function (req, res) {
        let ads;
        try {
            ads = await Ads.find({}).lean().exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Ads.get_ads', null, null, 'GET');
            return res.status(502).json({success: false, msg: 'Unable to get ads'});
        }

        return res.status(200).json({
            ads,
            appVersion: '1.0.1'
        });
    },
};

module.exports = controllers;
