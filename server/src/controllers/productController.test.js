import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
  },
}));

const prisma = (await import('../config/db.js')).default;
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = await import('./productController.js');

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      user: { id: 'user123', role: 'ADMIN' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch all products with pagination', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          stock: 10,
          category: { id: 'cat1', name: 'Category 1' },
        },
        {
          id: '2',
          name: 'Product 2',
          price: 200,
          stock: 5,
          category: { id: 'cat1', name: 'Category 1' },
        },
      ];

      prisma.product.findMany.mockResolvedValue(mockProducts);
      prisma.product.count.mockResolvedValue(2);

      req.query = { page: 1, limit: 10 };

      await getProducts(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          products: mockProducts,
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
            totalPages: 1,
          },
        },
      });
    });

    it('should filter products by category', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          price: 100,
          categoryId: 'cat1',
        },
      ];

      prisma.product.findMany.mockResolvedValueOnce(mockProducts);
      prisma.product.count.mockResolvedValueOnce(1);

      req.query = { category: 'cat1' };

      await getProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { categoryId: 'cat1' },
        })
      );
    });

    it('should filter products by price range', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Product 1',
          price: 150,
        },
      ];

      prisma.product.findMany.mockResolvedValueOnce(mockProducts);
      prisma.product.count.mockResolvedValueOnce(1);

      req.query = { minPrice: '100', maxPrice: '200' };

      await getProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            price: { gte: 100, lte: 200 },
          },
        })
      );
    });

    it('should search products by name and description', async () => {
      const mockProducts = [
        {
          id: '1',
          name: 'Laptop Pro',
          description: 'High performance laptop',
        },
      ];

      prisma.product.findMany.mockResolvedValueOnce(mockProducts);
      prisma.product.count.mockResolvedValueOnce(1);

      req.query = { search: 'laptop' };

      await getProducts(req, res);

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'laptop', mode: 'insensitive' } },
              { description: { contains: 'laptop', mode: 'insensitive' } },
            ],
          },
        })
      );
    });

    it('should handle errors gracefully', async () => {
      prisma.product.findMany.mockRejectedValueOnce(new Error('Database error'));
      prisma.product.count.mockResolvedValueOnce(0);

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error fetching products',
        })
      );
    });
  });

  describe('getProductById', () => {
    it('should fetch a product by ID', async () => {
      const mockProduct = {
        id: '1',
        name: 'Product 1',
        price: 100,
        category: { id: 'cat1', name: 'Category 1' },
      };

      prisma.product.findUnique.mockResolvedValue(mockProduct);

      req.params = { id: '1' };

      await getProductById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { product: mockProduct },
      });
    });

    it('should return 404 if product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      req.params = { id: '999' };

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found',
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.product.findUnique.mockRejectedValueOnce(new Error('Database error'));

      req.params = { id: '1' };

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mockCategory = { id: 'cat1', name: 'Category 1' };
      const mockProduct = {
        id: '1',
        name: 'New Product',
        price: 99.99,
        description: 'A new product',
        stock: 10,
        categoryId: 'cat1',
        category: mockCategory,
      };

      prisma.category.findUnique.mockResolvedValue(mockCategory);
      prisma.product.create.mockResolvedValue(mockProduct);

      req.body = {
        name: 'New Product',
        price: '99.99',
        description: 'A new product',
        stock: '10',
        categoryId: 'cat1',
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Product created successfully',
        data: { product: mockProduct },
      });
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Product' };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide name, price, and categoryId',
      });
    });

    it('should return 404 if category not found', async () => {
      prisma.category.findUnique.mockResolvedValue(null);

      req.body = {
        name: 'Product',
        price: '99.99',
        categoryId: 'invalid-cat',
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Category not found',
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.category.findUnique.mockResolvedValueOnce({ id: 'cat1' });
      prisma.product.create.mockRejectedValueOnce(new Error('Database error'));

      req.body = {
        name: 'Product',
        price: '99.99',
        categoryId: 'cat1',
      };

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const mockProduct = {
        id: '1',
        name: 'Updated Product',
        price: 149.99,
      };

      prisma.product.findUnique.mockResolvedValueOnce({ id: '1', categoryId: 'cat1' });
      prisma.product.update.mockResolvedValueOnce(mockProduct);

      req.params = { id: '1' };
      req.body = { name: 'Updated Product', price: '149.99' };

      await updateProduct(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Product updated successfully',
          data: { product: mockProduct },
        })
      );
    });

    it('should handle update errors', async () => {
      prisma.product.findUnique.mockResolvedValueOnce({ id: '1', categoryId: 'cat1' });
      prisma.product.update.mockRejectedValueOnce(new Error('Not found'));

      req.params = { id: '999' };
      req.body = { name: 'Updated' };

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      prisma.product.findUnique.mockResolvedValueOnce({ id: '1' });
      prisma.product.delete.mockResolvedValueOnce({ id: '1' });

      req.params = { id: '1' };

      await deleteProduct(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Product deleted successfully',
        })
      );
    });

    it('should handle delete errors', async () => {
      prisma.product.findUnique.mockResolvedValueOnce({ id: '1' });
      prisma.product.delete.mockRejectedValueOnce(new Error('Not found'));

      req.params = { id: '999' };

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
