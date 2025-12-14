"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu, X, LayoutDashboard, Package, Users, Folder, ImageIcon, Star,
  Ticket, ChevronDown, Sun, Moon, ShoppingBag, Heart,
  PackagePlus, PackageSearch, TicketPlus,
  Boxes,
  Layers,
  PackageCheck,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);

  const [openProducts, setOpenProducts] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openCoupons, setOpenCoupons] = useState(false);
  const [openCartDropdown, setOpenCartDropdown] = useState(false);

  const [dark, setDark] = useState(false);

  const [user, setUser] = useState<any>(null);

  // FETCH USER
 // FETCH USER + REDIRECT IF NOT LOGGED IN
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      // ❌ NOT LOGGED IN → REDIRECT TO LOGIN PAGE
      if (!data.success) {
        window.location.href = "/auth/login?error=login_required";
        return;
      }

      // ✅ USER LOGGED IN 
      setUser(data.user);

    } catch (error) {
      window.location.href = "/auth/login?error=login_required";
    }
  };

  fetchUser();
}, []);

  // LOGOUT FIXED (POST method)
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",    // ← FIXED
      credentials: "include",
    });

    setUser(null);

    // Redirect
    window.location.href = "/auth/login?logout=success";
  };

  return (
    <div className={`${dark ? "dark bg-gray-900" : "bg-white"} flex w-full h-screen overflow-hidden`}>

      {openMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${dark ? "bg-gray-800 text-white" : "bg-white text-black"}
          border-r shadow-md transition-all duration-300
          h-full flex flex-col fixed md:static z-40
          ${open ? "w-64" : "w-20"}
          ${openMobile ? "left-0" : "-left-64 md:left-0"}
        `}
      >
        {/* TOP LOGO */}
        <div className="p-4 flex items-center justify-between">
          <img
            src="/estore.webp"
            alt="Logo"
            className={`${open ? "w-32" : "w-10"} transition-all duration-300`}
          />

          <button
            onClick={() => (window.innerWidth < 768 ? setOpenMobile(!openMobile) : setOpen(!open))}
            className="md:block"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-4 space-y-5 overflow-y-auto px-1">

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            <LayoutDashboard size={20} className="text-purple-600" />
            {open && <span>Dashboard</span>}
          </Link>

          {/* Products */}
          <div>
            <button
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setOpenProducts(!openProducts)}
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-purple-600" />
                {open && <span>Products</span>}
              </div>
              {open && <ChevronDown className={`${openProducts ? "rotate-180" : ""} transition`} />}
            </button>

            {openProducts && open && (
              <div className="ml-10 space-y-4 mt-2">
             <Link
               href="/auth/admin/products/add"
               className="flex items-center gap-2 hover:text-purple-600"
                >
               <PackagePlus size={18} className="text-purple-600" />
                Add Product
            </Link>


              <Link
                 href="/products/variants"
                 className="flex items-center gap-2 hover:text-purple-600"
                 >
                <Layers size={18} className="text-purple-600" />
               All Variant
              </Link>

             <Link
                href="/auth/admin/products/showproduct"
                className="flex items-center gap-2 hover:text-purple-600"
                >
                <Boxes size={18} className="text-purple-600" />
                All Product
            </Link>

           <Link
                href="#"
                className="text-black flex items-center gap-1 hover:text-purple-600"
                >
               <Layers size={18} className="text-purple-600" />
               Add Variants
          </Link>






              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <button
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-purple-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setOpenCategory(!openCategory)}
            >
              <div className="flex items-center gap-3">
                <Folder size={20} className="text-purple-700" />
                {open && <span>Category</span>}
              </div>
              {open && <ChevronDown className={`${openCategory ? "rotate-180" : "text-purple-500"} transition`} />}
            </button>

            {openCategory && open && (
              <div className="ml-10 space-y-4 mt-2">

                <Link href="/auth/admin/Catagory/add" className="flex items-center gap-2 hover:text-purple-600">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  All Category
                </Link>

               

              </div>
            )}
          </div>

          {/* Coupons */}
          <div>
            <button
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              onClick={() => setOpenCoupons(!openCoupons)}
            >
              <div className="flex items-center gap-3">
                <Ticket size={20} className="text-purple-700" />
                {open && <span>Coupons</span>}
              </div>
              {open && <ChevronDown className={`${openCoupons ? "rotate-180" : ""} transition`} />}
            </button>

            {openCoupons && open && (
              <div className="ml-10 space-y-4 mt-2">

                <Link href="/coupons/add" className="flex items-center gap-2 hover:text-purple-600">
                  <TicketPlus size={18} className="text-purple-600" />
                  Add Coupon
                </Link>

                <Link href="/coupons" className="flex items-center gap-2 hover:text-purple-600">
                  <Ticket size={18} className="text-purple-600" />
                  All Coupons
                </Link>

              </div>
            )}
          </div>

          {/* Users */}
          <Link
            href="/users"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <Users size={20} className="text-purple-600" />
            {open && <span>Users</span>}
          </Link>

          {/* Media */}
          <Link
            href="/auth/admin/media"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <ImageIcon size={20} className="text-purple-600" />
            {open && <span>Media</span>}
          </Link>

          {/* Reviews */}
          <Link
            href="/reviews"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <Star size={20} className="text-purple-600" />
            {open && <span>Reviews</span>}
          </Link>

        </nav>

        {/* LOGIN / LOGOUT SECTION */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-700">

          {user ? (
            <div className="flex flex-col gap-2">

              {open && (
                <p className="text-center font-semibold mb-1">Hello, {user.name}</p>
              )}

              <button
                onClick={handleLogout}
                className={`w-full py-2 rounded-lg font-semibold 
                  ${dark ? "bg-red-600 text-white" : "bg-red-500 text-white"}
                `}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={`w-full flex items-center justify-center py-2 rounded-lg font-semibold
                ${dark ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-black hover:bg-gray-300"}
              `}
            >
              {open ? "Login" : "🔐"}
            </Link>
          )}

        </div>
      </aside>

      {/* RIGHT SIDE */}
      <div className="flex-1 h-full flex flex-col overflow-hidden ml-0 md:ml-0">

        {/* NAVBAR */}
        <header
          className={`h-16 w-full border-b px-4 md:px-6 flex items-center justify-between
            ${dark ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black"}
          `}
        >
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpenMobile(true)}>
              <Menu size={24} className="text-purple-600" />
            </button>

            <span className="font-medium text-lg hidden sm:block">
              {user ? `Welcome, ${user.name}` : "Admin Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border 
                ${dark ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-black"}
              `}
            >
              <input
                type="text"
                placeholder="Search..."
                className={`bg-transparent outline-none w-64 ${
                  dark ? "placeholder-gray-300 text-white" : "placeholder-gray-500"
                }`}
              />
            </div>

            {/* CART DROPDOWN */}
            <div className="relative hidden sm:block">
              <button
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setOpenCartDropdown(!openCartDropdown)}
              >
                <ShoppingBag size={22} className="text-purple-600" />
              </button>

              {openCartDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border rounded-s shadow-lg z-50">

                  <Link href="/admin/products/add" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Package size={18} className="text-purple-600" /> New Product
                  </Link>

                  <Link href="/admin/wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Heart size={18} className="text-purple-600" /> Wishlist
                  </Link>

                  <Link href="/admin/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ShoppingBag size={18} className="text-purple-600" /> Orders
                  </Link>

                </div>
              )}
            </div>

            {/* DARK MODE */}
            <button onClick={() => setDark(!dark)}>
              {dark ? <Sun size={22} /> : <Moon size={22} className="text-purple-600" />}
            </button>

          </div>
        </header>
        

        {/* PAGE CONTENT */}
        <main
          className={`p-4 md:p-6 overflow-auto h-full
            ${dark ? "bg-gray-900 text-white" : "bg-gray-100"}
          `}
        >
          {children}
        </main>

      </div>
    </div>
  );
}
