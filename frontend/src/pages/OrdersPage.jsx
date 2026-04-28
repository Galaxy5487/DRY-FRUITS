import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatCurrency } from "../utils/currency";

const statusTone = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700"
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/mine");
        setOrders(data);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;

  return (
    <section className="container-shell py-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Orders</p>
        <h1 className="section-title mt-3">Track your recent purchases</h1>
      </div>
      {orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card-surface flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center"
            >
              <div>
                <p className="text-sm text-brand-cocoa/60">Order #{order._id.slice(-6)}</p>
                <p className="mt-2 font-medium">{order.products.length} items</p>
              </div>
              <div className="text-sm text-brand-cocoa/70">{formatCurrency(order.totalAmount)}</div>
              <span className={`rounded-full px-3 py-2 text-sm ${statusTone[order.orderStatus] || "bg-gray-100"}`}>
                {order.orderStatus}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No orders yet" description="Once you place an order, it will appear here." />
      )}
    </section>
  );
};

export default OrdersPage;
