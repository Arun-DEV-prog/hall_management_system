import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import jwt from "jsonwebtoken";

// Submit a new complaint
export async function POST(request) {
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
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token. Please login again." },
        { status: 403 },
      );
    }

    const student_id = decoded.student_id;
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: "title and description are required!" },
        { status: 400 },
      );
    }

    const db = connectDB();

    // Get student's allocated room
    const roomResult = await db.query(
      `SELECT room_id FROM allocations WHERE student_id = $1 AND status = 'active'`,
      [student_id],
    );

    if (roomResult.rows.length === 0) {
      return NextResponse.json(
        { message: "You don't have an active room allocation." },
        { status: 400 },
      );
    }

    const room_id = roomResult.rows[0].room_id;

    await db.query(
      `INSERT INTO complaints (student_id, room_id, title, description) 
       VALUES ($1, $2, $3, $4)`,
      [student_id, room_id, title, description],
    );

    return NextResponse.json(
      { message: "Complaint submitted successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Server error. Please try again later.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
