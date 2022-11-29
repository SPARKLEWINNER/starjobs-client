const AWS = require('aws-sdk')
require('dotenv').config()

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_ACCESS_KEY,
  region: process.env.REGION,
  signatureVersion: 'v4'
})

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
}

const getUploadURL = async function (_format, _type) {
  let actionId = Date.now()

  var s3Params = {
    Bucket: process.env.BUCKET,
    Key: `${actionId}${_type}`,
    ContentType: `${_format}`,
    ACL: 'public-read'
  }

  return new Promise((resolve) => {
    let uploadURL = s3.getSignedUrl('putObject', s3Params)
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
    })
  })
}

var controllers = {
  create_url: async function (req, res) {
    const _type = pre_types[req.headers['content-type']]
    const result = await getUploadURL(req.headers['content-type'], _type)
    if (result.statusCode !== 200) return res.status(502).json({success: false, msg: 'User not found'})

    return res.status(200).json(JSON.parse(result.body))
  }
}

module.exports = controllers
