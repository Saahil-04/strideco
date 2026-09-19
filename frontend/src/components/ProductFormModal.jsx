import { useState, useEffect } from "react";
import { X } from "lucide-react";

const CATEGORIES = ["running", "lifestyle", "basketball", "training", "sandals"];

const empty = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "running",
  sizes: "7,8,9,10,11",
  colors: "Black",
  stock: "",
  image: "",
  featured: false,
};

export default function ProductFormModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        sizes: product.sizes.join(","),
        colors: product.colors.join(","),
      });
    } else {
      setForm(empty);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      sizes: form.sizes.split(",").map((s) => parseInt(s.trim(), 10)).filter(Boolean),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      slug:
        form.slug ||
        form.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-ink">
            {product ? "Edit product" : "Add product"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-ink">Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Description</label>
            <textarea
              name="description"
              required
              rows={3}
              value={form.description}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-ink">Price ($)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Stock</label>
              <input
                name="stock"
                type="number"
                required
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1 capitalize"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Sizes (comma separated)</label>
            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Colors (comma separated)</label>
            <input
              name="colors"
              value={form.colors}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Image URL</label>
            <input
              name="image"
              required
              value={form.image}
              onChange={handleChange}
              className="w-full border border-black/10 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured on homepage
          </label>

          <button
            type="submit"
            className="w-full bg-ink text-white rounded-lg py-2.5 font-medium hover:bg-ink/90 transition-colors mt-2"
          >
            {product ? "Save changes" : "Create product"}
          </button>
        </form>
      </div>
    </div>
  );
}
