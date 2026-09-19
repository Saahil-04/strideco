import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Pencil, Trash2, Plus, LogOut } from "lucide-react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import ProductFormModal from "../components/ProductFormModal";

const COLORS = ["#e2582c", "#141414", "#c9a97a", "#7c9885", "#8b6f9e"];

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [tab, setTab] = useState("overview");

  const loadAll = async () => {
    const [s, r, c, t, p] = await Promise.all([
      client.get("/analytics/summary"),
      client.get("/analytics/revenue-by-day"),
      client.get("/analytics/category-breakdown"),
      client.get("/analytics/top-products"),
      client.get("/products"),
    ]);
    setSummary(s.data);
    setRevenueByDay(r.data);
    setCategoryData(c.data);
    setTopProducts(t.data);
    setProducts(p.data);
  };

  useEffect(() => {
    loadAll().catch((err) => {
      if (err.response?.status === 401) {
        logout();
        navigate("/admin/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (payload) => {
    if (editingProduct) {
      await client.put(`/products/${editingProduct._id}`, payload);
    } else {
      await client.post("/products", payload);
    }
    setModalOpen(false);
    setEditingProduct(null);
    loadAll();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await client.delete(`/products/${id}`);
    loadAll();
  };

  if (!summary) {
    return <div className="max-w-6xl mx-auto px-5 py-24 text-ink/40">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Admin dashboard</h1>
          <p className="text-ink/50 text-sm">Welcome back, {admin?.name || admin?.email}</p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        {["overview", "products"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
              tab === t ? "bg-ink text-white" : "bg-sand text-ink/70"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total revenue" value={`$${summary.totalRevenue.toFixed(2)}`} />
            <StatCard label="Orders" value={summary.totalOrders} />
            <StatCard label="Products" value={summary.totalProducts} />
            <StatCard label="Low stock" value={summary.lowStockCount} accent />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="md:col-span-2 border border-black/5 rounded-2xl p-5">
              <h3 className="font-medium text-ink mb-4">Revenue — last 30 days</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#e2582c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-black/5 rounded-2xl p-5">
              <h3 className="font-medium text-ink mb-4">Units sold by category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="unitsSold"
                    nameKey="category"
                    outerRadius={80}
                    label={(d) => d.category}
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-black/5 rounded-2xl p-5">
              <h3 className="font-medium text-ink mb-4">Top-selling products</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#141414" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="border border-black/5 rounded-2xl p-5">
              <h3 className="font-medium text-ink mb-4">Orders per day — last 30 days</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueByDay}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#e2582c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {tab === "products" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-ember text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-ember/90"
            >
              <Plus size={16} /> Add product
            </button>
          </div>

          <div className="border border-black/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-sand text-ink/60 text-left">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Sold</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-black/5">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                      {p.name}
                    </td>
                    <td className="px-4 py-3 capitalize text-ink/60">{p.category}</td>
                    <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                    <td className={`px-4 py-3 ${p.stock < 10 ? "text-ember font-medium" : ""}`}>{p.stock}</td>
                    <td className="px-4 py-3">{p.sold}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil size={16} className="text-ink/50 hover:text-ink" />
                        </button>
                        <button onClick={() => handleDelete(p._id)}>
                          <Trash2 size={16} className="text-ink/50 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="border border-black/5 rounded-2xl p-5">
      <p className="text-ink/50 text-sm mb-1">{label}</p>
      <p className={`font-display text-2xl font-bold ${accent ? "text-ember" : "text-ink"}`}>{value}</p>
    </div>
  );
}
