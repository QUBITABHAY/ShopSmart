import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";
import { protect, admin, master } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin-only user management routes
router.use(protect);

router.get("/", master, getAllUsers);
router.patch("/:id/role", master, updateUserRole);

export default router;
