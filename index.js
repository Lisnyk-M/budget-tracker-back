const express = require('express');
const app = express();
const { json } = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./src/users/user.router');
const ContactsService_v2 = require('./src/services/contact.service_v2');
const entriesRouter = require('./src/entries/entries.routes');


require('dotenv').config();
console.log('NODE_ENV: ', process.env.NODE_ENV)

const host = process.env.HOST;
const port = process.env.PORT || 3001;
ContactsService_v2.dbConnect();

function logErrors(err, req, res, next) {
    console.error('logErrors: ', err);

    if (!err.status) { err.status = 400 };
    if (err.code === 11000) {
        err.message = 'Contact already in database';
        err.status = 409;
    };

    return res.status(err.status).send(err.message);
    // next(err);
}

app.use(json());
app.use(cors({ origin: "https://lisnyk-m-btrack.netlify.app/" }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan('combined'));
app.use('/', userRoutes);
app.use('/', entriesRouter);

app.use( express.static('build'));
app.use(logErrors);

async function start() {
    app.listen(port, () =>
        console.log(`server is running on a port ${port}`)
    )
}

start();

module.exports.start = start;
module.exports.app = app;
