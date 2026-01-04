import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/#top"
          className="text-3xl font-extrabold tracking-tight text-blue-700 hover:text-blue-800 transition"
        >
          Sonu Monu
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-10 text-gray-700 font-medium">
          <a href="/#top" className="hover:text-blue-700 transition">
            Home
          </a>
          <Link href="/products" className="hover:text-blue-700 transition">
            Products
          </Link>
          <Link href="/feedback" className="hover:text-blue-700 transition">
            Feedback
          </Link>
          <Link href="/contact" className="hover:text-blue-700 transition">
            Contact
          </Link>
          <a href="#about" className="hover:text-blue-700 transition">
            About
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg border border-blue-700 text-blue-700 font-semibold hover:bg-blue-50 transition"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
