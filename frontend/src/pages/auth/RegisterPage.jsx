import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: {
      fullName: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India"
    }
  });

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateAddress = (key, value) =>
    setForm((current) => ({ ...current, address: { ...current.address, [key]: value } }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate("/");
  };

  return (
    <section className="container-shell py-16">
      <div className="mx-auto max-w-2xl card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Join us</p>
        <h1 className="mt-3 font-display text-4xl">Create your account</h1>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.address.phone}
            onChange={(event) => updateAddress("phone", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="text"
            placeholder="Address line"
            value={form.address.line1}
            onChange={(event) => updateAddress("line1", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3 md:col-span-2"
          />
          <input
            type="text"
            placeholder="City"
            value={form.address.city}
            onChange={(event) => updateAddress("city", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="text"
            placeholder="State"
            value={form.address.state}
            onChange={(event) => updateAddress("state", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="text"
            placeholder="Postal code"
            value={form.address.postalCode}
            onChange={(event) => updateAddress("postalCode", event.target.value)}
            className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-brand-cocoa px-6 py-3 text-white md:col-span-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-5 text-sm text-brand-cocoa/70">
          Already have an account? <Link to="/login" className="text-brand-amber">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
