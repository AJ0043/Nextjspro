"use client";

import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  name: string;
  role?: "user" | "admin";
}

interface Category {
  _id: string;
  title: string;
  slug: string;
}

export default function Header() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // 🔹 Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        const data = await res.json();
        data.success ? setUser(data.user) : setUser(null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-amber-50 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">

          {/* LOGO */}
          <Link href="/website" className="shrink-0">
            <Image
              src="/estore.webp"
              alt="E-Store Logo"
              width={120}
              height={120}
              priority
              className="object-contain"
            />
          </Link>

          {/* SEARCH (DESKTOP) */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 text-[16px] border rounded-full outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-5">
            {/* CART */}
            <button
              onClick={() => router.push("/cart")}
              className="relative cursor-pointer"
            >
              <ShoppingCart size={26} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            {/* USER */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-semibold text-[16px]">
                  Hi, <span className="text-purple-600">{user.name}</span>
                </span>

                {user.role === "admin" && (
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-sm hover:bg-purple-800 cursor-pointer"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="hidden md:block cursor-pointer"
              >
                <User size={26} />
              </button>
            )}

            {/* HAMBURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden cursor-pointer"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP NAV ================= */}
      <nav className="hidden md:block bg-purple-500 border-b">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-center gap-10 text-[16px] font-serif text-white">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="hover:text-yellow-300"
            >
              {cat.title}
            </Link>
          ))}
          <Link href="/about" className="hover:text-purple-600">About</Link>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-purple-500 border-b px-4 py-4 space-y-4 text-amber-50">
          {/* MOBILE SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg outline-none"
          />

          {/* NAV LINKS */}
          <div className="flex flex-col gap-3 font-medium text-amber-50">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
              >
                {cat.title}
              </Link>
            ))}
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          </div>

          {/* USER ACTIONS */}
          {user ? (
            <div className="pt-4 border-t space-y-3">
              <p className="font-semibold">
                Hi, <span className="text-purple-600">{user.name}</span>
              </p>

              {user.role === "admin" && (
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-sm"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              <User size={18} />
              Login
            </button>
          )}
        </div>
      )}
    </>
  );
}
