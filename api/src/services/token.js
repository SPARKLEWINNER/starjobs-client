const jwt = require('jsonwebtoken');
const maxAge = 3 * 24 * 60 * 60;

var controller = {
    create_token: function (id) {
        let accessToken = jwt.sign({id}, process.env.JWT_SECRET, {});
        let refreshToken = jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET, {});
        return {accessToken, refreshToken};
    },
    verify_token: function (id, token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            return decoded.id === id;
        } catch (error) {
            // console.error(error);
            return false;
        }
    }
};

module.exports = controller;
