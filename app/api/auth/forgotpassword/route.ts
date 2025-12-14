import { NextResponse } from "next/server";
import dbConnect from "@/lib/databaseConnection";
import User from "@/models/User.model";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", color: "red" },
        { status: 404 }
      );
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token & expiry as Date OBJECT ✔️
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    // Gmail SMTP - Port 587 (BEST) ✔️
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS STARTS → perfect for Gmail
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // ✨ HTML Email Template
    const htmlTemplate = `
      <div style="font-family: Arial; background:#f4f4f7; padding:40px; text-align:center;">
        <div style="max-width:500px; margin:auto; background:white; padding:35px; border-radius:12px;">
          <h2 style="color:#4c1d95;">Stech Web – Password Reset</h2>
          <p>Hello <strong>${user.name}</strong>,<br><br>
          Click the button below to reset your password.</p>

          <a href="${resetUrl}"
            style="background:#4c1d95; color:white; padding:12px 24px; display:inline-block;
            text-decoration:none; border-radius:8px; margin-top:15px;">
            Reset Password
          </a>

          <p style="margin-top:25px; color:#777;">This link is valid for <strong>15 minutes</strong>.</p>

          <hr style="margin:25px 0; border-top:1px solid #eee;"/>

          <p style="font-size:12px; color:#aaa;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Stech Web" <${process.env.NODEMAILER_EMAIL}>`,
      to: user.email,
      subject: "Reset Your Password – Stech Web",
      html: htmlTemplate,
    });

    return NextResponse.json(
      { success: true, message: "Reset link sent to email", color: "green" },
      { status: 200 }
    );
  } catch (error) {
    console.log("NodeMailer Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong", color: "red" },
      { status: 500 }
    );
  }
}
