const jwt = require('jsonwebtoken'); // to generate signed token
const Account = require('./../../models/Account');
const Client = require('./../../models/Client');
const User = require('./../../models/User');
const History = require('./../../models/History');
const Ratings = require('./../../models/Ratings');
const mongoose = require('mongoose');
const { getSpecificData } = require('../../services/validateExisting');
const mailer = require('../../services/mailer');
const logger = require('../../services/logger');
const requestToken = require('../../services/token');

const now = new Date();

async function create_jobster_profile(id, data) {
    let result;
    const {
        firstName,
        lastName,
        middleInitial,
        gender,
        religion,
        civilStatus,
        citizenship,
        samePermanentAddress,
        presentBlkNo,
        presentZipCode,
        presentStreetName,
        presentCity,
        permanentBlkNo,
        permanentZipCode,
        permanentStreetName,
        permanentCity,
        emergencyName,
        emergencyContact,
        emergencyRelation
    } = data;

    const accountObj = new Account({
        uuid: mongoose.Types.ObjectId(id),
        firstName,
        lastName,
        middleInitial,
        gender,
        religion,
        civilStatus,
        citizenship,
        samePermanentAddress,
        presentBlkNo,
        presentZipCode,
        presentStreetName,
        presentCity,
        permanentBlkNo,
        permanentZipCode,
        permanentStreetName,
        permanentCity,
        emergencyName,
        emergencyContact,
        emergencyRelation,
        dateCreated: now.toDateString()
    });

    try {
        result = await Account.create(accountObj).catch((err) => console.log(err));

        if (result) {
            await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { isActive: true });
        }
    } catch (error) {
        await logger.logError(error, 'Accounts.post_account_details', accountObj, id, 'POST');
        return res.status(502).json({ success: false, msg: 'User not found' });
    }

    const updated_user = await User.find({ _id: mongoose.Types.ObjectId(id) })
        .lean()
        .exec();

    return {
        ...updated_user[0]
    };
}

async function personal_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists
    const {
        firstName,
        lastName,
        middleInitial,
        gender,
        religion,
        civilStatus,
        citizenship,
        samePermanentAddress,
        presentBlkNo,
        presentZipCode,
        presentStreetName,
        presentCity,
        permanentBlkNo,
        permanentZipCode,
        permanentStreetName,
        permanentCity,
        emergencyName,
        emergencyContact,
        emergencyRelation
    } = data;

    const details = {
        firstName,
        lastName,
        middleInitial,
        gender,
        religion,
        civilStatus,
        citizenship,
        samePermanentAddress,
        presentBlkNo,
        presentZipCode,
        presentStreetName,
        presentCity,
        permanentBlkNo,
        permanentZipCode,
        permanentStreetName,
        permanentCity,
        emergencyName,
        emergencyContact,
        emergencyRelation
    };

    const oldDetails = await Account.find({ uuid: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details);
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...account[0],
        photo: account.photo
    };
}

async function work_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists

    const details = {
        work: {
            ...data
        }
    };

    const oldDetails = await Account.find({ uuid: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details, {
            new: true
        })
            .lean()
            .exec();
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...account[0],
        photo: account.photo
    };
}

async function expertise_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists

    const details = {
        expertise: {
            ...data
        }
    };

    const oldDetails = await Account.find({ uuid: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details, {
            new: true
        })
            .lean()
            .exec();
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...account[0],
        photo: account.photo
    };
}

async function education_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists

    const details = {
        education: {
            ...data
        }
    };

    const oldDetails = await Account.find({ _id: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: account.photo
    };
}

async function rate_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists
    const details = {
        rate: {
            rateAmount: data?.rateAmount,
            rateType: data?.rateType
        },
        payment: {
            accountPaymentType: data?.accountType,
            acccountPaymentName: data?.accountName,
            acccountPaymentNumber: data?.accountNumber
        }
    };

    const oldDetails = await Account.find({ _id: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: account.photo
    };
}

async function photo_information(id, data) {
    let user, account;
    await getSpecificData({ uuid: id }, Account, 'User', id); // validate if data exists

    const details = {
        photo: data?.photo
    };

    const oldDetails = await Account.find({ _id: id }).lean().exec();

    try {
        account = await Account.findOneAndUpdate({ uuid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(account.uuid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Accounts.patch_account_details', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: account.photo
    };
}


// client


async function create_client_profile(id, data) {
    let result;
    const {
        firstName,
        lastName,
        middleInitial,
        email,
        companyName,
        brandName,
        location,
        website,
        companyPosition,
    } = data;

    const accountObj = new Client({
        uid: mongoose.Types.ObjectId(id),
        firstName,
        lastName,
        middleInitial,
        email,
        companyName,
        brandName,
        location,
        website,
        companyPosition,
        dateCreated: now.toDateString()
    });

    try {
        result = await Client.create(accountObj).catch((err) => console.log(err));

        if (result) {
            await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, { isActive: true });
        }
    } catch (error) {
        await logger.logError(error, 'Clients.create_client_profile', accountObj, id, 'POST');
        return res.status(502).json({ success: false, msg: 'User not found' });
    }

    const updated_user = await User.find({ _id: mongoose.Types.ObjectId(id) })
        .lean()
        .exec();

    return {
        ...updated_user[0]
    };
}

async function personal_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists
    const {
        firstName,
        lastName,
        middleInitial,
        email,
        companyName,
        brandName,
        location,
        website,
        companyPosition,
    } = data;

    const details = {
        firstName,
        lastName,
        middleInitial,
        email,
        companyName,
        brandName,
        location,
        website,
        companyPosition,
    };

    const oldDetails = await Client.find({ uid: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details);
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.personal_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...client[0],
        photo: client.photo
    };
}

async function contact_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists

    const details = {
        contact: {
            ...data
        }
    };

    const oldDetails = await Client.find({ uid: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details, {
            new: true
        })
            .lean()
            .exec();
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.contact_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...client[0],
        photo: client.photo
    };
}

async function industry_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists

    const details = {
        industry: {
            ...data
        }
    };

    const oldDetails = await Client.find({ uid: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details, {
            new: true
        })
            .lean()
            .exec();
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.expertise_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...client[0],
        photo: client.photo
    };
}

async function education_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists

    const details = {
        education: {
            ...data
        }
    };

    const oldDetails = await Client.find({ _id: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.education_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: client.photo
    };
}

async function rate_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists
    const details = {
        rate: {
            rateAmount: data?.rateAmount,
            rateType: data?.rateType
        },
        payment: {
            accountPaymentType: data?.accountType,
            acccountPaymentName: data?.accountName,
            acccountPaymentNumber: data?.accountNumber
        }
    };

    const oldDetails = await Client.find({ _id: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.rate_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: client.photo
    };
}

async function photo_client_information(id, data) {
    let user, client;
    await getSpecificData({ uid: id }, Client, 'User', id); // validate if data exists

    const details = {
        photo: data?.photo
    };

    const oldDetails = await Client.find({ _id: id }).lean().exec();

    try {
        client = await Client.findOneAndUpdate({ uid: id }, details, {
            new: true
        });
        user = await User.find({ _id: mongoose.Types.ObjectId(client.uid) })
            .lean()
            .exec();
        await logger.logAccountHistory(user[0].accountType, details, id, oldDetails[0]);
    } catch (error) {
        console.error(error);
        await logger.logError(error, 'Clients.photo_client_information', null, id, 'PATCH');
        return false;
    }

    return {
        ...user[0],
        photo: client.photo
    };
}

var controllers = {
    update_jobster_profile: async function (req, res) {
        const { id } = req.params;
        const user = User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec(); // validate if data exists
        if (!user || !user.length < 0) {
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        const isAccountExist = await Account.find({ uuid: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();
        let result = isAccountExist;
        if (isAccountExist.length === 0) {
            result = await create_jobster_profile(id, req.body);
        } else {
            switch (req.body.step) {
                case 'personal':
                    result = await personal_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'work':
                    result = await work_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'expertise':
                    result = await expertise_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'education':
                    result = await education_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'rate':
                    result = await rate_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'photo':
                    result = await photo_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                default:
                    break;
            }
        }

        return res.status(200).json(result);
    },
    update_client_profile: async function (req, res) {
        const { id } = req.params;
        const user = User.find({ _id: mongoose.Types.ObjectId(id) })
            .lean()
            .exec(); // validate if data exists
        if (!user || !user.length < 0) {
            return res.status(502).json({ success: false, msg: 'User not found' });
        }

        const isAccountExist = await Client.find({ uid: mongoose.Types.ObjectId(id) })
            .lean()
            .exec();
        let result = isAccountExist;
        if (isAccountExist.length === 0) {
            result = await create_client_profile(id, req.body);
        } else {
            switch (req.body.step) {
                case 'personal':
                    result = await personal_client_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'contact':
                    result = await contact_client_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'industry':
                    result = await industry_client_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'rate':
                    result = await rate_client_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                case 'photo':
                    result = await photo_client_information(mongoose.Types.ObjectId(id), req.body);
                    break;
                default:
                    break;
            }
        }

        return res.status(200).json(result);
    }
};

module.exports = controllers;
