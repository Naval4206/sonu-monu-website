"use client";

import { useState } from "react";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    const res = await fetch("http://127.0.0.1:5000/admin/upload-product", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      alert("Product uploaded successfully");
      e.target.reset();
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Product Name" required className="input" />
        <input name="brand" placeholder="Brand" required className="input" />
        <input name="gender" placeholder="Gender" required className="input" />
        <input name="size" placeholder="Size" required className="input" />

        <input type="file" name="image" accept="image/*" required />

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}
