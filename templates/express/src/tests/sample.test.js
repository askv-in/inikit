const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns 200 and service info', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('service');
  });
});
