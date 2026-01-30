"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Admin = {
  name?: string;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin");

    if (!token) {
      router.push("/admin/login");
    }

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, [router]);

  const logout = () => {
    // 🔴 Clear ALL auth data
    localStorage.removeItem("admin_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔄 Force hard navigation (important)
    window.location.href = "/signin";
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Feedback", path: "/admin/feedback", icon: "💬" },
    { name: "Queries", path: "/admin/queries", icon: "❓" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col fixed inset-y-0 left-0">
        <div className="px-6 py-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-blue-400">Sonu Monu</h2>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menu.map((item) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-xl text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 ml-64">
        {/* ADMIN TOP BAR */}
        <header className="h-16 bg-white border-b flex items-center justify-end px-8 shadow-sm">
          <span className="text-sm font-medium text-gray-700">
            Hi, {admin?.name || "Admin"}
          </span>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
