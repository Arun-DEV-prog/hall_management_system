import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function GET() {
  try {
    const db = connectDB();

    const sql = `
      SELECT 
        ha.application_id,
        ha.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        s.student_number,
        h.name AS hall_name,
        ha.preferred_room,
        ha.reason,
        ha.status,
        ha.applied_at
      FROM hall_applications ha
      JOIN students s ON ha.student_id = s.student_id
      JOIN halls h ON ha.hall_id = h.hall_id
      WHERE ha.status = 'pending'
      ORDER BY ha.applied_at DESC
    `;

    const { rows } = await db.query(sql);

    return NextResponse.json(
      { message: "Pending applications fetched", data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /halls/applications/pending ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
