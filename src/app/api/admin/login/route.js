import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required!" },
        { status: 400 }
      );
    }

    const db = connectDB();

    // Query staff table
    const { rows } = await db.query(
      "SELECT * FROM staff WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Admin/Staff user not found!" },
        { status: 404 }
      );
    }

    const staff = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 }
      );
    }

    // Generate JWT token containing staff info
    const token = jwt.sign(
      { 
        staff_id: staff.staff_id, 
        email: staff.email, 
        name: staff.name,
        role: staff.role || "staff"
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    const response = NextResponse.json(
      { message: "Login successful!", token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/admin/login ERROR:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later.", error: error.message },
      { status: 500 }
    );
  }
}
