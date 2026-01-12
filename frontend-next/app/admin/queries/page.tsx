"use client";

import { useEffect, useState } from "react";

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadQueries = () => {
    fetch("http://127.0.0.1:5000/admin/queries", { headers })
      .then((res) => res.json())
      .then(setQueries);
  };

  useEffect(loadQueries, []);

  const markRead = (id: number) =>
    fetch(`http://127.0.0.1:5000/admin/queries/read/${id}`, {
      method: "PUT",
      headers,
    }).then(loadQueries);

  const remove = (id: number) =>
    fetch(`http://127.0.0.1:5000/admin/queries/${id}`, {
      method: "DELETE",
      headers,
    }).then(loadQueries);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Queries</h1>

      {queries.map((q: any) => (
        <div
          key={q.id}
          className={`border rounded-lg p-5 shadow-sm flex justify-between gap-6 ${
            !q.is_read ? "bg-yellow-50" : "bg-white"
          }`}
        >
          {/* USER INFO */}
          <div className="w-1/4">
            <p className="font-semibold text-lg">{q.name}</p>
            <p className="text-sm text-gray-600">{q.phone}</p>
            <p className="text-sm text-gray-600">{q.email}</p>
          </div>

          {/* MESSAGE */}
          <div className="flex-1">
            <p className="text-gray-800 whitespace-pre-line">
              {q.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(q.created_at).toLocaleString()}
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-2 items-end">
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                q.is_read
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {q.is_read ? "Read" : "Unread"}
            </span>

            {!q.is_read && (
              <button
                onClick={() => markRead(q.id)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Mark Read
              </button>
            )}

            <button
              onClick={() => remove(q.id)}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
