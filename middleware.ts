// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login?error=login_required", req.url)
      );
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.redirect(
        new URL("/auth/login?error=login_required", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
