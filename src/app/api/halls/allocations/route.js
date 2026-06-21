import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";

export async function GET() {
  try {
    const db = connectDB();

    const sql = `
      SELECT 
        a.allocation_id,
        a.student_id,
        CONCAT(s.first_name, ' ', s.last_name) AS student_name,
        s.student_number,
        r.room_no,
        r.capacity,
        r.rent,
        r.status AS room_status,
        h.name AS hall_name,
        b.name AS block_name,
        a.assigned_by_staff,
        st.name AS assigned_staff_name,
        a.assigned_at,
        a.move_in,
        a.move_out,
        a.status AS allocation_status
      FROM allocations a
      JOIN students s ON a.student_id = s.student_id
      JOIN rooms r ON a.room_id = r.room_id
      JOIN blocks b ON r.block_id = b.block_id
      JOIN halls h ON r.hall_id = h.hall_id
      LEFT JOIN staff st ON a.assigned_by_staff = st.staff_id
      ORDER BY a.assigned_at DESC
      LIMIT 1000
    `;

    const { rows } = await db.query(sql);

    return NextResponse.json({
      message: "Allocations fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("GET /halls/allocations ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
