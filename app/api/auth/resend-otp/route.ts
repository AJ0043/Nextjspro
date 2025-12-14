import { NextRequest } from "next/server";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import { response, catchError } from "@/lib/helperFunction";
import { sendOTP } from "@/lib/sendMail";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { email } = await req.json();

    if (!email) return response(false, 400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) return response(false, 404, "User not found");

    const otp = await sendOTP(email, user.name);
    const otpExpiry = Date.now() + 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    return response(true, 200, "OTP resent successfully");

  } catch (error: any) {
    return catchError(error);
  }
}
