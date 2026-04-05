import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const prisma = (await import('../config/db.js')).default;
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = await import('./categoryController.js');

describe('Category Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: 'user123', role: 'ADMIN' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch all categories with product counts', async () => {
      const mockCategories = [
        {
          id: 'cat1',
          name: 'Electronics',
          description: 'Electronic devices',
          products: [{ image: 'img1.jpg' }, { image: 'img2.jpg' }],
          _count: { products: 50 },
        },
        {
          id: 'cat2',
          name: 'Clothing',
          description: 'Clothing items',
          products: [{ image: 'img3.jpg' }],
          _count: { products: 100 },
        },
      ];

      prisma.category.findMany.mockResolvedValue(mockCategories);

      await getCategories(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { categories: mockCategories },
      });

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: {
          products: {
            take: 10,
            select: { image: true },
          },
          _count: {
            select: { products: true },
          },
        },
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.category.findMany.mockRejectedValueOnce(new Error('Database error'));

      await getCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error fetching categories',
        })
      );
    });
  });

  describe('getCategoryById', () => {
    it('should fetch category by ID', async () => {
      const mockCategory = {
        id: 'cat1',
        name: 'Electronics',
        description: 'Electronic devices',
        _count: { products: 50 },
      };

      prisma.category.findUnique.mockResolvedValue(mockCategory);

      req.params = { id: 'cat1' };

      await getCategoryById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { category: mockCategory },
      });
    });

    it('should return 404 if category not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      req.params = { id: 'invalid' };

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category not found',
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.category.findUnique.mockRejectedValueOnce(new Error('Database error'));

      req.params = { id: 'cat1' };

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const mockCategory = {
        id: 'cat1',
        name: 'Electronics',
        description: 'Electronic devices',
        image: 'electronics.jpg',
      };

      prisma.category.create.mockResolvedValue(mockCategory);

      req.body = {
        name: 'Electronics',
        description: 'Electronic devices',
        image: 'electronics.jpg',
      };

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Category created successfully',
        data: { category: mockCategory },
      });
    });

    it('should return 400 if name not provided', async () => {
      req.body = { description: 'Some category' };

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide a category name',
      });
    });

    it('should handle optional fields', async () => {
      const mockCategory = {
        id: 'cat1',
        name: 'New Category',
        description: null,
        image: null,
      };

      prisma.category.create.mockResolvedValue(mockCategory);

      req.body = { name: 'New Category' };

      await createCategory(req, res);

      expect(prisma.category.create).toHaveBeenCalledWith({
        data: {
          name: 'New Category',
          description: null,
          image: null,
        },
      });
    });

    it('should handle creation errors', async () => {
      prisma.category.create.mockRejectedValueOnce(new Error('Database error'));

      req.body = { name: 'Category' };

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateCategory', () => {
    it('should update category', async () => {
      const mockCategory = {
        id: 'cat1',
        name: 'Updated Electronics',
        description: 'Updated description',
      };

      prisma.category.findUnique.mockResolvedValueOnce({ id: 'cat1' });
      prisma.category.update.mockResolvedValueOnce(mockCategory);

      req.params = { id: 'cat1' };
      req.body = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };

      await updateCategory(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Category updated successfully',
        })
      );
    });

    it('should handle update errors', async () => {
      prisma.category.findUnique.mockResolvedValueOnce({ id: 'cat1' });
      prisma.category.update.mockRejectedValueOnce(new Error('Not found'));

      req.params = { id: 'invalid' };
      req.body = { name: 'Updated' };

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteCategory', () => {
    it('should delete category', async () => {
      prisma.category.findUnique.mockResolvedValueOnce({ id: 'cat1', _count: { products: 0 } });
      prisma.category.delete.mockResolvedValueOnce({ id: 'cat1' });

      req.params = { id: 'cat1' };

      await deleteCategory(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Category deleted successfully',
        })
      );
    });

    it('should handle delete errors', async () => {
      prisma.category.findUnique.mockResolvedValueOnce({ id: 'cat1', _count: { products: 0 } });
      prisma.category.delete.mockRejectedValueOnce(
        new Error('Cannot delete category with products')
      );

      req.params = { id: 'cat1' };

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
