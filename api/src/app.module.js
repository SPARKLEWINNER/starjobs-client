require('dotenv').config()
const fetch = require('axios')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Pusher = require('pusher')
const routes = require('./app.routes')

const port = process.env.PORT || 3001
const app = express()
const useragent = require('express-useragent')

const MONGO_DATABASE_URL = process.env.MONGODB_URI

mongoose
  .connect(MONGO_DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log(`Database Connected`))
  .catch((err) => console.log(err))

app.enable('trust proxy')
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')
  next()
})
app.use(useragent.express())

routes(app)

async function load() {
  console.log('trigger load')
  try {
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=	AAAA4r-Yg4A:APA91bHUWV4WvR0zwPMTF9ukmZC5SsvQeppJpAtACMWfBlDjI_021R2ut6bJfrHTFn9DVtTrhXpQ0-jNRgAG3hVOQAV4yYGzZbFu2ZAf26LcsCNOaGm4fOYBaPmH0YYG9fqOSOl5bGLt'
      },
      data: {
        notification: {
          title: `Starjobs`,
          body: `TEST`,
          icon: 'https://app.starjobs.com.ph/static/starjobs-blue-outline-preloader-669196fa2260221466c34d52de5da168.png',
          click_action: 'https://app.starjobs.com.ph/dashboard'
        },
        to: 'cTNz_ORmQme8Y2_tvMS7Y0:APA91bGrzzC-QBUkWZ9haoL0e8UdCLtlN1IcGJHYIC1VuWwfg-yphMjIAm3q8CgxFdMH38IWjlwfUPr3SEvFAxV9uB4_O0OUUHjc8cp0adA3pb06Myo5DHZXkEuBVJrnjg1DJ0lBLUXg'
        // to: user[0].deviceId
      }
    }).catch(err => console.log('fcm error', err))
    
  } catch (err) {
    console.log(err)
  }

}



const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
})

global.pusher = pusher

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  load()
})
