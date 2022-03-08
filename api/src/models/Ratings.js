const mongoose = require('mongoose');
const {Schema, Types} = mongoose;
const collectionName = 'ratings';
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
    rates: {
        type: Object,
        required: true
    },
    isClient: {
        type: Boolean,
        default: false
    },
    isJobster: {
        type: Boolean,
        default: false
    },
    comments: {
        type: String,
        default: null
    },
    skipped: {
        type: Boolean,
        default: false
    },
    dateCreated: Date
};

const ratingSchema = new Schema(data, {timestamps: true});
module.exports = mongoose.model('Ratings', ratingSchema, collectionName);
