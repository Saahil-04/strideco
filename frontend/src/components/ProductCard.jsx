import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock < 10;
  const outOfStock = product.stock === 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block rounded-2xl overflow-hidden border border-black/5 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square overflow-hidden bg-sand relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {outOfStock && (
          <span className="absolute top-3 left-3 bg-ink text-white text-xs px-2 py-1 rounded-full">
            Sold out
          </span>
        )}
        {!outOfStock && lowStock && (
          <span className="absolute top-3 left-3 bg-ember text-white text-xs px-2 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-ink/40 mb-1">{product.category}</p>
        <h3 className="font-medium text-ink">{product.name}</h3>
        <p className="text-ink/70 mt-1">₹{product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
