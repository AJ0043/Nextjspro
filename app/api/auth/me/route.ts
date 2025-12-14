import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connect from "@/lib/databaseConnection";
import User from "@/models/User.model";

export async function GET(req: NextRequest) {
  try {
    await connect();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
