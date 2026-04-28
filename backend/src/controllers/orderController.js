import crypto from "crypto";
import { razorpayClient } from "../config/razorpay.js";
import { Coupon } from "../models/Coupon.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { calculateOrderTotals } from "../utils/calculateOrder.js";

const hydrateOrderItems = async (items) => {
  // Snapshot product pricing and stock at checkout time so order history remains consistent.
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return items.map((item) => {
    const product = productMap.get(String(item.productId));

    if (!product) {
      throw new Error("One or more products are unavailable");
    }

    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    return {
      productId: product._id,
      name: product.name,
      image: product.images?.[0],
      quantity: item.quantity,
      price: product.price
    };
  });
};

const getValidCoupon = async (couponCode, subtotal) => {
  if (!couponCode) {
    return null;
  }

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw new Error("Coupon has expired");
  }

  if (subtotal < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount is Rs. ${coupon.minOrderAmount}`);
  }

  return coupon;
};

export const createOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod, address, couponCode, razorpayOrderId } = req.body;

  const hydratedItems = await hydrateOrderItems(items);
  const rawSubtotal = hydratedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = await getValidCoupon(couponCode, rawSubtotal);
  const totals = calculateOrderTotals({ items: hydratedItems, coupon });

  const order = await Order.create({
    userId: req.user._id,
    products: hydratedItems,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "COD" : "Pending",
    subtotal: totals.subtotal,
    shippingFee: totals.shippingFee,
    discountAmount: totals.discountAmount,
    totalAmount: totals.totalAmount,
    orderStatus: paymentMethod === "COD" ? "Confirmed" : "Pending",
    address,
    couponCode: coupon?.code,
    razorpayOrderId
  });

  await Promise.all(
    hydratedItems.map((item) =>
      Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    )
  );

  const user = await User.findById(req.user._id);
  await sendOrderConfirmationEmail({ to: user?.email, order });

  res.status(201).json(order);
});

export const verifyPaymentAndConfirmOrder = asyncHandler(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    order.paymentStatus = "Failed";
    await order.save();
    res.status(400);
    throw new Error("Payment verification failed");
  }

  order.paymentStatus = "Paid";
  order.orderStatus = "Confirmed";
  order.razorpayPaymentId = razorpayPaymentId;
  await order.save();

  res.json({ message: "Payment verified", order });
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  if (!razorpayClient) {
    res.status(500);
    throw new Error("Razorpay is not configured");
  }

  const { items, couponCode } = req.body;
  const hydratedItems = await hydrateOrderItems(items);
  const rawSubtotal = hydratedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = await getValidCoupon(couponCode, rawSubtotal);
  const totals = calculateOrderTotals({ items: hydratedItems, coupon });

  const razorpayOrder = await razorpayClient.orders.create({
    amount: totals.totalAmount * 100,
    currency: "INR",
    receipt: `nr-${Date.now()}`
  });

  res.json({
    razorpayOrder,
    totals,
    key: process.env.RAZORPAY_KEY_ID
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("userId", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (req.user.role !== "admin" && String(order.userId._id) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Forbidden");
  }

  res.json(order);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.paymentStatus) {
    order.paymentStatus = req.body.paymentStatus;
  }

  await order.save();
  res.json(order);
});
