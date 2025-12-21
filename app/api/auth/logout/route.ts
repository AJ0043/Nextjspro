// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ✅ Clear cookies (agar authentication cookie use ho rahi hai)
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Example: clear cookie named "token" or session
    response.cookies.set("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0), // expire immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
