const mongoose = require('mongoose');
const {Schema, Types: {ObjectId}} = mongoose;

const entriesSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },

    date: {
        type: String,
        required: true,
    },

    entries: [
        {
            category: String,
            spent: Number,
        }
    ]
});

const entriesModel = mongoose.model('entries', entriesSchema);
module.exports = entriesModel;
