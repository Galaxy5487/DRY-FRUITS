import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import RatingStars from "../ui/RatingStars";
import { formatCurrency } from "../../utils/currency";

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const inWishlist = wishlist.some((item) => item._id === product._id);

  return (
    <article className="group card-surface overflow-hidden">
      <div className="relative">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute right-4 top-4 rounded-full p-3 ${
            inWishlist ? "bg-brand-amber text-white" : "bg-white/85 text-brand-cocoa"
          }`}
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-amber">{product.category}</p>
        <Link to={`/products/${product._id}`} className="mt-2 block font-display text-2xl">
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <RatingStars rating={product.averageRating} />
          <span className="text-sm text-brand-cocoa/60">{product.numReviews} reviews</span>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xl font-semibold">{formatCurrency(product.price)}</span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="rounded-full bg-brand-cocoa px-4 py-2 text-sm text-white hover:bg-brand-amber"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
