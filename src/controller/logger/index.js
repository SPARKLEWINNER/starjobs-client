const Logs = require('./../../models/Logs');
const logger = require('../../services/logger');

var controllers = {
    get_logs: async function (req, res) {
        let logs;
        try {
            logs = await Logs.find({
                "createdAt": {
                    $lt: new Date(),
                    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                }
            })
                .exec();
            console.log(logs)
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'LOGS.get_logs', null, null, 'GET');

            return res.status(502).json({ success: false, msg: 'Unable to get details' });
        }

        return res.status(200).json(logs);
    }
};

module.exports = controllers;


