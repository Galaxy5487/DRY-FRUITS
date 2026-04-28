import express from "express";
import { body } from "express-validator";
import { addReview, getAllReviews, getReviewsByProduct } from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllReviews);
router.get("/:productId", getReviewsByProduct);
router.post(
  "/:productId",
  protect,
  [body("rating").isInt({ min: 1, max: 5 }), body("comment").notEmpty()],
  validateRequest,
  addReview
);

export default router;
