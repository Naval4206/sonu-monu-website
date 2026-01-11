"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) router.push("/admin/login");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold text-lg">Sonu Monu Admin</h1>
        <button
          onClick={() => {
            localStorage.removeItem("admin_token");
            router.push("/admin/login");
          }}
        >
          Logout
        </button>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
