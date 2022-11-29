const createError = require('http-errors');
const capitalize = (_str) => {
    return _str.charAt(0).toUpperCase() + _str.slice(1);
};

const getSpecificData = async (_params, _table, _origin, _id) => {
    let data;

    try {
        data = await _table.find(_params).lean().exec();
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(`${_origin}-${error}`);
    }

    if (!data) {
        throw new createError.NotFound(`${capitalize(_origin)} with ${_id} not found!`);
    }

    return data;
};

const scanDetails = async (_param, _table, _origin, _id) => {
    let data;
    try {
        data = await _table.find({_param: _id}).lean().exec();
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(`${_origin}-${error}`);
    }

    if (!data) {
        throw new createError.NotFound(`${capitalize(_origin)} with ${_id} not found!`);
    }

    return data;
};

const isExisting = async (_params, _table, _origin, _id) => {
    let data;
    try {
        data = await _table.exists(_params, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                return result;
            }
        });
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(`${_origin}-${error}`);
    }

    if (data) {
        throw new createError.NotFound(`${capitalize(_origin)} with ${_id} is already taken!`);
    }

    return false;
};

module.exports = {capitalize, getSpecificData, scanDetails, isExisting};
