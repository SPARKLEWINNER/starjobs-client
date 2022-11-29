require('dotenv').config();

const signUp = (verification_code) => {
    const template =
        '<html>' +
        ' <body>' +
        ' <div style="font-family: inherit; text-align: inherit"><span style="font-family: helvetica, sans-serif; font-size: 18px">You`re verification code.&nbsp;</span></div>' +
        ' <div style="font-family: inherit; text-align: inherit"><br></div>' +
        ' <div style="font-family: inherit; text-align: inherit"><span style="font-family: helvetica, sans-serif; font-size: 18px">Please click on the following link, or paste this into your browser to complete the process</span><span style="font-family: helvetica, sans-serif; font-size: 18px; color: #0085ff"> </span>' +
        verification_code +
        '<span style="font-family: helvetica, sans-serif; font-size: 18px">.&nbsp;</span></div>' +
        ' <div style="font-family: inherit; text-align: inherit"><br></div> ' +
        '</body>' +
        '</html>';
    return template;
};

module.exports = signUp;
