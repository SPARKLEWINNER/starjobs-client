const jwt = require('jsonwebtoken'); // to generate signed token
const User = require('./../../models/User');
const Client = require('./../../models/Client');
const Account = require('./../../models/Account');
const mongoose = require('mongoose');

const mailer = require('../../services/mailer');
const sms = require('../../services/sms');
const logger = require('../../services/logger');
const requestToken = require('../../services/token');
const uuid = require('uuid').v1;
const crypto = require('crypto');

var controllers = {
    require_sign_in: function (req, res, next) {
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });

        token = token.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded_token) => {
            if (err)
                return res.status(401).json({
                    success: false,
                    is_authorized: false,
                    msg: 'Not authorized'
                });

            next();
        });
    },
    require_admin_access: function (req, res, next) {
        let token = req.headers['authorization'];
        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });

        token = token.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded_token) => {
            if (err)
                return res.status(401).json({
                    success: false,
                    is_authorized: false,
                    msg: 'Not authorized'
                });
            let user = await User.find({ _id: mongoose.Types.ObjectId(decoded_token.id) })
                .lean()
                .exec();
            if (!user || user[0].accountType !== 99)
                return res.status(401).json({
                    success: false,
                    is_authorized: false,
                    msg: 'Not authorized'
                });

            next();
        });
    },
    is_authenticated: function (req, res, next) {
        let token = req.headers['authorization'];

        if (!token || typeof token === undefined)
            return res.status(401).json({ success: false, is_authorized: false, msg: 'Not authorized' });

        token = token.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded_token) => {
            if (err) {
                return res.status(401).json({
                    error: 'Unauthorized'
                });
            }

            let user = await User.find({
                _id: mongoose.Types.ObjectId(decoded_token.id)
            })
                .lean()
                .exec();

            if (!user) {
                return res.status(401).json({
                    error: 'Unable to access'
                });
            }

            next();
        });
    },
    sign_in: async function (req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, msg: `Missing email or password field!` });
            return;
        }
        try {
            const user = await User.login(email, password);
            if (!user) {
                res.status(400).json({ success: false, msg: `Invalid credentials!` });
                return;
            }

            user.hashed_password = user.salt = undefined;

            let { accessToken: token, refreshToken } = requestToken.create_token(user._id);

            res.cookie('jwt', token, { expire: new Date() + 9999 });
            if (user.isActive) {
                if (user.accountType === 0) {
                    const account = await Account.find({ uuid: mongoose.Types.ObjectId(user._id) }, { photo: 1 })
                        .lean()
                        .exec();

                    return res.json({
                        token,
                        refreshToken,
                        ...user,
                        photo: account[0].photo
                    }); // freelancer
                } else {
                    const client = await Client.find({ uid: mongoose.Types.ObjectId(user._id) }, { photo: 1 })
                        .lean()
                        .exec();
                    return res.json({
                        token,
                        refreshToken,
                        ...user,
                        photo: client[0].photo,
                        isClient: true
                    }); // client
                }
            }

            if (user.accountType === 0) {
                return res.json({ token, refreshToken, ...user, photo: undefined }); // freelancer
            } else {
                return res.json({ token, refreshToken, ...user, isClient: true, photo: undefined }); // client
            }
        } catch (err) {
            console.log(err);
            await logger.logError(err, 'Auth.sign_in', null, null, 'POST');

            res.status(400).json({ success: false, msg: err });
        }
    },
    sign_up: async function (req, res) {
        const { email, password, accountType, name, phone } = req.body;

        if (!email || !password || accountType === null || accountType === undefined || !name || !phone) {
            res.status(400).json({ success: false, msg: `Missing email or password field!` });
            return;
        }

        const isExistingEmail = await User.find({ email: email }).lean().exec();
        const isExistingPhone = await User.find({ phone: phone }).lean().exec();

        if (isExistingEmail.length > 0)
            return res.status(400).json({
                success: false,
                msg: 'Email already exists'
            });
        if (isExistingPhone.length > 0)
            return res.status(400).json({
                success: false,
                msg: 'Phone number already exists'
            });

        try {
            let code = Math.floor(100000 + Math.random() * 900000);
            const new_user = new User({
                email,
                name,
                accountType,
                phone,
                verificationCode: code,
                password: password,
                dateCreated: new Date()
            });

            let result = await User.create(new_user);
            if (!result) {
                res.status(400).json({
                    success: false,
                    msg: 'Unable to sign up'
                });
            }

            sms.send_sms(phone, `Starjobs verification code ${code}`);
            mailer.send_mail({ email, verifyCode: code, type: 'sign_up' });

            let { accessToken: token, refreshToken } = requestToken.create_token(result._doc._id);
            res.json({ ...result._doc, token, refreshToken });
        } catch (err) {
            await logger.logError(err, 'Auth.sign_up', null, null, 'POST');

            res.status(400).json({ success: false, msg: err });
        }
    },
    resend_verification: async function (req, res) {
        const type = req.query.type;
        const { email } = req.body;

        let isExisting = await User.find({ email: email }).lean().exec();
        if (isExisting.length === 0)
            return res.status(400).json({
                success: false,
                msg: `Email doesn't exists`
            });

        if (!isExisting[0].verificationCode) {
            let new_code = Math.floor(100000 + Math.random() * 900000);
            await User.findOneAndUpdate({ email: email }, { verificationCode: new_code }, { new: true });
            isExisting[0].verificationCode = new_code;
            if (!isExisting)
                res.status(400).json({
                    success: false,
                    msg: `Unable to create verification code`
                });
        }

        try {
            if (type && type === 'sms') {
                let { phone: request_phone } = req.body;
                let phone;

                if (!isExisting[0].phone) {
                    const numberFormat =
                        String(request_phone).charAt(0) +
                        String(request_phone).charAt(1) +
                        String(request_phone).charAt(2);

                    if (numberFormat !== '+63') {
                        phone = '+63' + request_phone.substring(1);
                    }
                    await User.findOneAndUpdate({ email: email }, { phone: phone });
                } else {
                    phone = request_phone;
                }

                await sms.send_sms(phone, `Starjobs verification code ${isExisting[0].verificationCode}`);
            } else {
                await mailer.send_mail({ email, verifyCode: isExisting[0].verificationCode, type: 'sign_up' });
            }

            res.status(200).json({ success: true, msg: 'Request for verification code success' });
        } catch (err) {
            await logger.logError(err, 'Auth.resend_verification', null, null, 'POST');
            console.log(err);
            res.status(400).json({ success: false, msg: err });
        }
    },
    verify_code: async function (req, res) {
        const { code, email } = req.body;
        try {
            let isExisting = await User.find({ email: email, verificationCode: code }).lean().exec();
            if (isExisting.length === 0)
                return res.status(400).json({
                    success: false,
                    msg: `Invalid verification code`
                });

            const result = await User.findOneAndUpdate({ email: email }, { isVerified: true, verificationCode: null });
            if (!result)
                res.status(400).json({
                    success: false,
                    msg: `Unable to verify account ${email}`
                });

            res.status(200).json(isExisting[0]);
        } catch (err) {
            await logger.logError(err, 'Auth.verify_code', null, null, 'POST');

            res.status(400).json({ success: false, msg: err });
        }
    },
    sign_out: function (req, res) {
        res.clearCookie('jwt');
        res.json({ message: 'Sign out success' });
    },
    verify_refresh_token: function (req, res) {
        const { id, refreshToken } = req.body;
        const isValid = requestToken.verify_token(id, refreshToken);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid token,try login again' });
        }

        let { accessToken: token } = requestToken.create_token(id);

        return res.status(200).json({ success: true, token });
    },
    forgot_password: async function (req, res) {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({
                success: false,
                msg: `Email address is required`
            });

        const isExisting = await User.find({ email: email }).lean().exec();
        if (isExisting.length === 0)
            return res.status(400).json({
                success: false,
                msg: `` // Email doesn't exists
            });

        let token = requestToken.reset_token(email);

        await User.findOneAndUpdate(
            { email: email },
            { hashed_password: null, salt: null, resetToken: token.resetToken }
        )
            .lean()
            .exec();

        try {
            await mailer.send_mail({ email, token, type: 'forgot_password' });
            return res.json({ success: true, msg: 'Email for reset password sent.' });
        } catch (err) {
            console.log(err);
        }
    },
    reset_password: async function (req, res) {
        const { token, password: newPassword } = req.body;
        if (!token)
            return res.status(400).json({
                success: false,
                msg: `Reset token expired`
            });

        const current_user = await User.find({ resetToken: token }).lean().exec();
        if (current_user.length === 0)
            return res.status(400).json({
                success: false,
                msg: `` // Email doesn't exists
            });

        const user_salt = uuid();
        const encrypt_password = crypto.createHmac('sha1', user_salt).update(newPassword).digest('hex');

        await User.findOneAndUpdate(
            { resetToken: token },
            { hashed_password: encrypt_password, salt: user_salt, resetToken: null }
        )
            .lean()
            .exec();

        try {
            return res.json({ success: true, msg: 'Change password success.' });
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = controllers;
