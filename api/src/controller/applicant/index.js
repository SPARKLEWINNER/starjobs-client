const Gigs = require('./../../models/Gigs');
const Client = require('./../../models/Client');
const Account = require('./../../models/Account');
const History = require('./../../models/History');
const User = require('./../../models/User');
const Extends = require('./../../models/Extends');
const mongoose = require('mongoose');
const jwt_decode = require('jwt-decode');

const { getSpecificData } = require('../../services/validateExisting');
const logger = require('../../services/logger');

const { BUCKET_URL } = process.env;

async function individual_gig(id, details) {
    let gig;
    const history = await History.find({ gid: mongoose.Types.ObjectId(id) })
        .lean()
        .exec();

    if (details) {
        gig = await Promise.all(
            history.map(async (h) => {
                console.log('history', h);
                let users = await Account.find({ uuid: mongoose.Types.ObjectId(h.uid) })
                    .lean()
                    .exec();
                console.log('gig', users);
                if (users.length > 0) {
                    users[0].photo = BUCKET_URL + users[0].photo;
                    return {
                        ...h,
                        ...users[0]
                    };
                }
            })
        );
    }

    if (gig.includes(undefined)) return {};

    return {
        history,
        gig
    };
}

async function extended_gig(id) {
    let gigExtended = await Extends.find({ gigId: mongoose.Types.ObjectId(id) })
        .lean()
        .exec();

    if (!gigExtended) return false;
    gigExtended = gigExtended.pop();

    let gig = await Promise.all(
        // let gig = await Object.values(gigExtended.applicants).forEach(async (h) => {
        gigExtended.applicants.map(async (h) => {
            let users = await Account.find({ uuid: mongoose.Types.ObjectId(h.auid) })
                .lean()
                .exec();

            users = users.pop();
            users.photo = BUCKET_URL + users.photo;

            if (users) {
                return {
                    ...h,
                    ...users
                };
            }
        })
    );

    return {
        gigExtended,
        gig
    };
}

var controllers = {
    get_applicants: async function (req, res) {
        const { id } = req.params;
        await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, Gigs, 'Gigs', id);
        let details;
        try {
            let gigs = await Gigs.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            if (!gigs) return res.status(502).json({ success: false, msg: 'Gig not found' });
            gigs = gigs.pop();

            if (gigs.isExtended === undefined) {
                details = await individual_gig(id, gigs);
            } else {
                details = await extended_gig(id);
            }

            details = {
                ...gigs,
                applicants: details.gig
            };
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Applicants', null, id, 'GET');
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        return res.status(200).json(details);
    },
    get_applicant_details: async function (req, res) {
        const { id } = req.params;
        await getSpecificData({ _id: mongoose.Types.ObjectId(id) }, User, 'User', id);
        let account;
        try {
            let user = await User.find({ _id: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();
            account = await Account.find({ uuid: mongoose.Types.ObjectId(id) })
                .lean()
                .exec();

            account[0].email = user[0].email;
            account[0].deviceId = user[0].deviceId;
            account[0].accountType = user[0].accountType;
        } catch (error) {
            console.error(error);

            await logger.logError(error, 'Applicant', null, id, 'GET');
            return res.status(502).json({ success: false, msg: 'User not found' });
        }
        return res.status(200).json(account);
    },
    get_freelancer_list: async function (req, res) {
        let freelancers;
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });
        try {
            freelancers = await User.aggregate([
                {
                    $lookup: {
                        from: 'account',
                        localField: '_id',
                        foreignField: 'uuid',
                        as: 'details'
                    }
                }
            ])
                .match({
                    accountType: 0,
                    isActive: true,
                    isVerified: true
                })
                .sort({ createdAt: -1 })
                .limit(50)
                .exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Applicant.get_freelancer_list', null, null, 'GET');
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        return res.status(200).json(freelancers);
    }
};

module.exports = controllers;
