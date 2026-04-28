import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import Loader from "../components/ui/Loader";
import { formatCurrency } from "../utils/currency";

const OrderSummaryPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <Loader label="Loading order summary..." />;
  if (!order) return null;

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Order placed</p>
          <h1 className="section-title mt-3">Thank you for shopping with NR Dry Fruit</h1>
          <div className="mt-8 space-y-4">
            {order.products.map((item) => (
              <div key={item.productId} className="flex items-center justify-between rounded-3xl bg-brand-cream p-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-brand-cocoa/65">Qty {item.quantity}</p>
                </div>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="card-surface h-fit p-8">
          <h2 className="font-display text-3xl">Tracking</h2>
          <div className="mt-6 space-y-4 text-brand-cocoa/75">
            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentStatus}
            </p>
            <p>
              <strong>Total:</strong> {formatCurrency(order.totalAmount)}
            </p>
            <p>
              <strong>Address:</strong> {order.address?.line1}, {order.address?.city}, {order.address?.state}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default OrderSummaryPage;
