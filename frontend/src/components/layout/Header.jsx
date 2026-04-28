import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/wishlist", label: "Wishlist" }
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartItems, wishlist } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-cocoa/10 bg-brand-cream/90 backdrop-blur-md">
      <div className="container-shell flex items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-brand-cocoa">
          NR Dry Fruit
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "text-brand-amber" : "text-brand-cocoa/70 hover:text-brand-cocoa"
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/wishlist" className="relative rounded-full bg-white p-3 shadow-soft">
            <Heart size={18} />
            {wishlist.length ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-brand-amber px-1.5 text-xs text-white">
                {wishlist.length}
              </span>
            ) : null}
          </Link>
          <Link to="/cart" className="relative rounded-full bg-white p-3 shadow-soft">
            <ShoppingBag size={18} />
            {cartItems.length ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-brand-amber px-1.5 text-xs text-white">
                {cartItems.length}
              </span>
            ) : null}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Hi, {user.name.split(" ")[0]}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-brand-cocoa px-4 py-2 text-sm text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="rounded-full bg-brand-cocoa px-4 py-2 text-sm text-white">
              Login
            </Link>
          )}
        </div>

        <button type="button" className="md:hidden" onClick={() => setOpen((value) => !value)}>
          <Menu />
        </button>
      </div>

      {open ? (
        <div className="border-t border-brand-cocoa/10 bg-white md:hidden">
          <div className="container-shell flex flex-col gap-4 py-4">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)}>
              Cart ({cartItems.length})
            </Link>
            <Link to="/wishlist" onClick={() => setOpen(false)}>
              Wishlist ({wishlist.length})
            </Link>
            <Link to={user ? "/orders" : "/login"} onClick={() => setOpen(false)}>
              <span className="inline-flex items-center gap-2">
                <User size={16} /> {user ? user.name : "Account"}
              </span>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
