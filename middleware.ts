// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: "admin" | "user";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔒 Protect only admin routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    // ❌ No token → login
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login?error=login_required", req.url)
      );
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      // ❌ ROLE CHECK (IMPORTANT)
      if (decoded.role !== "admin") {
        return NextResponse.redirect(
          new URL("/website?error=unauthorized", req.url)
        );
      }
    } catch (err) {
      return NextResponse.redirect(
        new URL("/auth/login?error=invalid_token", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
