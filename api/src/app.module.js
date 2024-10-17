const helmet = require('helmet')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Pusher = require('pusher')
const routes = require('./app.routes')
const crypto = require('crypto')
require('dotenv').config()

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

// Helmet middleware with CSP & Frameguard for clickjacking prevention
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://example.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://example.com'],
        connectSrc: ["'self'", 'https://api.example.com', process.env.PUSHER_APP_CLUSTER],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ["'self'"], // Prevents embedding by other domains
        objectSrc: ["'none'"] // Disallow embedding of object tags
      }
    },
    crossOriginEmbedderPolicy: true,
    frameguard: {action: 'deny'} // Prevents embedding in iframes (anti-clickjacking)
  })
)

app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

const allowedOrigins = [
  'http://localhost:7003',
  'http://localhost:8000',
  'https://app.starjobs.com.ph',
  'https://rider-map-implementation.starjobs-gatsby.pages.dev',
  'https://staging-starjobs.onrender.com/api/internal/v1'
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Limit allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Control allowed headers
    exposedHeaders: ['X-Total-Count'], // Allow only specific headers to be exposed
    credentials: true
  })
)

app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')
  res.header('Referrer-Policy', 'no-referrer-when-downgrade')
  res.header('X-Frame-Options', 'DENY') // Additional anti-clickjacking header
  next()
})

app.use(useragent.express())

app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok', timestamp: new Date()})
})

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
