import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // if no token block

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized ! Login required" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token!" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/students/profile/:path*",
    "/api/halls/:path*",
    "/api/allocations/:path*",
  ],
};
