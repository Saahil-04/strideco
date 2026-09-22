import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import client from "../api/client";
import { useCart } from "../context/CardContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState(null);
  const [added, setAdded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    client
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        setSize(data.sizes?.[0] ?? null);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-ink/50 mb-4">We couldn't find that product.</p>
        <Link to="/products" className="text-ember font-medium hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!product) return <div className="max-w-6xl mx-auto px-5 py-24 text-ink/40">Loading...</div>;

  // Simple client-side "add to cart" simulation — so this just calls the order endpoint directly to
  // demonstrate the order flow and feed the admin analytics.
  const handleAddToCart = async () => {
    try {
      addItem(product, size, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="max-w-6xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-12">
      <div className="rounded-2xl overflow-hidden bg-sand aspect-square">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-ink/40 mb-2">{product.category}</p>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">{product.name}</h1>
        <p className="text-xl text-ink/80 mb-6">₹{product.price.toFixed(2)}</p>
        <p className="text-ink/60 leading-relaxed mb-8">{product.description}</p>

        <div className="mb-6">
          <p className="text-sm font-medium text-ink mb-2">Size (US)</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-11 h-11 rounded-full border text-sm font-medium transition-colors ${
                  size === s ? "bg-ink text-white border-ink" : "border-black/15 text-ink/70 hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {product.colors?.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-ink mb-2">Colorways</p>
            <p className="text-sm text-ink/60">{product.colors.join(" · ")}</p>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full md:w-auto bg-ember text-white px-8 py-3 rounded-full font-medium hover:bg-ember/90 transition-colors disabled:bg-ink/20 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? "Sold out" : added ? "Added ✓" : "Add to cart"}
        </button>

        <p className="text-xs text-ink/40 mt-3">{product.stock} in stock</p>
      </div>
    </div>
  );
}
