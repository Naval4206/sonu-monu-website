"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  brand: string;
  gender: string;
  size: string;
  price: number;
  image_url?: string;
};

type StoredUser = {
  name?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Logged-in user
  const [user, setUser] = useState<StoredUser | null>(null);

  /* 🔐 Load user */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔌 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`
        );
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const clearFilters = () => {
    setSearch("");
    setGender("");
    setSize("");
    setSort("");
  };

  const filteredProducts = products
    .filter((product) => {
      const matchName =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase());

      const matchGender = gender === "" || product.gender === gender;
      const matchSize = size === "" || product.size === size;

      return matchName && matchGender && matchSize;
    })
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <main className="pt-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Products
          </h1>
          <p className="mt-2 text-gray-600">
            Browse products and share your feedback.
          </p>

          {/* Logged in badge */}
          {user?.name && (
            <div className="mt-4 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
              Logged in as <strong>{user.name}</strong>
            </div>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full border rounded-lg py-3 bg-white font-medium shadow-sm"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters */}
        <div
          className={`bg-white rounded-2xl shadow-sm p-6 mb-14
          ${showFilters ? "block" : "hidden md:block"}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Search */}
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Search by product name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />

            {/* Gender */}
            <select
              suppressHydrationWarning
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Unisex">Unisex</option>
            </select>

            {/* Size */}
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sizes</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sort By</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
