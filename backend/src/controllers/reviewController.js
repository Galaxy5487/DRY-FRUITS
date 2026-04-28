import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const refreshProductRatings = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { productId } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  await Product.findByIdAndUpdate(productId, {
    averageRating: stats[0]?.averageRating ? Number(stats[0].averageRating.toFixed(1)) : 0,
    numReviews: stats[0]?.numReviews || 0
  });
};

export const getReviewsByProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ productId: req.params.productId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = await Review.findOneAndUpdate(
    { userId: req.user._id, productId: product._id },
    { rating, comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  await refreshProductRatings(product._id);
  res.status(201).json(review);
});

export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("userId", "name email")
    .populate("productId", "name")
    .sort({ createdAt: -1 });

  res.json(reviews);
});
