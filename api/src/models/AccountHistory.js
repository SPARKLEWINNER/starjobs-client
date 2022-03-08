const mongoose = require('mongoose');
const {Schema, Types} = mongoose;
const accountHistorySchema = new Schema(
    {
        uid: {type: Types.ObjectId, ref: 'User'},
        details: Object,
        prevDetails: Object,
        accountType: Number,
        dateCreated: Date
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('AccountHistory', accountHistorySchema);
