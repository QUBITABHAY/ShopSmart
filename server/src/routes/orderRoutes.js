import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder).get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(admin, updateOrderStatus);
router.route('/:id/cancel').patch(cancelOrder);

export default router;
