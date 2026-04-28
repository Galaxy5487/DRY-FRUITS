import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildProductFilters } from "../utils/apiFeatures.js";

export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 8);
  const filters = buildProductFilters(req.query);

  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort(req.query.sort === "price-asc" ? { price: 1 } : req.query.sort === "price-desc" ? { price: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filters)
  ]);

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(6);
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const reviews = await Review.find({ productId: product._id })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json({ ...product.toObject(), reviews });
});

export const createProduct = asyncHandler(async (req, res) => {
  const images = req.files?.length
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : req.body.images || [];

  const product = await Product.create({
    ...req.body,
    images
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const uploadedImages = req.files?.length
    ? req.files.map((file) => `/uploads/${file.filename}`)
    : undefined;

  Object.assign(product, req.body);
  if (uploadedImages) {
    product.images = uploadedImages;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});
