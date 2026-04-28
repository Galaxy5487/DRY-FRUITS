import { Coupon } from "../models/Coupon.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }

  if (amount < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is Rs. ${coupon.minOrderAmount}`);
  }

  res.json(coupon);
});
