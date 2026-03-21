import request from 'supertest';
import app from '../src/app.js';

describe('API basic tests', () => {
    it('GET /api/health - should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
    });

    it('GET /api/categories - should return 200 and categories array', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.categories)).toBe(true);
    });

    it('GET /api/products - should return 200 and products array', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.products)).toBe(true);
    });
});
