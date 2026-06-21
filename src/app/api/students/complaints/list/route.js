import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token. Please login again." },
        { status: 403 }
      );
    }

    const student_id = decoded.student_id;
    const db = connectDB();

    const { rows } = await db.query(
      `SELECT 
         c.complaint_id,
         c.title,
         c.description,
         c.status,
         c.raised_at,
         c.resolved_at,
         r.room_no,
         h.name AS hall_name
       FROM complaints c
       LEFT JOIN rooms r ON c.room_id = r.room_id
       LEFT JOIN halls h ON r.hall_id = h.hall_id
       WHERE c.student_id = $1
       ORDER BY c.raised_at DESC`,
      [student_id]
    );

    return NextResponse.json({ message: "Complaints fetched", data: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
