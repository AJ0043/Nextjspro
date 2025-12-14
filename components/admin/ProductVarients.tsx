"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Variant {
  _id: string;
  sku: string;
  price: number;
  finalPrice: number;
  stock: number;
  attributes: {
    color?: string;
    size?: string;
  };
  images: { url: string }[];
}

export default function ProductVariants({
  params,
}: {
  params: { productId: string };
}) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    sku: "",
    color: "",
    size: "",
    price: "",
    discount: "",
    stock: "",
    images: [] as File[],
  });

  const fetchVariants = async () => {
    const res = await axios.get(
      `/api/products/${params.productId}/variants`
    );
    setVariants(res.data.variants || []);
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("sku", form.sku);
      fd.append("color", form.color);
      fd.append("size", form.size);
      fd.append("price", form.price);
      fd.append("discount", form.discount);
      fd.append("stock", form.stock);

      form.images.forEach((img) => fd.append("images", img));

      await axios.post(
        `/api/products/${params.productId}/variants`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setForm({
        sku: "",
        color: "",
        size: "",
        price: "",
        discount: "",
        stock: "",
        images: [],
      });

      fetchVariants();
    } catch (err) {
      alert("Variant add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Product Variants</h2>

      {/* ADD VARIANT */}
      <div className="border p-4 rounded mb-6">
        <input
          placeholder="SKU"
          className="border p-2 w-full mb-2"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          placeholder="Color"
          className="border p-2 w-full mb-2"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <input
          placeholder="Size"
          className="border p-2 w-full mb-2"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />
        <input
          placeholder="Price"
          type="number"
          className="border p-2 w-full mb-2"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Discount"
          type="number"
          className="border p-2 w-full mb-2"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
        />
        <input
          placeholder="Stock"
          type="number"
          className="border p-2 w-full mb-2"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setForm({
              ...form,
              images: Array.from(e.target.files || []).slice(0, 7),
            })
          }
        />

        <button
          onClick={submit}
          disabled={loading}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : "Add Variant"}
        </button>
      </div>

      {/* LIST VARIANTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variants.map((v) => (
          <div key={v._id} className="border p-3 rounded">
            <div className="font-semibold">{v.sku}</div>
            <div>₹{v.finalPrice}</div>
            <div>Stock: {v.stock}</div>
            <div className="flex gap-2 mt-2">
              {v.images?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  className="h-16 w-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
