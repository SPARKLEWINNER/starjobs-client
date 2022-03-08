require('dotenv').config();
const request = require('request');
const fixieRequest = request.defaults({proxy: process.env.FIXIE_URL});
const fetch = require('node-fetch');
const logger = require('./../services/logger');
const sgMail = require('@sendgrid/mail');

const {SG_EMAIL, MAILER, SG_KEY} = process.env;
sgMail.setApiKey(SG_KEY);

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
                    to: data.email,
                    from: `StarJobs Forgot Password`,
                    subject: `StarJobs Password Request <${SG_EMAIL}>`,
                    text: 'Some useless text',
                    html: `<p>You are receiving this because you have requested for a password changed for your account.\n\n Your verification code is ${data.verifyCode} \n\n  Have a Sparkling day.\n </p>`
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
            sgMail
                .send(mail)
                .then((res) => {
                    return res[0].statusCode;
                })
                .catch(async (error) => {
                    await logger.logError(error, 'MAILER.send_mail.SEND_GRID', data, null, 'POST');
                    return;
                });
        } catch (err) {
            await logger.logError(error, 'MAILER.send_mail.SEND_GRID', data, null, 'POST');
            return false;
        }
    }
};

module.exports = controller;
