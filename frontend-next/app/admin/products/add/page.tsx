"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      alert("Admin not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("brand", brand);
    formData.append("gender", gender);
    formData.append("size", size);
    formData.append("price", price);
    formData.append("image", image);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/admin/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to add product");
      }

      alert("Product added successfully");
      router.push("/admin/products");
    } catch (err) {
      alert("Error adding product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">➕ Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Brand */}
        <input
          type="text"
          placeholder="Brand"
          className="w-full border p-2 rounded"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        {/* Gender */}
        <select
          className="w-full border p-2 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Unisex">Unisex</option>
        </select>

        {/* Size */}
        <select
          className="w-full border p-2 rounded"
          value={size}
          onChange={(e) => setSize(e.target.value)}
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
          placeholder="Enter price (₹)"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
