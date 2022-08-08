const express = require('express');
const request = require('request');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const Pusher = require('pusher');
const PushNotifications = require('@pusher/push-notifications-server');
const routes = require('./src/routes');

const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const port = process.env.PORT || 3001;
const app = express();
const useragent = require('express-useragent');
const fixieRequest = request.defaults({ proxy: process.env.FIXIE_URL });

const fetch = require('axios');

swaggerDocument = require('./swagger.json');
require('dotenv').config();

fixieRequest('https://api.starjobs.com.ph/api/internal/v1/auth/resend-verification', (err, res, body) => {});

// Connect to the database
mongoose
    .connect(process.env.MONGODB_KEY, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log(`Database Connected`))
    .catch((err) => console.log(err));

app.enable('trust proxy');
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    next();
});
app.use(useragent.express());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // swagger

routes(app);

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

global.pusher = pusher;

const beamsClient = new PushNotifications({
    instanceId: 'db50def2-7957-4a3d-80f2-6d78d1d4c322',
    secretKey: '3C8C322BACC994268BCE083BD81B30C0EFBB46CC8AA8FD32DAE5CFD09A8E2669'
});

global.beamsClient = beamsClient;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// setInterval(() => {
//     beamsClient
//         .publishToInterests(['hello'], {
//             web: {
//                 notification: {
//                     title: 'Hello',
//                     body: 'Hello, world!',
//                     deep_link: 'https://www.pusher.com'
//                 }
//             }
//         })
//         .then((publishResponse) => {
//             console.log('Just published:', publishResponse.publishId);
//         })
//         .catch((error) => {
//             console.log('Error:', error);
//         });
// }, 8000);
