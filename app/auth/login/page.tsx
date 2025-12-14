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

// Notification Component
const NotificationBar = ({ message, color }: any) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded-xl shadow-lg text-white font-medium z-50
        ${color === "green" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", color: "" });

  // ⭐ AUTO LOAD LOGOUT MESSAGE
  useEffect(() => {
    const msg = localStorage.getItem("logout_msg");
    if (msg) {
      setNotification({ message: msg, color: "green" });
      localStorage.removeItem("logout_msg"); // Remove so it doesn't show again
    }
  }, []);

  const { register, handleSubmit, formState: { errors } } =
    useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
    });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setNotification({ message: "", color: "" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Login Result →", result);

      if (!result.success) {
        setNotification({ message: result.message, color: "red" });
        setIsLoading(false);
        return;
      }

      // Success Message
      setNotification({ message: "Login successful!", color: "green" });

      // Redirect based on backend response
      setTimeout(() => {
        router.replace(result.redirect);
      }, 600);

    } catch (error) {
      console.error(error);
      setNotification({
        message: "Something went wrong, try again.",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NotificationBar message={notification.message} color={notification.color} />

      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] px-3">
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 rounded-2xl bg-white">
          <CardContent className="p-0">
            <div className="flex justify-center mb-4">
              <Image src={Logo} alt="App Logo" width={150} height={250} />
            </div>

            <h1 className="text-center text-3xl font-bold mb-4">Login to your Account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              
              {/* Email */}
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2.5 rounded-lg border bg-gray-50"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="text-sm font-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                  className="w-full mt-1 p-2.5 pr-10 rounded-lg border bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[35px]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right -mt-2">
                <Link
                  href="/auth/forgotpassword"
                  className="text-sm text-purple-600 font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <Buttonloading
                isLoading={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
              >
                Login
              </Buttonloading>
            </form>

            <p className="text-center text-gray-700 mt-6">
              Don’t have an account?{" "}
              <Link href="/auth/Sign-up" className="text-purple-600 font-semibold">
                Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
