const fetch = require('axios');
const mongoose = require('mongoose');

const Gigs = require('./../../models/Gigs');
const Account = require('./../../models/Account');
const History = require('./../../models/History');
const User = require('./../../models/User');
const Extends = require('../../models/Extends');

const { getSpecificData } = require('../../services/validateExisting');
const logger = require('../../services/logger');

const { FCM_SERVER_KEY } = process.env;
const client = ['Applying', 'Confirm-Gig', 'On-the-way', 'Arrived', 'On-going', 'End-Shift', 'Cancelled'];
const freelancer = ['Accepted', 'Confirm-End-Shift', 'Confirm-Arrived'];

const { Types } = mongoose;

async function sendNotification(request, gigs, status) {
    let user;
    try {
        let messageList = [
            { status: 'Applying', type: '2', description: `Applicant has sent a gig request` },
            { status: 'Accepted', type: '1', description: `Congratulations, your gig has been accepted.` },
            { status: 'Confirm-Gig', type: '0', description: `Jobster has confirmed pushing thru the gig.` },
            { status: 'Arrived', type: '0', description: `The jobster has arrived.` },
            { status: 'Confirm-Arrived', type: '0', description: `The client have confirmed your arrival.` },
            { status: 'End-Shift', type: '0', description: `The jobster have Ended the shift` },
            {
                status: 'Confirm-End-Shift',
                type: '0',
                description: `You will receive your gig fee in the next three (3) days. Thank you for using Starjobs.`
            },
            {
                status: 'Cancelled',
                type: '0',
                description: `You will receive your gig fee in the next three (3) days. Thank you for using Starjobs.`
            }
        ];

        if (client.includes(status)) {
            user = await User.find({ _id: Types.ObjectId(gigs.uid) })
                .lean()
                .exec();
        } else if (freelancer.includes(status)) {
            let jobster_id = { _id: Types.ObjectId(request.uid) }; // client

            // individual gig postings
            if (status === 'Confirm-Arrived') {
                jobster_id = { _id: Types.ObjectId(gigs.auid) }; // jobster
            }

            user = await User.find(jobster_id).lean().exec();
        }

        user = user.pop();
        let message = messageList.filter((obj) => {
            if (obj.status === status) return obj;
        });

        // return still to process top level request.
        if (!message) return true;
        if (!user || !user.deviceId) return true;

        message = message.pop();
        console.log(message);

        await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'key=' + FCM_SERVER_KEY
            },
            data: {
                notification: {
                    title: message.description,
                    icon: 'https://app.starjobs.com.ph/images/72x72.png',
                    click_action: message.type
                },
                to: user.deviceId
            }
        });

        return true;
    } catch (error) {
        console.log(error);
        await logger.logError(error, 'Apply.send_notification', user.deviceId, null, 'FETCH');
    }
}

var controllers = {
    gig_apply: async function (req, res) {
        const { uid, status, actualTime, actualRate } = req.body;
        const { id } = req.params;
        await getSpecificData({ uuid: Types.ObjectId(uid) }, Account, 'Account', uid);

        const now = new Date();
        let updatedGig;
        const history_details = {
            status: status,
            gid: Types.ObjectId(id),
            date_created: now.toISOString(),
            uid: Types.ObjectId(uid),
            isExtended: false
        };

        try {
            let gigs = await Gigs.find({ _id: Types.ObjectId(id) })
                .lean()
                .exec();

            if (!gigs) res.status(400).json({ success: false, msg: 'Gig not found' }); // gig not found
            gigs = gigs.pop();

            if (gigs.isExtended) {
                // gig multiple applicants
                history_details.isExtended = true;

                const { maximumApplicants, applicants, additionalFees } = gigs;

                const acceptedApplicant =
                    applicants &&
                    Object.values(applicants).forEach((obj) => {
                        if (obj.status === 'Accepted') return obj;
                    });

                if (acceptedApplicant && acceptedApplicant.length >= maximumApplicants)
                    return res.status(202).json({
                        success: false,
                        message: 'Gig already reached the number of applicants to be accepted.'
                    });

                if (status !== 'Accepted') {
                    await Extends.findOneAndUpdate(
                        { gigId: Types.ObjectId(gigs._id) },
                        {
                            $push: {
                                applicants: {
                                    auid: Types.ObjectId(uid),
                                    status: status,
                                    date_created: now.toISOString(),
                                    additionalFees: additionalFees
                                }
                            }
                        }
                    );
                } else {
                    await Extends.findOneAndUpdate(
                        {
                            gigId: Types.ObjectId(gigs._id),
                            'applicants.auid': Types.ObjectId(uid)
                        },
                        {
                            status: status
                        }
                    );
                }
            } else {
                // gig individual acceptance
                if (status === 'Accepted') {
                    await Gigs.findOneAndUpdate(
                        { _id: Types.ObjectId(id) },
                        {
                            auid: Types.ObjectId(uid),
                            status: status
                        }
                    );
                } else {
                    if (status === 'End-Shift') {
                        await Gigs.findOneAndUpdate(
                            { _id: Types.ObjectId(id) },
                            {
                                status: status,
                                fees: { ...gigs.fees, proposedWorkTime: actualTime, proposedRate: actualRate }
                            }
                        );
                    } else {
                        await Gigs.findOneAndUpdate({ _id: Types.ObjectId(id) }, { status: status });
                    }
                }
            }

            let history = new History(history_details);
            await History.create(history);

            await sendNotification(req.body, gigs, status);
            updatedGig = gigs;
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Apply.gig_apply', req.body, id, 'PATCH');

            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        return res.status(200).json(updatedGig);
    }
};

module.exports = controllers;
