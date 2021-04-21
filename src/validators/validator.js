// const joi = require('joi');

module.exports = validator = async (data, schema) => {
    try {
        const { value, error } = await schema.validate(data);
        if (error) {
            // return error.details.map(el => el.message)[0];
            return error.message;
        }
    }
    catch (err) {
        console.log(err);
    }
}