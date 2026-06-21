import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Application ID is required!" },
        { status: 400 }
      );
    }

    const db = connectDB();

    const sql = `
      SELECT 
        ha.application_id,
        ha.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        s.student_number,
        s.email,
        s.phone,
        h.name AS hall_name,
        ha.preferred_room,
        ha.reason,
        ha.status,
        ha.applied_at,
        ha.reviewed_at,
        ha.remarks,
        st.name AS reviewed_by_name,
        st.role AS reviewed_by_role
      FROM hall_applications ha
      JOIN students s ON ha.student_id = s.student_id
      JOIN halls h ON ha.hall_id = h.hall_id
      LEFT JOIN staff st ON ha.reviewed_by_staff = st.staff_id
      WHERE ha.application_id = $1
    `;

    const { rows } = await db.query(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Application not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application fetched successfully", data: rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /halls/applications/[id] ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
