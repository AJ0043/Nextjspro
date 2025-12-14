"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";

interface CategoryType {
  _id: string;
  name: string;
}

interface ProductType {
  _id: string;
  title: string;
  price: number;
  finalPrice: number;
  category?: CategoryType;
  deletedAt?: string;
}

export default function RecyclePage() {
  const [recycleProducts, setRecycleProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewProduct, setViewProduct] = useState<ProductType | null>(null);

  // Fetch recycle products
  const fetchRecycleProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products/recycle");
      if (res.data.success) setRecycleProducts(res.data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecycleProducts();
  }, []);

  // Restore product
  const handleRestore = async (id: string) => {
    if (!confirm("Restore this product?")) return;
    try {
      const res = await axios.put(`/api/products/restore/${id}`);
      if (res.data.success) {
        setRecycleProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Permanent delete
  const handlePermanentDelete = async (id: string) => {
    if (!confirm("Permanently delete this product?")) return;
    try {
      const res = await axios.delete(`/api/products/permanent/${id}`);
      if (res.data.success) {
        setRecycleProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = useMemo(
    () =>
      recycleProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.name.toLowerCase().includes(search.toLowerCase())
      ),
    [recycleProducts, search]
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-4xl font-bold mb-4 text-red-700">Recycle Bin</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search deleted products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[1000px] w-full text-base bg-amber-100">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Final</th>
              <th className="p-3">Category</th>
              <th className="p-3">Deleted At</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No deleted products
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="p-2">{p.title}</td>
                  <td className="p-2 text-center">₹{p.price}</td>
                  <td className="p-2 text-center font-semibold text-green-700">
                    ₹{p.finalPrice}
                  </td>
                  <td className="p-2 text-center">{p.category?.name || "-"}</td>
                  <td className="p-2 text-center">
                    {p.deletedAt && new Date(p.deletedAt).toLocaleString("en-IN")}
                  </td>
                  <td className="p-2 flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => handleRestore(p._id)}
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(p._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setViewProduct(p)}
                      className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Product Modal */}
      <AnimatePresence>
        {viewProduct && (
          <motion.div
            key={viewProduct._id}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewProduct(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-teal-800">{viewProduct.title}</h2>
              <p className="mt-2 text-gray-700">
                Price: ₹{viewProduct.price} | Final: ₹{viewProduct.finalPrice}
              </p>
              <p className="mt-2 text-gray-600">
                Category: {viewProduct.category?.name || "-"}
              </p>
              <p className="mt-2 text-gray-500 text-sm">
                Deleted At: {viewProduct.deletedAt && new Date(viewProduct.deletedAt).toLocaleString("en-IN")}
              </p>
              <button
                onClick={() => setViewProduct(null)}
                className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
