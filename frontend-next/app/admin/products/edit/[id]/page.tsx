"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    gender: "",
    size: "",
    price: "",
    image: null as File | null,
  });

  // 🔹 Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
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
          const product = json.data.find((p: any) => p.id == id);

          if (product) {
            setForm({
              name: product.name ?? "",
              brand: product.brand ?? "",
              gender: product.gender ?? "",
              size: product.size ?? "",
              price: String(product.price ?? ""),
              image: null,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Submit updated product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("admin_token");
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("gender", form.gender);
    formData.append("size", form.size);
    formData.append("price", form.price);

    if (form.image) {
      formData.append("image", form.image);
    }

    await fetch(`http://127.0.0.1:8000/admin/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    router.push("/admin/products");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        {/* Brand */}
        <input
          type="text"
          placeholder="Brand"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        {/* Gender */}
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>

        {/* Size */}
        <select
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Size</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>

        {/* ✅ Price FIXED */}
        <input
          type="number"
          placeholder="Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setForm({ ...form, image: e.target.files?.[0] || null })
          }
          className="w-full"
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
