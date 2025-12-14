"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";  // ✅ Eye Icons (lucide-react)

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async () => {
    if (!password || !confirmPassword) return alert("Please fill all fields");

    if (password !== confirmPassword) return alert("Passwords do not match");

    if (!token) return alert("Invalid or missing reset token.");

    setLoading(true);

    try {
      const res = await fetch("/api/auth/resetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Password updated successfully!");
        window.location.href = "/login";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-600 p-3 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 11V7a4 4 0 10-8 0v4M5 11h14l-1 9H6l-1-9z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mt-3">E-store</h2>
        </div>

        <h1 className="text-center text-3xl font-bold mb-4">Reset Password</h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your new password below.
        </p>

        {/* New Password */}
        <label className="block font-medium mb-1">New Password</label>
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            className="w-full p-3 pr-12 border rounded-lg bg-gray-100"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Eye Icon */}
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Confirm Password */}
        <label className="block font-medium mb-1">Confirm Password</label>
        <div className="relative mb-6">
          <input
            type={showConfirmPass ? "text" : "password"}
            className="w-full p-3 pr-12 border rounded-lg bg-gray-100"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Eye Icon */}
          <span
            className="absolute top-3 right-3 cursor-pointer"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-purple-600 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
