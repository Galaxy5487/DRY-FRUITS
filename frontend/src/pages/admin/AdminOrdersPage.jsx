import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, orderStatus) => {
    await api.patch(`/orders/${id}/status`, { orderStatus });
    toast.success("Order updated");
    loadOrders();
  };

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <section className="container-shell py-10">
      <h1 className="section-title">Manage orders</h1>
      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card-surface p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{order.userId?.name}</p>
                <p className="text-sm text-brand-cocoa/70">
                  {order.products.length} items • {order.paymentMethod} • {order.paymentStatus}
                </p>
              </div>
              <select
                value={order.orderStatus}
                onChange={(event) => updateStatus(order._id, event.target.value)}
                className="rounded-full border border-brand-cocoa/10 bg-white px-4 py-3"
              >
                {["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminOrdersPage;
