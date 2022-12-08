require('dotenv').config()
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
