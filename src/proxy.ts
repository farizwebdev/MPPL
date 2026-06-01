import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminPaths = ["/admin/dashboard", "/admin/transaksi", "/admin/laporan"];
const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout", "/api/auth/check"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = adminPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isPublicPath = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!isAdminPath || isPublicPath) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session");

  if (!session?.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|file\\.svg|globe\\.svg|next\\.svg|vercel\\.svg|window\\.svg|foto_hero\\.png).*)",
  ],
};
