import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CardContext";
import client from "../api/client";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  const handleBuy = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      await client.post("/orders", {
        customerName: form.name,
        customerEmail: form.email,
        items: items.map((i) => ({
          product: i.product,
          name: i.name,
          price: i.price,
          size: i.size,
          quantity: i.quantity,
        })),
      });
      clearCart();
      navigate("/order-confirmed");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <p className="text-ink/50 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-ember font-medium hover:underline">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <h1 className="font-display text-2xl font-bold text-ink mb-6">Your cart</h1>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-4 border-b border-black/5 pb-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover bg-sand" />
              <div className="flex-1">
                <p className="font-medium text-ink">{item.name}</p>
                <p className="text-sm text-ink/50">Size {item.size}</p>
                <p className="text-sm text-ink/70 mt-1">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.key)}>
                  <Trash2 size={16} className="text-ink/40 hover:text-red-600" />
                </button>
                <div className="flex items-center gap-2 border border-black/10 rounded-full px-2 py-1">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                  >
                    <Plus size={14} className={item.quantity >= item.maxStock ? "opacity-30" : ""} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="border border-black/5 rounded-2xl p-5 sticky top-24">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink/60">Subtotal</span>
            <span className="font-medium text-ink">₹{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-ink/40 mb-4">Shipping and taxes calculated at a real checkout.</p>

          <form onSubmit={handleBuy} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember/30"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-black/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ember/30"
            />

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={placing}
              className="w-full bg-ember text-white rounded-full py-2.5 font-medium hover:bg-ember/90 transition-colors disabled:opacity-50"
            >
              {placing ? "Placing order..." : "Buy now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}