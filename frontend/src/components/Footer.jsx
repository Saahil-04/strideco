export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row justify-between gap-6 text-sm text-ink/60">
        <div>
          <p className="font-display font-bold text-ink text-base mb-1">StrideCo.</p>
          <p>Shoes built for the miles you actually run.</p>
        </div>
        <div className="flex gap-10">
          <div>
            <p className="font-medium text-ink mb-2">Shop</p>
            <ul className="space-y-1">
              <li>Running</li>
              <li>Lifestyle</li>
              <li>Basketball</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-ink mb-2">Company</p>
            <ul className="space-y-1">
              <li>About</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-ink/40 pb-6">© {new Date().getFullYear()} StrideCo. Demo project — not a real store.</p>
    </footer>
  );
}
