"use client";

import { useState } from "react";

type Props = {
  productName: string;
  onClose: () => void;
};

export default function ProductFeedbackModal({ productName, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!phone || !feedback) {
      setError("Phone number and feedback are required.");
      return;
    }

    /**
     * Payload EXACTLY matches MySQL table:
     * product_name
     * feedback
     * name
     * phone
     * email
     * status -> handled by DB (default: unread)
     */
    const payload = {
      product_name: productName,
      feedback,
      name,
      phone,
      email,
    };

    // 🔒 Backend will be connected later
    // await fetch("/api/product-feedback", { method: "POST", body: JSON.stringify(payload) });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">

        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Product Feedback
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          For <span className="font-medium">{productName}</span>
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-3">
            {error}
          </p>
        )}

        {/* Name */}
        <label className="block mb-3">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Your name"
          />
        </label>

        {/* Phone */}
        <label className="block mb-3">
          Phone <span className="text-red-600">*</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Enter phone number"
            required
          />
        </label>

        {/* Email */}
        <label className="block mb-3">
          Email (optional)
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            placeholder="Enter email"
          />
        </label>

        {/* Feedback */}
        <label className="block mb-4">
          Feedback <span className="text-red-600">*</span>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1"
            rows={4}
            placeholder="Write your feedback here"
            required
          />
        </label>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="w-1/2 bg-blue-600 text-white rounded-lg py-2"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}
