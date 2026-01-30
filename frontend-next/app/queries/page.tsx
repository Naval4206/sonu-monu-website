"use client";

import { useEffect, useState } from "react";

type StoredUser = {
  name?: string;
  phone?: string;
  email?: string;
};

export default function QueriesPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);

  /* ✅ Check login + load user */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setIsLoggedIn(!!token);

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // ✅ Auto-fill fields
      setName(parsedUser.name || "");
      setPhone(parsedUser.phone || "");
      setEmail(parsedUser.email || "");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !query.trim()) {
      setMessage("Name, phone number and query are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            query,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        setMessage("Your query has been submitted successfully!");
        setQuery("");
      } else {
        setMessage(json.message || "Failed to submit query");
      }
    } catch {
      setMessage("Failed to submit query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Queries
          </h1>
          <p className="mt-2 text-gray-600">
            Have a question? We’re here to help.
          </p>
        </div>

        {/* 🔐 Login Required */}
        {!isLoggedIn ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Login Required
            </h2>
            <p className="mt-2 text-gray-600">
              Please sign in to submit your query.
            </p>

            <a
              href="/signin"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </a>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 space-y-6"
          >
            {/* Logged in badge */}
            {user?.name && (
              <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
                Logged in as <strong>{user.name}</strong>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Query */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Query <span className="text-red-500">*</span>
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={5}
                required
                className="mt-1 w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Message */}
            {message && (
              <p className="text-sm text-center text-blue-600">
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name || !phone || !query}
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Query"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
