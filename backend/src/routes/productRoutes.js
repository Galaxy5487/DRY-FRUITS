import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 4),
  [body("name").notEmpty(), body("category").notEmpty(), body("price").isFloat({ min: 0 })],
  validateRequest,
  createProduct
);

router.put("/:id", protect, authorize("admin"), upload.array("images", 4), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

export default router;
