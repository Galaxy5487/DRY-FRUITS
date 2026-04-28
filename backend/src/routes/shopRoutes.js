import express from "express";
import { getShopInfo, updateShopInfo } from "../controllers/shopController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getShopInfo);
router.put("/", protect, authorize("admin"), upload.single("ownerPhoto"), updateShopInfo);

export default router;
