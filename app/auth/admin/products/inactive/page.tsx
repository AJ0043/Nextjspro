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
  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page, pageSize]);

  // Reset page on search or pageSize change
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  /* -----------------------------
     Restore Product
  ----------------------------- */
  const handleRestore = async (id: string) => {
    if (!confirm("Restore this product?")) return;

    try {
      const res = await axios.patch(`/api/products/restore/${id}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("RESTORE ERROR:", err);
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
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  /* -----------------------------
     JSX
  ----------------------------- */
  return (
    <div className="p-6">
      <h1 className="text-3xl font-serif mb-6 text-white border rounded w-full p-2 bg-teal-800">
        Inactive Products
      </h1>

      {/* Search + Row Limit */}
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
          className="px-3 py-2 border rounded cursor-pointer bg-teal-600 text-amber-50"
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
          <div className="overflow-x-auto border rounded">
            <table className="min-w-[1000px] w-full border-collapse bg-amber-100">
              <thead className="bg-purple-700 text-amber-50">
                <tr>
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Final Price</th>
                  <th className="p-2 border">Inactive Since</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">
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

                    <td className="p-2 border font-semibold">{p.title}</td>

                    <td className="p-2 border text-center">₹{p.price}</td>

                    <td className="p-2 border text-center font-bold text-green-700">
                      ₹{p.finalPrice}
                    </td>

                    <td className="p-2 border text-center font-semibold">
                      {p.deletedAt
                        ? new Date(p.deletedAt).toLocaleString("en-IN")
                        : "-"}
                    </td>

                    <td className="p-2 border">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleRestore(p._id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-3xl hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw size={16} />
                          Restore
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(p._id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600 flex items-center gap-1 cursor-pointer"
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
              className="px-3 py-2 border rounded disabled:opacity-50 bg-amber-600 cursor-pointer"
            >
              ◀
            </button>

            <span className="font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 border rounded disabled:opacity-50 bg-amber-600 cursor-pointer"
            >
              ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}
