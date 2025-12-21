"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Recycle,
  Download,
  Layers,
  Boxes,
} from "lucide-react";
import Link from "next/link";

/* -----------------------------
   Types
----------------------------- */
type ImageObj = { url: string; public_id?: string };

interface CategoryType {
  _id: string;
  name: string;
}

interface ProductType {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount?: number;
  finalPrice: number;
  stock: number;
  images: ImageObj[];
  category?: CategoryType;
  status?: "active" | "inactive";
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  newImage?: File | null;
}

/* -----------------------------
   Component
----------------------------- */
export default function ShowProductPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [viewProduct, setViewProduct] = useState<ProductType | null>(null);
  const [editProduct, setEditProduct] = useState<ProductType | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [columnVisibility, setColumnVisibility] = useState({
    image: true,
    title: true,
    slug: true,
    category: true,
    price: true,
    discount: true,
    final: true,
    stock: true,
    created: true,
    updated: true,
    action: true,
  });

  const toggleColumn = (col: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* -----------------------------
     Fetch Products
  ----------------------------- */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products");
      if (res.data.success) {
        const activeProducts = res.data.products.filter(
          (p: ProductType) => p.status !== "inactive"
        );
        setProducts(activeProducts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     Fetch Categories
  ----------------------------- */
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category");
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editProduct && categories.length > 0) {
      const cat = categories.find((c) => c._id === editProduct.category?._id);
      if (cat) setEditProduct({ ...editProduct, category: cat });
    }
  }, [categories]);

  /* -----------------------------
     Export Product list
  ----------------------------- */
  const handleExportCSV = () => {
  if (products.length === 0) return;

  const headers = [
    "Title",
    "Slug",
    "Category",
    "Price",
    "Discount",
    "Final Price",
    "Stock",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = products.map((p) => [
    `"${p.title}"`,
    `"${p.slug}"`,
    `"${p.category?.name || ""}"`,
    p.price,
    p.discount || 0,
    p.finalPrice,
    p.stock,
    p.status || "active",
    p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "",
    p.updatedAt ? new Date(p.updatedAt).toLocaleString("en-IN") : "",
  ]);

  const csvContent =
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  
  
  
  /* -----------------------------
   Update Product (FORM DATA)
----------------------------- */
const handleUpdate = async () => {
  if (!editProduct) return;

  try {
    const formData = new FormData();

    formData.append("title", editProduct.title);
    formData.append("slug", editProduct.slug);
    formData.append("description", editProduct.description || "");
    formData.append("price", String(editProduct.price));
    formData.append("discount", String(editProduct.discount ?? 0));
    formData.append("stock", String(editProduct.stock));

    // ✅ category ONLY if exists
    if (editProduct.category?._id) {
      formData.append("category", editProduct.category._id);
    }

    // ✅ image optional
    if (editProduct.newImage instanceof File) {
      formData.append("images", editProduct.newImage);
    }

    const res = await axios.put(
      `/api/products/${editProduct._id}`,
      formData
      // ❌ headers mat bhej
    );

    if (res.data.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editProduct._id ? res.data.product : p
        )
      );
      setEditProduct(null);
    }
  } catch (err: any) {
    console.error("UPDATE ERROR:", err.response?.data || err.message);
  }
};

  /* -----------------------------
     Soft Delete Product
  ----------------------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Do you want to move this product to Recycle Bin?")) return;

    try {
      const res = await axios.delete(`/api/products/soft-delete/${id}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("SOFT DELETE ERROR:", err);
    }
  };

  /* -----------------------------
     Table Pagination & Filters
  ----------------------------- */
  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    setProducts((prev) => {
      const arr = [...prev];
      if (direction === "up" && index > 0)
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      if (direction === "down" && index < arr.length - 1)
        [arr[index + 1], arr[index]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  /* -----------------------------
     JSX
  ----------------------------- */
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <h1 className="text-4xl font-serif">Products</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            className="border px-3 py-2 rounded w-64"
            placeholder="Search product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link
            href="/auth/admin/products/add"
            className="px-3 py-2 bg-teal-800 text-white rounded flex items-center gap-1 cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </Link>

          <Link
            href="/auth/admin/products/inactive"
            className="px-3 py-2 bg-purple-800 text-white rounded flex items-center gap-1 cursor-pointer"
          >
            <Recycle size={16} /> Recycle Bin
          </Link>
         <button
           onClick={handleExportCSV}
           className="px-3 py-2 bg-orange-500 text-white rounded flex items-center gap-1 hover:bg-orange-700 transition cursor-pointer"
           >
          <Download size={16} />
           Export CSV
         </button>


      
      
        </div>
      </div>

      {/* Column Toggle */}
      <div className="flex gap-2 flex-wrap mb-3">
        {Object.keys(columnVisibility).map((col) => (
          <button
            key={col}
            onClick={() => toggleColumn(col as keyof typeof columnVisibility)}
            className="px-2 py-1 rounded text-sm flex items-center gap-1"
            style={{
              backgroundColor: "#bae6fd",
              textDecoration: columnVisibility[col as keyof typeof columnVisibility]
                ? "none"
                : "line-through",
            }}
          >
            <Eye size={14} /> {col}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-[2000px] w-full text-base bg-amber-100">
          <thead className="bg-teal-800 text-white">
            <tr>
              {columnVisibility.image && <th className="p-3">Image</th>}
              {columnVisibility.title && <th className="p-3">Title</th>}
              {columnVisibility.slug && <th className="p-3">Slug</th>}
              {columnVisibility.category && <th className="p-3">Category</th>}
              {columnVisibility.price && <th className="p-3">Price</th>}
              {columnVisibility.discount && <th className="p-3">Discount</th>}
              {columnVisibility.final && <th className="p-3">Final</th>}
              {columnVisibility.stock && <th className="p-3">Stock</th>}
              {columnVisibility.created && <th className="p-3">Created</th>}
              {columnVisibility.updated && <th className="p-3">Updated</th>}
              {columnVisibility.action && <th className="p-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-6 text-center">
                  No products
                </td>
              </tr>
            ) : (
              paginatedProducts.map((p, index) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  {columnVisibility.image && (
                    <td className="p-2 text-center">
                      {p.images?.[0]?.url && (
                        <img
                          src={p.images[0].url}
                          className="h-16 w-16 object-cover rounded mx-auto cursor-pointer"
                          onClick={() => setZoomImage(p.images[0].url)}
                        />
                      )}
                    </td>
                  )}
                  {columnVisibility.title && <td className="p-2 font-semibold text-amber-950">{p.title}</td>}
                  {columnVisibility.slug && <td className="p-2 text-teal-700">{p.slug}</td>}
                  {columnVisibility.category && <td className="p-2 text-orange-800">{p.category?.name || "-"}</td>}
                  {columnVisibility.price && <td className="p-2 text-center text-purple-950">₹{p.price}</td>}
                  {columnVisibility.discount && <td className="p-2 text-center text-sky-700">{p.discount || 0}%</td>}
                  {columnVisibility.final && (
                    <td className="p-2 text-center font-semibold text-green-700">₹{p.finalPrice}</td>
                  )}
                  {columnVisibility.stock && <td className="p-2 text-center text-amber-900">{p.stock}</td>}
                  {columnVisibility.created && (
                    <td className="p-2 text-center text-red-900">{p.createdAt && new Date(p.createdAt).toLocaleString("en-IN")}</td>
                  )}
                  {columnVisibility.updated && (
                    <td className="p-2 text-center text-blue-900">{p.updatedAt && new Date(p.updatedAt).toLocaleString("en-IN")}</td>
                  )}
                  {columnVisibility.action && (
                    <td className="p-2 flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => setViewProduct(p)}
                        className="px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-600 transition cursor-pointer mt-3"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => setEditProduct(p)}
                        className="px-3 py-2 bg-teal-400 text-white rounded hover:bg-teal-600 transition cursor-pointer mt-3"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="px-3 py-2 bg-red-400 text-white rounded hover:bg-red-600 transition cursor-pointer mt-3"
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => moveRow(index, "up")}
                          className="px-3 py-2 bg-purple-400 text-white rounded hover:bg-purple-600 transition cursor-pointer mt-3"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={() => moveRow(index, "down")}
                          className="px-3 py-2 bg-purple-400 text-white rounded hover:bg-purple-600 transition cursor-pointer mt-3"
                        >
                          <ChevronDown size={16} />
                        </button>
                      {/* View Variants */}
               <Link
                href={`/auth/admin/products/${p._id}/variants`}
                className="flex items-center px-3 py-1 rounded-sm
                     bg-gray-600 text-white text-sm gap-2 mt-3
                       hover:bg-black transition"
                >
                <Layers size={16} />
                  View Variants
              </Link>

{/* Add Variant */}
               <Link
                  href={`/auth/admin/products/${p._id}/variants/add`}
                  className="flex items-center px-3 py-1 rounded-sm
                      bg-pink-400 text-white text-sm gap-2 mt-3
                      hover:bg-pink-600 transition"
                  >
                   <Boxes size={16} />
                    Add Variant
               </Link>




                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Rows:
          <select
            className="border ml-2 px-2 py-1"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={60}>60</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="px-2 py-1 border rounded"
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {/* Zoom Image */}
        {zoomImage && (
          <motion.div
            key="zoomImage"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 cursor-zoom-out"
            onClick={() => setZoomImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={zoomImage}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
          </motion.div>
        )}

        {/* View Product */}
        {viewProduct && (
          <motion.div
            key={`view-${viewProduct._id}`}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewProduct(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Image */}
              <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center p-4">
                {viewProduct.images?.[0]?.url && (
                  <img
                    src={viewProduct.images[0].url}
                    className="h-64 w-full object-cover rounded"
                  />
                )}
              </div>

              {/* Right Details */}
              <div className="md:w-1/2 w-full p-6 flex flex-col gap-3 border-l md:border-l-2 border-gray-200 relative">
                <h2 className="text-3xl font-bold text-teal-800">{viewProduct.title}</h2>
                <p className="text-gray-700">{viewProduct.description}</p>
                <div className="flex gap-4 items-center mt-2">
                  <span className="text-lg font-semibold">Price: ₹{viewProduct.price}</span>
                  <span className="text-green-600 font-bold">Discount: {viewProduct.discount || 0}%</span>
                  <span className="text-xl font-bold text-teal-500">Final: ₹{viewProduct.finalPrice}</span>
                </div>
                <p className="text-gray-600">Stock: {viewProduct.stock}</p>
                <p className="text-gray-600">Category: {viewProduct.category?.name || "-"}</p>
                <p className="text-gray-500 text-sm">
                  Created: {viewProduct.createdAt && new Date(viewProduct.createdAt).toLocaleString("en-IN")}
                </p>
                <p className="text-gray-500 text-sm">
                  Updated: {viewProduct.updatedAt && new Date(viewProduct.updatedAt).toLocaleString("en-IN")}
                </p>
                <button
                  className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => setViewProduct(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Product */}
{editProduct && (
  <motion.div
    key={`edit-${editProduct._id}`}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setEditProduct(null)}
  >
    <motion.div
      className="bg-white rounded-lg shadow-xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left Image + Upload */}
      <div className="md:w-1/2 w-full bg-gray-100 flex flex-col items-center justify-center p-4 gap-3">
        {/* Preview Image */}
        {(editProduct.newImage || editProduct.images?.[0]?.url) && (
          <img
            src={
              editProduct.newImage
                ? URL.createObjectURL(editProduct.newImage)
                : editProduct.images?.[0]?.url
            }
            className="h-64 w-full object-cover rounded cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setZoomImage(
                editProduct.newImage
                  ? URL.createObjectURL(editProduct.newImage)
                  : editProduct.images![0].url
              );
            }}
          />
        )}

        {/* Upload Input */}
        <input
          type="file"
          accept="image/*"
          className="w-full border rounded px-3 py-2 bg-white"
          onChange={(e) =>
            setEditProduct({
              ...editProduct,
              newImage: e.target.files?.[0] || null,
            })
          }
        />
        <p className="text-xs text-gray-500 text-center">
          Upload new image to replace existing one
        </p>
      </div>

      {/* Right Form */}
      <div className="md:w-1/2 w-full p-6 flex flex-col gap-4 border-l md:border-l-2 border-gray-200">
        <h2 className="text-2xl font-bold text-teal-800 mb-4">Edit Product</h2>

        {[
          {
            label: "Title",
            value: editProduct.title,
            type: "text" as const,
            onChange: (v: string) =>
              setEditProduct({ ...editProduct, title: v }),
          },
          {
            label: "Slug",
            value: editProduct.slug,
            type: "text" as const,
            onChange: (v: string) =>
              setEditProduct({ ...editProduct, slug: v }),
          },
          {
            label: "Description",
            value: editProduct.description,
            type: "textarea" as const,
            onChange: (v: string) =>
              setEditProduct({ ...editProduct, description: v }),
          },
          {
            label: "Price",
            value: editProduct.price.toString(),
            type: "number" as const,
            onChange: (v: number) =>
              setEditProduct({
                ...editProduct,
                price: v,
                finalPrice:
                  v - (v * (editProduct.discount || 0)) / 100,
              }),
          },
          {
            label: "Discount",
            value: (editProduct.discount || 0).toString(),
            type: "number" as const,
            onChange: (v: number) =>
              setEditProduct({
                ...editProduct,
                discount: v,
                finalPrice:
                  editProduct.price -
                  (editProduct.price * v) / 100,
              }),
          },
          {
            label: "Stock",
            value: editProduct.stock.toString(),
            type: "number" as const,
            onChange: (v: number) =>
              setEditProduct({ ...editProduct, stock: v }),
          },
        ].map((field, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <label className="w-32 font-semibold">
              {field.label}:
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="border px-3 py-2 flex-1 rounded hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={field.value}
                onChange={(e) =>
                  field.onChange(e.target.value)
                }
              />
            ) : (
              <input
                type={field.type}
                className="border px-3 py-2 flex-1 rounded hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
                value={field.value}
                onChange={(e) =>
                  field.type === "number"
                    ? field.onChange(Number(e.target.value))
                    : field.onChange(e.target.value)
                }
              />
            )}
          </div>
        ))}

        {/* Category Dropdown */}
        <div className="flex items-center gap-4">
          <label className="w-32 font-semibold">Category:</label>
          <select
            className="border px-3 py-2 flex-1 rounded hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
            value={editProduct.category?._id || ""}
            onChange={(e) => {
              const selectedCat = categories.find(
                (c) => c._id === e.target.value
              );
              setEditProduct({
                ...editProduct,
                category: selectedCat,
              });
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => setEditProduct(null)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

      </AnimatePresence>
    </div>
  );
}
