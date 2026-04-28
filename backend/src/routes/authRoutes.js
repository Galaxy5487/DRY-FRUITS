import express from "express";
import { body } from "express-validator";
import { getProfile, loginUser, registerUser, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  loginUser
);

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

export default router;
