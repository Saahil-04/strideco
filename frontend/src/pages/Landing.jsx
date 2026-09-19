import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    client
      .get("/products")
      .then(({ data }) => setFeatured(data.filter((p) => p.featured).slice(0, 4)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <section className="bg-sand">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-ember font-medium mb-3 tracking-wide uppercase text-sm">New season</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-ink">
              Built for the
              <br />
              miles you run.
            </h1>
            <p className="text-ink/60 mt-5 max-w-md">
              Lightweight, durable, and designed with runners in mind — StrideCo makes shoes
              that keep up whether you're logging your first 5K or your fiftieth marathon.
            </p>
            <Link
              to="/products"
              className="inline-block mt-8 bg-ink text-white px-6 py-3 rounded-full font-medium hover:bg-ink/90 transition-colors"
            >
              Shop the collection
            </Link>
          </div>
          <div className="rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000"
              alt="Running shoe"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ink">Featured</h2>
          <Link to="/products" className="text-sm font-medium text-ember hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
        {featured.length === 0 && (
          <p className="text-ink/40 text-sm">
            No featured products yet — run the seed script on the backend to populate the store.
          </p>
        )}
      </section>

      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <p className="font-display text-3xl font-bold mb-2">Free shipping</p>
            <p className="text-white/60 text-sm">On every order over $75, no minimum tier games.</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold mb-2">30-day returns</p>
            <p className="text-white/60 text-sm">Wear them, run in them, return them if they're not right.</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold mb-2">Made to last</p>
            <p className="text-white/60 text-sm">Reinforced stitching and tested outsoles on every pair.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
