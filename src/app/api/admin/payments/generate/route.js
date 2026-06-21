import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function POST(request) {
  try {
    const { allocation_id, student_id, months, monthly_amount, staff_id } =
      await request.json();

    if (
      !allocation_id ||
      !student_id ||
      !months ||
      !monthly_amount ||
      !staff_id
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const db = connectDB();

    // Create payment records for each month
    const today = new Date();
    let successCount = 0;

    for (let i = 0; i < months; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const dueDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        5,
      );

      try {
        await db.query(
          `INSERT INTO payments 
           (student_id, allocation_id, month, amount, due_date, status)
           VALUES ($1, $2, $3, $4, $5, 'pending')
           ON CONFLICT (student_id, allocation_id, month) DO NOTHING`,
          [
            student_id,
            allocation_id,
            monthDate.toISOString().split("T")[0],
            monthly_amount,
            dueDate.toISOString().split("T")[0],
          ],
        );
        successCount++;
      } catch (e) {
        console.error("Error creating payment record:", e);
      }
    }

    return NextResponse.json(
      { message: `${successCount} payment records created successfully!` },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /admin/payments/generate ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
