import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function POST(request) {
  try {
    const { payment_id, paid_amount, staff_id, remarks } = await request.json();

    if (!payment_id || !paid_amount || !staff_id) {
      return NextResponse.json(
        { message: "payment_id, paid_amount, and staff_id are required!" },
        { status: 400 },
      );
    }

    const db = connectDB();

    // Get payment details
    const paymentResult = await db.query(
      `SELECT amount, paid_amount FROM payments WHERE payment_id = $1`,
      [payment_id],
    );

    if (paymentResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Payment record not found!" },
        { status: 404 },
      );
    }

    const payment = paymentResult.rows[0];
    const totalAmount = parseFloat(payment.amount);
    const alreadyPaid = parseFloat(payment.paid_amount || 0);
    const newPaidAmount = alreadyPaid + parseFloat(paid_amount);

    // Determine status
    let status = "pending";
    if (newPaidAmount >= totalAmount) {
      status = "paid";
    } else if (new Date() > new Date(payment.due_date)) {
      status = "overdue";
    }

    // Update payment
    await db.query(
      `UPDATE payments 
       SET paid_amount = $1, 
           status = $2, 
           payment_date = NOW(),
           paid_by_staff = $3,
           remarks = $4
       WHERE payment_id = $5`,
      [newPaidAmount, status, staff_id, remarks || null, payment_id],
    );

    return NextResponse.json(
      { message: "Payment recorded successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /admin/payments/record ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
