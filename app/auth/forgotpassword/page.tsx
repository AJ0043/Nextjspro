"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/estore.webp";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Buttonloading from "@/components/Application/Buttonloading";

// Zod Schema
const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// 🔥 Notification Component
const NotificationBar = ({ message, color }: any) => {
  if (!message) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-md 
        text-white font-medium transition-all duration-300
        ${color === "green" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
};

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState({
    message: "",
    color: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setNotification({ message: "", color: "" });

    try {
      // ✅ Correct API route
      const res = await fetch("/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      setNotification({
        message: result.message,
        color: res.status === 200 ? "green" : "red",
      });

      // Hide notification after 4s
      setTimeout(() => setNotification({ message: "", color: "" }), 4000);
    } catch (error) {
      console.error(error);
      setNotification({
        message: "Something went wrong, try again.",
        color: "red",
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Notification */}
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-3">
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="flex justify-center mb-6">
              <Image src={Logo} alt="App Logo" width={150} height={150} />
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-900 mb-1 font-serif">
              Forgot Password?
            </h1>

            <p className="text-center text-gray-600 mb-6">
              Enter your email to receive a password reset link.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* EMAIL */}
              <div>
                <label className="text-gray-800 text-sm font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <Buttonloading
                isLoading={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
              >
                Send Reset Link
              </Buttonloading>
            </form>

            {/* BACK TO LOGIN */}
            <p className="text-center text-gray-700 mt-6">
              Remember your password?{" "}
              <Link
                href="/auth/Login"
                className="text-purple-600 font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ForgotPassword;
