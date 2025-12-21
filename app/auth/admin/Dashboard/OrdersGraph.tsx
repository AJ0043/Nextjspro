"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Layers,
  TicketPercent,
  Users,
  ShoppingCart,
} from "lucide-react";

import StatCard from "./StatCard";
import OrdersGraph from "./OrdersGraph";

interface Stats {
  products: number;
  categories: number;
  coupons: number;
  users: number;
  orders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/dashboard/stats")
      .then((res) => setStats(res.data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-red-500">Failed to load stats</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Admin Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Products"
          value={stats.products}
          href="/auth/admin/products/showproduct"
          gradient="from-indigo-500 via-purple-500 to-pink-500"
          icon={<Package />}
        />

        <StatCard
          title="Categories"
          value={stats.categories}
          href="/auth/admin/Catagory/add"
          gradient="from-green-500 via-emerald-500 to-teal-500"
          icon={<Layers />}
        />

        <StatCard
          title="Coupons"
          value={stats.coupons}
          href="/auth/admin/Coupons"
          gradient="from-amber-400 via-orange-500 to-red-500"
          icon={<TicketPercent />}
        />

        <StatCard
          title="Users"
          value={stats.users}
          href="/auth/admin/Users"
          gradient="from-sky-500 via-blue-500 to-indigo-500"
          icon={<Users />}
        />

        <StatCard
          title="Orders"
          value={stats.orders}
          href="/auth/admin/orders"
          gradient="from-pink-500 via-rose-500 to-red-500"
          icon={<ShoppingCart />}
        />
      </div>

      {/* ORDERS GRAPH SECTION */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="text-pink-500" />
          Orders Analytics
        </h2>

        <OrdersGraph
          data={[5, 10, 8, 14, 18, 22, stats.orders]}
        />
      </div>
    </div>
  );
}
