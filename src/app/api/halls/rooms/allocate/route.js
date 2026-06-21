import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function POST(request) {
  try {
    const { student_id, room_id, staff_id, move_in } = await request.json();

    // Validate input
    if (!student_id || !room_id || !staff_id || !move_in) {
      return NextResponse.json(
        { message: "student_id, room_id, staff_id and move_in are required!" },
        { status: 400 }
      );
    }

    const db = connectDB();

    // Check if room exists & available
    const { rows: room } = await db.query(
      `SELECT status FROM rooms WHERE room_id = $1`,
      [room_id]
    );

    if (room.length === 0) {
      return NextResponse.json({ message: "Room not found!" }, { status: 404 });
    }

    if (room[0].status !== "available") {
      return NextResponse.json(
        { message: `Room is not available (Current: ${room[0].status})` },
        { status: 400 }
      );
    }

    // Check if student already has active allocation
    const { rows: exists } = await db.query(
      `SELECT allocation_id FROM allocations WHERE student_id = $1 AND status = 'active'`,
      [student_id]
    );

    if (exists.length > 0) {
      return NextResponse.json(
        { message: "Student already has an active room allocation!" },
        { status: 400 }
      );
    }

    // Insert allocation with move_in date
    await db.query(
      `INSERT INTO allocations (student_id, room_id, assigned_by_staff, assigned_at, move_in, status)
       VALUES ($1, $2, $3, NOW(), $4, 'active')`,
      [student_id, room_id, staff_id, move_in]
    );

    // Update room status to occupied
    await db.query(`UPDATE rooms SET status = 'occupied' WHERE room_id = $1`, [
      room_id,
    ]);

    return NextResponse.json(
      { message: "Room successfully allocated to student!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /halls/rooms/allocate ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
