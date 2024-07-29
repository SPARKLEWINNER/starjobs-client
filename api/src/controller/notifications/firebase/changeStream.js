const mongoose = require('mongoose');
const {messaging} = require('./admin');
const FCMTOKEN = require('../../users/models/fcm-tokens')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');

    // Start listening to changes in the collection
    const collection = mongoose.connection.collection('notifications'); // Replace with your collection name
    const changeStream = collection.watch();

    changeStream.on('change', async (change) => {

        if (change.operationType === 'insert' || change.operationType === 'update') {
            // Notify target users based on the change
            await notifyUsers(change.fullDocument);
        }
    });
}).catch(err => console.error('MongoDB connection error:', err));

const notifyUsers = async (updatedDocument) => {
    if(updatedDocument && updatedDocument.targetUsers.length > 0){
        try {
            const fcm = await FCMTOKEN.find({ userId: {$in: updatedDocument?.targetUsers}, device: 'pwa'}).select('fcmToken')
            // Fetch target users' FCM tokens from the database
            // const tokens = users.map(user => user.fcmToken);
            if (fcm && fcm.length > 0) {
                // Map tokens to message payloads
                const messages = fcm.map((token) => ({
                    notification: {
                        title: updatedDocument.title.toString(),
                        body: updatedDocument.body.toString(),
                    },
                    token: token.fcmToken,
                }));

                // Send all messages and wait for all promises to resolve
                const responses = await Promise.all(messages.map((message) => messaging.send(message)));

                // Log successful responses
                responses.forEach((response, index) => {
                    console.log(`Successfully sent message to token ${fcm[index].fcmToken}:`, response);
                });
            } else {
                console.log('No tokens available to send notifications');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }
};