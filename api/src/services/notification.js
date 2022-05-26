const Notification = require('../models/Notification');
const User = require('../models/User');

const logger = require('./logger')

var controller = {
    globalNotification: async function (additionalData) {
        const jobster = await User.aggregate([
            {
                $lookup: {
                    localField: '_id',
                    from: 'account',
                    foreignField: 'uuid',
                    as: 'account'
                }
            },
            {
                $unwind: {
                    path: '$account',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    'account.presentCity': { $regex: new RegExp(additionalData.location, "i") }
                }
            }
        ])
            .match({
                accountType: 0,
                isActive: true,
                isVerified: true
            })
            .exec();

        let targetUsers = [];
        if (jobster && jobster.length > 1) {
            await jobster.forEach((item) => {
                targetUsers.push(item._id);
            });
        } else {
            targetUsers.push(jobster[0]._id);
        }

        const notificationInput = new Notification({
            title: 'A gig offer nearby is posted',
            body: 'Visit the client to get the gig',
            targetUsers: targetUsers,
            type: 'GigNotif',
            target: 'Selected',
            additionalData: JSON.stringify(additionalData)
        });

        try {
            await Notification.create(notificationInput);
        } catch (err) {
            await logger.logError(error, 'Notifications.globalNotification', null, additionalData.user[0]._id, 'POST');
        }
    }
};

module.exports = controller;
