"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";

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
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  // FETCH CATEGORY & PRODUCTS
  useEffect(() => {
    async function load() {
      try {
        const catRes = await axios.get("/api/category");
        setCategories(catRes.data.categories || []);

        const prodRes = await axios.get("/api/products/add");
        setProducts(prodRes.data.products || []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // INPUT CHANGE
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // FILE CHANGE HANDLER
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 10);

    const previews = files.map((file) => URL.createObjectURL(file));
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));

    setSelectedFiles(files);
    setImagePreviews(previews);
  };

  // REMOVE IMAGE
  const handleRemoveImage = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // CONVERT FILE TO BASE64
  const filesToBase64 = async (files: File[]) => {
    const promises = files.map(
      (file) =>
        new Promise<{ url: string; public_id: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () =>
            resolve({ url: reader.result as string, public_id: file.name });
          reader.onerror = (error) => reject(error);
        })
    );
    return Promise.all(promises);
  };
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!form.title || !form.slug || !form.price || !form.category) {
    alert("Required fields missing!");
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("price", form.price);
    formData.append("discount", form.discount || "0");
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("stock", form.stock);

    // 🔥 Real image files append
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    const prod = await axios.post("/api/products/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (prod.data.success) {
      alert("Product Added Successfully!");

      setProducts((prev) => [...prev, prod.data.product]);

      // Reset form
      setForm({
        title: "",
        slug: "",
        price: "",
        discount: "",
        description: "",
        category: "",
        stock: "",
      });
      setSelectedFiles([]);
      setImagePreviews([]);
    }
  } catch (err) {
    console.error(err);
    alert("Error adding product");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-2xl sm:text-3xl font-serif mb-6">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 max-w-full sm:max-w-2xl lg:max-w-3xl"
      >
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50"
          required
        />
        <input
          type="text"
          name="slug"
          placeholder="Slug"
          value={form.slug}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50"
            required
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50"
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-3 rounded w-full bg-amber-50"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-3 rounded w-full bg-amber-50"
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

        {/* IMAGE UPLOAD */}
        <div className="border p-4 rounded bg-amber-50">
          <label className="font-semibold">Upload Images</label>
          <div
            onClick={() => document.getElementById("imageUpload")?.click()}
            className="mt-2 border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            Click to upload (Max 10)
          </div>
          <input
            id="imageUpload"
            multiple
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img
                    src={src}
                    className="w-full h-28 object-cover rounded border shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
                <td className="border px-3 py-2">{p.title}</td>
                <td className="border px-3 py-2">{p.slug}</td>
                <td className="border px-3 py-2">{p.category?.title}</td>
                <td className="border px-3 py-2">{p.price}</td>
                <td className="border px-3 py-2">{p.discount}%</td>
                <td className="border px-3 py-2">{p.finalPrice}</td>
                <td className="border px-3 py-2">{p.stock}</td>
                <td className="border px-3 py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="border px-3 py-2">
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
