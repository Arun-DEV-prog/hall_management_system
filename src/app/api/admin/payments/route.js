import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function GET(request) {
  try {
    const db = connectDB();

    const sql = `
      SELECT 
        p.payment_id,
        p.student_id,
        s.first_name,
        s.last_name,
        s.student_number,
        p.month,
        p.amount,
        p.due_date,
        p.paid_amount,
        p.status,
        p.payment_date,
        r.room_no,
        h.name as hall_name
      FROM payments p
      JOIN students s ON p.student_id = s.student_id
      JOIN allocations a ON p.allocation_id = a.allocation_id
      JOIN rooms r ON a.room_id = r.room_id
      JOIN halls h ON r.hall_id = h.hall_id
      ORDER BY p.month DESC, s.student_number ASC
    `;

    const result = await db.query(sql);

    return NextResponse.json(
      { message: "Payments fetched successfully", data: result.rows },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /admin/payments ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
