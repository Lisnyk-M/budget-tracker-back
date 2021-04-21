const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const contactValidator = require('../validators/contact.validator');
const userRegisterSchema = require('../schemas/user.register.schema');
const userModel = require('../users/user.model');
const Token = require('../token/Token');
const sendVerificationEmail = require('../helpers/sendMailer_v2');

const SALT_FACTOR = 8;

class UserController {
    async getUserById(req, res) {
        try {
            const user = await userModel.getById(req.user._id);
            if (!user) {
                res.status(400)
                return res.json({ message: `No user with id ${req.user._id} not found.` });
            }
            res.json({ user });
        }
        catch (err) {
        }
    };

    async registerUser(req, res, next) {
        try {
            const validate = await contactValidator(res, req.body, userRegisterSchema);
            if (validate) {
                return res.status(400).send({ error: validate });
            }
            const hashPassword = await bcrypt.hash(req.body.password, SALT_FACTOR);
            req.body.password = hashPassword;

            const uniqueUser = await userModel.findOne({ email: req.body.email }).exec();
            if (uniqueUser) {
                return res.status(409).send({ message: "Email in use" });
            }
            const responseBody = {
                user: {
                    name: req.body.name,
                    email: req.body.email,
                }
            }

            const newContact = await userModel.create(req.body);

            if (newContact) {
                const verificationToken = await crypto.randomBytes(16).toString('hex');

                await Token.create({
                    verificationToken,
                    userId: newContact._id
                })

                await sendVerificationEmail(req.body.email, verificationToken);
            }

            return newContact
                ? res.status(201).send(responseBody)
                : res.status(400).send({ message: "error create user" });

        } catch (err) {
            next(err);
        }
        next();
    }

    async verifyUser(req, res, next) {
        const { params: { verificationToken } } = req;
        const tokenData = await Token.findOne({
            verificationToken
        })

        if (!tokenData) {
            return res.status(404).send("Not found");
        }

        const user = await userModel.findById(tokenData.userId);

        if (!user) {
            return res.status(404).send("Not found");
        }

        user.verified = true;
        await user.save();

        res.send("Your verification is successfull!");
        //удалити токен щоб два рази ссилка не зпрацьовувала
        await Token.updateOne({ verificationToken }, { $set: { verificationToken: null } });
    }

    async getRegisteredUsers(req, res, next) {
        try {
            const newContact = await userModel.find({});
            return newContact
                ? res.status(200).send(newContact)
                : res.status(400).send({ message: "error users not found" });
        } catch (err) {
            next(err);
        }
        next();
    }

    async userLogin(req, res, next) {
        try {
            if (!req.existingUser.verified) {
                return res.status(400).send('Your email not verified. Please check your email');
            }

            const token = jwt.sign({ id: req.existingUser._id }, process.env.JWT_SECRET, {
                expiresIn: '2 days'
            });

            const findedUser = await userModel.findByIdAndUpdate(req.existingUser._id, { $set: { token } });

            return res.status(200).json({
                token,
                user: {
                    email: req.existingUser.email,
                    name: req.existingUser.name,
                }
            })
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async userLogout(req, res, next) {
        try {
            const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
            if (!decoded) {
                return res.status(401).send({ message: "Unauthorized" });
            }
            const { id } = decoded;
            //замінити на частковий перезапис бо юзер повністю перезаписується
            const updatedUser = {
                _id: req.user._id,
                subscription: req.user.subscription,
                email: req.user.email,
                name: req.user.name,
                password: req.user.password,
                avatarURL: req.user.avatarURL,
                verified: req.user.verified,
            }
            req.user.token = null;
            req.user = null;
            await userModel.findOneAndReplace({ _id: id }, updatedUser, { new: true });

            return res.status(204).send({ message: "No Content" });
        }
        catch (err) {
            next(err);
        }
        next();
    }

    async getCurrentUser(req, res, next) {
        if (req.user) {
            const { email, subscription } = req.user;
            return res.status(200).send({
                email, subscription
            });
        }
    }

    async updateSubscription(req, res, next) {
        try {
            const update = await userModel.findByIdAndUpdate(
                req.user._id,
                { $set: { subscription: req.body.subscription } },
                { new: true, runValidators: true }
            );
            return res.status(200).send({
                email: update.email,
                subscription: update.subscription
            });
        }
        catch (err) {
            next(err);
        }
        next();
    }    
}

module.exports = new UserController();