"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("admin_token");

    const res = await fetch("http://127.0.0.1:5000/admin/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProducts(data);
  };

  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("admin_token");

    await fetch(`http://127.0.0.1:5000/admin/products/${id}`, {
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Size</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">
                  <img
                    src={`http://127.0.0.1:5000/uploads/products/${p.image_url}`}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/no-image.png";
                    }}
                  />
                </td>
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.brand}</td>
                <td className="p-4">{p.gender}</td>
                <td className="p-4">{p.size}</td>
                <td className="p-4 flex gap-2">
                  <Link
                    href={`/admin/products/edit/${p.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
