import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";

const CartPage = () => {
  const { cartItems, totals, updateCartQuantity, removeFromCart } = useCart();

  if (!cartItems.length) {
    return (
      <section className="container-shell py-10">
        <EmptyState
          title="Your cart is empty"
          description="Add premium dry fruits and come back here to checkout."
          action={
            <Link to="/products" className="rounded-full bg-brand-cocoa px-6 py-3 text-white">
              Browse products
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={item.images?.[0]} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
              <div className="flex-1">
                <h2 className="font-display text-2xl">{item.name}</h2>
                <p className="mt-2 text-brand-cocoa/70">{formatCurrency(item.price)}</p>
              </div>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(event) => updateCartQuantity(item._id, event.target.value)}
                className="w-24 rounded-full border border-brand-cocoa/10 px-4 py-2"
              />
              <button
                type="button"
                onClick={() => removeFromCart(item._id)}
                className="rounded-full border border-brand-cocoa/10 px-4 py-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="card-surface h-fit p-6">
          <h2 className="font-display text-3xl">Order summary</h2>
          <div className="mt-6 space-y-3 text-brand-cocoa/75">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(totals.shipping)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-brand-cocoa">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 block rounded-full bg-brand-cocoa px-6 py-3 text-center text-white">
            Continue to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default CartPage;
