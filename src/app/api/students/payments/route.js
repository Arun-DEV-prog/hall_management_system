import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../../lib/db";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Invalid or expired token. Please login again." },
        { status: 403 },
      );
    }

    const student_id = decoded.student_id;
    const db = connectDB();

    const sql = `
      SELECT 
        p.payment_id,
        p.month,
        p.amount,
        p.due_date,
        p.paid_amount,
        p.status,
        p.payment_date,
        (p.amount - COALESCE(p.paid_amount, 0)) as pending_amount
      FROM payments p
      WHERE p.student_id = $1
      ORDER BY p.month DESC
    `;

    const result = await db.query(sql, [student_id]);

    // Calculate totals
    const totals = {
      total_due: 0,
      total_paid: 0,
      pending_months: 0,
      paid_months: 0,
    };

    result.rows.forEach((row) => {
      if (row.status === "paid") {
        totals.total_paid += parseFloat(row.paid_amount || 0);
        totals.paid_months += 1;
      } else {
        totals.total_due += parseFloat(row.pending_amount || 0);
        totals.pending_months += 1;
      }
    });

    return NextResponse.json(
      {
        message: "Payment history fetched",
        data: result.rows,
        summary: totals,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /students/payments ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
