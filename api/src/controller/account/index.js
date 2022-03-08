const jwt = require('jsonwebtoken'); // to generate signed token
const Account = require('./../../models/Account');
const User = require('./../../models/User');
const History = require('./../../models/History');
const Ratings = require('./../../models/Ratings');
const mongoose = require('mongoose');
const {getSpecificData} = require('../../services/validateExisting');
const mailer = require('../../services/mailer');
const logger = require('../../services/logger');
const requestToken = require('../../services/token');

var controllers = {
    post_account_details: async function (req, res) {
        const {id} = req.params;
        const user = User.find({_id: mongoose.Types.ObjectId(id)})
            .lean()
            .exec(); // validate if data exists
        if (!user || !user.length < 0) {
            return res.status(502).json({success: false, msg: 'User not found'});
        }

        const now = new Date();
        let result;
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
        } = req.body;

        const accountObj = new Account({
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
        });

        try {
            result = await Account.create(accountObj).catch((err) => console.log(err));

            if (result) {
                await User.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {isActive: true});
            }
        } catch (error) {
            await logger.logError(error, 'Accounts.post_account_details', accountObj, id, 'POST');
            return res.status(502).json({success: false, msg: 'User not found'});
        }

        const updated_user = await User.find({_id: mongoose.Types.ObjectId(id)})
            .lean()
            .exec();

        let {accessToken: token, refreshToken} = requestToken.create_token(id);
        result = {
            token: token,
            refreshToken: refreshToken,
            ...updated_user[0]
        };

        return res.status(201).json(result);
    },
    patch_account_details: async function (req, res) {
        const {id} = req.params;
        let user, account;
        await getSpecificData({uuid: id}, Account, 'User', id); // validate if data exists
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
        } = req.body;

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
        };

        const oldDetails = await Account.find({_id: mongoose.Types.ObjectId(id)})
            .lean()
            .exec();

        try {
            account = await Account.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, details);
            user = await User.find({_id: mongoose.Types.ObjectId(account.uuid)})
                .lean()
                .exec();
            await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
            return res.status(502).json({success: false, msg: 'User not found'});
        }

        let {accessToken: token, refreshToken} = requestToken.create_token(account.uuid);
        result = {
            ...user[0],
            photo: account.photo,
            token,
            refreshToken
        };

        return res.status(200).json(result);
    },
    get_account_details: async function (req, res) {
        const {id} = req.params;
        let result;
        try {
            const account = await Account.find({uuid: mongoose.Types.ObjectId(id)})
                .lean()
                .exec();

            const ratings = await Ratings.find({uid: mongoose.Types.ObjectId(id)})
                .lean()
                .exec();

            if (!ratings) {
                result = account;
            } else {
                let efficiency = 0,
                    onTime = 0,
                    completeness = 0,
                    showRate = 0;

                ratings &&
                    ratings.length > 0 &&
                    ratings.map((value) => {
                        let rates = value.rates;

                        efficiency = rates.efficiency + efficiency;
                        onTime = rates.onTime + onTime;
                        completeness = rates.completeness + completeness;
                        showRate = rates.showRate + showRate;
                    });

                console.log(ratings.length);
                totalEfficiency = parseFloat(ratings.length * efficiency) / 100;
                totalOnTime = parseFloat(ratings.length * onTime) / 100;
                totalCompleteness = parseFloat(ratings.length * completeness) / 100;
                totalShowRate = parseFloat(ratings.length * showRate) / 100;

                result = {
                    ...account,
                    ratings: {
                        efficiency: totalEfficiency,
                        onTime: totalOnTime,
                        completeness: totalCompleteness,
                        showRate: totalShowRate
                    }
                };
            }

            if (!result) {
                return res.status(502).json({success: false, msg: 'User not found'});
            }
        } catch (error) {
            console.error(error);

            await logError(error, 'Accounts', null, id, 'GET');
            return res.status(502).json({success: false, msg: 'User not found'});
        }

        return res.status(200).json(result);
    }
};

module.exports = controllers;
