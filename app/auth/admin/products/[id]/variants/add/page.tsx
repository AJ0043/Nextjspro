"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { ImageIcon, Trash2 } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/* ================= TYPES ================= */
interface Variant {
  _id: string;
  sku: string;
  attributes: {
    color?: string;
    size: string;
  };
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  description?: string;
  images: { url: string }[];
}

interface Product {
  _id: string;
  title: string;
  description?: string;
}

/* ================= PAGE ================= */
export default function ProductVariantsPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    color: "",
    size: "",
    price: "",
    discount: "",
    stock: "",
    description: "",
  });

  /* 🔥 4 IMAGE STATES */
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
  const [preview, setPreview] = useState<(string | null)[]>([null, null, null, null]);

  /* ================= PRICE ================= */
  const price = Number(form.price || 0);
  const discount = Number(form.discount || 0);
  const finalPrice = Math.round(price - (price * discount) / 100);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/products/variants/${id}`);
      setProduct(res.data.product);
      setVariants(res.data.variants || []);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  /* ================= HELPERS ================= */
  const imgSrc = (img: any) => img?.url?.startsWith("http") ? img.url : `${BASE_URL}${img?.url || ""}`;
  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (index: number, file: File | null) => {
    const newImages = [...images];
    const newPreview = [...preview];

    newImages[index] = file;
    newPreview[index] = file ? URL.createObjectURL(file) : null;

    setImages(newImages);
    setPreview(newPreview);
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      images.forEach((img) => {
        if (img) fd.append("images", img);
      });

      await axios.post(`/api/products/variants/${id}`, fd);

      alert("Variant added successfully ✅");
      setForm({ sku: "", color: "", size: "", price: "", discount: "", stock: "", description: "" });
      setImages([null, null, null, null]);
      setPreview([null, null, null, null]);
      fetchData();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteVariant = async (vid: string) => {
    if (!confirm("Delete this variant?")) return;
    try {
      await axios.delete(`/api/products/variants/${vid}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">

      {/* PRODUCT */}
      {product && (
        <div className="bg-indigo-50 p-6 rounded-xl border shadow">
          <h1 className="text-3xl font-bold text-indigo-700">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      {/* ADD VARIANT */}
      <form onSubmit={submitHandler} className="bg-amber-50 p-8 rounded-sm shadow border grid md:grid-cols-5 gap-6">
        <h2 className="md:col-span-5 text-2xl font-serif text-indigo-700">➕ Add Variant</h2>

        <div className="md:col-span-2 space-y-4 text-amber-900">
          <input name="sku" placeholder="SKU" className={input} value={form.sku} onChange={handleChange} required />
          <input name="color" placeholder="Color" className={input} value={form.color} onChange={handleChange} />
          <input name="price" type="number" placeholder="Price" className={input} value={form.price} onChange={handleChange} required />
          <input name="discount" type="number" placeholder="Discount %" className={input} value={form.discount} onChange={handleChange} />
          <p className="font-semibold">Final Price: <span className="text-green-600">₹{finalPrice}</span></p>
        </div>

        <div className="md:col-span-3 space-y-4 text-amber-950">
          <input name="stock" type="number" placeholder="Stock" className={input} value={form.stock} onChange={handleChange} />
          <select name="size" className={input} value={form.size} onChange={handleChange} required>
            <option value="">Select Size</option>
            {SIZES.map((s) => (<option key={s}>{s}</option>))}
          </select>
          <textarea name="description" placeholder="Description" className={input} value={form.description} onChange={handleChange} />

          {/* 🔥 IMAGE UPLOAD */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((_, i) => (
              <label key={i} className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500">
                <input type="file" accept="image/*" hidden onChange={(e) => handleImageChange(i, e.target.files?.[0] || null)} />
                {preview[i] ? (
                  <img src={preview[i]!} className="h-24 w-24 object-cover rounded" />
                ) : (
                  <>
                    <ImageIcon className="text-gray-400" />
                    <span className="text-sm text-gray-500">Image {i + 1}</span>
                  </>
                )}
              </label>
            ))}
          </div>

          <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg">
            {loading ? "Saving..." : "Add Variant"}
          </button>
        </div>
      </form>

      {/* VARIANTS TABLE */}
      <div className="bg-green-100 p-6 rounded-sm shadow border">
        <h2 className="text-2xl font-serif text-teal-700 mb-6">📦 Product Variants</h2>

        <div className="overflow-x-auto border rounded-2xl bg-amber-100">
          <table className="w-full border text-base">
            <thead className="bg-indigo-600 text-white font-serif">
              <tr>
                <th className={th}>SKU</th>
                <th className={th}>Color</th>
                <th className={th}>Size</th>
                <th className={th}>Price</th>
                <th className={th}>Discount</th>
                <th className={th}>Final Price</th>
                <th className={th}>Stock</th>
                <th className={th}>Description</th>
                <th className={th}>Images</th>
                <th className={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50 text-orange-400">
                  <td className={td}>{v.sku}</td>
                  <td className={td}>{v.attributes.color || "-"}</td>
                  <td className={td}>{v.attributes.size}</td>
                  <td className={td}>₹{v.price}</td>
                  <td className={td}>{v.discount}%</td>
                  <td className={`${td} font-bold text-green-600`}>₹{v.finalPrice}</td>
                  <td className={td}>{v.stock}</td>
                  <td className={td}>{v.description || "-"}</td>
                  <td className={td}>
                    <div className="grid grid-cols-2 gap-2 w-28">
                      {v.images.slice(0, 4).map((img, i) => (
                        <img key={i} src={imgSrc(img)} className="h-12 w-12 object-cover" />
                      ))}
                    </div>
                  </td>
                  <td className={td}>
                    <button onClick={() => deleteVariant(v._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex gap-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* ================= STYLES ================= */
const input = "w-full border-2 border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-indigo-500";
const th = "px-4 py-4 border text-left text-lg";
const td = "px-4 py-4 border text-base";
