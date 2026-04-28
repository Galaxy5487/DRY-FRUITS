import express from "express";
import { createRazorpayOrder, verifyPaymentAndConfirmOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPaymentAndConfirmOrder);

export default router;
