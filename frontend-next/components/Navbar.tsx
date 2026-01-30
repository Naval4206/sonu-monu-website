"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  name: string;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  /* ---------------- AUTH STATE ---------------- */
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Initial load
    loadUser();

    // 🔄 Listen for logout/login from anywhere (admin / other tabs)
    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = () => {
    // 🔴 Clear ALL auth (user + admin)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_token");

    setUser(null);
    setOpen(false);

    // 🔄 Hard redirect to reset state everywhere
    window.location.href = "/signin";
  };

  /* ---------------- SCROLL HELPERS ---------------- */
  const scrollToTop = () => {
    const topElement = document.getElementById("top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur border-b z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* LOGO */}
          {pathname === "/" ? (
            <button
              onClick={scrollToTop}
              className="text-2xl font-extrabold text-blue-600 tracking-tight"
            >
              Sonu Monu
            </button>
          ) : (
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-600 tracking-tight"
            >
              Sonu Monu
            </Link>
          )}

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {pathname === "/" ? (
              <button onClick={scrollToTop} className="hover:text-blue-600">
                Home
              </button>
            ) : (
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            )}

            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <Link href="/feedback" className="hover:text-blue-600">
              Feedback
            </Link>
            <Link href="/queries" className="hover:text-blue-600">
              Queries
            </Link>

            {pathname === "/" ? (
              <button onClick={scrollToAbout} className="hover:text-blue-600">
                About
              </button>
            ) : (
              <Link href="/#about" className="hover:text-blue-600">
                About
              </Link>
            )}
          </nav>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <span className="text-sm font-medium text-gray-700">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-800"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden bg-white border-t shadow-sm">
            <div className="flex flex-col gap-4 py-5 text-center text-gray-800">
              <button onClick={scrollToTop}>Home</button>
              <Link href="/products" onClick={() => setOpen(false)}>
                Products
              </Link>
              <Link href="/feedback" onClick={() => setOpen(false)}>
                Feedback
              </Link>
              <Link href="/queries" onClick={() => setOpen(false)}>
                Queries
              </Link>

              {pathname === "/" ? (
                <button onClick={scrollToAbout}>About</button>
              ) : (
                <Link href="/#about" onClick={() => setOpen(false)}>
                  About
                </Link>
              )}

              <div className="pt-4 border-t flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="border border-red-500 text-red-500 py-2 rounded-lg text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      onClick={() => setOpen(false)}
                      className="border border-blue-600 text-blue-600 py-2 rounded-lg text-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="bg-blue-600 text-white py-2 rounded-lg text-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
