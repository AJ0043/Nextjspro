import { NextRequest } from "next/server";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import { response, catchError } from "@/lib/helperFunction";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { email, otp } = await req.json();

    if (!email || !otp)
      return response(false, 400, "Email & OTP required");

    const user = await User.findOne({ email });
    if (!user)
      return response(false, 404, "User not found");

    if (user.otp !== otp)
      return response(false, 400, "Invalid OTP");

    if (!user.otpExpiry || user.otpExpiry < Date.now())
      return response(false, 400, "OTP expired");

    // Mark user as verified
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return response(true, 200, "OTP verified successfully!", {
      redirect: "/auth/login",
    });

  } catch (error: any) {
    return catchError(error);
  }
}
