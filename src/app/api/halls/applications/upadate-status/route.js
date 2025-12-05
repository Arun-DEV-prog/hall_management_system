import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function PATCH(request) {
  try {
    const { application_id, status, staff_id, remarks } = await request.json();

    // Validate request body
    if (!application_id || !status || !staff_id) {
      return NextResponse.json(
        { message: "application_id, status, and staff_id are required!" },
        { status: 400 }
      );
    }

    // Only valid statuses allowed
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status! Must be 'approved' or 'rejected'." },
        { status: 400 }
      );
    }

    const db = await connectDB();

    const sql = `
      UPDATE hall_applications 
      SET status = ?, 
          reviewed_by_staff = ?, 
          remarks = ?, 
          reviewed_at = NOW()
      WHERE application_id = ?
    `;

    const [result] = await db.execute(sql, [
      status,
      staff_id,
      remarks || null,
      application_id,
    ]);
    console.log("Update Route Hit");

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Application not found or nothing updated!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Application ${status} successfully!` },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /hall/applications/update-status ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
