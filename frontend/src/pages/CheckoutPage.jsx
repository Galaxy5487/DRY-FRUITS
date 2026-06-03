import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const defaultAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India"
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totals, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState(user?.address || defaultAddress);
  const onlinePaymentsEnabled = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);

  const grandTotal = useMemo(() => {
    const discount = coupon
      ? coupon.discountType === "percentage"
        ? Math.round((totals.subtotal * coupon.discountValue) / 100)
        : coupon.discountValue
      : 0;
    return Math.max(totals.total - discount, 0);
  }, [coupon, totals.subtotal, totals.total]);

  const applyCoupon = async () => {
    const { data } = await api.post("/coupons/validate", {
      code: couponCode,
      amount: totals.subtotal
    });
    setCoupon(data);
    toast.success(`Coupon ${data.code} applied`);
  };

  const buildOrderPayload = (extra = {}) => ({
    items: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
    paymentMethod,
    address,
    couponCode: coupon?.code,
    ...extra
  });

  const placeCodOrder = async () => {
    const { data } = await api.post("/orders", buildOrderPayload());
    clearCart();
    navigate(`/orders/${data._id}`);
  };

  const placeOnlineOrder = async () => {
    if (!onlinePaymentsEnabled) {
      toast.error("Online payments are not configured yet. Please use Cash on Delivery.");
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Unable to load Razorpay");
      return;
    }

    const { data } = await api.post("/payments/create-order", buildOrderPayload());

    // The actual order is stored only after Razorpay returns a successful payment response.
    const razorpay = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || data.key,
      amount: data.razorpayOrder.amount,
      currency: "INR",
      name: "NR Dry Fruit",
      description: "Premium dry fruit order",
      order_id: data.razorpayOrder.id,
      handler: async (response) => {
        const created = await api.post(
          "/orders",
          buildOrderPayload({
            razorpayOrderId: data.razorpayOrder.id,
            paymentMethod: "Online"
          })
        );

        await api.post("/payments/verify", {
          orderId: created.data._id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature
        });

        clearCart();
        navigate(`/orders/${created.data._id}`);
      },
      prefill: {
        name: address.fullName,
        email: user?.email,
        contact: address.phone
      },
      theme: {
        color: "#b86a28"
      }
    });

    razorpay.open();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === "COD") {
        await placeCodOrder();
      } else {
        await placeOnlineOrder();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="card-surface p-8">
          <h1 className="font-display text-4xl">Checkout</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {Object.entries(address).map(([key, value]) => (
              <input
                key={key}
                value={value}
                placeholder={key}
                onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
              />
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-semibold">Payment method</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {["Online", "COD"].map((method) => (
                <label key={method} className="rounded-3xl border border-brand-cocoa/10 bg-white p-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    disabled={method === "Online" && !onlinePaymentsEnabled}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    className="mr-3"
                  />
                  {method === "Online"
                    ? onlinePaymentsEnabled
                      ? "Pay securely with Razorpay"
                      : "Razorpay unavailable in local demo"
                    : "Cash on Delivery"}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 rounded-full bg-brand-cocoa px-6 py-3 text-white disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Place order"}
          </button>
        </form>

        <aside className="card-surface h-fit p-8">
          <h2 className="font-display text-3xl">Bill details</h2>
          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="flex-1 rounded-full border border-brand-cocoa/10 bg-white px-4 py-3"
            />
            <button type="button" onClick={applyCoupon} className="rounded-full bg-brand-amber px-5 py-3 text-white">
              Apply
            </button>
          </div>
          {coupon ? <p className="mt-3 text-sm text-brand-olive">{coupon.description}</p> : null}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(totals.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{formatCurrency(totals.total - grandTotal)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Payable</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CheckoutPage;
