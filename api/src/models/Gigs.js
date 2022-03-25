const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const collectionName = 'gigs';
const userSchema = new Schema(
    {
        _id: { type: Types.ObjectId, ref: 'Client' },
        location: String,
        companyName: String,
        website: String,
        thumbnail: String,
        rateType: String
    },
    { timestamps: true }
);

const gigsData = {
    auid: { type: Types.ObjectId, ref: 'Client' },
    from: String,
    time: String,
    shift: String,
    hours: String,
    fee: String,
    date: String,
    breakHr: String,
    uid: {
        type: Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    category: String,
    position: String,
    isApprove: {
        type: Boolean,
        default: false
    },
    dateCreated: Date,
    user: [userSchema],
    status: {
        type: String,
        default: 'Waiting',
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
    statusMessage: {
        type: String
    },
    locationRate: {
        default: 'NCR',
        type: String,
        enum: [
            'NCR',
            'Provincial'
        ]
    },
    fees: {
        computedFeeByHr: String,
        voluntaryFee: String,
        premiumFee: String,
        transactionFee: String,
        grossGigFee: String,
        grossVAT: String,
        grossWithHolding: String,
        serviceCost: String,
        jobsterTotal: String,
    }
};

const gigsSchema = new Schema(gigsData, { timestamps: true });
module.exports = mongoose.model('Gigs', gigsSchema, collectionName);
