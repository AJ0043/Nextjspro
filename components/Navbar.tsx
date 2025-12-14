"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const handleLogout = () => {
    // Remove token & role
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");

    setIsLoggedIn(false); // update UI
    router.push("/auth/login"); // redirect to login
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-purple-600 text-white">
      <Link href="/" className="text-xl font-bold">
        My Ecom
      </Link>

      <div className="flex gap-4">
        {!isLoggedIn && (
          <Link
            href="/auth/login"
            className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold"
          >
            Login
          </Link>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
