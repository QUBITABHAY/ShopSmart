import { jest } from '@jest/globals';

jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('../utils/auth.js', () => ({
  generateToken: jest.fn(),
}));

const bcrypt = (await import('bcryptjs')).default;
const prisma = (await import('../config/db.js')).default;
const { generateToken } = await import('../utils/auth.js');
const { register, login, getProfile, updateProfile } = await import('./authController.js');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      req.body = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
      prisma.user.findUnique.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue({
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
      });
      generateToken.mockReturnValue('mocktoken');

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: 'mocktoken',
        }),
      }));
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      req.body = { email: 'john@example.com', password: 'password123' };
      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER',
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockReturnValue('mocktoken');

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          token: 'mocktoken',
        }),
      }));
    });

    it('should return 401 for invalid credentials', async () => {
      req.body = { email: 'john@example.com', password: 'wrongpassword' };
      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'CUSTOMER',
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid email or password' }));
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      req.user = { id: 'user123' };
      const mockUser = { id: 'user123', name: 'John Doe', email: 'john@example.com' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await getProfile(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: { user: mockUser }
      }));
    });
  });
});
