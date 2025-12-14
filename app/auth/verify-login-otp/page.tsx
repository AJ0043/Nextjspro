"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const VerifyOTP = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [notification, setNotification] = useState({ message: "", color: "" });

  const email = localStorage.getItem("pending_email");

  const handleVerify = async () => {
    if (!otp) return setNotification({ message: "Enter OTP", color: "red" });

    try {
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await res.json();
      if (!result.success) {
        setNotification({ message: result.message, color: "red" });
        return;
      }

      // OTP verified → store token & redirect
      localStorage.setItem("token", result.token);
      localStorage.removeItem("pending_email");

      router.push("/myaccount");
    } catch (err) {
      console.error(err);
      setNotification({ message: "Something went wrong", color: "red" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {notification.message && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${notification.color === "green" ? "bg-green-600" : "bg-red-600"}`}>
          {notification.message}
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mb-4 p-2 border rounded w-full max-w-sm"
      />
      <button
        onClick={handleVerify}
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default VerifyOTP;
