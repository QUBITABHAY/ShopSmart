import request from 'supertest';
import app from '../src/app.js';

describe('API Comprehensive Tests', () => {
  describe('Health Check', () => {
    it('GET /api/health - should return 200 and status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Root Route', () => {
    it('GET / - should return welcome message', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('ShopSmart Backend Service');
    });
  });

  describe('CORS Middleware', () => {
    it('should include CORS headers', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Content-Type Handling', () => {
    it('should handle JSON requests', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['content-type']).toContain('application/json');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for undefined routes', async () => {
      const res = await request(app).get('/api/undefined-route');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('API Response Format', () => {
    it('health endpoint should have correct response format', async () => {
      const res = await request(app).get('/api/health');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
      expect(typeof res.body.timestamp).toBe('string');
    });
  });

  describe('Multiple Requests', () => {
    it('should handle multiple sequential requests', async () => {
      const res1 = await request(app).get('/api/health');
      const res2 = await request(app).get('/api/health');
      const res3 = await request(app).get('/api/health');

      expect(res1.statusCode).toEqual(200);
      expect(res2.statusCode).toEqual(200);
      expect(res3.statusCode).toEqual(200);
    });
  });

  describe('Response Status Codes', () => {
    it('health check should respond with status 200', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
    });

    it('should return appropriate status codes for different requests', async () => {
      const healthRes = await request(app).get('/api/health');
      expect(healthRes.statusCode).toEqual(200);

      const notFoundRes = await request(app).get('/api/nonexistent');
      expect(notFoundRes.statusCode).toEqual(404);
    });
  });
});
