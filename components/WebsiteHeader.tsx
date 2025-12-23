"use client";

import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  ListOrdered,
  PackagePlus,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  Home,
  Info,
  Star,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  name: string;
  role?: "user" | "admin";
}

export default function Header() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [cartCount] = useState(3); // demo

  const navLinks = [
    { label: "Home", href: "http://localhost:3000/website" },
    { label: "Cargo", href: "/website/category/Cargo" },
    { label: "Watch", href: "/website/category/Watch" },
    { label: "Women", href: "/website/category/Women" },
    { label: "Guns", href: "/website/category/guns" },
    { label: "Mens", href: "/website/category/Men" },
    { label: "Electronics", href: "/website/category/electronics" },
    { label: "LuggageBags", href: "/website/category/Bags" },
    { label: "KitchenWare", href: "/website/category/Kitchenware" },
    { label: "Shoes", href: "/website/category/Shoes" },
    { label: "Cap", href: "/website/category/Cap" },
    { label: "Sports", href: "/website/category/sports" },
    { label: "NewProduct", href: "/website/category/NewProducts" },
    { label: "About", href: "/website/category/abouts" },
  ];

  /* ================= FETCH USER ================= */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => (d.success ? setUser(d.user) : setUser(null)))
      .catch(() => setUser(null));
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMenuOpen(false);
    setUserDropdown(false);
    router.push("/auth/login");
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="w-full bg-amber-50 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

          {/* MOBILE MENU BTN */}
          <button onClick={() => setMenuOpen(true)} className="md:hidden">
            <Menu size={28} />
          </button>

          {/* LOGO */}
          <Link href="/website">
            <Image src="/estore.webp" alt="E-Store" width={110} height={110} />
          </Link>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-5 py-3 border rounded-full"
            />
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-4">

            {/* ADMIN DASHBOARD */}
            {user?.role === "admin" && (
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
            )}

            {/* CART */}
            <button onClick={() => router.push("/cart")} className="relative">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* USER DROPDOWN */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-1"
              >
                <User size={26} />
                <ChevronDown size={18} />
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-3 w-60 bg-white border rounded-lg shadow-xl z-50">
                  <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t rotate-45" />

                  {user ? (
                    <>
                      <div className="px-4 py-3 font-semibold border-b bg-gray-50">
                        Hi, <span className="text-purple-600">{user.name}</span>
                      </div>

                      <DropdownItem href="/cart" icon={<ShoppingCart size={18} />} label="Cart" />
                      <DropdownItem href="/wishlist" icon={<Heart size={18} />} label="Wishlist" />
                      <DropdownItem href="/orders" icon={<ListOrdered size={18} />} label="Orders" />
                      <DropdownItem href="/Review" icon={<Star size={18} />} label="Reviews" />

                      {user.role === "admin" && (
                        <>
                          <DropdownItem href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                          <DropdownItem href="/admin/products/new" icon={<PackagePlus size={18} />} label="New Product" />
                        </>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 border-t"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </>
                  ) : (
                    <DropdownItem href="/auth/login" icon={<LogIn size={18} />} label="Login" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SLIDER ================= */}
      <div className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "visible" : "invisible"}`}>
        {/* OVERLAY */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />

        {/* DRAWER */}
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white transition-transform duration-300 overflow-y-auto`}
          style={{ maxHeight: "100vh" }}
        >
          {/* HEADER */}
          <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Menu</h2>
            <X onClick={() => setMenuOpen(false)} className="cursor-pointer" />
          </div>

          {/* SEARCH */}
          <div className="p-4 border-b">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* NAV LINKS */}
          <div className="divide-y">
            {navLinks.map((link) => (
              <MobileItem key={link.href} label={link.label} href={link.href} />
            ))}
          </div>

          {/* USER LINKS */}
          <div className="border-t mt-4 divide-y">
            {user ? (
              <>
                <div className="px-4 py-3 font-semibold">Hi, {user.name}</div>

                <MobileItem icon={<ShoppingCart size={18} />} label="Cart" href="/cart" />
                <MobileItem icon={<Heart size={18} />} label="Wishlist" href="/wishlist" />
                <MobileItem icon={<ListOrdered size={18} />} label="Orders" href="/orders" />

                {user.role === "admin" && (
                  <>
                    <MobileItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/admin/dashboard" />
                    <MobileItem icon={<PackagePlus size={18} />} label="New Product" href="/admin/products/new" />
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <MobileItem icon={<LogIn size={18} />} label="Login" href="/auth/login" />
            )}
          </div>
        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      <nav className="hidden md:block bg-purple-500 text-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex justify-center gap-10 items-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

/* ================= DROPDOWN ITEM ================= */
function DropdownItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-100 last:border-b-0"
    >
      {icon}
      {label}
    </Link>
  );
}

/* ================= MOBILE ITEM ================= */
function MobileItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-100"
    >
      {icon}
      {label}
    </Link>
  );
}
