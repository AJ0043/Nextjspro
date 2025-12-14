import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import jwt from "jsonwebtoken";
import { response, catchError } from "@/lib/helperFunction";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ success: false, message: "Email & OTP required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    if (user.otp !== otp || (user.otpExpiry || 0) < Date.now()) {
      return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    const response = NextResponse.json({ success: true, message: "OTP verified!", redirect: "/myaccount", token });
    response.cookies.set("token", token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 7 });

    return response;
  } catch (error: any) {
    return catchError(error);
  }
}
