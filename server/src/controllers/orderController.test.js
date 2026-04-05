import { jest } from "@jest/globals";

jest.unstable_mockModule("../config/db.js", () => ({
  default: {
    cart: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
    },
    product: {
      update: jest.fn(),
    },
    cartItem: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const prisma = (await import("../config/db.js")).default;
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = await import("./orderController.js");

describe("Order Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { id: "user123", role: "CUSTOMER" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    it("should create order successfully", async () => {
      req.body = { addressId: "addr1" };

      const mockCart = {
        id: "cart1",
        userId: "user123",
        items: [
          {
            id: "item1",
            productId: "prod1",
            quantity: 2,
            product: { id: "prod1", name: "Product 1", price: 100 },
          },
        ],
      };

      const mockOrder = {
        id: "order1",
        userId: "user123",
        addressId: "addr1",
        subtotal: 200,
        tax: 20,
        shipping: 50,
        total: 270,
        items: [],
      };

      prisma.cart.findUnique.mockResolvedValueOnce(mockCart);

      // Mock $transaction to call the callback function
      prisma.$transaction.mockImplementationOnce(async (callback) => {
        const mockTx = {
          order: {
            create: jest.fn().mockResolvedValue(mockOrder),
          },
          product: { update: jest.fn().mockResolvedValue({}) },
          cartItem: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
        };
        return await callback(mockTx);
      });

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Order created successfully",
        }),
      );
    });

    it("should return 400 if addressId not provided", async () => {
      req.body = {};

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please provide addressId",
      });
    });

    it("should return 400 if cart is empty", async () => {
      req.body = { addressId: "addr1" };

      prisma.cart.findUnique.mockResolvedValue({
        id: "cart1",
        items: [],
      });

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Cart is empty",
      });
    });

    it("should calculate shipping correctly (free for orders > 500)", async () => {
      req.body = { addressId: "addr1" };

      const mockCart = {
        id: "cart1",
        userId: "user123",
        items: [
          {
            id: "item1",
            productId: "prod1",
            quantity: 10,
            product: { id: "prod1", name: "Product 1", price: 100 },
          },
        ],
      };

      prisma.cart.findUnique.mockResolvedValue(mockCart);

      let createdOrderData;
      prisma.$transaction.mockImplementation(async (callback) => {
        const mockTx = {
          order: {
            create: jest.fn().mockImplementation((data) => {
              createdOrderData = data.data;
              return { id: "order1", ...data.data };
            }),
          },
          product: { update: jest.fn() },
          cartItem: { deleteMany: jest.fn() },
        };
        return callback(mockTx);
      });

      await createOrder(req, res);

      expect(createdOrderData.shipping).toBe(0);
    });
  });

  describe("getMyOrders", () => {
    it("should fetch user orders", async () => {
      const mockOrders = [
        {
          id: "order1",
          userId: "user123",
          total: 270,
          status: "PENDING",
          createdAt: new Date(),
        },
      ];

      prisma.order.findMany.mockResolvedValue(mockOrders);

      await getMyOrders(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { orders: mockOrders },
      });

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: "user123" },
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          address: true,
        },
      });
    });

    it("should handle errors gracefully", async () => {
      prisma.order.findMany.mockRejectedValueOnce(new Error("Database error"));

      await getMyOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Error fetching your orders",
        }),
      );
    });
  });

  describe("getOrderById", () => {
    it("should fetch order by ID for owner", async () => {
      const mockOrder = {
        id: "order1",
        userId: "user123",
        total: 270,
        user: { name: "John", email: "john@example.com" },
      };

      prisma.order.findUnique.mockResolvedValue(mockOrder);

      req.params = { id: "order1" };

      await getOrderById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { order: mockOrder },
      });
    });

    it("should return 404 for customer accessing other user order", async () => {
      const mockOrder = {
        id: "order1",
        userId: "other-user",
      };

      prisma.order.findUnique.mockResolvedValue(mockOrder);

      req.params = { id: "order1" };
      req.user = { id: "user123", role: "CUSTOMER" };

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should allow admin to access any order", async () => {
      const mockOrder = {
        id: "order1",
        userId: "other-user",
        user: { name: "John", email: "john@example.com" },
      };

      prisma.order.findUnique.mockResolvedValue(mockOrder);

      req.params = { id: "order1" };
      req.user = { id: "admin-user", role: "ADMIN" };

      await getOrderById(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
        }),
      );
    });
  });

  describe("updateOrderStatus", () => {
    it("should update order status", async () => {
      const mockOrder = {
        id: "order1",
        userId: "user123",
        status: "SHIPPED",
        user: { email: "user@example.com", name: "John" },
      };

      prisma.order.update.mockResolvedValue(mockOrder);

      req.params = { id: "order1" };
      req.body = { status: "SHIPPED" };

      await updateOrderStatus(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Order status updated to SHIPPED",
        }),
      );
    });

    it("should return 400 if status not provided", async () => {
      req.params = { id: "order1" };
      req.body = {};

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Please provide status",
      });
    });
  });

  describe("cancelOrder", () => {
    it("should cancel order and restore stock", async () => {
      const mockOrder = {
        id: "order1",
        userId: "user123",
        status: "PENDING",
      };

      const mockOrderItems = [
        {
          id: "item1",
          productId: "prod1",
          quantity: 2,
        },
      ];

      prisma.order.findUnique.mockResolvedValueOnce(mockOrder);
      prisma.order.update.mockResolvedValueOnce({
        ...mockOrder,
        status: "CANCELLED",
      });
      prisma.orderItem.findMany.mockResolvedValueOnce(mockOrderItems);
      prisma.product.update.mockResolvedValueOnce({});

      req.params = { id: "order1" };
      req.user = { id: "user123", role: "CUSTOMER" };

      await cancelOrder(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining("cancelled"),
        }),
      );
    });

    it("should not cancel shipped or delivered order", async () => {
      const mockOrder = {
        id: "order1",
        userId: "user123",
        status: "SHIPPED",
      };

      prisma.order.findUnique.mockResolvedValueOnce(mockOrder);

      req.params = { id: "order1" };

      await cancelOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
