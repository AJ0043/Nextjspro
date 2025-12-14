import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="w-64 h-screen bg-black text-white p-6 flex flex-col gap-6 fixed">
      <h2 className="text-2xl font-bold tracking-wide">Admin Panel</h2>

      <div className="flex flex-col gap-4 text-gray-200">
        <Link href="/dashboard/admin" className="hover:text-white">Dashboard</Link>
        <Link href="/dashboard/admin/users" className="hover:text-white">Manage Users</Link>
        <Link href="/dashboard/admin/orders" className="hover:text-white">Orders</Link>
        <Link href="/dashboard/admin/settings" className="hover:text-white">Settings</Link>
      </div>
    </div>
  );
}
