const Category = require('./../../models/Category');

const logger = require('../../services/logger');

const {BUCKET_URL} = process.env;

var controllers = {
    get_category: async function (req, res) {
        const {id} = req.params;
        let category;
        try {
            category = await Category.findById(id).lean().exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Category.get_category', null, id, 'GET');

            return res.status(502).json({success: false, msg: 'Unable to get category'});
        }

        return res.status(200).json(category);
    },
    get_categories: async function (req, res) {
        let categories;
        try {
            categories = await Category.find({}).lean().exec();
        } catch (error) {
            console.error(error);
            await logger.logError(error, 'Categories.get_categories', null, null, 'GET');

            return res.status(502).json({success: false, msg: 'Unable to get categories'});
        }

        let category = categories.map((v, k) => {
            v.image = BUCKET_URL + v.image;
            return v;
        });

        return res.status(200).json(category);
    }
};

module.exports = controllers;
