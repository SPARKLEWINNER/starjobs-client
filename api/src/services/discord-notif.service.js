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
    time
  ) {
    let lateByHour = parseFloat(late) / parseFloat(60)
    if (late === null || late === undefined) {
      lateByHour = 0
    }
    const lateDeduction = parseFloat(lateByHour * gigs.fee)

    const feeRate = parseFloat(gigs.fees.jobsterTotal * time)

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
          description: `${clientData[0].firstName} ${clientData[0].lastName}| Client`,
          color: 15258703,
          fields: [
            {
              name: '',
              value: ``
            },
            {
              name: 'Position',
              value: `${gigs.position} `,
              inline: true
            },
            {
              name: 'Fee',
              value: `${gigs.fee} `,
              inline: true
            },
            {
              name: 'Jobster Assigned',
              value: `${jobsterData[0].firstName} ${jobsterData[0].lastName}`
            },
            {
              name: 'Shift',
              value: `${gigs.shift}`
            },
            {
              name: 'Late',
              value: `${gigs.late ? `${gigs.late}` : 'none'}`
            },
            {
              name: 'Start',
              value: `${moment(gigs.from).format('MMMM Do YYYY, h:mm:ss a')} `,
              inline: true
            },
            {
              name: 'End',
              value: `${moment(gigs.time).format('MMMM Do YYYY, h:mm:ss a')}  `,
              inline: true
            },
            {
              name: 'Hours',
              value: `${time} `
            },
            {
              name: 'Gig Fee Rate',
              value: ` `,
              inline: true
            },
            {
              name: '',
              value: `Php ${parseFloat(feeRate).toFixed(2)} \n`,
              inline: true
            },
            {
              name: '',
              value: ``
            },
            {
              name: 'Late Deduction',
              value: ``,
              inline: true
            },
            {
              name: '',
              value: `-Php ${parseFloat(lateDeduction).toFixed(2)} \n`,
              inline: true
            },
            {
              name: '',
              value: ``
            },
            {
              name: 'Gig Extension',
              value: ``,
              inline: true
            },
            {
              name: '',
              value: `Php ${parseFloat(gigExtension).toFixed(2)} \n`,
              inline: true
            },
            {
              name: '',
              value: ``
            },
            {
              name: 'Night Surge',
              value: ` `,
              inline: true
            },

            {
              name: '',
              value: `Php ${parseFloat(nightSurge).toFixed(2)} `,
              inline: true
            },
            {
              name: '',
              value: ``
            },
            {
              name: 'Holiday Surge',
              value: ``,
              inline: true
            },
            {
              name: '',
              value: `Php ${parseFloat(holidaySurge).toFixed(2)}`,
              inline: true
            },
            // {
            //   name: '',
            //   value: ``
            // },
            {
              name: 'Jobster Total',
              value: ` `
              // inline: true
            },
            {
              name: '',
              value: `Php ${parseFloat(jobsterFinal).toFixed(2)}`
              // inline: true
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
