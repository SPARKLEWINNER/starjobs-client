const mongoose = require('mongoose');
const { Schema } = mongoose;
const collectionName = 'appSettings';
const data = new Schema({
    appVersion: String
});

const appSettingsSchema = new Schema(data, { timestamps: true });
module.exports = mongoose.model('AppSettings', appSettingsSchema, collectionName);
