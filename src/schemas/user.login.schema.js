const joi = require('joi');

const userRegisterSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required(),
    token: joi.string()
});

module.exports = userRegisterSchema;