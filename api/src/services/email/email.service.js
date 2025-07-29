require('dotenv').config()

const AWS = require('aws-sdk')

const logger = require('../../common/loggers')

const forgotPassword = require('./templates/forgot.template.js')
const signUp = require('./templates/signup.template.js')
const moment = require('moment')

const {SG_EMAIL} = process.env
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const ses = new AWS.SES({
  accessKeyId,
  secretAccessKey,
  region
})

function generateCSV(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return ''

  const headers = [
    'Position',
    'Jobster',
    'DatePosted',
    'Hours',
    'Break',
    'Location',
    'From',
    'To',
    'Fee',
    'Late Minutes',
    'Gig Extension Hours',
    'Night Surge Hours',
    'GigExtension',
    'NightSurge',
    'HolidaySurge',
    'ServiceCost'
  ]

  const rows = dataArray.map((item) => {
    return [
      item.position || '',
      `${item.account?.[0]?.firstName || ''} ${item.account?.[0]?.lastName || ''}`,
      formatDateWithTime(item.dateCreated),
      item.hours || '',
      item.breakHr || '',
      item.location || '',
      formatDateWithTime(item.from),
      formatDateWithTime(item.time),
      item.fee || '',
      item.late || '',
      item.fees?.proposedGigExtensionHr || '',
      item.fees?.proposedNightSurgeHr || '',
      item.fees?.gigExtension || '',
      item.fees?.nightSurge || '',
      item.fees?.holidaySurge || '',
      item.fees?.serviceCost || ''
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(',')
  })

  console.log('🚀 ~ rows:', rows)

  return [headers.join(','), ...rows].join('\n')
}

const formatDateWithTime = (date) => (date ? moment(date).format('MMM-DD-YYYY hh:mm A') : '')

var controller = {
  send_mail: async function (data) {
    let mail = {}
    switch (data.type) {
      case 'sign_up':
        mail = {
          Destination: {
            ToAddresses: [data.email] // replace with your destination email
          },
          Message: {
            Body: {
              Html: {
                // HTML Content for email
                Charset: 'UTF-8',
                Data: signUp(data.verifyCode)
              }
            },
            Subject: {
              // Subject for email
              Charset: 'UTF-8',
              Data: 'Verification code - Starjobs'
            }
          },
          Source: SG_EMAIL // replace with your source email};
        }
        break
      case 'forgot_password':
        mail = {
          Destination: {
            ToAddresses: [data.email] // replace with your destination email
          },
          Message: {
            Body: {
              Html: {
                // HTML Content for email
                Charset: 'UTF-8',
                Data: forgotPassword(data.token.resetToken)
              }
            },
            Subject: {
              // Subject for email
              Charset: 'UTF-8',
              Data: 'Forgot password Request- Starjobs'
            }
          },
          Source: SG_EMAIL // replace with your source email};
        }
        break
      case 'request_history': {
        const {email, historyData} = data
        console.log('🚀 ~ historyData:', historyData)
        const csvContent = generateCSV(historyData)
        const attachment = Buffer.from(csvContent).toString('base64')

        const boundary = `----=_Part_${Date.now()}`
        const subject = 'Request History Report - Starjobs'

        const rawMessage = [
          `From: Starjobs <${SG_EMAIL}>`,
          `To: ${email}`,
          `Subject: ${subject}`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/mixed; boundary="${boundary}"`,
          '',
          `--${boundary}`,
          `Content-Type: text/html; charset="UTF-8"`,
          `Content-Transfer-Encoding: 7bit`,
          '',
          `<!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8" />
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      color: #333;
                      margin: 0;
                      padding: 0;
                      background-color: #f6f9fc;
                    }
                    .container {
                      max-width: 600px;
                      margin: 30px auto;
                      background: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                      padding: 40px;
                    }
                    .header {
                      font-size: 22px;
                      font-weight: bold;
                      color: #2c3e50;
                      margin-bottom: 20px;
                    }
                    .content {
                      font-size: 16px;
                      line-height: 1.6;
                      color: #555;
                    }
                    .footer {
                      margin-top: 30px;
                      font-size: 12px;
                      color: #999;
                      border-top: 1px solid #eee;
                      padding-top: 10px;
                    }
                    .brand {
                      color: #4a90e2;
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">📄 Request History Report</div>
                    <div class="content">
                      <p>Hi there,</p>
                      <p>
                        Please find your request history attached as a CSV file. You can open it using Excel, Google Sheets, or any spreadsheet software.
                      </p>
                      <p>
                        If you didn’t request this, please ignore this email.
                      </p>
                      <p>Thanks,<br /><span class="brand">Starjobs Team</span></p>
                    </div>
                    <div class="footer">
                      This is an automated email. Do not reply directly to this message.
                    </div>
                  </div>
                </body>
              </html>`,
          '',
          `--${boundary}`,
          `Content-Type: text/csv; name="request-history.csv"`,
          `Content-Disposition: attachment; filename="request-history.csv"`,
          `Content-Transfer-Encoding: base64`,
          '',
          attachment,
          '',
          `--${boundary}--`
        ].join('\n')

        mail = {
          RawMessage: {Data: rawMessage}
        }
        break
      }
      default:
        mail = {
          to: `emquintos.developer@gmail.com`,
          from: `Sparkle Account Change Password <${SG_EMAIL}>`,
          subject: 'Change Password Request',
          text: 'Some useless text',
          html: `<p>You are receiving this because you have successfuLly change password for your account.\n\n  Have a Sparkling day.\n </p>`
        }
        break
    }
    try {
      let sendEmail
      if (mail.RawMessage) {
        sendEmail = ses.sendRawEmail(mail).promise()
      } else {
        sendEmail = ses.sendEmail(mail).promise()
      }

      // sendEmail
      await sendEmail
        .then((data) => console.log('response ==>', data))
        .catch((err) => console.error('email sending error: ', err))
    } catch (error) {
      console.log(error)
      await logger.logError(error, 'MAILER.send_mail.SEND_GRID', data, null, 'POST')
      return false
    }
  }
}

module.exports = controller
