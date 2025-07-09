import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function authMiddleware(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value || localStorage.getItem("token");

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard");

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
