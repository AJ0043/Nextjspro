"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Layers,
  TicketPercent,
  Users as UsersIcon,
  ShoppingCart,
} from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Stats {
  products: number;
  categories: number;
  coupons: number;
  users: number;
  orders: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface OrderStats {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  unverified: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#f59e0b","#3b82f6","#6366f1","#16a34a","#ef4444","#9ca3af"];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("/api/dashboard/stats");
        setStats(res.data.stats);

        const usersRes = await axios.get("/api/users");
        setUsers(usersRes.data.users);

        const ordersRes = await axios.get("/api/orders/stats");
        setOrderStats(ordersRes.data.stats);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* 🔥 Banner */}
      <div className="mb-8 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="text-yellow-300">E-Store</span>
          </h1>
          <p className="text-lg opacity-90">Manage products, users, orders & grow your business 🚀</p>
        </div>
        <div className="mt-4 md:mt-0 rounded">
          <Image src="/Ecom2.png" alt="eMart Banner" width={220} height={220} className="drop-shadow-xl" />
        </div>
      </div>

      {/* Dashboard Title */}
      <h2 className="text-2xl font-serif mb-6">Admin Dashboard</h2>

      {/* Grid: Cards + Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard title="Products" value={stats?.products || 0} max={500} href="/auth/admin/products/showproduct" gradient="from-indigo-500 via-purple-500 to-pink-500" icon={<Package />} />
          <StatCard title="Categories" value={stats?.categories || 0} max={50} href="/auth/admin/Catagory/add" gradient="from-green-500 via-emerald-500 to-teal-500" icon={<Layers />} />
          <StatCard title="Coupons" value={stats?.coupons || 0} max={100} href="/auth/admin/Coupons" gradient="from-amber-400 via-orange-500 to-red-500" icon={<TicketPercent />} />
          <StatCard title="Users" value={stats?.users || 0} max={1000} href="/auth/admin/Users" gradient="from-sky-500 via-blue-500 to-indigo-500" icon={<UsersIcon />} />
          <StatCard title="Orders" value={stats?.orders || 0} max={200} href="/auth/admin/orders" gradient="from-pink-500 via-rose-500 to-red-500" icon={<ShoppingCart />} />
        </div>

        {/* Users Box */}
        <div className="bg-teal-700 rounded-lg shadow p-4 h-[500px] overflow-y-auto lg:col-span-1">
          <h3 className="text-xl font-semibold mb-3 text-amber-200">All Users</h3>
          <div className="space-y-2">
            {users.length === 0 && <p>No users found</p>}
            {users.map((user) => (
              <div key={user._id} className="flex justify-between items-center border-b border-gray-200 py-2">
                <div>
                  <p className="font-medium text-amber-100">{user.name}</p>
                  <p className="text-sm text-white">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Orders Pie Chart */}
      {orderStats && (
        <div className="mt-8 bg-gradient-to-r from-violet-500 via-teal-500 to-lime-500 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Orders Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" nameKey="name" data={[
                { name: "Pending", value: orderStats.pending },
                { name: "Processing", value: orderStats.processing },
                { name: "Shipped", value: orderStats.shipped },
                { name: "Delivered", value: orderStats.delivered },
                { name: "Cancelled", value: orderStats.cancelled },
                { name: "Unverified", value: orderStats.unverified },
              ]} cx="50%" cy="50%" outerRadius={100} label>
                {Object.values(orderStats).map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Status counts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 text-center">
            {Object.entries(orderStats).map(([status, value], idx) => (
              <div key={idx} className="p-2 rounded-lg bg-red-100">
                <p className="font-semibold text-gray-700 capitalize">{status}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Latest Order & Review Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Latest Order Card */}
        <div className="bg-gradient-to-r from-blue-800 p-6 rounded-lg shadow text-white">
          <h4 className="font-semibold text-lg mb-2">Latest Order</h4>
          <p>Customer: John Doe</p>
          <p>Order Amount: $120</p>
          <p>Status: <span className="capitalize">Pending</span></p>
          <Link href="#" className="underline text-sm mt-2 block">View Details</Link>
        </div>

        {/* Latest Review Card */}
        <div className="bg-gradient-to-r from-green-800  p-6 rounded-lg shadow text-white">
          <h4 className="font-semibold text-lg mb-2">Latest Review</h4>
          <p>Customer: Jane Smith</p>
          <p>Rating: ★★★★☆</p>
          <p>Comment: "Great product!"</p>
          <Link href="#" className="underline text-sm mt-2 block">View Review</Link>
        </div>

      </div>

    </div>
  );
}

/* ---------- StatCard Component ---------- */
function StatCard({ title, value, max, icon, href, gradient }: {
  title: string; value: number; max: number; icon: React.ReactNode; href: string; gradient: string;
}) {
  const progress = Math.min((value / max) * 100, 100);
  return (
    <Link href={href}>
      <div className={`text-white rounded-lg p-5 shadow-lg hover:shadow-xl hover:scale-[1.03] transition cursor-pointer bg-gradient-to-r ${gradient}`}>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <h2 className="text-3xl font-bold mt-1">{value}</h2>
          </div>
          <div className="bg-white/20 p-3 rounded-full">{icon}</div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1 opacity-90">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
