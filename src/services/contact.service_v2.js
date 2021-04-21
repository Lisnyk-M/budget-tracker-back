const mongoose = require('mongoose');
require('dotenv').config();

const mongoDbURL = process.env.MONGODB_URL;

class ContactService {
    dbConnect() {
        mongoose.connect(mongoDbURL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
            function (err) {
                if (err) {
                    process.exit(1);
                }
                console.log('Successfully connected');
            });
    }
}

module.exports = new ContactService();