import { NextResponse } from "next/server";

function rewriteAdminPath(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = "/Dashboard";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/dashboard/admin" || pathname === "/dashboard/admin/") {
    const url = request.nextUrl.clone();
    url.pathname = "/Dashboard/admin";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/dashboard/admin/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace("/dashboard/admin", "/Dashboard/admin");
    return NextResponse.rewrite(url);
  }

  if (pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/Dashboard/admin";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export function middleware(request) {
  return rewriteAdminPath(request);
}

export const config = {
  matcher: ["/admin", "/admin/login", "/dashboard/:path*"],
};
