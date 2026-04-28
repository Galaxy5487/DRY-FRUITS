import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const readStorage = (key, fallback) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
};

export const CartProvider = ({ children }) => {
  // Cart and wishlist live in localStorage so users keep their selections between refreshes.
  const [cartItems, setCartItems] = useState(() => readStorage("nr-cart", []));
  const [wishlist, setWishlist] = useState(() => readStorage("nr-wishlist", []));

  useEffect(() => {
    localStorage.setItem("nr-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("nr-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }
      return [...current, { ...product, quantity }];
    });
    toast.success("Added to cart");
  };

  const updateCartQuantity = (_id, quantity) => {
    setCartItems((current) =>
      current
        .map((item) => (item._id === _id ? { ...item, quantity: Number(quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (_id) => {
    setCartItems((current) => current.filter((item) => item._id !== _id));
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item._id === product._id);
      if (exists) {
        toast.success("Removed from wishlist");
        return current.filter((item) => item._id !== product._id);
      }
      toast.success("Saved to wishlist");
      return [...current, product];
    });
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 1500 ? 0 : cartItems.length ? 99 : 0;
    return {
      subtotal,
      shipping,
      total: subtotal + shipping
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        totals,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
