"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.password) {
      setMessage("Name, phone and password are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      /* 1️⃣ SIGN UP */
      const signupRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const signupJson = await signupRes.json();

      if (!signupJson.success) {
        setMessage(signupJson.message || "Signup failed");
        return;
      }

      /* 2️⃣ AUTO LOGIN */
      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: form.phone, // phone OR email works
            password: form.password,
          }),
        }
      );

      const loginJson = await loginRes.json();

      if (loginJson.success) {
        localStorage.setItem("token", loginJson.access_token);
        localStorage.setItem("user", JSON.stringify(loginJson.user));
        router.push("/");
      } else {
        setMessage("Account created, please sign in");
        router.push("/signin");
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create Account
        </h1>

        {/* Name */}
        <input
          type="text"
          placeholder="Full Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone Number *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {/* Email (OPTIONAL) */}
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-lg px-4 py-3"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password *"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-600 font-medium">
            Sign In
          </a>
        </p>
      </form>
    </main>
  );
}
