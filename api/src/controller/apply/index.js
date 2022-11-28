const mongoose = require('mongoose');
const { Types } = mongoose;

const Gigs = require('./../../models/Gigs');
const Account = require('./../../models/Account');

const { getSpecificData } = require('../../services/validateExisting');

const service = require('./services');

var controllers = {
    gig_apply: async function (req, res, next) {
        const { uid, status } = req.body;
        const { id } = req.params;
        await getSpecificData({ uuid: Types.ObjectId(uid) }, Account, 'Account', uid);

        let gigs = await Gigs.find({ _id: Types.ObjectId(id) })
            .lean()
            .exec();

        if (!gigs) res.status(400).json({ success: false, msg: 'Gig not found' }); // gig not found
        gigs = gigs.pop();
        if (status !== 'Applying' || gigs.status == 'Contracts') {
            switch (gigs.gigFeeType) {
                case 'Commission':
                    return await service.contract(req, res, next);
                default:
                    return await service.default(req, res, next);
            }
        }

        return await service.default(req, res, next);
    }
};

module.exports = controllers;
