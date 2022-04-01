
require('dotenv').config();

const {FRONTEND_URL} = process.env

const forgotPassword = (token) => {
    return '<html><body><div style="font-family: inherit; text-align: inherit"><span style="font-family: helvetica, sans-serif; font-size: 18px">You are receiving this because you (or someone else) have requested the reset of the password for your account.&nbsp;</span></div> <div style="font-family: inherit; text-align: inherit"><br></div><div style="font-family: inherit; text-align: inherit"><span style="font-family: helvetica, sans-serif; font-size: 18px">Please click on the following link, or paste this into your browser to complete the process</span><span style="font-family: helvetica, sans-serif; font-size: 18px; color: #0085ff"> </span><a href="'+FRONTEND_URL+'/reset-password/?token='+token+'" title="Link"><span style="font-family: helvetica, sans-serif; font-size: 18px; color: #0085ff">Link</span></a><span style="font-family: helvetica, sans-serif; font-size: 18px">.&nbsp;</span></div> <div style="font-family: inherit; text-align: inherit"><br></div><div style="font-family: inherit; text-align: inherit"><span style="font-family: helvetica, sans-serif; font-size: 18px">If you did not request this, please ignore this email and your password will remain unchanged.</span></div></body></html>'
}

module.exports = forgotPassword