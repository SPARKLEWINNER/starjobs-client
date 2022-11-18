const fetch = require('axios');
const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');
const crypto = require('crypto');
let db = mongoose.connection;

const User = require('./../../models/User');
const Account = require('./../../models/Account');
const Client = require('./../../models/Client');

const { getSpecificData } = require('../../services/validateExisting');
const logger = require('../../services/logger');

var controllers = {
    get_user: async function (req, res) {
        let user, result;
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });
        const id = jwt_decode(token)['id'];

        try {
            user = await User.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();
            if (!user || user.length === 0)
                return res.status(404).json({ success: false, is_authorized: false, msg: 'User not found' });

            if (user && user[0].accountType === 1) {
                result = await Client.find({ uid: mongoose.Types.ObjectId(id) }, { photo: 1 })
                    .lean()
                    .exec();
            } else {
                result = await Account.find({ uuid: mongoose.Types.ObjectId(id) }, { photo: 1 })
                    .lean()
                    .exec();
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_user', null, id, 'GET');

            return res.status(502).json({ success: false, msg: 'Unable to get details' });
        }

        if (result.length > 0) {
            return res.status(200).json({ ...user[0], photo: result[0].photo });
        }

        return res.status(200).json({ ...user[0], photo: undefined });
    },
    get_users: async function (req, res) {
        let query = User.find({ accountType: { $ne: 99 } }, null, { sort: { dateCreated: -1 } });

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * pageSize;
        const total = await User.countDocuments();
        const reports = await User.aggregate([
            {
                $group: {
                    _id: { $month: '$dateCreated' },
                    numberOfRegisters: { $sum: 1 }
                }
            }
        ]);

        try {
            const pages = Math.ceil(total / pageSize);

            query = query.skip(skip).limit(pageSize);

            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found'
                });
            }

            const result = await query;

            res.status(200).json({
                status: 'success',
                count: result.length,
                page,
                pages,
                total: total,
                data: result,
                reports: reports.sort((a, b) => a._id - b._id)
            });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_users', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    get_users_specific: async function (req, res) {
        let { id, type } = req.params;
        let user_details;

        try {
            if (JSON.parse(type) === 1) {
                user_details = await User.aggregate([
                    {
                        $lookup: {
                            from: 'clients',
                            localField: '_id',
                            foreignField: 'uid',
                            as: 'profile'
                        }
                    }
                ])
                    .match({ _id: mongoose.Types.ObjectId(id) })
                    .exec((err, data) => {
                        if (err) return false;

                        return res.status(200).json(data[0]);
                    });
            } else {
                user_details = User.aggregate([
                    {
                        $lookup: {
                            from: 'account',
                            localField: '_id',
                            foreignField: 'uuid',
                            as: 'profile'
                        }
                    }
                ])
                    .match({ _id: mongoose.Types.ObjectId(id) })
                    .exec((err, data) => {
                        if (err) return false;

                        return res.status(200).json(data[0]);
                    });
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_users', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    patch_change_password: async function (req, res) {
        let update_user = {};
        const { id } = req.params;
        let { oldPassword, newPassword } = req.body;

        const user = await User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();
        if (!user) {
            return res.status(502).json({ success: false, msg: 'Unable to change password' });
        }

        let encryptPassword = crypto.createHmac('sha1', user[0].salt).update(oldPassword).digest('hex');
        if (encryptPassword !== user[0].hashed_password) {
            return res.status(402).json({ success: false, msg: "Old password doesn't match." });
        }

        update_user['hashed_password'] = crypto.createHmac('sha1', user[0].salt).update(newPassword).digest('hex');
        try {
            update_user = await User.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(id) }, update_user)
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_user', null, id, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get details' });
        }

        return res.status(200).json(update_user);
    },
    get_search_users: async function (req, res) {
        let query = User.find({ accountType: { $ne: 99 }, name: { $regex: '.*' + req.query.keyword + '.*' } });
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * pageSize;
        const totalUsers = await User.countDocuments();
        const total = await User.length;
        const reports = await User.aggregate([
            {
                $group: {
                    _id: { $month: '$dateCreated' },
                    numberOfRegisters: { $sum: 1 }
                }
            }
        ]);

        try {
            const pages = Math.ceil(total / pageSize);

            query = query.skip(skip).limit(pageSize);

            if (page > pages) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'No page found'
                });
            }

            const result = await query;
            res.status(200).json({
                status: 'success',
                count: result.length,
                page,
                pages,
                total: totalUsers,
                data: result,
                reports: reports.sort((a, b) => a._id - b._id)
            });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_users', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    get_user_exports: async function (req, res) {
        try {
            let query = await User.find(
                { accountType: { $ne: 99 } },
                { name: 1, _id: 1, email: 1, isActive: 1, dateCreated: 1, accountType: 1 }
            )
                .lean()
                .exec();

            res.status(200).json({
                status: 'success',
                data: query
            });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.get_user_exports', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    patch_user_token: async function (req, res, next) {
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });

        const id = jwt_decode(token)['id'];
        const user = await User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();

        if (!user) {
            return res.status(502).json({ success: false, msg: 'Unable to update device token' });
        }

        const { deviceToken } = req.body;

        try {
            update_user = await User.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(id) },
                {
                    deviceId: deviceToken
                }
            )
                .lean()
                .exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.patch_user_token', null, id, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to patch new device token' });
        }

        return res.status(200).json(update_user);
    },

    patch_user: async function (req, res, next) {
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });

        const id = jwt_decode(token)['id'];
        let user = await User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();

        if (!user) {
            return res.status(502).json({ success: false, msg: 'Unable to update device token' });
        }
        try {
            update_user = await User.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(id) },
                {
                    accountType: req.body.accountType,
                    phone: req.body.phone,
                    isVerified: true
                }
            )
                .lean()
                .exec();

            if (update_user) {
                user = await User.find({ _id: mongoose.Types.ObjectId(id) })
                    .lean()
                    .exec();
            }
            res.status(200).json({ ...user });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'USER.patch_user', null, id, 'GET');
            res.status(502).json({ success: false, msg: 'Unable to patch new device token' });
        } finally {
            next();
        }
    }
};

module.exports = controllers;
