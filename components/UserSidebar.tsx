import Link from "next/link";

export default function UserSidebar() {
  return (
    <div className="w-64 h-screen bg-purple-700 text-white p-6 flex flex-col gap-6 fixed">
      <h2 className="text-2xl font-bold tracking-wide">User Dashboard</h2>

      <div className="flex flex-col gap-4 text-purple-100">
        <Link href="/dashboard/user" className="hover:text-white">Home</Link>
        <Link href="/dashboard/user/profile" className="hover:text-white">My Profile</Link>
        <Link href="/dashboard/user/orders" className="hover:text-white">My Orders</Link>
        <Link href="/dashboard/user/settings" className="hover:text-white">Settings</Link>
      </div>
    </div>
  );
}
