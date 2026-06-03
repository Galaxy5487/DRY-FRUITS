const ProductFilters = ({ filters, setFilters, categories }) => {
  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  return (
    <div className="card-surface grid gap-4 p-5 md:grid-cols-4">
      <select
        value={filters.category}
        onChange={(event) => update("category", event.target.value)}
        className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        placeholder="Min price"
        value={filters.minPrice}
        onChange={(event) => update("minPrice", event.target.value)}
        className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
      />
      <input
        type="number"
        min="0"
        placeholder="Max price"
        value={filters.maxPrice}
        onChange={(event) => update("maxPrice", event.target.value)}
        className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
      />
      <select
        value={filters.rating}
        onChange={(event) => update("rating", event.target.value)}
        className="rounded-2xl border border-brand-cocoa/10 bg-white px-4 py-3"
      >
        <option value="">All ratings</option>
        <option value="4">4 stars and above</option>
        <option value="3">3 stars and above</option>
      </select>
    </div>
  );
};

export default ProductFilters;
