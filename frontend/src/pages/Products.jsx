import { useEffect, useState } from "react";
import client from "../api/client";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["all", "running", "lifestyle", "basketball", "training", "sandals"];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "all") params.category = category;
    if (search) params.search = search;
    if (sort === "price_asc") params.sort = "price_asc";
    if (sort === "price_desc") params.sort = "price_desc";

    client
      .get("/products", { params })
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort, search]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Shop all shoes</h1>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                category === c ? "bg-ink text-white" : "bg-sand text-ink/70 hover:bg-ink/10"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-black/10 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ember/30"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-black/10 rounded-full px-3 py-1.5 text-sm focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-ink/40">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-ink/40">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
