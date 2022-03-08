const AWS = require('aws-sdk');
require('dotenv').config();
const {AWS_SES_ACCESS_KEY_ID, AWS_SES_ACCESS_KEY, REGION, BUCKET_URL, BUCKET} = process.env;
var s3 = new AWS.S3({
    accessKeyId: AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: AWS_SES_ACCESS_KEY,
    region: REGION,
    signatureVersion: 'v4'
});

const pre_types = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/jpg': '.jpg',
    'image/gif': '.gif',
    'text/csv': '.csv',
    'text/doc': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/xlsx': '.xlsx',
    'application/pdf': '.pdf'
};

const getUploadURL = async function (_format, _type) {
    let actionId = Date.now();

    var s3Params = {
        Bucket: BUCKET,
        Key: `${actionId}${_type}`,
        ContentType: `${_format}`,
        //    CacheControl: 'max-age=31104000',
        ACL: 'public-read' // Optional if you want the object to be publicly readable
    };

    return new Promise((resolve, reject) => {
        // Get signed URL
        let uploadURL = s3.getSignedUrl('putObject', s3Params);
        resolve({
            statusCode: 200,
            isBase64Encoded: false,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadURL: uploadURL,
                photoFilename: `${actionId}${_type}`
            })
        });
    });
};

var controllers = {
    create_url: async function (req, res) {
        const _type = pre_types[req.headers['content-type']];
        const result = await getUploadURL(req.headers['content-type'], _type);
        if (result.statusCode !== 200) return res.status(502).json({success: false, msg: 'User not found'});

        return res.status(200).json(JSON.parse(result.body));
    }
};

module.exports = controllers;
