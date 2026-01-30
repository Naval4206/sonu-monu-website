"use client";

import { useState } from "react";
import ProductFeedbackModal from "./ProductFeedbackModal";

export default function ProductCard({ product }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">

        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          {product.image_url && (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image_url}`}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm text-gray-500">
            {product.brand} • {product.gender} • {product.size}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          <p className="mt-2 text-blue-600 font-bold">
            ₹{product.price}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Give Product Feedback
          </button>
        </div>
      </div>

      {open && (
        <ProductFeedbackModal
          productName={product.name}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
