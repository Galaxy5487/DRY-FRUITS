import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";

const AdminShopPage = () => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/shop");
      setForm(data);
    };

    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.put("/shop", form);
    toast.success("Shop info updated");
  };

  if (!form) return <Loader label="Loading shop info..." />;

  return (
    <section className="container-shell py-10">
      <h1 className="section-title">Shop information</h1>
      <form onSubmit={handleSubmit} className="mt-8 card-surface p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {["shopName", "ownerName", "ownerPhoto", "shopAddress", "latitude", "longitude", "googleMapsEmbedUrl"].map((field) => (
            <input
              key={field}
              value={form[field] || ""}
              placeholder={field}
              onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
              className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
            />
          ))}
          <input
            value={form.contactDetails?.phone || ""}
            placeholder="contact phone"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                contactDetails: { ...current.contactDetails, phone: event.target.value }
              }))
            }
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            value={form.contactDetails?.email || ""}
            placeholder="contact email"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                contactDetails: { ...current.contactDetails, email: event.target.value }
              }))
            }
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
        </div>
        <textarea
          rows="5"
          value={form.ownerDescription || ""}
          placeholder="owner description"
          onChange={(event) => setForm((current) => ({ ...current, ownerDescription: event.target.value }))}
          className="mt-4 w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
        />
        <button type="submit" className="mt-6 rounded-full bg-brand-cocoa px-6 py-3 text-white">
          Save changes
        </button>
      </form>
    </section>
  );
};

export default AdminShopPage;
