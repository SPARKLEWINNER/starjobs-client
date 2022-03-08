const mongoose = require('mongoose');
const {Schema, Types} = mongoose;
const collectionName = 'history';
const data = {
    uid: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    gid: {
        type: Types.ObjectId,
        required: true,
        ref: 'Gigs'
    },
    dateCreated: Date,
    status: {
        type: String,
        enum: [
            'Waiting',
            'Applying',
            'Accepted',
            'Confirm-Gig',
            'On-the-way',
            'Arrived',
            'Confirm-Arrived',
            'On-going',
            'End-Shift',
            'Confirm-End-Shift',
            'Paid',
            'Complete',
            'No-Appearance',
            'Cancelled',
            'Archived'
        ]
    },
    readUser: {
        type: Boolean,
        default: false
    },
    readAuthor: {
        type: Boolean,
        default: false
    },
    isExtended: {
        type: Boolean,
        default: false
    }
};

const historySchema = new Schema(data, {timestamps: true});
module.exports = mongoose.model('History', historySchema, collectionName);
