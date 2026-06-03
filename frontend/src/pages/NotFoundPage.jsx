import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="container-shell py-20">
    <div className="card-surface p-12 text-center">
      <h1 className="font-display text-5xl">Page not found</h1>
      <p className="mt-4 text-brand-cocoa/70">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-brand-cocoa px-6 py-3 text-white">
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
