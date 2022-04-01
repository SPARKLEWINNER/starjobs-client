const AWS = require('aws-sdk');
require('dotenv').config();
const request = require('request');
const HttpsProxyAgent = require('https-proxy-agent');
const logger = require('./../services/logger');
const forgotPassword = require('./emailTemplates/forgot.template.js');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(SG_KEY);
// const agent = new HttpsProxyAgent(
//     'http://u72febijyv5ebi:qd7pvxhq1xng42a7o3tgcjhnkl@us-east-static-07.quotaguard.com:9293'
// );
const { SG_EMAIL, MAILER, SG_KEY, QUOTASTATIC_USERNAME, QUOTASTATIC_PROXY } = process.env;

// function callback(error, response, body) {
//     console.log('error', error);
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     }
// }

const ses = new AWS.SES({
    accessKeyId: 'AKIA3GMN5RL2MXPORLXK',
    secretAccessKey: 'ssKOth8edgxR8qWNCKj+TM4E03RJKhYtV5gKCT4F',
    region: 'us-east-1'
});

let params = {
    Destination: {
        ToAddresses: ['eduardo.quintos23@gmail.com'] // replace with your destination email
    },
    Message: {
        Body: {
            Html: {
                // HTML Content for email
                Charset: 'UTF-8',
                Data: forgotPassword()
            }
        },
        Subject: {
            // Subject for email
            Charset: 'UTF-8',
            Data: 'SES email sending tutorial'
        }
    },
    Source: 'no-reply@starjobs.com.ph' // replace with your source email
};

var controller = {
    send_mail: async function (data) {
        let mail = {};
        switch (data.type) {
            case 'sign_up':
                mail = {
                    to: data.email,
                    from: `StarJobs Account Verification <${SG_EMAIL}>`,
                    subject: 'StarJobs Verification Code',
                    text: 'Some useless text',
                    html: `<p>Your verification code is ${data.verifyCode} \n\n  Have a Sparkling day.\n </p>`
                };
                break;
            case 'forgot_password':
                mail = {
                    Destination: {
                        ToAddresses: ["eduardo.quintos23@gmail.com"] // replace with your destination email
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
                            Data: 'SES email sending tutorial'
                        }
                    },
                    Source: SG_EMAIL // replace with your source email};
                };

                console.log(mail)
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
            /*
            sgMail
                .send(mail)
                .then((res) => {
                    console.log(res);
                    return res[0].statusCode;
                })
                .catch(async (error) => {
                    console.log(error);
                    await logger.logError(error, 'MAILER.send_mail.SEND_GRID', data, null, 'POST');
                    return;
                });

            var options = {
                method: 'POST',
                url: 'https://api.sendgrid.com/v3/mail/send',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${SG_KEY}`
                },
                body: JSON.stringify(mail)
            };

            await request.post(options, callback);
                */

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
