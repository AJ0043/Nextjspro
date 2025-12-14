"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Logo from "@/public/estore.webp";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupInput } from "@/lib/SignupSchema";
import { Eye, EyeOff } from "lucide-react";
import Buttonloading from "@/components/Application/Buttonloading";
import { useRouter } from "next/navigation";

// Notification Bar
const NotificationBar = ({ message, color }: any) => {
  if (!message) return null;
  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-md text-white font-medium transition-all duration-300
        ${color === "green" ? "bg-green-600" : "bg-red-600"}`}
    >
      {message}
    </div>
  );
};

const Signup = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState({
    message: "",
    color: "",
  });

  const { register, handleSubmit, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  // SUBMIT HANDLER
  const onSubmit = async (data: SignupInput) => {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          phone: data.phone, // ✅ Phone number
        }),
      });

      const result = await res.json();
      console.log("API Response:", result);

      setNotification({
        message: result.message,
        color: result.success ? "green" : "red",
      });

      setTimeout(() => {
        setNotification({ message: "", color: "" });
      }, 3000);

      if (result.success) {
        setTimeout(() => {
          router.push("/auth/verify-otp?email=" + data.email);
        }, 1200);
      }

    } catch (error) {
      console.error(error);

      setNotification({
        message: "Something went wrong!",
        color: "red",
      });

      setTimeout(() => {
        setNotification({ message: "", color: "" });
      }, 3000);

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

            {/* LOGO */}
            <div className="flex justify-center mb-4">
              <Image src={Logo} alt="App Logo" width={150} height={250} />
            </div>

            <h1 className="text-center text-3xl font-bold text-gray-900 mb-1 font-serif">
              Create your account
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Signup to start your journey.
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

              {/* NAME */}
              <div>
                <label className="text-gray-800 text-sm font-semibold">Full Name</label>
                <input
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                />
                {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-gray-800 text-sm font-semibold">Email</label>
                <input
                  {...register("email")}
                  placeholder="example@gmail.com"
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-gray-800 text-sm font-semibold">Phone Number</label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="+91 9876543210"
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                />
                {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
              </div>

              {/* ROLE DROPDOWN */}
              <div>
                <label className="text-gray-800 text-sm font-semibold">Select Role</label>
                <select
                  {...register("role")}
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 bg-gray-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-600 text-sm">{errors.role.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-gray-800 text-sm font-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="********"
                  className="w-full mt-1 p-2.5 pr-10 rounded-lg border border-gray-300 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label className="text-gray-800 text-sm font-semibold">Confirm Password</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="********"
                  className="w-full mt-1 p-2.5 pr-10 rounded-lg border border-gray-300 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-12 text-purple-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Buttonloading
                isLoading={isLoading}
                className="bg-purple-600 hover:bg-purple-700 w-full py-3 text-white"
              >
                Create Account
              </Buttonloading>
            </form>

            <p className="text-center text-gray-700 mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-purple-600 font-semibold hover:underline">
                Login
              </Link>
            </p>

          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Signup;
