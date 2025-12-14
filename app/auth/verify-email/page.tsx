"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "invalid">("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        const res = await fetch("/api/auth/verify-email?token=" + token);
        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("invalid");
        }
      } catch (error) {
        setStatus("invalid");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-gray-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-200 transition">

        {status === "loading" && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Verifying your email...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="h-14 w-14 flex items-center justify-center bg-green-100 rounded-full">
                <span className="text-4xl">✅</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-green-600 mb-3">Email Verified 🎉</h2>
            <p className="text-gray-600 mb-6">
              Your account is now activated. You can log in and start using the website.
            </p>

            <a
              href="/auth/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
            >
              Go to Login
            </a>
          </>
        )}

        {status === "invalid" && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="h-14 w-14 flex items-center justify-center bg-red-100 rounded-full">
                <span className="text-4xl">❌</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-red-600 mb-3">Invalid or Expired Link</h2>
            <p className="text-gray-600 mb-6">
              The verification link is invalid or has expired. Request a new one.
            </p>

            <a
              href="/resend-verification"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md"
            >
              Resend Verification Email
            </a>
          </>
        )}

      </div>
    </div>
  );
}
