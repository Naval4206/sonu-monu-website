"use client";

import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (json.success) setUsers(json.data);
    setLoading(false);
  };

  // ================= DELETE USER =================
  const deleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    await fetch(`http://127.0.0.1:8000/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUsers();
  };

  // ================= UPDATE USER =================
  const updateUser = async () => {
    await fetch(
      `http://127.0.0.1:8000/admin/users/${editingUser.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingUser.name,
          phone: editingUser.phone,
          email: editingUser.email,
          role: editingUser.role,
        }),
      }
    );

    setEditingUser(null);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="p-6">Loading users...</p>;

  // ================= SEARCH FILTER =================
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.phone || "").includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Users</h1>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full sm:w-72"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{u.name || "-"}</td>
                <td className="p-4">{u.phone}</td>
                <td className="p-4">{u.email || "-"}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setEditingUser({
                        ...u,
                        name: u.name ?? "",
                        phone: u.phone ?? "",
                        email: u.email ?? "",
                      })
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  {u.role !== "admin" && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="space-y-4">
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editingUser.name ?? ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
              />

              <input
                type="text"
                className="w-full border rounded p-2"
                value={editingUser.phone ?? ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />

              <input
                type="email"
                className="w-full border rounded p-2"
                value={editingUser.email ?? ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
              />

              <select
                className="w-full border rounded p-2"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
