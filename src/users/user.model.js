const mongoose = require('mongoose');
const { Schema, Types: { ObjectId } } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarURL: String,

    token: { type: String },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;