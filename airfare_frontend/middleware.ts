import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Cookies from "js-cookie";

export function middleware(request: NextRequest) {
  const accessToken =
    request.cookies.get("access_token")?.value || Cookies.get("access_token");
  const { pathname } = request.nextUrl;

  if (accessToken && pathname.startsWith("/admin/login")) {
    return NextResponse.redirect(
      new URL("/admin/dashboard/cities", request.url)
    );
  }

  if (!accessToken && pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
