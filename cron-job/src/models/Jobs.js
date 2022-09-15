const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const collectionName = 'jobs';

const jobsData = {
    repeatTimes: Number,
    repeatEvery: [],
    gid: {
        type: Types.ObjectId,
        required: true,
        ref: 'Gigs'
    },
    uid: {
        type: Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    dateCreated: Date,
};

const jobsSchema = new Schema(jobsData, { timestamps: true });
module.exports = mongoose.model('Jobs', jobsSchema, collectionName);
