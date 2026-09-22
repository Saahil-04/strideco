import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmed() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <CheckCircle2 size={48} className="text-ember mx-auto mb-4" />
      <h1 className="font-display text-2xl font-bold text-ink mb-2">Order placed</h1>
      <p className="text-ink/50 mb-8">
        Thanks for your order — a confirmation would normally be emailed here.
      </p>
      <Link to="/products" className="text-ember font-medium hover:underline">
        Continue shopping
      </Link>
    </div>
  );
}