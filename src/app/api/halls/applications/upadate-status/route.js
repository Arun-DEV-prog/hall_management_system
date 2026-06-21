import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function PATCH(request) {
  try {
    const { application_id, status, staff_id, remarks } = await request.json();

    if (!application_id || !status || !staff_id) {
      return NextResponse.json(
        { message: "application_id, status, and staff_id are required!" },
        { status: 400 },
      );
    }

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status! Must be 'approved' or 'rejected'." },
        { status: 400 },
      );
    }

    const db = connectDB();

    // Get application details
    const appResult = await db.query(
      `SELECT student_id, hall_id, preferred_room FROM hall_applications WHERE application_id = $1`,
      [application_id],
    );

    if (appResult.rows.length === 0) {
      return NextResponse.json(
        { message: "Application not found!" },
        { status: 404 },
      );
    }

    const { student_id, hall_id, preferred_room } = appResult.rows[0];

    // If approving, create allocation and assign room
    if (status === "approved") {
      // Try to get the preferred room first, then any available room
      let roomResult;
      if (preferred_room) {
        roomResult = await db.query(
          `SELECT room_id FROM rooms 
           WHERE hall_id = $1 AND room_no = $2 AND status = 'available'
           LIMIT 1`,
          [hall_id, preferred_room],
        );
      }

      // If preferred room not available, get any available room
      if (!roomResult || roomResult.rows.length === 0) {
        roomResult = await db.query(
          `SELECT room_id FROM rooms 
           WHERE hall_id = $1 AND status = 'available'
           LIMIT 1`,
          [hall_id],
        );
      }

      if (roomResult.rows.length === 0) {
        return NextResponse.json(
          { message: "No available rooms in this hall!" },
          { status: 400 },
        );
      }

      const room_id = roomResult.rows[0].room_id;

      // Create allocation record
      await db.query(
        `INSERT INTO allocations (student_id, room_id, assigned_by_staff, status)
         VALUES ($1, $2, $3, 'active')`,
        [student_id, room_id, staff_id],
      );

      // Update room status to occupied
      await db.query(
        `UPDATE rooms SET status = 'occupied' WHERE room_id = $1`,
        [room_id],
      );
    }

    // Update application status
    const sql = `
      UPDATE hall_applications 
      SET status = $1, 
          reviewed_by_staff = $2, 
          remarks = $3, 
          reviewed_at = NOW()
      WHERE application_id = $4
    `;

    const result = await db.query(sql, [
      status,
      staff_id,
      remarks || null,
      application_id,
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Application not found or nothing updated!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: `Application ${status} successfully!` },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /hall/applications/update-status ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 },
    );
  }
}
