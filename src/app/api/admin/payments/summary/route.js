import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function GET(request) {
  try {
    const db = connectDB();

    const sql = `
      SELECT 
        s.student_id,
        s.first_name,
        s.last_name,
        s.student_number,
        r.room_no,
        h.name as hall_name,
        COALESCE(SUM(CASE WHEN p.status IN ('pending', 'overdue') THEN p.amount - COALESCE(p.paid_amount, 0) ELSE 0 END), 0) as total_due,
        COALESCE(SUM(CASE WHEN p.status = 'paid' THEN p.paid_amount ELSE 0 END), 0) as total_paid,
        COUNT(CASE WHEN p.status IN ('pending', 'overdue') THEN 1 END) as pending_months,
        COUNT(CASE WHEN p.status = 'paid' THEN 1 END) as paid_months
      FROM students s
      LEFT JOIN allocations a ON s.student_id = a.student_id AND a.status = 'active'
      LEFT JOIN rooms r ON a.room_id = r.room_id
      LEFT JOIN halls h ON r.hall_id = h.hall_id
      LEFT JOIN payments p ON s.student_id = p.student_id AND a.allocation_id = p.allocation_id
      GROUP BY s.student_id, s.first_name, s.last_name, s.student_number, r.room_no, h.name
      ORDER BY COALESCE(SUM(CASE WHEN p.status IN ('pending', 'overdue') THEN p.amount - COALESCE(p.paid_amount, 0) ELSE 0 END), 0) DESC
    `;

    const result = await db.query(sql);

    return NextResponse.json(
      { message: "Payment summary fetched", data: result.rows },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /admin/payments/summary ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
