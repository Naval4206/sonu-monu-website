"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  brand: string;
  gender: string;
  size: string;
  price: number;
  image_url: string | null;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          // show latest 4 products
          setProducts(json.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block mb-4 bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium">
            Featured Collection
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Trending Products
          </h2>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Discover some of our most loved styles, carefully selected
            for quality, comfort, and everyday fashion.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading featured products...
          </p>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-500">
            No products available
          </p>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >
              {/* Image */}
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full z-10">
                  New
                </div>

                {product.image_url ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image_url}`}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-100
                    flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-1">
                  {product.gender} • {product.size}
                </p>

                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-lg">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-16 text-center">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-base md:text-lg font-medium hover:bg-blue-700 transition"
          >
            View All Products →
          </Link>
        </div>

      </div>
    </section>
  );
}
