import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(request) {
  try {
    // Auth Check
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const db = connectDB();

    // Query students
    const { rows } = await db.query(
      `SELECT student_id, student_number, first_name, last_name, email, department, intake_year, phone, created_at 
       FROM students 
       ORDER BY created_at DESC`
    );

    return NextResponse.json(
      { message: "Students fetched successfully", data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/students ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
