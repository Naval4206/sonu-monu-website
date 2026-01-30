"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      const res = await fetch("http://127.0.0.1:8000/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      // ✅ IMPORTANT FIX
      if (json.success && Array.isArray(json.data)) {
        setProducts(json.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("admin_token");

    await fetch(`http://127.0.0.1:8000/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <Link
          href="/admin/products/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  No products found
                </td>
              </tr>
            )}

            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <img
                    src={
                      p.image_url
                        ? `http://127.0.0.1:8000${p.image_url}`
                        : "/no-image.png"
                    }
                    className="w-14 h-14 rounded-lg object-cover border"
                  />
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.name}
                </td>

                <td className="px-6 py-4 text-gray-600">{p.brand}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {p.gender}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                    {p.size}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold text-blue-600">
                  ₹{p.price}
                </td>

                <td className="px-6 py-4 text-right flex gap-2 justify-end">
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
