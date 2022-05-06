const moment = require('moment');
const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');

const User = require('./../../models/User');
const Account = require('./../../models/Account');
const History = require('./../../models/History');
const Gigs = require('./../../models/Gigs');
const Client = require('./../../models/Client');
const Extends = require('./../../models/Extends');

const { getSpecificData } = require('../../services/validateExisting');
const logger = require('../../services/logger');

const { timeCal } = require('../../services/timeCalculator');
const { BUCKET_URL } = process.env;

var controllers = {
    // list of gigs
    get_gigs: async function (req, res) {
        let gigs = [];
        try {
            let initial_find = await Gigs.find({
                status: ['Waiting', 'Applying']
            })
                .lean()
                .exec();

            gigs = initial_find.filter((obj) => {
                return !moment(obj.time).isBefore(moment(), 'day');
            });

            if (!initial_find) res.status(502).json({ success: false, msg: 'Gigs not found' });
        } catch (error) {
            console.error(error);

            await logger.logError(error, 'Gigs.get_gigs_categorized', category, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Gigs not found' });
        }

        return res.status(200).json(gigs);
    },
    // specific gig
    get_gig: async function (req, res) {
        const { id } = req.params;
        let gigs;

        try {
            // gigs = await Gigs.findById(id).lean().exec();
            gigs = await Gigs.aggregate([
                {
                    $lookup: {
                        from: 'account',
                        localField: 'auid',
                        foreignField: 'uuid',
                        as: 'account'
                    }
                },
                {
                    $lookup: {
                        from: 'history',
                        localField: '_id',
                        foreignField: 'gid',
                        as: 'history'
                    }
                }
            ])
                .match({
                    _id: mongoose.Types.ObjectId(id)
                })
                .sort({ createdAt: -1 })
                .exec();
        } catch (error) {
            console.error(error);

            await logger.logError(error, 'Gigs.get_gig', null, id, 'GET');
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        return res.status(200).json(gigs.pop());
    },
    // list of gigs by category
    get_gigs_categorized: async function (req, res) {
        const { category } = req.params;
        let gigs = [];
        try {
            let initial_find = await Gigs.find({
                category: category,
                status: ['Waiting', 'Applying']
            })
                .lean()
                .exec();

            gigs = initial_find.filter((obj) => {
                return !moment(obj.time).isBefore(moment(), 'day');
            });

            if (!initial_find) res.status(502).json({ success: false, msg: 'Gigs not found' });
        } catch (error) {
            console.error(error);

            await logger.logError(error, 'Gigs.get_gigs_categorized', category, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Gigs not found' });
        }

        return res.status(200).json(gigs);
    },
    // list of gigs by history
    get_gigs_history: async function (req, res) {
        const { id } = req.params;
        const now = new Date();
        await getSpecificData({ uuid: mongoose.Types.ObjectId(id) }, Account, 'Account', id);
        let details;
        try {
            const check_user = await User.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            if (!check_user[0].isActive) {
                details = {
                    ...check_user,
                    account: [],
                    gigs: [],
                    reports: {
                        numberOfApplied: 0,
                        numberOfCompleted: 0
                    }
                };
            } else {
                const user = await User.aggregate([
                    {
                        $lookup: {
                            from: 'account',
                            localField: '_id',
                            foreignField: 'uuid',
                            as: 'account'
                        }
                    }
                ])
                    .match({
                        'account.uuid': mongoose.Types.ObjectId(id)
                    })
                    .exec();

                const reports = await Gigs.aggregate([
                    {
                        $lookup: {
                            from: 'history',
                            localField: '_id',
                            foreignField: 'gid',
                            as: 'history'
                        }
                    }
                ])
                    .match({
                        'history.uid': mongoose.Types.ObjectId(id)
                    })
                    .sort({ createdAt: -1 })
                    .exec();

                details = {
                    ...user,
                    account: user[0].isActive ? user[0].account[0] : [],
                    gigs: reports.filter((obj) => {
                        const diff = moment(obj.from).diff(now);

                        //express as a duration
                        const diffDuration = moment.duration(diff);

                        // between 0 days and 2 days before current day
                        if (diffDuration.days() >= 0 && diffDuration.days() <= 2) {
                            return obj;
                        }
                        return;
                    }),
                    reports: {
                        numberOfApplied: reports.filter((obj) => obj.status === 'Applying').length,
                        numberOfCompleted: reports.filter((obj) => obj.status === 'Confirm-End-Shift').length
                    }
                };
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Gigs.get_gigs_history', null, id, 'GET');

            return res.status(502).json({ success: false, msg: 'Unable to get history details' });
        }

        return res.status(200).json(details);
    },
    // create gigs
    post_gig: async function (req, res) {
        const { id } = req.params;
        const { time, shift, hours, fee, date, category, position, breakHr, from, fees, locationRate, location, contactNumber, notes } = req.body;
        const now = new Date();

        const isUserExists = await User.find({ _id: mongoose.Types.ObjectId(id), accountType: 1 })
            .lean()
            .exec();

        if (!isUserExists || isUserExists.length === 0) {
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        const client = await Client.find({ uid: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();

        if (!client) {
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        const gigsObj = new Gigs({
            user: [
                {
                    _id: mongoose.Types.ObjectId(client[0]._id),
                    location: client[0].location,
                    companyName: client[0].companyName,
                    website: client[0].website,
                    thumbnail: BUCKET_URL + client[0].photo
                }
            ],
            time,
            from,
            shift,
            hours,
            fee,
            date,
            category,
            position,
            breakHr,
            fees,
            location,
            contactNumber,
            notes,
            locationRate: locationRate,
            uid: mongoose.Types.ObjectId(id),
            dateCreated: now.toISOString()
        });

        try {
            await Gigs.create(gigsObj);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Gigs.post_gig', gigsObj, client[0]._id, 'POST');
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        return res.status(201).json(gigsObj);
    },
    // edit gigs
    patch_gig_details: async function (req, res) {
        const { id, uid: owner_id } = req.params;
        const { time, shift, hours, fee, date, category, position, from, uid } = req.body;

        const isGigOwner = await Gigs.find({ _id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(owner_id) })
            .lean()
            .exec();
        if (!isGigOwner || isGigOwner.length <= 0) {
            return res.status(502).json({ success: false, msg: 'Not Gig owner' });
        }

        try {
            const gigsObj = {
                time,
                from,
                shift,
                hours,
                fee,
                date,
                category,
                position
            };

            await Gigs.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, gigsObj);
            return res.status(200).json(gigsObj);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'GIGS.patch_gig_details', null, null, 'PATCH');
            return res.status(502).json({ success: false, msg: 'Unable to edit gig details' });
        }
    },
    patch_remove_gig: async function (req, res) {
        const { id, uid: owner_id } = req.params;
        const { status } = req.body;

        const isGigOwner = await Gigs.find({ _id: mongoose.Types.ObjectId(id), uid: mongoose.Types.ObjectId(owner_id) })
            .lean()
            .exec();
        if (!isGigOwner || isGigOwner.length <= 0) {
            return res.status(502).json({ success: false, msg: 'Not Gig owner' });
        }

        try {
            const gigsObj = {
                status
            };

            await Gigs.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, gigsObj);
            return res.status(200).json(gigsObj);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'GIGS.patch_remove_gig', null, null, 'PATCH');
            return res.status(502).json({ success: false, msg: 'Unable to remove gig' });
        }
    },
    // ======================== ADMIN ======================
    get_admin_gigs: async function (req, res) {
        let query = Gigs.find({}, null, { sort: { dateCreated: -1 } });

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * pageSize;
        const total = await Gigs.countDocuments();
        const reports = await Gigs.aggregate([
            {
                $group: {
                    _id: { $month: '$dateCreated' },
                    numberOfGigs: { $sum: 1 }
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
            await logger.logError(error, 'GIGS.get_admin_gigs', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    patch_admin_status_gig: async function (req, res) {
        const { id } = req.params;
        const { status, uid } = req.body;
        const now = new Date();
        try {
            const gigs = await Gigs.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            let history = new History({
                status: status,
                gid: mongoose.Types.ObjectId(id),
                date_created: now.toISOString(),
                uid: mongoose.Types.ObjectId(uid)
            });

            history.uid = mongoose.Types.ObjectId(uid);
            await Gigs.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { status: status });
            await History.create(history);
            return res.status(200).json(gigs);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'GIGS.patch_archived_gig', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    get_admin_gigs_exports: async function (req, res) {
        try {
            let query = await Gigs.find(
                {},
                {
                    position: 1,
                    _id: 1,
                    fee: 1,
                    status: 1,
                    category: 1,
                    from: 1,
                    time: 1,
                    shift: 1,
                    dateCreated: 1
                }
            )
                .lean()
                .exec();

            res.status(200).json({
                status: 'success',
                data: query
            });
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'GIGS.get_admin_gigs_exports', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    },
    get_admin_search_users: async function (req, res) {
        let query = Gigs.find({ position: { $regex: '.*' + req.query.keyword + '.*' } });
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * pageSize;
        const totalUsers = await Gigs.countDocuments();
        const total = await Gigs.length;
        const reports = await Gigs.aggregate([
            {
                $group: {
                    _id: { $month: '$dateCreated' },
                    numberOfGigs: { $sum: 1 }
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
    patch_admin_gig_details: async function (req, res) {
        const { id } = req.params;
        const { time, shift, hours, fee, date, category, position, from, status, uid } = req.body;
        const now = new Date();
        try {
            const gigs = await Gigs.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            if (gigs[0].status !== status) {
                let history = new History({
                    status: status,
                    gid: mongoose.Types.ObjectId(id),
                    date_created: now.toISOString(),
                    uid: mongoose.Types.ObjectId(uid)
                });

                history.uid = mongoose.Types.ObjectId(uid);
                await History.create(history);
            }

            const gigsObj = {
                time,
                from,
                shift,
                hours,
                fee,
                date,
                category,
                position,
                status
            };

            await Gigs.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, gigsObj);
            return res.status(200).json(gigsObj);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'GIGS.patch_archived_gig', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'Unable to get lists' });
        }
    }
};

module.exports = controllers;
