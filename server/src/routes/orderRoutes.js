import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAdminOrders,
  getAdminStats,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Admin routes
router.get('/admin/orders', admin, getAdminOrders);
router.get('/admin/stats', admin, getAdminStats);

// User routes
router.route('/').post(createOrder).get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(admin, updateOrderStatus);
router.route('/:id/cancel').patch(cancelOrder);

export default router;
