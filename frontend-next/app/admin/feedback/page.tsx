"use client";

import { useEffect, useState } from "react";

export default function AdminFeedbackPage() {
  const [store, setStore] = useState([]);
  const [product, setProduct] = useState([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers = { Authorization: `Bearer ${token}` };

  const loadData = () => {
    fetch("http://127.0.0.1:5000/admin/feedback/store", { headers })
      .then((res) => res.json())
      .then(setStore);

    fetch("http://127.0.0.1:5000/admin/feedback/products", { headers })
      .then((res) => res.json())
      .then(setProduct);
  };

  useEffect(loadData, []);

  const markRead = (type: string, id: number) =>
    fetch(`http://127.0.0.1:5000/admin/feedback/${type}/read/${id}`, {
      method: "PUT",
      headers,
    }).then(loadData);

  const remove = (type: string, id: number) =>
    fetch(`http://127.0.0.1:5000/admin/feedback/${type}/${id}`, {
      method: "DELETE",
      headers,
    }).then(loadData);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Feedback Dashboard</h1>

      {/* ================= STORE FEEDBACK ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Store Feedback</h2>

        {store.map((f: any) => (
          <div
            key={f.id}
            className={`border rounded-lg p-5 mb-4 shadow-sm flex justify-between gap-6 ${
              !f.is_read ? "bg-yellow-50" : "bg-white"
            }`}
          >
            {/* USER INFO */}
            <div className="w-1/4">
              <p className="font-semibold text-lg">{f.name || "Anonymous"}</p>
              <p className="text-sm text-gray-600">{f.phone}</p>
              <p className="text-sm text-gray-600">{f.email}</p>
              <p className="mt-2 font-medium">⭐ {f.rating}/5</p>
            </div>

            {/* FEEDBACK */}
            <div className="flex-1">
              <p className="text-gray-800">{f.feedback}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(f.created_at).toLocaleString()}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  f.is_read
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {f.is_read ? "Read" : "Unread"}
              </span>

              {!f.is_read && (
                <button
                  onClick={() => markRead("store", f.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Mark Read
                </button>
              )}

              <button
                onClick={() => remove("store", f.id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= PRODUCT FEEDBACK ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Product Feedback</h2>

        {product.map((f: any) => (
          <div
            key={f.id}
            className={`border rounded-lg p-5 mb-4 shadow-sm flex justify-between gap-6 ${
              !f.is_read ? "bg-yellow-50" : "bg-white"
            }`}
          >
            {/* PRODUCT + USER */}
            <div className="w-1/4">
              <p className="font-semibold text-lg">{f.name || "Anonymous"}</p>
              <p className="font-semibold text-lg">{f.product_name}</p>
              <p className="text-sm text-gray-600">{f.name}</p>
              <p className="text-sm text-gray-600">{f.phone}</p>
            </div>

            {/* FEEDBACK */}
            <div className="flex-1">
              <p className="text-gray-800">{f.feedback}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(f.created_at).toLocaleString()}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  f.is_read
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {f.is_read ? "Read" : "Unread"}
              </span>

              {!f.is_read && (
                <button
                  onClick={() => markRead("product", f.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Mark Read
                </button>
              )}

              <button
                onClick={() => remove("product", f.id)}
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
