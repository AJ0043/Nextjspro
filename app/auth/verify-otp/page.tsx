"use client";

import { useRef, useState, useEffect } from "react";

interface VerifyOTPClientProps {
  email: string;
}

export default function VerifyOTPClient({ email: initialEmail }: VerifyOTPClientProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [message, setMessage] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);

  // Timer for Resend OTP
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(id);
    }
    setResendDisabled(false);
  }, [timer]);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (!email) {
      setMessage("Email is required!");
      return;
    }

    if (finalOtp.length !== 6) {
      setMessage("Please enter complete 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect to frontend page after verification
        window.location.href = data.redirect || "/auth/login";
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong, please try again!");
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (resendDisabled) return;

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("OTP resent successfully!");
        setTimer(60);
        setResendDisabled(true);
        setOtp(Array(6).fill(""));
        inputsRef.current[0]?.focus();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to resend OTP, try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl text-center">

        <img
          src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
          alt="verify"
          className="w-16 mx-auto mb-4"
        />

        <h2 className="text-2xl font-semibold mb-3">Email Verification</h2>

        {/* Email Field */}
        <div className="text-left mb-5">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            disabled={Boolean(initialEmail)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={`w-full mt-1 px-4 py-2 rounded-lg border ${
              initialEmail ? "bg-gray-100 opacity-80" : "bg-white"
            } focus:outline-none focus:border-purple-600`}
          />
        </div>

        {/* OTP Fields */}
        <label className="text-sm font-medium text-gray-700">Enter OTP</label>
        <div className="flex justify-between mb-6 mt-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputsRef.current[index] = el; }} // ✔ TypeScript-safe
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition"
            />
          ))}
        </div>

        {/* Verify OTP Button */}
        <button
          onClick={verifyOtp}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-xl text-lg font-medium"
        >
          Verify OTP
        </button>

        {/* Resend OTP Button */}
        <button
          onClick={resendOtp}
          disabled={resendDisabled}
          className={`mt-4 text-purple-600 text-sm underline ${
            resendDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {resendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
