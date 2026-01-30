"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, password }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        setMessage(json.message || "Login failed");
        return;
      }

      // ✅ Save common data
      localStorage.setItem("user", JSON.stringify(json.user));
      localStorage.setItem("token", json.access_token);

      // 🔑 ADMIN → ADMIN PANEL
      if (json.user.role === "admin") {
        localStorage.setItem("admin_token", json.access_token);
        router.push("/admin/dashboard");
        return;
      }

      // 👤 NORMAL USER → USER PANEL
      router.push("/");
    } catch (error) {
      setMessage("Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <input
          type="text"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {message && (
          <p className="text-red-500 text-sm text-center">{message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>
    </main>
  );
}
