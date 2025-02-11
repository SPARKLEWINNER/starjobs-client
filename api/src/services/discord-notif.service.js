const fetch = require('axios')
const mongoose = require('mongoose')
const moment = require('moment')
const momentTz = require('moment-timezone')

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

    const convertToPhilippinesTime = (date) => {
      return momentTz(date).tz('Asia/Manila').format('MMMM Do YYYY, h:mm:ss a')
    }

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
              }\n${convertToPhilippinesTime(gigs.from)}\n${convertToPhilippinesTime(
                gigs.time
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
            text: `${moment().tz('Asia/Manila').format('MMM-DD-YYYY hh:mm A')}`,
            icon_url:
              'https://images-ext-1.discordapp.net/external/KfTbvCiVmFUlsvw_NRHZP5ttamV6eSRStISSJuSgkRI/https/app.starjobs.com.ph/icons/icon-512x512.png'
          }
        }
      ]
    })
  },

  send_jobster_endshift: async function (jobsterData, clientData, gigs, late, time, gigExtensionHr, nightSurgeHr) {
    let lateByHour = parseFloat(late) * parseFloat(60)
    if (late === null || late === undefined) {
      lateByHour = 0
    }
    // const lateDeduction = parseFloat(lateByHour * gigs.fee)
    const lateDeduction = parseFloat(late * gigs.fee)

    const feeRate = parseFloat(gigs.fees.jobsterTotal * time)

    const convertToPhilippinesTime = (date) => {
      return momentTz(date).tz('Asia/Manila').format('MMMM Do YYYY, h:mm:ss a')
    }

    await fetch.post(`${process.env.DISCORD_URL}/${process.env.DISCORD_JOBSTER_ENDSHIFT_KEY}`, {
      // method: 'post',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      username: `Gig Details  - End Shift`,
      avatar_url:
        'https://cdn.discordapp.com/avatars/1069382190800056340/c9a9e35eecc4bc6a825f85ccb0e3a207.webp?size=80',
      embeds: [
        {
          title: `**Jobster Gig End Shift - (${gigs.category})**`,
          description: `${gigs.user[0].companyName}| ${gigs.location}| Client`,
          color: 15258703,
          fields: [
            {
              name: '',
              value: ``
            },
            {
              name: 'Details',
              value: `**Position:**\n**Fee:**\n**Jobster Assigned:**\n**Shift:**\n**Start:**\n**End:**\n**Hours:**\n**Gig Fee Rate:**\n**Late:**\n**Late Deduction:**\n**Gig Extension:**\n**Night Surge:**`,
              inline: true
            },
            {
              name: '-',
              value: `${gigs.position}\n${gigs.fee}\n${jobsterData[0].firstName} ${jobsterData[0].lastName}\n${
                gigs.shift
              }\n${convertToPhilippinesTime(gigs.from)}\n${convertToPhilippinesTime(
                gigs.time
              )}\n${time}\nPhp ${parseFloat(feeRate).toFixed(2)} \n${
                lateByHour ? `${lateByHour} mins` : 'none'
              }\n-Php ${parseFloat(lateDeduction).toFixed(2)} \n${parseFloat(gigExtensionHr).toFixed(
                2
              )} hours \n ${parseFloat(nightSurgeHr).toFixed(2)} hours \n `,
              inline: true
            }
          ],
          footer: {
            text: `${moment().tz('Asia/Manila').format('MMM-DD-YYYY hh:mm A')}`,
            icon_url:
              'https://images-ext-1.discordapp.net/external/KfTbvCiVmFUlsvw_NRHZP5ttamV6eSRStISSJuSgkRI/https/app.starjobs.com.ph/icons/icon-512x512.png'
          }
        }
      ]
    })
  },

  send_editGig: async function (gig, time, from, shift, breakHr, hours, fee, date, category, position, notes) {
    const gigs = gig[0]
    const feeRate = parseFloat(gigs.fees?.jobsterTotal * gigs.hours)
    const NewfeeRate = parseFloat(gigs.fees?.jobsterTotal * hours)

    const convertToPhilippinesTime = (date) => {
      return momentTz(date).tz('Asia/Manila').format('MMMM Do YYYY, h:mm:ss a')
    }

    await fetch.post(`${process.env.DISCORD_URL}/${process.env.DISCORD_EDITGIG_KEY}`, {
      // method: 'post',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      username: `Gig Details  - Edit Gig`,
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
              value: `**Position:**\n**Fee:**\n**Shift:**\n**Start:**\n**End:**\n**Hours:**\n**Gig Fee Rate:**\n**Night Surge:**\n**Night Surge Fee:**\n**Holiday Surge:**\n**Notes:**`,
              inline: true
            },
            {
              name: 'Old',
              value: `${gigs.position}\n${gigs.fee}\n${gigs.shift}\n${convertToPhilippinesTime(
                gigs.from
              )}\n${convertToPhilippinesTime(gigs.time)}\n${hours}\nPhp ${parseFloat(feeRate).toFixed(
                2
              )} \n ${parseFloat(gigs.fees?.proposedNightSurgeHr).toFixed(2)} hours \nPhp ${parseFloat(
                gigs.fees?.nightSurge
              ).toFixed(2)}\nPhp ${parseFloat(gigs.fees?.holidaySurge).toFixed(2)}\n${gigs.notes}\n`,
              inline: true
            },
            {
              name: 'New',
              value: `${position}\n${fee}\n${shift}\n${convertToPhilippinesTime(from)}\n${convertToPhilippinesTime(
                time
              )}\n${hours}\nPhp ${parseFloat(NewfeeRate).toFixed(2)} \n ${parseFloat(
                gigs.fees?.proposedNightSurgeHr
              ).toFixed(2)} hours \nPhp ${parseFloat(gigs.fees?.nightSurge).toFixed(2)}\nPhp ${parseFloat(
                gigs.fees?.holidaySurge
              ).toFixed(2)}\n${notes}\n `,
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
  },

  send_cancelledGig: async function (gig, reason) {
    const gigs = gig[0]
    const feeRate = parseFloat(gigs.fees?.jobsterTotal * gigs.hours)

    const convertToPhilippinesTime = (date) => {
      return momentTz(date).tz('Asia/Manila').format('MMMM Do YYYY, h:mm:ss a')
    }

    await fetch.post(`${process.env.DISCORD_URL}/${process.env.DISCORD_CANCELLEDGIG_KEY}`, {
      // method: 'post',
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      username: `Gig Details  - Cancelled Gig`,
      avatar_url:
        'https://cdn.discordapp.com/avatars/1069382190800056340/c9a9e35eecc4bc6a825f85ccb0e3a207.webp?size=80',
      embeds: [
        {
          title: `**Client Cancelled Gig - ${reason}**`,
          description: `${gigs.user[0].companyName}| ${gigs.location}| Client`,
          color: 15258703,
          fields: [
            {
              name: '\u200B', // Empty field for spacing
              value: '\u200B'
            },
            {
              name: 'Details',
              value: `**Position:**\n**Fee:**\n**Shift:**\n**Start:**\n**End:**\n**Hours:**\n**Gig Fee Rate:**\n**Night Surge:**\n**Night Surge Fee:**\n**Holiday Surge:**\n**Notes:**`,
              inline: true
            },
            {
              name: 'Old',
              value: `${gigs.position}\n${gigs.fee}\n${gigs.shift}\n${convertToPhilippinesTime(
                gigs.from
              )}\n${convertToPhilippinesTime(gigs.time)}\n${gigs.hours}\nPhp ${parseFloat(feeRate).toFixed(
                2
              )} \n ${parseFloat(gigs.fees?.proposedNightSurgeHr).toFixed(2)} hours \nPhp ${parseFloat(
                gigs.fees?.nightSurge
              ).toFixed(2)}\nPhp ${parseFloat(gigs.fees?.holidaySurge).toFixed(2)}\n${gigs.notes}\n`,
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
