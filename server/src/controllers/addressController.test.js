import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    address: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

const prisma = (await import('../config/db.js')).default;
const {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} = await import('./addressController.js');

describe('Address Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: 'user123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAddresses', () => {
    it('should fetch all user addresses', async () => {
      const mockAddresses = [
        {
          id: 'addr1',
          userId: 'user123',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          isDefault: true,
        },
        {
          id: 'addr2',
          userId: 'user123',
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA',
          isDefault: false,
        },
      ];

      prisma.address.findMany.mockResolvedValue(mockAddresses);

      await getAddresses(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { addresses: mockAddresses },
      });

      expect(prisma.address.findMany).toHaveBeenCalledWith({
        where: { userId: 'user123' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.address.findMany.mockRejectedValueOnce(new Error('Database error'));

      await getAddresses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error fetching addresses',
        })
      );
    });
  });

  describe('getAddressById', () => {
    it('should fetch address by ID for owner', async () => {
      const mockAddress = {
        id: 'addr1',
        userId: 'user123',
        street: '123 Main St',
        city: 'New York',
      };

      prisma.address.findUnique.mockResolvedValue(mockAddress);

      req.params = { id: 'addr1' };

      await getAddressById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { address: mockAddress },
      });
    });

    it('should return 404 if address not found', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      req.params = { id: 'invalid' };

      await getAddressById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if address belongs to another user', async () => {
      const mockAddress = {
        id: 'addr1',
        userId: 'other-user',
      };

      prisma.address.findUnique.mockResolvedValue(mockAddress);

      req.params = { id: 'addr1' };

      await getAddressById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createAddress', () => {
    it('should create a new address', async () => {
      const mockAddress = {
        id: 'addr1',
        userId: 'user123',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true,
      };

      prisma.address.count.mockResolvedValue(0);
      prisma.address.create.mockResolvedValue(mockAddress);

      req.body = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      };

      await createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Address created successfully',
        data: { address: mockAddress },
      });
    });

    it('should set first address as default', async () => {
      prisma.address.count.mockResolvedValue(0);

      req.body = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      };

      prisma.address.create.mockResolvedValue({
        isDefault: true,
      });

      await createAddress(req, res);

      expect(prisma.address.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isDefault: true,
        }),
      });
    });

    it('should unset other defaults when setting new default', async () => {
      prisma.address.count.mockResolvedValue(2);
      prisma.address.updateMany.mockResolvedValue({ count: 1 });
      prisma.address.create.mockResolvedValue({ id: 'addr2', isDefault: true });

      req.body = {
        street: '456 Oak Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        isDefault: true,
      };

      await createAddress(req, res);

      expect(prisma.address.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user123', isDefault: true },
        data: { isDefault: false },
      });
    });

    it('should return 400 if required fields missing', async () => {
      req.body = {
        street: '123 Main St',
        city: 'New York',
      };

      await createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide street, city, state, and zipCode',
      });
    });

    it('should use default country USA', async () => {
      prisma.address.count.mockResolvedValue(0);

      req.body = {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      };

      prisma.address.create.mockResolvedValue({
        country: 'USA',
      });

      await createAddress(req, res);

      expect(prisma.address.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          country: 'USA',
        }),
      });
    });
  });

  describe('updateAddress', () => {
    it('should update address', async () => {
      const mockAddress = {
        id: 'addr1',
        userId: 'user123',
        street: 'Updated Street',
        city: 'Boston',
      };

      prisma.address.findUnique.mockResolvedValue({
        id: 'addr1',
        userId: 'user123',
      });
      prisma.address.update.mockResolvedValue(mockAddress);

      req.params = { id: 'addr1' };
      req.body = {
        street: 'Updated Street',
        city: 'Boston',
      };

      await updateAddress(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Address updated successfully',
        })
      );
    });

    it('should return 404 if address not found', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      req.params = { id: 'invalid' };
      req.body = { street: 'Updated' };

      await updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteAddress', () => {
    it('should delete address', async () => {
      prisma.address.findUnique.mockResolvedValue({
        id: 'addr1',
        userId: 'user123',
      });
      prisma.address.delete.mockResolvedValue({ id: 'addr1' });

      req.params = { id: 'addr1' };

      await deleteAddress(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Address deleted successfully',
        })
      );
    });

    it('should return 404 if address not found', async () => {
      prisma.address.findUnique.mockResolvedValue(null);

      req.params = { id: 'invalid' };

      await deleteAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
