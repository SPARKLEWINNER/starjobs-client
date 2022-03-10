const mongoose = require('mongoose');
require('dotenv').config();

let db;
mongoose.Promise = global.Promise;
const connectToDatabase = async () => {
    try {
        db = await mongoose.connect(
            process.env.MONGODB_KEY,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false
            },
            {connectTimeoutMS: 30000},
            {keepAlive: 1}
        );
        console.log(`Database connected ::: ${db.connection.host}`);
    } catch (error) {
        console.error(`Error::: ${error.message}`);
        process.exit(1);
    }
};

const disconnectToDatabase = async () => {
    try {
        db.disconnect();
        console.log(`Database disconnected`);
    } catch (error) {
        console.error(`Error::: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {connectToDatabase, disconnectToDatabase};
