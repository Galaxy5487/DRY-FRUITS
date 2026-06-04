import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { env } from "./config/env.js";
import { defaultCoupons, defaultProducts, defaultShopInfo, defaultUsers } from "./data/defaultData.js";

const app = express();
const orders = [];
const reviews = [
  {
    _id: "review-almonds-1",
    userId: { name: "Aisha Khan", email: "aisha@example.com" },
    productId: "product-1",
    rating: 5,
    comment: "Fresh, crunchy, and very premium packaging."
  }
];

const products = defaultProducts.map((product, index) => ({
  ...product,
  _id: `product-${index + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

const users = defaultUsers.map((user, index) => ({
  ...user,
  _id: `user-${index + 1}`
}));

const isAllowedOrigin = (origin) => {
  if (!origin || env.clientUrls.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === "https:" && (hostname.endsWith(".vercel.app") || hostname.endsWith(".netlify.app"));
  } catch {
    return false;
  }
};

const signUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  address: user.address,
  token: jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
});

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], env.jwtSecret);
    const user = users.find((item) => item._id === decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
};

app.use(
  cors({
    origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
    credentials: true
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "serverless-demo" });
});

app.post("/api/auth/login", (req, res) => {
  const user = users.find((item) => item.email === req.body.email);
  const expectedPassword = user?.role === "admin" ? "Admin@123" : "Customer@123";
  if (!user || req.body.password !== expectedPassword) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  res.json(signUser(user));
});

app.post("/api/auth/register", (req, res) => {
  const exists = users.some((user) => user.email === req.body.email);
  if (exists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = {
    _id: `user-${users.length + 1}`,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: "customer",
    address: req.body.address
  };
  users.push(user);
  res.status(201).json(signUser(user));
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const { password, ...user } = req.user;
  res.json(user);
});

app.get("/api/products/featured", (req, res) => {
  res.json(products.filter((product) => product.isFeatured));
});

app.get("/api/products", (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);
  const search = String(req.query.search || "").toLowerCase();
  const filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);
    const matchesCategory = !req.query.category || product.category === req.query.category;
    const matchesRating = !req.query.rating || product.averageRating >= Number(req.query.rating);
    const matchesMin = !req.query.minPrice || product.price >= Number(req.query.minPrice);
    const matchesMax = !req.query.maxPrice || product.price <= Number(req.query.maxPrice);
    return matchesSearch && matchesCategory && matchesRating && matchesMin && matchesMax;
  });
  const start = (page - 1) * limit;

  res.json({
    products: filtered.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: filtered.length,
      pages: Math.max(Math.ceil(filtered.length / limit), 1)
    }
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((item) => item._id === req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  res.json({
    ...product,
    reviews: reviews.filter((review) => review.productId === product._id)
  });
});

app.get("/api/reviews", requireAuth, requireAdmin, (req, res) => {
  res.json(reviews);
});

app.get("/api/reviews/:productId", (req, res) => {
  res.json(reviews.filter((review) => review.productId === req.params.productId));
});

app.post("/api/reviews/:productId", requireAuth, (req, res) => {
  const review = {
    _id: `review-${Date.now()}`,
    userId: { name: req.user.name, email: req.user.email },
    productId: req.params.productId,
    rating: Number(req.body.rating),
    comment: req.body.comment
  };
  reviews.push(review);
  res.status(201).json(review);
});

app.get("/api/shop", (req, res) => {
  res.json(defaultShopInfo);
});

app.post("/api/coupons/validate", (req, res) => {
  const coupon = defaultCoupons.find((item) => item.code === String(req.body.code || "").toUpperCase());
  if (!coupon) {
    res.status(404).json({ message: "Coupon not found" });
    return;
  }
  res.json(coupon);
});

app.post("/api/orders", requireAuth, (req, res) => {
  const items = req.body.items.map((item) => {
    const product = products.find((entry) => entry._id === item.productId);
    return {
      productId: product._id,
      name: product.name,
      image: product.images[0],
      quantity: Number(item.quantity),
      price: product.price
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 1500 ? 0 : 99;
  const order = {
    _id: `order-${Date.now()}`,
    userId: req.user._id,
    products: items,
    subtotal,
    shippingFee,
    discountAmount: 0,
    totalAmount: subtotal + shippingFee,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: req.body.paymentMethod === "COD" ? "COD" : "Pending",
    orderStatus: req.body.paymentMethod === "COD" ? "Confirmed" : "Pending",
    address: req.body.address,
    createdAt: new Date().toISOString()
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get("/api/orders/mine", requireAuth, (req, res) => {
  res.json(orders.filter((order) => order.userId === req.user._id));
});

app.get("/api/orders", requireAuth, requireAdmin, (req, res) => {
  res.json(orders);
});

app.get("/api/orders/:id", requireAuth, (req, res) => {
  const order = orders.find((item) => item._id === req.params.id);
  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }
  res.json(order);
});

app.get("/api/admin/stats", requireAuth, requireAdmin, (req, res) => {
  res.json({
    stats: {
      orders: orders.length,
      users: users.length,
      products: products.length,
      revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    },
    recentOrders: orders.slice(-5).reverse()
  });
});

export const demoApp = app;
