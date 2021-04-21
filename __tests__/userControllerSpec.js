// console.log(1);

// const { describe } = require("../src/schemas/id.schema");
const { getUserById } = require('../src/users/user.controller');
const userDao = require('../dao/user.Dao');

describe('User controller', () => {
    it('getUserById should return valid user in response', async (done) => {
        const userData = {
            user: {
                email: "pes@gmail.com",
                name: "dog",
                password: "1234"
            }
        }
        const mReq = { user: { _id: '1' } };
        const mRes = { json: jest.fn() };    //ответ в json-е

        jest.spyOn(userDao, 'getById').mockResolvedValueOnce(userData.user);

        await getUserById(mReq, mRes);
        expect(mRes.json).toBeCalledWith(userData);
        done();
    });

    it('getUserById should return error if no user data returned from Database', async (done) => {
        const userData = {
            user: undefined
        }
        const mReq = { user: { _id: '1' } };
        const mRes = { json: jest.fn(), status: jest.fn() };    //ответ в json-е

        jest.spyOn(userDao, 'getById').mockResolvedValueOnce(userData.user);

        await getUserById(mReq, mRes);
        expect(mRes.status).toBeCalledWith(400);
        expect(mRes.json).toBeCalledWith({message: `No user with id ${mReq.user._id} not found.`});
        done();
    });
})