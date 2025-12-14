import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/lib/databaseConnection";
import User from "@/models/User.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ success: false, message: "No token found" });
    }

    // FIXED FIELD NAME
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid token" });
    }

    user.isEmailVerified = true;
    user.verificationToken = null; // Now allowed because interface updated
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
