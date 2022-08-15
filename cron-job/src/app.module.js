const Promise = require('bluebird');
const express = require('express')
const useragent = require('express-useragent')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const morgan = require('morgan')

const routes = require('./app.routes')
const jobs = require('./jobs/jobs.service')

const port = process.env.PORT || 3001
const app = express()

require('dotenv').config()

Promise.promisifyAll(mongoose);

mongoose
    .connect(process.env.MONGODB_KEY, {
        bufferMaxEntries: 0,
        keepAlive: true,
        socketTimeoutMS: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log(`Database Connected`));

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.db}`);
});

app.enable('trust proxy')
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())
app.use(function (request, response, next) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  response.header('Access-Control-Expose-Headers', 'X-Total-Count')
  next()
})

app.use(useragent.express())

routes(app)
jobs();


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
