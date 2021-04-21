const mongoose = require('mongoose');
const {Schema, Types: {ObjectId}} = mongoose;

const TokenSchema = new Schema({
    verificationToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 1000 * 60 * 60 * 24
    },
    userId: {
        type: ObjectId,
        required: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);