import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await login(form);
    navigate(location.state?.from?.pathname || "/");
  };

  return (
    <section className="container-shell py-16">
      <div className="mx-auto max-w-md card-surface p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Account</p>
        <h1 className="mt-3 font-display text-4xl">Login</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
          />
          <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-cocoa px-6 py-3 text-white">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 text-sm text-brand-cocoa/70">
          New here? <Link to="/register" className="text-brand-amber">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
