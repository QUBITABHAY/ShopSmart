import { jest } from '@jest/globals';

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn(),
  },
}));

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const jwt = (await import('jsonwebtoken')).default;
const prisma = (await import('../config/db.js')).default;
const { protect, admin, master } = await import('./authMiddleware.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect', () => {
    it('should call next if valid token is provided', async () => {
      req.headers.authorization = 'Bearer validtoken';
      const mockUser = { id: 'user123', name: 'John Doe', role: 'USER' };
      
      jwt.verify.mockReturnValue({ id: 'user123' });
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(mockUser);
    });

    it('should return 401 if no token is provided', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized, no token' }));
    });
  });

  describe('admin', () => {
    it('should call next if user is an ADMIN', () => {
      req.user = { role: 'ADMIN' };

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should call next if user is a MASTER_ADMIN', () => {
      req.user = { role: 'MASTER_ADMIN' };

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user is not authorized', () => {
      req.user = { role: 'USER' };

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized as an admin' }));
    });
  });

  describe('master', () => {
    it('should call next if user is a MASTER_ADMIN', () => {
      req.user = { role: 'MASTER_ADMIN' };

      master(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user is not a MASTER_ADMIN', () => {
      req.user = { role: 'ADMIN' };

      master(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Not authorized as a master admin' }));
    });
  });
});
