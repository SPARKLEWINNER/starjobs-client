require('dotenv').config();

const AWS = require('aws-sdk');
const logger = require('./../services/logger');
const forgotPassword = require('./emailTemplates/forgot.template.js');
const signUp = require('./emailTemplates/signup.template.js');

const { SG_EMAIL } = process.env;

const ses = new AWS.SES({
    accessKeyId: 'AKIA3GMN5RL2MXPORLXK',
    secretAccessKey: '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',
    region: 'us-east-1'
});

var controller = {
    send_mail: async function (data) {
        let mail = {};
        switch (data.type) {
            case 'sign_up':
                mail = {
                    Destination: {
                        ToAddresses: [data.email] // replace with your destination email
                    },
                    Message: {
                        Body: {
                            Html: {
                                // HTML Content for email
                                Charset: 'UTF-8',
                                Data: signUp(data.verifyCode)
                            }
                        },
                        Subject: {
                            // Subject for email
                            Charset: 'UTF-8',
                            Data: 'Verification code - Starjobs'
                        }
                    },
                    Source: SG_EMAIL // replace with your source email};
                };
                break;
            case 'forgot_password':
                mail = {
                    Destination: {
                        ToAddresses: [data.email] // replace with your destination email
                    },
                    Message: {
                        Body: {
                            Html: {
                                // HTML Content for email
                                Charset: 'UTF-8',
                                Data: forgotPassword(data.token.resetToken)
                            }
                        },
                        Subject: {
                            // Subject for email
                            Charset: 'UTF-8',
                            Data: 'Forgot password Request- Starjobs'
                        }
                    },
                    Source: SG_EMAIL // replace with your source email};
                };
                break;
            default:
                mail = {
                    to: `emquintos.developer@gmail.com`,
                    from: `Sparkle Account Change Password <${SG_EMAIL}>`,
                    subject: 'Change Password Request',
                    text: 'Some useless text',
                    html: `<p>You are receiving this because you have successfuLly change password for your account.\n\n  Have a Sparkling day.\n </p>`
                };
                break;
        }
        try {
            const sendEmail = ses.sendEmail(mail).promise();

            sendEmail
                .then((data) => console.log('response ==>', data))
                .catch((err) => console.error('email sending error: ', err));
        } catch (err) {
            console.log(err);
            await logger.logError(error, 'MAILER.send_mail.SEND_GRID', data, null, 'POST');
            return false;
        }
    }
};

module.exports = controller;
