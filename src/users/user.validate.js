const bcrypt = require('bcrypt');
const userLoginSchema = require('../schemas/user.login.schema');
const userModel = require('./user.model');

async function userValidate(req, res, next) {
    try {
        const { email, password } = req.body;
        const validate = await contactValidator(res, req.body, userLoginSchema);

        if (validate) {
            return res.status(400).send({ error: validate });
        }

        const existingUser = await userModel.findOne({ email: email }).exec();

        if (!existingUser) {
            return res.status(401).send({ message: " Email or password is wrong" });
        }

        const passwordValidate = await bcrypt.compare(password, existingUser.password);
        if (!passwordValidate) {
            return res.status(401).send({ message: " Email or password is wrong" });
        }
        
        req.existingUser = existingUser;
        next();
    }
    catch (err) {
        next(err);
    }
}

module.exports = userValidate;