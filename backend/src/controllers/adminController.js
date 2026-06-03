import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [orders, users, products, revenueData, recentOrders] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: { $in: ["Paid", "COD"] } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name")
  ]);

  res.json({
    stats: {
      orders,
      users,
      products,
      revenue: revenueData[0]?.revenue || 0
    },
    recentOrders
  });
});
