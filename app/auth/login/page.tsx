"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/estore.webp";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/LoginSchema";
import { Eye, EyeOff } from "lucide-react";
import Buttonloading from "@/components/Application/Buttonloading";
import { useRouter } from "next/navigation";

/* 🔔 Notification */
const NotificationBar = ({ message, color }: any) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl
      shadow-lg text-white font-medium z-50
      ${color === "green" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
};

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    color: "",
  });

  /* ✅ CHECK LOGIN STATUS ON PAGE LOAD */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data?.success && data?.user?.role) {
          router.replace(
            data.user.role === "admin"
              ? "/admin/dashboard"
              : "/website"
          );
        }
      } catch {
        // ignore
      }
    };

    checkAuth();

    const msg = localStorage.getItem("logout_msg");
    if (msg) {
      setNotification({ message: msg, color: "green" });
      localStorage.removeItem("logout_msg");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  /* 🔐 LOGIN SUBMIT */
  const onSubmit = async (data: LoginInput) => {
    if (isLoading) return;

    setIsLoading(true);
    setNotification({ message: "", color: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setNotification({
          message: result?.message || "Invalid credentials",
          color: "red",
        });
        return;
      }

      setNotification({
        message: result.message,
        color: "green",
      });

      setTimeout(() => {
        router.replace(result.redirect);
      }, 700);
    } catch {
      setNotification({
        message: "Server error, try again",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />

      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-3">
        <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <div className="flex justify-center mb-4">
              <Image src={Logo} alt="Logo" width={150} />
            </div>

            <h1 className="text-center text-3xl font-bold mb-6">
              Login to your Account
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {/* Email */}
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2.5 rounded-lg border bg-gray-50"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm font-semibold">Password</label>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full mt-1 p-2.5 pr-10 rounded-lg border bg-gray-50"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[36px]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <Link
                  href="/auth/forgotpassword"
                  className="text-sm text-purple-600 font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>

              <Buttonloading
                isLoading={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg"
              >
                Login
              </Buttonloading>
            </form>

            <p className="text-center mt-6">
              Don’t have an account?{" "}
              <Link
                href="/auth/Sign-up"
                className="text-purple-600 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
