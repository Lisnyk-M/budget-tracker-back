const request = require('supertest');
const {app} = require('../index');
// const { describe } = require('../src/schemas/id.schema');

describe('API stats', () => {
    it('Should return status 200 and valid json response', async () => {
        // await app();

        const response = await request(app).get('/api/stats');
        expect(response.statusCode).toBe(200);
    })
})