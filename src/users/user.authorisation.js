const jwt = require('jsonwebtoken');
const userModel = require('./user.model');
const { NotFoundError, UnauthorizedError } = require('../helpers/errors.constructor');

async function authorize(req, res, next) {
    try {
        // 1. витягнути токен користувача з заголовка Authorization
        const authorizationHeader = req.get("Authorization") || "";
        if (!authorizationHeader) {
            throw new UnauthorizedError("User not authorized");
        }
        const token = authorizationHeader.replace("Bearer ", "");
        // 2. витягнути id користувача з пейлоада або вернути користувачу
        // помилку зі статус кодом 401
        let userId;
        try {
            userId = await jwt.verify(token, process.env.JWT_SECRET).id;    //_id
        } catch (err) {
            next(new UnauthorizedError("User not authorized"));
        }

        // 3. витягнути відповідного користувача. Якщо такого немає - викинути
        // помилку зі статус кодом 401
        // userModel - модель користувача в нашій системі
        const user = await userModel.findOne(
            { _id: userId }
        );
        if (!user || user.token !== token) {
            throw new NotFoundError("User not found");
        }

        // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
        // і передати обробку запиту на наступний middleware
        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        next(err);
    }
}

module.exports = authorize;