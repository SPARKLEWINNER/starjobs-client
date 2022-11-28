const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collectionName = 'guests';
const data = {
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        required: true
    }
};

const guestSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('Guest', guestSchema, collectionName);
