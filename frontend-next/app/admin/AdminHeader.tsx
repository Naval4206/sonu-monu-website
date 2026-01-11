"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_role");
    router.push("/admin/login");
  };

  if (!mounted) return null; // 🔑 hydration fix

  return (
    <div style={{ background: "#1e5bff", color: "white", padding: "15px" }}>
      <span>Sonu Monu Admin</span>
      <button
        onClick={logout}
        style={{ float: "right", background: "black", color: "white" }}
      >
        Logout
      </button>
    </div>
  );
}
