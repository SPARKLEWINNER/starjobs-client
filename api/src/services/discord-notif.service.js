const fetch = require('axios')
const mongoose = require('mongoose')
const moment = require('moment')
var controller = {
  send_endshift: async function (
    jobsterData,
    clientData,
    gigs,
    holidaySurge,
    nightSurge,
    gigExtension,
    late,
    jobsterFinal,
    computedFeeByHr,
    time,
    gigExtensionHr,
    nightSurgeHr
  ) {
    let lateByHour = parseFloat(late) / parseFloat(60)
    if (late === null || late === undefined) {
      lateByHour = 0
    }
    const lateDeduction = parseFloat(lateByHour * gigs.fee)

    const feeRate = parseFloat(gigs.fees.jobsterTotal * time)
    console.log(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' +
        nightSurgeHr
    )

    await fetch.post(`${process.env.DISCORD_URL}/${process.env.DISCORD_ENDSHIFT_KEY}`, {
      // method: 'post',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      username: `Gig Details  - End Shift`,
      avatar_url:
        'https://cdn.discordapp.com/avatars/1069382190800056340/c9a9e35eecc4bc6a825f85ccb0e3a207.webp?size=80',
      embeds: [
        {
          title: `**Client Gig End Shift**`,
          description: `${gigs.user[0].companyName}| ${gigs.location}| Client`,
          color: 15258703,
          fields: [
            {
              name: '',
              value: ``
            },
            {
              name: 'Details',
              value: `**Position:**\n**Fee:**\n**Jobster Assigned:**\n**Shift:**\n**Start:**\n**End:**\n**Hours:**\n**Gig Fee Rate:**\n**Late:**\n**Late Deduction:**\n**Gig Extension:**\n**Gig Extension Fee:**\n**Night Surge:**\n**Night Surge Fee:**\n**Holiday Surge:**\n\n**Jobster Total:**`,
              inline: true
            },
            {
              name: '-',
              value: `${gigs.position}\n${gigs.fee}\n${jobsterData[0].firstName} ${jobsterData[0].lastName}\n${
                gigs.shift
              }\n${moment(gigs.from).format('MMMM Do YYYY, h:mm:ss a')}\n${moment(gigs.time).format(
                'MMMM Do YYYY, h:mm:ss a'
              )}\n${time}\nPhp ${parseFloat(feeRate).toFixed(2)} \n${late ? `${late} mins` : 'none'}\n-Php ${parseFloat(
                lateDeduction
              ).toFixed(2)} \n${parseFloat(gigExtensionHr).toFixed(2)} hours \nPhp ${parseFloat(gigExtension).toFixed(
                2
              )} \n ${parseFloat(nightSurgeHr).toFixed(2)} hours \nPhp ${parseFloat(nightSurge).toFixed(
                2
              )}\nPhp ${parseFloat(holidaySurge).toFixed(2)}\n\nPhp ${parseFloat(jobsterFinal).toFixed(2)}\n `,
              inline: true
            }
          ],
          footer: {
            text: `${moment().format('MMM-DD-YYYY hh:mm A')}`,
            icon_url:
              'https://images-ext-1.discordapp.net/external/KfTbvCiVmFUlsvw_NRHZP5ttamV6eSRStISSJuSgkRI/https/app.starjobs.com.ph/icons/icon-512x512.png'
          }
        }
      ]
    })
  }
}

module.exports = controller
