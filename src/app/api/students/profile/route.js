// file: src/app/api/students/profile/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token)
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 }
      );

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token. Please login again." },
        { status: 403 }
      );
    }

    const student_id = decoded.student_id;
    const db = connectDB();

    const sql = `
      SELECT 
        s.student_id,
        s.first_name,
        s.last_name,
        s.student_number,
        s.email,
        s.department,
        s.intake_year AS session,
        s.phone,
        a.allocation_id,
        a.move_in,
        a.status AS allocation_status,
        r.room_no,
        r.rent,
        r.status AS room_status,
        b.name AS block,
        h.name AS hall
      FROM students s
      LEFT JOIN allocations a ON s.student_id = a.student_id AND a.status='active'
      LEFT JOIN rooms r ON a.room_id = r.room_id
      LEFT JOIN blocks b ON r.block_id = b.block_id
      LEFT JOIN halls h ON r.hall_id = h.hall_id
      WHERE s.student_id = $1
    `;

    const { rows } = await db.query(sql, [student_id]);

    if (rows.length === 0)
      return NextResponse.json(
        { message: "Student not found!" },
        { status: 404 }
      );

    const row = rows[0];

    const profileData = {
      student_id: row.student_id,
      first_name: row.first_name,
      last_name: row.last_name,
      name: `${row.first_name} ${row.last_name}`,
      student_number: row.student_number,
      email: row.email,
      department: row.department,
      session: row.session,
      phone: row.phone,
      allocation: row.allocation_id
        ? {
            hall: row.hall,
            block: row.block,
            room_no: row.room_no,
            room_status: row.room_status,
            rent: row.rent,
            move_in: row.move_in,
          }
        : null,
    };

    return NextResponse.json({ message: "Profile fetched", data: profileData });
  } catch (error) {
    console.error("GET /students/profile ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
