const joi = require('joi');

const contactSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email(),
    phone: joi.string()
});

module.exports = contactSchema;