import express from "express";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All address routes are protected

router.route("/").get(getAddresses).post(createAddress);

router
  .route("/:id")
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

router.put("/:id/default", setDefaultAddress);

export default router;
