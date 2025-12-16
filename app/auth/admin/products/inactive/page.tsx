"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { RotateCcw, Trash2 } from "lucide-react";

/* -----------------------------
   Types
----------------------------- */
type ImageObj = {
  url: string;
};

interface Product {
  _id: string;
  title: string;
  price: number;
  finalPrice: number;
  status: string;
  deletedAt?: string | null;
  images?: ImageObj[];
}

/* -----------------------------
   Component
----------------------------- */
export default function InactiveProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* -----------------------------
     Fetch inactive products
  ----------------------------- */
  const fetchInactiveProducts = async () => {
    try {
      const res = await axios.get("/api/products/inactive");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error("FETCH INACTIVE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInactiveProducts();
  }, []);

  /* -----------------------------
     Search filter
  ----------------------------- */
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  /* -----------------------------
     Pagination
  ----------------------------- */
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* -----------------------------
     Restore Product
  ----------------------------- */
  const handleRestore = async (id: string) => {
    if (!confirm("Restore this product?")) return;

    try {
      const res = await axios.put(`/api/products/restore/${id}`);
      if (res.data.success) {
        alert(res.data.message);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      console.error("RESTORE ERROR:", err.response || err.message);
      alert(err.response?.data?.message || "Restore failed");
    }
  };

  /* -----------------------------
     Permanent Delete
  ----------------------------- */
  const handlePermanentDelete = async (id: string) => {
    if (!confirm("⚠️ Permanently delete this product?")) return;

    try {
      const res = await axios.delete(`/api/products/permanent/${id}`);
      if (res.data.success) {
        alert(res.data.message);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err: any) {
      console.error("DELETE ERROR:", err.response || err.message);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* -----------------------------
     JSX
  ----------------------------- */
  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-3xl font-serif mb-6 text-white rounded w-[350px] px-4 py-2 bg-yellow-500">
        Inactive Products
      </h1>

      {/* Search + Page size */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-2 rounded cursor-pointer bg-teal-600 text-white"
        >
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={40}>40 rows</option>
        </select>
      </div>

      {paginatedProducts.length === 0 ? (
        <p className="text-gray-600">No inactive products found</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-[1000px] w-full bg-amber-100">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-center">Price</th>
                  <th className="p-3 text-center">Final Price</th>
                  <th className="p-3 text-center">Inactive Since</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((p, index) => (
                  <tr
                    key={p._id}
                    className={`hover:bg-amber-200 ${
                      index % 2 === 0 ? "bg-amber-50" : "bg-amber-100"
                    }`}
                  >
                    <td className="p-3 text-center">
                      {p.images?.[0]?.url ? (
                        <img
                          src={p.images[0].url}
                          alt={p.title}
                          className="h-14 w-14 object-cover rounded mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>

                    <td className="p-3 font-semibold">{p.title}</td>

                    <td className="p-3 text-center">₹{p.price}</td>

                    <td className="p-3 text-center font-bold text-green-700">
                      ₹{p.finalPrice}
                    </td>

                    <td className="p-3 text-center font-semibold">
                      {p.deletedAt
                        ? new Date(p.deletedAt).toLocaleString("en-IN")
                        : "-"}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleRestore(p._id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-700 flex items-center gap-1"
                        >
                          <RotateCcw size={16} />
                          Restore
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(p._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-full hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-2 rounded disabled:opacity-50 bg-amber-600 text-white"
            >
              ◀
            </button>

            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 rounded disabled:opacity-50 bg-amber-600 text-white"
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
