import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { api } from "../api/client";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";

const testimonials = [
  {
    name: "Ritika S.",
    text: "Beautiful packaging, fresh almonds, and the delivery was faster than expected."
  },
  {
    name: "Mohit K.",
    text: "The pistachios were outstanding. This now feels like my go-to premium dry fruit store."
  },
  {
    name: "Samina A.",
    text: "Perfect for gifting. The quality feels carefully curated, not mass-market."
  }
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [{ data: products }, { data: shop }] = await Promise.all([
          api.get("/products/featured"),
          api.get("/shop")
        ]);
        setFeaturedProducts(products);
        setShopInfo(shop);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  if (loading) return <Loader label="Preparing the storefront..." />;

  return (
    <div>
      <section className="container-shell py-10">
        <div className="grid items-center gap-8 rounded-[2rem] bg-brand-cocoa px-8 py-12 text-white shadow-soft md:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-sand">Festive Premium Collection</p>
            <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl">
              Nourishing dry fruits with a premium neighborhood touch.
            </h1>
            <p className="mt-5 max-w-2xl text-white/80">
              Explore handpicked almonds, pistachios, cashews, raisins, and curated gift boxes from NR Dry Fruit.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-brand-gold px-6 py-3 font-medium text-brand-cocoa">
                Shop now
              </Link>
              <span className="rounded-full border border-white/20 px-6 py-3">Offers from 10% off</span>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white/10 p-6">
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
              {[
                { label: "Freshly packed", icon: ShieldCheck },
                { label: "Top rated picks", icon: Star },
                { label: "Store pickup support", icon: MapPin }
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/10 p-5">
                  <item.icon className="text-brand-gold" />
                  <p className="mt-4 text-lg">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Featured</p>
            <h2 className="section-title mt-3">Customer favorites</h2>
          </div>
          <Link to="/products" className="text-sm text-brand-amber">
            View all products
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="card-surface p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Owner</p>
            <h2 className="section-title mt-3">Meet the face behind the shop</h2>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row">
              <img
                src={shopInfo.ownerPhoto}
                alt={shopInfo.ownerName}
                className="h-48 w-48 rounded-3xl object-cover"
              />
              <div>
                <h3 className="font-display text-3xl">{shopInfo.ownerName}</h3>
                <p className="mt-4 text-brand-cocoa/75">{shopInfo.ownerDescription}</p>
                <div className="mt-5 space-y-2 text-sm text-brand-cocoa/80">
                  <p className="inline-flex items-center gap-2">
                    <Phone size={16} /> {shopInfo.contactDetails?.phone}
                  </p>
                  <p>{shopInfo.contactDetails?.email}</p>
                  <p>{shopInfo.shopAddress}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-surface overflow-hidden">
            <iframe
              title="NR Dry Fruit location"
              src={shopInfo.googleMapsEmbedUrl}
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="card-surface p-6">
              <div className="flex items-center gap-1 text-brand-gold">★★★★★</div>
              <p className="mt-4 text-brand-cocoa/80">{item.text}</p>
              <p className="mt-5 font-medium">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
