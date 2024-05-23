const axios = require('axios')

var controller = {
  send_sms: function (phone, message) {
    const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    client.messages
      .create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err))
  },
  cast_sms: async function (token, recipients, message) {
    console.log(recipients, 'recipients')
    const url = 'https://svc.app.cast.ph/api/announcement/send'
    const data = {
      MessageFrom: process.env.SENDER_ID,
      Message: message,
      Recipients: recipients,
      Tags: [],
      SendDate: null,
      Mask: process.env.SENDER_ID,
      HasUnsubscribeLink: false
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }

    try {
      const response = await axios.post(url, data, {headers})
      console.log(response.data)
    } catch (error) {
      console.error(error.response.data) // Log the response data for more details on the error
    }
  }
}

module.exports = controller
