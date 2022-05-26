const fetch = require('axios');
const mongoose = require('mongoose');

const User = require('./../../models/User');

const {getSpecificData} = require('../../services/validateExisting');
const mailer = require('../../services/mailer');
const logger = require('../../services/logger');

const {FCM_SERVER_KEY} = process.env;

var controllers = {
    get_token: async function (req, res) {
        const {id} = req.params;
        let user;

        try {
            user = await getSpecificData({id: id}, User, 'User', id);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'FCM.get_token', null, id, 'GET');

            return res.status(502).json({success: false, msg: 'Unable to get details'});
        }

        return res.status(200).json(user);
    },
    post_token: async function (req, res) {
        const {message} = req.body;
        const {id} = req.params;

        const user = await getSpecificData({id: mongoose.Types.ObjectId(id)}, User, 'User', id); // validate if data exists
        let isSent;
        try {
            isSent = await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'key=' + FCM_SERVER_KEY
                },
                data: {
                    notification: {
                        title: `Starjobs`,
                        body: `${message}`,
                        icon: 'https://app.starjobs.com.ph/images/72x72.png',
                        click_action: 'https://app.starjobs.com.ph/index-my-gigs.html'
                    },
                    to: user[0].deviceId
                }
            });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'FCM.post_token', null, id, 'POST');

            return res.status(502).json({success: false, msg: 'Unable to post fcm'});
        }

        return res.status(200).json(isSent);
    },
    patch_token: async function (req, res) {
        const {deviceId} = req.body;
        const {id} = req.params;

        await getSpecificData({id: mongoose.Types.ObjectId(id)}, User, 'User', id); // validate if data exists
        const params = {
            deviceId
        };
        let updatedToken;
        try {
            updatedToken = await User.findByIdAndUpdate(id, params);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'FCM.patch_token', null, id, 'PATCH');

            return res.status(502).json({success: false, msg: 'Unable to patch fcm'});
        }

        return res.status(200).json(updatedToken);
    }
};

module.exports = controllers;
