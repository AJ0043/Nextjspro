// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email or password missing" },
        { status: 400 }
      );
    }

    // Find user with password + role
    const user = await User.findOne({ email }).select("+password +role");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT
   const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

    // Set cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    // Admin role check
    if (user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You are not authorized to access admin" },
        { status: 403 }
      );
    }

    // Send response with cookie and redirect info
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      redirect: "/auth/admin",
    });

    res.headers.set("Set-Cookie", cookie);

    return res;
  } catch (err: any) {
    console.error("Login Error:", err.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
