const moment = require('moment');

const Gigs = require('./../../models/Gigs');
const Client = require('./../../models/Client');
const Account = require('./../../models/Account');
const History = require('./../../models/History');
const User = require('./../../models/User');
const mongoose = require('mongoose');

const { getSpecificData } = require('../../services/validateExisting');
const logger = require('../../services/logger');
const requestToken = require('../../services/token');

const { BUCKET_URL } = process.env;

var controllers = {
    post_client_details: async function (req, res) {
        const { id } = req.params;
        let result;

        await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, User, 'Client', id); // validate if data exists

        const {
            firstName,
            lastName,
            middleInitial,
            email,
            companyName,
            brandName,
            location,
            website,
            companyPosition,
            contact,
            industry,
            rate,
            payment,
            photo,
            documents
        } = req.body;
        const now = new Date();

        const clientObj = new Client({
            uid: mongoose.Types.ObjectId(id),
            firstName,
            lastName,
            middleInitial,
            email,
            companyName,
            brandName,
            location,
            website,
            companyPosition,
            contact,
            industry,
            rate,
            payment,
            photo,
            documents,
            dateCreated: now.toISOString()
        });

        try {
            result = await Client.create(clientObj);
            if (result) {
                await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { isActive: true });
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Client.post_client_details', accountObj, id, 'POST');

            return res.status(502).json({ success: false, msg: 'User to save details' });
        }

        clientObj.photo = BUCKET_URL + photo;

        let document_url = clientObj.documents.split('=>').map((v) => {
            return BUCKET_URL + v;
        });

        clientObj.documents = document_url;

        const updated_user = await User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();
        let { accessToken: token, refreshToken } = requestToken.create_token(id);
        result = {
            token,
            refreshToken,
            ...updated_user[0]
        };

        return res.status(201).json(result);
    },
    patch_client_details: async function (req, res) {
        const { id } = req.params;
        let result, user;

        await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, User, 'Client', id); // validate if data exists

        const {
            firstName,
            lastName,
            middleInitial,
            email,
            companyName,
            brandName,
            location,
            website,
            companyPosition,
            contact,
            industry,
            rate,
            payment,
            photo
        } = req.body;

        const clientObj = {
            firstName,
            lastName,
            middleInitial,
            email,
            companyName,
            brandName,
            location,
            website,
            companyPosition,
            contact,
            industry,
            rate,
            payment,
            photo
        };

        const oldDetails = await Client.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();

        try {
            result = await Client.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, clientObj);
            user = await User.find({ _id: mongoose.Types.ObjectId(result.uid) })
                .lean()
                .exec();
            await logger.logAccountHistory(user[0].accountType, clientObj, id, oldDetails[0]);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Client.patch_client_details', clientObj, id, 'PATCH');
            return res.status(502).json({ success: false, msg: 'User to save details' });
        }

        let { accessToken: token, refreshToken } = requestToken.create_token(result.uid);
        result = {
            ...user[0],
            photo: result.photo,
            token,
            refreshToken
        };

        return res.status(201).json(result);
    },
    patch_client_documents: async function (req, res) {
        const { id } = req.params;
        let result, user;

        await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, User, 'Client', id); // validate if data exists

        const { documents } = req.body;

        const oldDetails = await Client.find({ uid: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();

        try {
            result = await Client.findOneAndUpdate({ uid: mongoose.Types.ObjectId(id) }, { documents: documents });
            console.log(result);
            user = await User.find({ _id: mongoose.Types.ObjectId(result.uid) })
                .lean()
                .exec();
            await logger.logAccountHistory(user[0].accountType, { documents: documents }, id, oldDetails[0]);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Client.patch_client_documents', { documents: documents }, id, 'PATCH');
            return res.status(502).json({ success: false, msg: 'User to save new documents' });
        }

        return res.status(200).json({ msg: 'New Documents will be reviewed by our staff', status: 'success' });
    },
    get_client: async function (req, res) {
        const { id } = req.params;
        let client;

        try {
            client = await getSpecificData({ uid: mongoose.Types.ObjectId(id) }, Client, 'Client', id);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Client', null, id, 'GET');

            return res.status(502).json({ success: false, msg: 'User to get details' });
        }
        return res.status(200).json(client);
    },
    get_client_gigs: async function (req, res) {
        const { id } = req.params;
        let gigs;
        let client;

        if (!id) res.status(502).json({ success: false, msg: 'User id missing' });

        try {
            await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, User, 'User', id);
            let user = await Client.find({ uid: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            if (user) {
                gigs = await Gigs.aggregate([
                    {
                        $lookup: {
                            from: 'extends',
                            localField: '_id',
                            foreignField: 'gigId',
                            as: 'extends'
                        }
                    },
                    {
                        $unwind: {
                            path: '$extends',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'history',
                            localField: 'extends.gid',
                            foreignField: 'gid',
                            as: 'history'
                        }
                    },
                    {
                        $unwind: {
                            path: '$history',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            position: 1,
                            hours: 1,
                            nation: 1,
                            from: 1,
                            time: 1,
                            status: 1,
                            shift: 1,
                            fee: 1,
                            user: 1,
                            uid: 1,
                            isExtended: 1,
                            isApprove: 1,
                            category: 1,
                            createdAt: 1,
                            date: 1,
                            dateCreated: 1,
                            auid: 1,
                            maximumApplicants: '$extends.maximumApplicants',
                            numberofApplicants: {
                                $filter: {
                                    input: '$extends.applicants',
                                    as: 's',
                                    cond: [
                                        {
                                            $eq: ['$$s.status', 'Applying']
                                        },
                                        '$s.auid',
                                        []
                                    ]
                                }
                            }
                        }
                    }
                ])
                    .match({
                        uid: mongoose.Types.ObjectId(id)
                        // status: {$in: ['Waiting', 'Applying']} MQ: 03-09-2022 Fixed issue of pending gigs not showing
                    })
                    .exec();

                gigs = gigs.filter((obj) => {
                    return !moment(obj.time).isBefore(moment(), 'day');
                });

                gigs = await Promise.all(
                    gigs.map(async (obj) => {
                        if (!obj.isExtended) {
                            const account = await Account.find({ uuid: mongoose.Types.ObjectId(obj.auid) })
                                .lean()
                                .exec();

                            // add applicant list since to prevent re-apply of jobsters
                            if (obj.status === 'Applying' || obj.status === 'Waiting') {
                                const history = await History.find(
                                    {
                                        gid: mongoose.Types.ObjectId(obj._id),
                                        status: ['Waiting', 'Applying']
                                    },
                                    { uid: 1, status: 1, _id: 1, createdAt: 1 }
                                )
                                    .find()
                                    .lean();

                                return {
                                    ...obj,
                                    applicants: history,
                                    account
                                };
                            }

                            return {
                                ...obj,
                                account
                            };
                        } else {
                            return obj;
                        }
                    })
                );

                client = {
                    details: user ? user[0] : {},
                    gigs: gigs,
                    gigCategory: [...new Set(gigs.map((item) => item.category))]
                };
            }
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Client.get_client_gigs', null, id, 'GET');

            return res.status(502).json({ success: false, msg: 'User to get details' });
        }

        return res.status(200).json(client);
    }
};

module.exports = controllers;
