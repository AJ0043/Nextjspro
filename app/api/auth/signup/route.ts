import { NextRequest } from "next/server";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import { response, catchError } from "@/lib/helperFunction";
import { sendOTP } from "@/lib/sendMail";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { name, email, password, role, phone } = await req.json();

    if (!name || !email || !password || !role || !phone)
      return response(false, 400, "All fields are required");

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return response(false, 400, "Email already registered");

    // Create user in DB
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    // Generate OTP and send via email
    const otp = await sendOTP(email, name);

    // Save OTP in DB
    newUser.otp = otp;
    newUser.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await newUser.save();

    return response(true, 200, "Registration successful, OTP sent to email!");

  } catch (error: any) {
    return catchError(error);
  }
}
