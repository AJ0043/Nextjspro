"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  title: string;
  
  slug: string;
  price: number;
  discount?: number;
  finalPrice: number;
  description?: string;
  category: { _id: string; title: string };
  images: { url: string; public_id: string }[];
  stock: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export default function AdminProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    price: "",
    discount: "",
    description: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const catRes = await axios.get("/api/category");
        setCategories(catRes.data.categories || []);

        const prodRes = await axios.get("/api/products/add?status=all");
        setProducts(prodRes.data.products || []);
      } catch (e) {
        console.error("Load Error:", e);
      }
    }
    load();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dropzone setup
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => setFiles(acceptedFiles.slice(0, 10)),
    noClick: true,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.price || !form.category || files.length === 0) {
      alert("Required fields missing or no images selected!");
      return;
    }

    setLoading(true);

    try {
      const uploadData = new FormData();
      files.forEach((file) => uploadData.append("images", file));

      const uploadRes = await axios.post("/api/products/uploads", uploadData);
      if (!uploadRes.data.success) throw new Error("Image upload failed");

      const uploadedImages = uploadRes.data.files.map((f: any) => ({
        url: f.url,
        public_id: f.name,
      }));

      const prodRes = await axios.post("/api/products/add", {
        ...form,
        images: uploadedImages,
      });

      if (prodRes.data.success) {
        alert("Product Added Successfully!");
        setProducts((prev) => [prodRes.data.product, ...prev]);

        setForm({
          title: "",
          slug: "",
          price: "",
          discount: "",
          description: "",
          category: "",
          stock: "",
        });
        setFiles([]);
      }
    } catch (err: any) {
      console.error("Add Product Error:", err);
      alert(err?.response?.data?.message || err.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl sm:text-3xl font-serif mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-full sm:max-w-2xl lg:max-w-3xl">
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50  text-amber-950"
          required
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50 text-amber-950"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50 text-amber-950"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50 text-amber-950"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50 text-amber-950"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50 text-amber-950"
            required
          />
          <select 
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50 text-amber-950"
            required
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* DROPZONE */}
        <div
          {...getRootProps()}
          className="border p-4 rounded bg-amber-50 cursor-pointer text-center"
        >
          <input {...getInputProps()} />
          <p className="text-orange-700">Click the box or drag & drop images here</p>
          <button type="button" onClick={open} className="mt-2 px-3 py-1 bg-purple-600 text-white rounded">
            Select Images
          </button>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {files.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  className="w-full h-28 object-cover rounded border shadow"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white p-3 rounded w-full sm:w-auto cursor-pointer"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* PRODUCTS TABLE */}
      <h2 className="text-2xl font-bold mt-10 mb-4 font-serif">Products</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-amber-100">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-amber-500 text-white">Image</th>
              <th className="px-3 py-2 bg-teal-600 text-white">Title</th>
              <th className="px-3 py-2 bg-green-600 text-white">Slug</th>
              <th className="px-3 py-2 bg-purple-600 text-white">Category</th>
              <th className="px-3 py-2 bg-red-500 text-white">Price</th>
              <th className="px-3 py-2 bg-blue-500 text-white">Discount</th>
              <th className="px-3 py-2 bg-orange-500 text-white">Final</th>
              <th className="px-3 py-2 bg-black text-white">Stock</th>
              <th className="px-3 py-2 bg-gray-700 text-white">Created At</th>
              <th className="px-3 py-2 bg-gray-800 text-white">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td className="border px-3 py-2">
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0].url}
                      className="h-14 w-14 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border px-3 py-2 text-teal-800">{p.title}</td>
                <td className="border px-3 py-2 text-lime-800">{p.slug}</td>
                <td className="border px-3 py-2 text-purple-800">{p.category?.title}</td>
                <td className="border px-3 py-2 text-red-800">{p.price}</td>
                <td className="border px-3 py-2 text-sky-800">{p.discount}%</td>
                <td className="border px-3 py-2 text-orange-800">{p.finalPrice}</td>
                <td className="border px-3 py-2 text-black">{p.stock}</td>
                <td className="border px-3 py-2 text-gray-800">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="border px-3 py-2 text-gray-900">
                  {new Date(p.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
