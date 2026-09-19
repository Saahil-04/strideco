import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-ink">
          Stride<span className="text-ember">Co.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.to ? "text-ember" : "text-ink/70 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="text-sm font-medium text-ink/50 hover:text-ink transition-colors"
          >
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ShoppingBag size={20} className="text-ink/70 hidden md:block" />
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </Link>
          ))}
          <Link to="/admin/login" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/50">
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
