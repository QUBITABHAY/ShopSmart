import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const prisma = (await import('../config/db.js')).default;
const { getAllUsers, updateUserRole } = await import(
  './userController.js'
);

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
      user: { id: 'admin123', role: 'MASTER_ADMIN' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should fetch all users with pagination', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'user1@example.com',
          name: 'User One',
          role: 'CUSTOMER',
          createdAt: new Date(),
        },
        {
          id: 'user2',
          email: 'user2@example.com',
          name: 'User Two',
          role: 'ADMIN',
          createdAt: new Date(),
        },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(2);

      req.query = { page: 1, limit: 10 };

      await getAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          users: mockUsers,
          pagination: {
            total: 2,
            page: 1,
            pages: 1,
          },
        },
      });
    });

    it('should search users by name or email', async () => {
      const mockUsers = [
        {
          id: 'user1',
          email: 'john@example.com',
          name: 'John Doe',
        },
      ];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(1);

      req.query = { search: 'john' };

      await getAllUsers(req, res);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'john', mode: 'insensitive' } },
              { email: { contains: 'john', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('should handle pagination correctly', async () => {
      const mockUsers = [];

      prisma.user.findMany.mockResolvedValue(mockUsers);
      prisma.user.count.mockResolvedValue(0);

      req.query = { page: 2, limit: 5 };

      await getAllUsers(req, res);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
    });

    it('should handle errors gracefully', async () => {
      prisma.user.findMany.mockRejectedValueOnce(new Error('Database error'));

      await getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error fetching users',
        })
      );
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const updatedUser = {
        id: 'user1',
        email: 'user@example.com',
        name: 'User One',
        role: 'ADMIN',
      };

      prisma.user.update.mockResolvedValue(updatedUser);

      req.params = { id: 'user1' };
      req.body = { role: 'ADMIN' };
      req.user = { id: 'master-admin', role: 'MASTER_ADMIN' };

      await updateUserRole(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User user@example.com updated to ADMIN',
        data: { user: updatedUser },
      });
    });

    it('should return 403 if user is not MASTER_ADMIN', async () => {
      req.params = { id: 'user1' };
      req.body = { role: 'ADMIN' };
      req.user = { id: 'admin123', role: 'ADMIN' };

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Only Master Admins can update user roles',
      });
    });

    it('should prevent updating own role', async () => {
      req.params = { id: 'master-admin' };
      req.body = { role: 'CUSTOMER' };
      req.user = { id: 'master-admin', role: 'MASTER_ADMIN' };

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You cannot change your own role to avoid being locked out',
      });
    });

    it('should handle update errors', async () => {
      prisma.user.update.mockRejectedValue(new Error('User not found'));

      req.params = { id: 'invalid' };
      req.body = { role: 'ADMIN' };
      req.user = { id: 'master-admin', role: 'MASTER_ADMIN' };

      await updateUserRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
