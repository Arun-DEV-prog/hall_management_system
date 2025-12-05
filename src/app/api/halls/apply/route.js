import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const { student_id, hall_id, preferred_room, reason } =
      await request.json();

    // Basic validation
    if (!student_id || !hall_id) {
      return NextResponse.json(
        { message: "student_id and hall_id are required!" },
        { status: 400 }
      );
    }

    // DB connection
    const db = await connectDB();

    // Check if student has pending application
    const [existing] = await db.execute(
      `SELECT application_id FROM hall_applications 
       WHERE student_id=? AND status='pending'`,
      [student_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You already have a pending application!" },
        { status: 409 }
      );
    }

    // Insert new application
    await db.execute(
      `INSERT INTO hall_applications 
      (student_id, hall_id, preferred_room, reason)
      VALUES (?,?,?,?)`,
      [student_id, hall_id, preferred_room ?? null, reason ?? null]
    );

    return NextResponse.json(
      { message: "Application submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
