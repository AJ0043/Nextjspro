import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  await connect();
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ success: false, message: "Token and password are required." }, { status: 400 });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: new Date() },
  }).select("+password");

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid or expired reset link." }, { status: 400 });
  }

  // Hash new password
  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();

  // Optional: Send confirmation email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Stech Web" <${process.env.NODEMAILER_EMAIL}>`,
    to: user.email,
    subject: "Your Stech Web Password Has Been Updated",
    html: `<h3>Password Updated Successfully</h3><p>Hello ${user.name}, your password has been updated.</p>`,
  });

  return NextResponse.json({ success: true, message: "Password reset successfully." }, { status: 200 });
}
