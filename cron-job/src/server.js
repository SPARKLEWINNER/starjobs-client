const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Queue = require('bull')
const useragent = require('express-useragent')
const CronJob = require('cron').CronJob
const app = express()

const Gigs = require('./models/Gigs')
const Client = require('./models/Client')
const Account = require('./models/Account')
const User = require('./models/User')
const Jobs = require('./models/Jobs')

require('dotenv').config()

const port = process.env.PORT || 3001
const queueJob = new Queue('gigsPosted', process.env.REDIS_URL)

mongoose
  .connect(process.env.MONGODB_KEY, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log(`Database Connected`)
    nodeScheduler.start()
  })
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

async function checkPosting() {
  const jobs = await Jobs.find({repeatTimes: {$gte: 1}}).lean().exec()

  if(!jobs) return

  await jobs.map(job => {
    // console.log(job)
  })
  // let job = await queueJob.add();
  // console.log(job)
  // res.json({ id: job.id });
}

const nodeScheduler = new CronJob(
  '* */5 * * * *', //cron time
  checkPosting, //replace with your function that you want to call
  null, //oncomplete
  true, //start flag
  'Asia/Manila' // timezone;
)

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }));
app.get('/client.js', (req, res) => res.sendFile('client.js', { root: __dirname }));


queueJob.on('global:completed', (jobId, result) => {
  console.log(`Job completed with result ${result} ${jobId}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
