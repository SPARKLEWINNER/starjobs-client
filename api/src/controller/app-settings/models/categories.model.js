const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const collectionName = 'categories';
const data = new Schema({
    name: String,
    image: String,
    sortOrder: Number,
    dateCreated: Date,
    uid: { type: Types.ObjectId, ref: 'Users' },
    slug: String,
    status: {
        type: Number,
        default: 0
    }
});

const categorySchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('Category', categorySchema, collectionName);
