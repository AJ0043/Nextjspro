"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Download } from "lucide-react";

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
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("/api/coupons");
      setCoupons(res.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const exportCSV = () => {
    if (!coupons.length) return;

    const headers = [
      "Code",
      "Discount",
      "Min Order",
      "Valid From",
      "Valid Till",
      "Usage Limit",
      "Active",
    ];

    const rows = coupons.map(c => [
      c.code,
      `${c.discountValue}${c.discountType === "percentage" ? "%" : "₹"}`,
      c.minOrderAmount || 0,
      new Date(c.validFrom).toLocaleDateString(),
      new Date(c.validTill).toLocaleDateString(),
      c.usageLimit,
      c.isActive ? "Yes" : "No",
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(r => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "coupons.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentCoupons = coupons.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(coupons.length / perPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>

        <div className="flex gap-2">
          <Link
            href="/admin/coupons/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Add Coupon
          </Link>

          <button
            onClick={exportCSV}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-1"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {coupons.length === 0 ? (
        <p>No coupons found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-200">
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
              {currentCoupons.map(c => (
                <tr key={c._id} className="bg-amber-100 hover:bg-amber-200">
                  <td className="border p-3">{c.code}</td>
                  <td className="border p-3">
                    {c.discountValue}
                    {c.discountType === "percentage" ? "%" : "₹"}
                  </td>
                  <td className="border p-3">{c.minOrderAmount || 0}</td>
                  <td className="border p-3">
                    {new Date(c.validFrom).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {new Date(c.validTill).toLocaleDateString()}
                  </td>
                  <td className="border p-3">{c.usageLimit}</td>
                  <td className="border p-3">{c.isActive ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-indigo-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
