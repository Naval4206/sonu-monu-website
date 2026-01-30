"use client";

import { useEffect, useState } from "react";

type Stats = {
  total_products: number;
  total_users: number;

  store_feedback_total: number;
  store_feedback_unread: number;
  store_feedback_read: number;

  product_feedback_total: number;
  product_feedback_unread: number;
  product_feedback_read: number;

  queries_total: number;
  queries_unread: number;
  queries_read: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    fetch("http://127.0.0.1:8000/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) {
    return <p className="text-gray-500 p-6">Loading dashboard...</p>;
  }

  const Card = ({
    title,
    value,
    bg,
  }: {
    title: string;
    value: number;
    bg: string;
  }) => (
    <div className={`rounded-xl shadow-md p-5 ${bg}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* PRODUCTS & USERS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Total Products" value={stats.total_products} bg="bg-blue-100" />
          <Card title="Total Users" value={stats.total_users} bg="bg-green-100" />
        </div>
      </section>

      {/* FEEDBACK */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Store Feedback (Total)" value={stats.store_feedback_total} bg="bg-indigo-100" />
          <Card title="Store Feedback (Unread)" value={stats.store_feedback_unread} bg="bg-yellow-100" />
          <Card title="Store Feedback (Read)" value={stats.store_feedback_read} bg="bg-green-100" />

          <Card title="Product Feedback (Total)" value={stats.product_feedback_total} bg="bg-purple-100" />
          <Card title="Product Feedback (Unread)" value={stats.product_feedback_unread} bg="bg-yellow-100" />
          <Card title="Product Feedback (Read)" value={stats.product_feedback_read} bg="bg-green-100" />
        </div>
      </section>

      {/* QUERIES */}
      <section>
        <h2 className="text-xl font-semibold mb-4">User Queries</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Total Queries" value={stats.queries_total} bg="bg-blue-100" />
          <Card title="Unread Queries" value={stats.queries_unread} bg="bg-red-100" />
          <Card title="Read Queries" value={stats.queries_read} bg="bg-green-100" />
        </div>
      </section>
    </div>
  );
}
