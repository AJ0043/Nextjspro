"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStats {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  unverified: number;
}

export default function OrdersPage() {
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const res = await axios.get("/api/orders/stats");
        setStats(res.data.stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  if (loading) return <p className="p-6">Loading orders stats...</p>;
  if (!stats) return <p className="p-6">No data available</p>;

  const data = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Unverified"],
    datasets: [
      {
        label: "Orders",
        data: [
          stats.pending,
          stats.processing,
          stats.shipped,
          stats.delivered,
          stats.cancelled,
          stats.unverified,
        ],
        backgroundColor: [
          "#F59E0B", // Pending - amber
          "#3B82F6", // Processing - blue
          "#10B981", // Shipped - green
          "#8B5CF6", // Delivered - purple
          "#EF4444", // Cancelled - red
          "#6B7280", // Unverified - gray
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-6 ">Orders Status</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Pie data={data} />

        {/* Counts below chart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
          <StatusBox label="Pending" count={stats.pending} color="bg-amber-500" />
          <StatusBox label="Processing" count={stats.processing} color="bg-blue-500" />
          <StatusBox label="Shipped" count={stats.shipped} color="bg-green-500" />
          <StatusBox label="Delivered" count={stats.delivered} color="bg-purple-500" />
          <StatusBox label="Cancelled" count={stats.cancelled} color="bg-red-500" />
          <StatusBox label="Unverified" count={stats.unverified} color="bg-gray-500" />
        </div>
      </div>
    </div>
  );
}

function StatusBox({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="p-4 rounded-lg shadow flex flex-col items-center justify-center">
      <div className={`w-4 h-4 rounded-full mb-2 ${color}`}></div>
      <p className="font-semibold">{label}</p>
      <p className="text-lg">{count}</p>
    </div>
  );
}
