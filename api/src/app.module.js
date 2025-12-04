require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Pusher = require('pusher')
const routes = require('./app.routes')
const crypto = require('crypto')

const port = process.env.PORT || 3001
const app = express()
const useragent = require('express-useragent')
require('./controller/notifications/firebase/changeStream')
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

const allowedOrigins = [
  'https://app.starjobs.com.ph',
  'https://www.app.starjobs.com.ph',
  'http://localhost:7003', // dev
  'http://localhost:8000',
  'https://home-gig-count.starjobs-gatsby.pages.dev', // staging
  'https://vefirication-ui-revamp.starjobs-gatsby.pages.dev/', // staging
  'https://persist-loc-rate.starjobs-gatsby.pages.dev', // staging
  'https://save-gig-logs.starjobs-gatsby.pages.dev', // staging
  'https://sj-2chat.pages.dev', //staging
  'https://ui-adjustments.starjobs-gatsby.pages.dev', // staging
  'https://fix-contact-bug.starjobs-gatsby.pages.dev', // staging
  'https://sj.spos.site/',
  'https://staging-starjobs.onrender.com/api/internal/v1',
  'https://api-sj.starjobs.com.ph/api/internal/v1',
  'https://starjobs-gatsby.vercel.app'
]

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. curl, mobile apps)
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
  })
)

// Handle preflight requests for all routes
app.options('*', cors())

// ✅ Fallback CORS-safe error handler
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    console.warn(`🚫 Blocked CORS request from origin: ${req.headers.origin}`)
    return res.status(403).json({
      success: false,
      message: 'CORS policy: This origin is not allowed to access this resource.'
    })
  }
  next(err)
})

app.use(useragent.express())
app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok', timestamp: new Date()})
})

// cron.schedule('*/25 * * * *', async () => {
//   try {
//     // Generate a new token
//     const response = await axios.post(
//       'https://svc.app.cast.ph/api/auth/signin',
//       {
//         username: process.env.CAST_USERNAME,
//         password: process.env.CAST_PASSWORD
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     )
//     console.log('🚀 ~ cron.schedule ~ response:', response)

//     const newToken = response.data.Token

//     // If you need to use the new token for something else, you can do it here
//     console.log('New token:', newToken)

//     // Find the existing token and update its value
//     const existingToken = await Token.findOne()
//     console.log('🚀 ~ cron.schedule ~ existingToken:', existingToken)
//     if (existingToken) {
//       existingToken.token = newToken
//       await existingToken.save()
//       console.log('Token updated:', newToken)
//     } else {
//       // If no token exists, create a new one
//       await Token.create({token: newToken})
//       console.log('New token created:', newToken)
//     }
//   } catch (error) {
//     console.error('Error updating token:', error)
//   }
// })
routes(app)

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
})
