"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  validFrom: string;
  validTill: string;
  usageLimit: number;
  isActive: boolean;
  createdAt: string;
}

export default function AddCouponPage() {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    validFrom: "",
    validTill: "",
    usageLimit: 1,
    isActive: true,
  });

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/coupons");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async () => {
    if (!form.code || !form.discountValue || !form.validFrom || !form.validTill) {
      return alert("Please fill all required fields (*)");
    }
    if (form.discountValue <= 0) return alert("Discount must be greater than 0");
    if (new Date(form.validTill) <= new Date(form.validFrom))
      return alert("Valid Till must be after Valid From");

    try {
      setLoading(true);
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        validFrom: form.validFrom,
        validTill: form.validTill,
        usageLimit: Number(form.usageLimit),
        isActive: form.isActive,
      };
      const res = await axios.post("/api/coupons", payload);
      alert(res.data.message || "Coupon created successfully ✅");
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderAmount: 0,
        validFrom: "",
        validTill: "",
        usageLimit: 1,
        isActive: true,
      });
      fetchCoupons();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/coupons" className="p-2 rounded hover:bg-gray-100">
          <ArrowLeft />
        </Link>
        <h1 className="text-3xl font-serif">Add Coupon</h1>
      </div>

      {/* Form */}
      <div className="bg-teal-100 border rounded-xl shadow p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={label}>Coupon Code *</label>
            <input
              className={input}
              placeholder="EX: SAVE20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>

          <div>
            <label className={label}>
              Discount Value *
              <span className="ml-2 text-gray-500 text-sm">
                ({form.discountType === "percentage" ? "%" : "₹"})
              </span>
            </label>
            <input
              type="number"
              className={input}
              value={form.discountValue}
              onChange={(e) =>
                setForm({ ...form, discountValue: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className={label}>Discount Type *</label>
            <select
              className={input}
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>

          <div>
            <label className={label}>Minimum Order Amount</label>
            <input
              type="number"
              className={input}
              placeholder="Optional"
              value={form.minOrderAmount}
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className={label}>Valid From *</label>
            <input
              type="date"
              className={input}
              value={form.validFrom}
              onChange={(e) =>
                setForm({ ...form, validFrom: e.target.value })
              }
            />
          </div>

          <div>
            <label className={label}>Valid Till *</label>
            <input
              type="date"
              className={input}
              value={form.validTill}
              onChange={(e) =>
                setForm({ ...form, validTill: e.target.value })
              }
            />
          </div>

          <div>
            <label className={label}>Usage Limit</label>
            <input
              type="number"
              className={input}
              value={form.usageLimit}
              onChange={(e) =>
                setForm({ ...form, usageLimit: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
            />
            <span className="text-base font-semibold">Coupon is Active</span>
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="mt-8 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-50"
        >
          <Save size={20} />
          {loading ? "Saving..." : "Create Coupon"}
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-amber-100 border rounded-xl shadow p-6">
        <h2 className="text-2xl font-serif mb-4">All Coupons</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-teal-500 border rounded-xl font-serif">
              <th className="p-3 border">Code</th>
              <th className="p-3 border">Discount</th>
              <th className="p-3 border">Min Order</th>
              <th className="p-3 border">Valid From</th>
              <th className="p-3 border">Valid Till</th>
              <th className="p-3 border">Usage Limit</th>
              <th className="p-3 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-3 border">{c.code}</td>
                <td className="p-3 border">
                  {c.discountValue} {c.discountType === "percentage" ? "%" : "₹"}
                </td>
                <td className="p-3 border">{c.minOrderAmount || 0}</td>
                <td className="p-3 border">{new Date(c.validFrom).toLocaleDateString()}</td>
                <td className="p-3 border">{new Date(c.validTill).toLocaleDateString()}</td>
                <td className="p-3 border">{c.usageLimit}</td>
                <td className="p-3 border">{c.isActive ? "✅" : "❌"}</td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="p-3 text-center text-gray-500">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const label = "block mb-1 text-sm font-semibold text-gray-700";
const input =
  "w-full border px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-500";
