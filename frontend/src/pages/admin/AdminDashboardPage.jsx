import { useEffect, useState } from "react";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";
import { formatCurrency } from "../../utils/currency";

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get("/admin/stats");
      setData(response.data);
    };

    load();
  }, []);

  if (!data) return <Loader label="Loading dashboard..." />;

  return (
    <section className="container-shell py-10">
      <h1 className="section-title">Admin dashboard</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-4">
        {[
          ["Orders", data.stats.orders],
          ["Users", data.stats.users],
          ["Products", data.stats.products],
          ["Revenue", formatCurrency(data.stats.revenue)]
        ].map(([label, value]) => (
          <div key={label} className="card-surface p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">{label}</p>
            <p className="mt-4 font-display text-4xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 card-surface p-6">
        <h2 className="font-display text-3xl">Recent orders</h2>
        <div className="mt-6 space-y-3">
          {data.recentOrders.map((order) => (
            <div key={order._id} className="flex items-center justify-between rounded-2xl bg-brand-cream p-4">
              <span>{order.userId?.name}</span>
              <span>{order.orderStatus}</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
