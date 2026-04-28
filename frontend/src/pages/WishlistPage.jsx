import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist } = useCart();

  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Wishlist</p>
        <h1 className="section-title mt-3">Saved favorites for later</h1>
      </div>
      {wishlist.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No saved items yet"
          description="Use the heart icon on any product to keep it handy."
          action={
            <Link to="/products" className="rounded-full bg-brand-cocoa px-6 py-3 text-white">
              Explore products
            </Link>
          }
        />
      )}
    </section>
  );
};

export default WishlistPage;
