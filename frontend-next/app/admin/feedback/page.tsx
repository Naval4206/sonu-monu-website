"use client";

import { useEffect, useState } from "react";

export default function AdminFeedbackPage() {
  const [store, setStore] = useState<any[]>([]);
  const [product, setProduct] = useState<any[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    const storeRes = await fetch(
      "http://127.0.0.1:8000/admin/feedback/store",
      { headers }
    );
    const productRes = await fetch(
      "http://127.0.0.1:8000/admin/feedback/products",
      { headers }
    );

    setStore(await storeRes.json());
    setProduct(await productRes.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  const markRead = async (type: "store" | "product", id: number) => {
    await fetch(
      `http://127.0.0.1:8000/admin/feedback/${type}/read/${id}`,
      {
        method: "PUT",
        headers,
      }
    );
    loadData(); // 🔥 refresh UI
  };

  const remove = async (type: "store" | "product", id: number) => {
    await fetch(
      `http://127.0.0.1:8000/admin/feedback/${type}/${id}`,
      {
        method: "DELETE",
        headers,
      }
    );
    loadData();
  };

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">Feedback Dashboard</h1>

      {/* STORE FEEDBACK */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Store Feedback</h2>

        {store.map((f) => (
          <div
            key={f.id}
            className={`border rounded-lg p-5 mb-4 shadow-sm flex justify-between gap-6 ${
              f.status === "unread" ? "bg-yellow-50" : "bg-white"
            }`}
          >
            <div className="w-1/4">
              <p className="font-semibold text-lg">{f.name || "Anonymous"}</p>
              <p className="text-sm text-gray-600">{f.phone}</p>
              <p className="text-sm text-gray-600">{f.email}</p>
              <p className="mt-2 font-medium">⭐ {f.rating}/5</p>
            </div>

            <div className="flex-1">
              <p>{f.feedback}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(f.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  f.status === "read"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {f.status === "read" ? "Read" : "Unread"}
              </span>

              {f.status === "unread" && (
                <button
                  onClick={() => markRead("store", f.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Mark As Read
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

      {/* PRODUCT FEEDBACK */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Product Feedback</h2>

        {product.map((f) => (
          <div
            key={f.id}
            className={`border rounded-lg p-5 mb-4 shadow-sm flex justify-between gap-6 ${
              f.status === "unread" ? "bg-yellow-50" : "bg-white"
            }`}
          >
            <div className="w-1/4">
              <p className="font-semibold text-lg">{f.name || "Anonymous"}</p>
              <p className="font-semibold">{f.product_name}</p>
              <p className="text-sm text-gray-600">{f.phone}</p>
            </div>

            <div className="flex-1">
              <p>{f.feedback}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(f.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  f.status === "read"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {f.status === "read" ? "Read" : "Unread"}
              </span>

              {f.status === "unread" && (
                <button
                  onClick={() => markRead("product", f.id)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Mark As Read
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
