var controller = {
    send_sms: function (phone, message) {
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        client.messages
            .create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone
            })
            .then((message) => console.log(message.sid))
            .catch((err) => console.log(err));
    }
};

module.exports = controller;
