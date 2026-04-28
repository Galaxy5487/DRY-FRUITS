import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import ProductFilters from "../../components/product/ProductFilters";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import { api } from "../../api/client";
import { useDebounce } from "../../hooks/useDebounce";

const ProductsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    search: "",
    sort: ""
  });
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(filters.search, 500);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products", {
          params: {
            ...filters,
            search: debouncedSearch,
            page: pagination.page
          }
        });
        setProducts(data.products);
        setPagination(data.pagination);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, filters.category, filters.maxPrice, filters.minPrice, filters.rating, filters.sort, pagination.page]);

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <section className="container-shell py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-amber">Catalogue</p>
          <h1 className="section-title mt-3">Premium dry fruits and daily essentials</h1>
        </div>
        <div className="flex gap-3">
          <input
            type="search"
            placeholder="Search products"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            className="rounded-full border border-brand-cocoa/10 bg-white px-5 py-3"
          />
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            className="rounded-full border border-brand-cocoa/10 bg-white px-5 py-3"
          >
            <option value="">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <ProductFilters filters={filters} setFilters={setFilters} categories={categories} />
      </div>

      {loading ? <Loader /> : null}
      {!loading && !products.length ? (
        <EmptyState title="No products found" description="Try adjusting the filters or search term." />
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={pagination.page <= 1}
          onClick={() => setPagination((current) => ({ ...current, page: current.page - 1 }))}
          className="rounded-full border border-brand-cocoa/10 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.pages || 1}
        </span>
        <button
          type="button"
          disabled={pagination.page >= pagination.pages}
          onClick={() => setPagination((current) => ({ ...current, page: current.page + 1 }))}
          className="rounded-full border border-brand-cocoa/10 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductsPage;
