"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin/login");
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-10">Sonu Monu</h2>

        <nav className="space-y-4">
          <button onClick={() => router.push("/admin/dashboard")} className="block w-full text-left hover:text-blue-400">
            Dashboard
          </button>
          <button onClick={() => router.push("/admin/products")} className="block w-full text-left hover:text-blue-400">
            Products
          </button>
          <button onClick={() => router.push("/admin/feedback")} className="block w-full text-left hover:text-blue-400">
            Feedback
          </button>
          <button onClick={() => router.push("/admin/queries")} className="block w-full text-left hover:text-blue-400">
            Queries
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-600 hover:bg-red-700 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
