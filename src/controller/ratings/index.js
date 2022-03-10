const mongoose = require('mongoose');
const Gigs = require('./../../models/Gigs');
const Ratings = require('./../../models/Ratings.js');

const logger = require('../../services/logger');

var controllers = {
    post_rating_gig: async function (req, res) {
        const {id} = req.params;
        const {efficiency, onTime, completeness, showRate, comments, accountType, uid} = req.body;
        const now = new Date();

        const isGigExist = await Gigs.find({_id: mongoose.Types.ObjectId(id), status: 'Confirm-End-Shift'})
            .lean()
            .exec();

        if (!isGigExist || isGigExist.length === 0) {
            return res.status(502).json({success: false, msg: 'Gig not found'});
        }
        const ratingsObj = new Ratings({
            uid: mongoose.Types.ObjectId(isGigExist[0].auid),
            gid: mongoose.Types.ObjectId(id),
            rates: {
                efficiency: efficiency,
                onTime: onTime,
                completeness: completeness,
                showRate: showRate
            },
            isJobster: accountType === 0 ? true : false,
            isClient: accountType === 1 ? true : false,
            comments: comments || null,
            skipped: false,
            dateCreated: now.toISOString()
        });

        try {
            await Ratings.create(ratingsObj);
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Ratings.post_rating_gig', ratingsObj, gigId, 'POST');
            return res.status(502).json({success: false, msg: 'Rating unable to process'});
        }

        return res.status(201).json(ratingsObj);
    }
};

module.exports = controllers;
