"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  brand: string;
  image_url: string;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="py-32 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Featured <span className="text-blue-700">Products</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked styles our customers love
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2"
            >
              <div className="h-56 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {product.brand}
                </p>

                <Link
                  href="/products"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Link
            href="/products"
            className="inline-block px-10 py-4 rounded-xl bg-blue-700 text-white text-lg font-semibold hover:bg-blue-800 shadow-lg"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
}
