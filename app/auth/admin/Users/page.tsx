"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt: string;
}

/* ---------------- PAGE ---------------- */
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  /* ---------------- FETCH ---------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone?.toLowerCase().includes(q) ?? false)
    );
  }, [users, search]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredUsers.length / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  /* ---------------- EXPORT CSV ---------------- */
  const handleExport = () => {
    if (filteredUsers.length === 0) return alert("No data to export");

    const headers = ["Name", "Email", "Phone", "Role", "Created At"];
    const rows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.phone || "",
      u.role || "",
      new Date(u.createdAt).toLocaleString(),
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "users.csv";
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-2">All Users</h1>

      {/* SEARCH & EXPORT */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, phone"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page when search changes
            }}
            className="w-full pl-10 pr-4 py-2 border rounded"
          />
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1 bg-emerald-500 px-3 py-2 text-white rounded hover:bg-emerald-600"
        >
          <Download size={16} /> Export
        </button>

        {/* LIMIT SELECTOR */}
        <select
          className="border rounded px-3 py-2 ml-auto"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          {[10, 20, 30, 50].map((l) => (
            <option key={l} value={l}>{l} / page</option>
          ))}
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto  bg-amber-100 border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-teal-600 text-white font-serif ">
            <tr>
              <th className={th}>Name</th>
              <th className={th}>Email</th>
              <th className={th}>Phone</th>
              <th className={th}>Role</th>
              <th className={th}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 text-amber-950">
                  <td className={td}>{u.name}</td>
                  <td className={td}>{u.email}</td>
                  <td className={td}>{u.phone || "-"}</td>
                  <td className={td}>{u.role || "-"}</td>
                  <td className={td}>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  {loading ? "Loading..." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={handlePrev}
            className="px-3 py-1 border rounded flex items-center gap-1"
            disabled={page === 1}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            className="px-3 py-1 border rounded flex items-center gap-1"
            disabled={page === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
/* ---------------- STYLES ---------------- */
const th = "px-4 py-3 border text-left font-semibold text-lg"; // headers thoda bada
const td = "px-4 py-3 border text-base"; // table content readable
