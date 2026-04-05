import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
    },
  },
}));

const prisma = (await import('../config/db.js')).default;
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = await import('./cartController.js');

describe('Cart Controller', () => {
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

  describe('getCart', () => {
    it('should return existing cart', async () => {
      const mockCart = {
        id: 'cart1',
        userId: 'user123',
        items: [
          {
            id: 'item1',
            productId: 'prod1',
            quantity: 2,
            product: {
              id: 'prod1',
              name: 'Product 1',
              price: 100,
              stock: 10,
            },
          },
        ],
      };

      prisma.cart.findUnique.mockResolvedValue(mockCart);

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { cart: mockCart },
      });
    });

    it('should create new cart if not exists', async () => {
      const newCart = {
        id: 'cart1',
        userId: 'user123',
        items: [],
      };

      prisma.cart.findUnique.mockResolvedValueOnce(null);
      prisma.cart.create.mockResolvedValue(newCart);

      await getCart(req, res);

      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: { userId: 'user123' },
        include: { items: true },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { cart: newCart },
      });
    });

    it('should handle errors gracefully', async () => {
      prisma.cart.findUnique.mockRejectedValue(new Error('Database error'));

      await getCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Error fetching cart',
        })
      );
    });
  });

  describe('addToCart', () => {
    it('should add item to existing cart', async () => {
      req.body = { productId: 'prod1', quantity: 2 };

      const mockProduct = {
        id: 'prod1',
        name: 'Product 1',
        price: 100,
      };

      const mockCart = { id: 'cart1', userId: 'user123' };

      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.cart.findUnique.mockResolvedValueOnce(mockCart);
      prisma.cartItem.findUnique.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue({
        id: 'item1',
        cartId: 'cart1',
        productId: 'prod1',
        quantity: 2,
      });

      const updatedCart = {
        id: 'cart1',
        userId: 'user123',
        items: [
          {
            id: 'item1',
            cartId: 'cart1',
            productId: 'prod1',
            quantity: 2,
            product: mockProduct,
          },
        ],
      };

      prisma.cart.findUnique.mockResolvedValueOnce(updatedCart);

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Item added to cart',
        })
      );
    });

    it('should return 400 if productId not provided', async () => {
      req.body = { quantity: 2 };

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide productId',
      });
    });

    it('should return 404 if product not found', async () => {
      req.body = { productId: 'invalid', quantity: 1 };

      prisma.product.findUnique.mockResolvedValue(null);

      await addToCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Product not found',
      });
    });

    it('should increment quantity if item already in cart', async () => {
      req.body = { productId: 'prod1', quantity: 1 };

      const mockProduct = { id: 'prod1', name: 'Product 1' };
      const mockCart = { id: 'cart1', userId: 'user123' };
      const existingItem = {
        id: 'item1',
        cartId: 'cart1',
        productId: 'prod1',
        quantity: 2,
      };

      prisma.product.findUnique.mockResolvedValueOnce(mockProduct);
      prisma.cart.findUnique.mockResolvedValueOnce(mockCart);
      prisma.cartItem.findUnique.mockResolvedValueOnce(existingItem);
      prisma.cartItem.update.mockResolvedValueOnce({
        ...existingItem,
        quantity: 3,
      });

      const updatedCart = {
        id: 'cart1',
        items: [{ ...existingItem, quantity: 3 }],
      };

      prisma.cart.findUnique.mockResolvedValueOnce(updatedCart);

      await addToCart(req, res);

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item1' },
        data: { quantity: 3 },
      });
    });
  });

  describe('updateCartItem', () => {
    it('should update cart item quantity', async () => {
      req.params = { itemId: 'item1' };
      req.body = { quantity: 5 };

      const cartItem = {
        id: 'item1',
        cart: { userId: 'user123' },
        product: { id: 'prod1' },
      };

      prisma.cartItem.findUnique.mockResolvedValue(cartItem);
      prisma.cartItem.update.mockResolvedValue({
        ...cartItem,
        quantity: 5,
      });

      await updateCartItem(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Cart item updated',
        })
      );
    });

    it('should return 400 if quantity is invalid', async () => {
      req.params = { itemId: 'item1' };
      req.body = { quantity: 0 };

      await updateCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide a valid quantity (min 1)',
      });
    });

    it('should return 404 if item not found', async () => {
      req.params = { itemId: 'invalid' };
      req.body = { quantity: 2 };

      prisma.cartItem.findUnique.mockResolvedValue(null);

      await updateCartItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('removeFromCart', () => {
    it('should remove item from cart', async () => {
      req.params = { itemId: 'item1' };

      const cartItem = {
        id: 'item1',
        cart: { userId: 'user123' },
      };

      prisma.cartItem.findUnique.mockResolvedValue(cartItem);
      prisma.cartItem.delete.mockResolvedValue(cartItem);

      await removeFromCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Item removed from cart',
      });
    });

    it('should return 404 if item not found', async () => {
      req.params = { itemId: 'invalid' };

      prisma.cartItem.findUnique.mockResolvedValue(null);

      await removeFromCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const cart = { id: 'cart1', userId: 'user123' };

      prisma.cart.findUnique.mockResolvedValue(cart);
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      await clearCart(req, res);

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart1' },
      });

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Cart cleared',
        })
      );
    });
  });
});
