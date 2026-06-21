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

    // Query complaints
    const sql = `
      SELECT 
        c.complaint_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        h.name AS hall_name,
        r.room_no,
        c.title,
        c.description,
        c.status,
        c.raised_at,
        c.resolved_at
      FROM complaints c
      JOIN students s ON c.student_id = s.student_id
      LEFT JOIN rooms r ON c.room_id = r.room_id
      LEFT JOIN halls h ON r.hall_id = h.hall_id
      ORDER BY c.raised_at DESC
    `;

    const { rows } = await db.query(sql);

    return NextResponse.json(
      { message: "Complaints fetched successfully", data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/admin/complaints ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
