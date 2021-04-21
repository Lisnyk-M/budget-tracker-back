const joi = require('joi');

const idSchema = joi.object({
    _id: joi.string()
        // .min(24)
        // .max(24)
        // .required()
        .pattern(new RegExp('^[a-fA-F0-9]{24}$')),
});

module.exports = idSchema;