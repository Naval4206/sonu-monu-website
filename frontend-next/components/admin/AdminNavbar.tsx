"use client";

import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();
  const admin = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("admin") || "{}")
    : {};

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin");
    router.push("/signin");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hi, <b>{admin?.name || "Admin"}</b>
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
