import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import Loader from "../../components/ui/Loader";

const initialForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  stock: "",
  images: "",
  isFeatured: false
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 50 } });
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images.split(",").map((item) => item.trim()).filter(Boolean)
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
      toast.success("Product updated");
    } else {
      await api.post("/products", payload);
      toast.success("Product created");
    }

    setForm(initialForm);
    setEditingId("");
    loadProducts();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      stock: product.stock,
      images: product.images.join(", "),
      isFeatured: product.isFeatured
    });
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    loadProducts();
  };

  if (loading) return <Loader label="Loading products..." />;

  return (
    <section className="container-shell py-10">
      <h1 className="section-title">Manage products</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="card-surface p-6">
          <h2 className="font-display text-3xl">{editingId ? "Edit product" : "Add product"}</h2>
          <div className="mt-6 space-y-4">
            {["name", "category", "price", "stock", "images"].map((field) => (
              <input
                key={field}
                value={form[field]}
                placeholder={field}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
              />
            ))}
            <textarea
              rows="5"
              value={form.description}
              placeholder="description"
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
            />
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
              />
              Featured product
            </label>
            <button type="submit" className="rounded-full bg-brand-cocoa px-6 py-3 text-white">
              {editingId ? "Update product" : "Create product"}
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product._id} className="card-surface flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <img src={product.images?.[0]} alt={product.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-brand-cocoa/70">
                  {product.category} • Rs. {product.price} • Stock {product.stock}
                </p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => editProduct(product)} className="rounded-full border px-4 py-2">
                  Edit
                </button>
                <button type="button" onClick={() => deleteProduct(product._id)} className="rounded-full border px-4 py-2">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminProductsPage;
