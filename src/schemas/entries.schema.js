const joi = require('joi');

const entriesSchemsa = joi.object({
    date: joi.string().required(),
    category: joi.string().required(),
    spent: joi.number().required(),
})

module.exports = entriesSchemsa;