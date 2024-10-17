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

// Database connection
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

// Helmet middleware with improved CSP, anti-clickjacking, and other security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://trusted-scripts.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        imgSrc: ["'self'", 'data:', 'https://trusted-images.com'],
        connectSrc: ["'self'", 'https://api.example.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        frameSrc: ["'none'"], // Prevents iframe embedding
        objectSrc: ["'none'"] // Blocks plugins (e.g., Flash)
      }
    },
    frameguard: {action: 'deny'}, // Anti-clickjacking header (X-Frame-Options)
    referrerPolicy: {policy: 'no-referrer-when-downgrade'} // Adds Referrer-Policy header
  })
)

// JSON parsing, logging, and cookies
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

// Define allowed origins for CORS
const allowedOrigins = [
  'http://localhost:7003',
  'http://localhost:8000',
  'https://app.starjobs.com.ph',
  'https://rider-map-implementation.starjobs-gatsby.pages.dev',
  'https://staging-starjobs.onrender.com/api/internal/v1'
]

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true) // Allow if origin is in the list
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'], // Exposes custom headers
    credentials: true // Allow cookies
  })
)

// User-agent parser middleware
app.use(useragent.express())

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({status: 'ok', timestamp: new Date()})
})

// Initialize routes
routes(app)

// Pusher configuration
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
})

global.pusher = pusher

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
