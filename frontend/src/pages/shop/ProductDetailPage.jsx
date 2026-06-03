import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import RatingStars from "../../components/ui/RatingStars";
import { formatCurrency } from "../../utils/currency";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to review");
      return;
    }

    await api.post(`/reviews/${id}`, reviewForm);
    toast.success("Review submitted");
    setReviewForm({ rating: 5, comment: "" });
    loadProduct();
  };

  if (loading) return <Loader label="Loading product..." />;
  if (!product) return null;

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="card-surface overflow-hidden">
          <img src={product.images?.[0]} alt={product.name} className="h-full max-h-[520px] w-full object-cover" />
        </div>
        <div className="card-surface p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">{product.category}</p>
          <h1 className="mt-3 font-display text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <RatingStars rating={product.averageRating} />
            <span className="text-brand-cocoa/70">{product.numReviews} reviews</span>
          </div>
          <p className="mt-6 text-brand-cocoa/75">{product.description}</p>
          <div className="mt-6 flex items-center gap-6">
            <span className="text-3xl font-semibold">{formatCurrency(product.price)}</span>
            <span className="rounded-full bg-brand-sand px-4 py-2 text-sm">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              disabled={product.stock < 1}
              onClick={() => addToCart(product)}
              className="rounded-full bg-brand-cocoa px-6 py-3 text-white disabled:opacity-50"
            >
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="rounded-full border border-brand-cocoa/10 px-6 py-3"
            >
              Save to wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface p-8">
          <h2 className="font-display text-3xl">Customer reviews</h2>
          <div className="mt-6 space-y-5">
            {product.reviews?.length ? (
              product.reviews.map((review) => (
                <div key={review._id} className="rounded-3xl bg-brand-cream p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.userId?.name}</h3>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="mt-3 text-brand-cocoa/75">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-brand-cocoa/70">No reviews yet. Be the first to share your thoughts.</p>
            )}
          </div>
        </div>

        <form onSubmit={submitReview} className="card-surface p-8">
          <h2 className="font-display text-3xl">Write a review</h2>
          <div className="mt-6 space-y-4">
            <select
              value={reviewForm.rating}
              onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}
              className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
            <textarea
              rows="5"
              placeholder="Tell others what you liked"
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
              className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
            />
            <button type="submit" className="rounded-full bg-brand-amber px-6 py-3 text-white">
              Submit review
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProductDetailPage;
