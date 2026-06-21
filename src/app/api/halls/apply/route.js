import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token. Please login again." },
        { status: 403 }
      );
    }

    const student_id = decoded.student_id; // ✅ get student_id from JWT
    const { hall_id, preferred_room, reason, cgpa, address, guardian_name, guardian_phone } = await request.json();

    if (!hall_id || !cgpa || !address || !guardian_name || !guardian_phone) {
      return NextResponse.json(
        { message: "Missing required fields! Hall, CGPA, Address, and Guardian details are required." },
        { status: 400 }
      );
    }

    // Parse hall_id to integer — HTML selects always send strings
    const hallIdInt = parseInt(hall_id, 10);
    if (isNaN(hallIdInt)) {
      return NextResponse.json(
        { message: "Invalid hall_id!" },
        { status: 400 }
      );
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 4.0) {
      return NextResponse.json(
        { message: "Invalid CGPA! Must be between 0.00 and 4.00." },
        { status: 400 }
      );
    }

    const db = connectDB();

    // Check for existing pending application
    const { rows: existing } = await db.query(
      `SELECT application_id FROM hall_applications 
       WHERE student_id=$1 AND status='pending'`,
      [student_id]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You already have a pending application!" },
        { status: 409 }
      );
    }

    // Coerce empty strings to null for optional fields
    const safePreferredRoom = preferred_room?.trim() || null;
    const safeReason = reason?.trim() || null;

    // Insert new application
    await db.query(
      `INSERT INTO hall_applications 
       (student_id, hall_id, preferred_room, reason, cgpa, address, guardian_name, guardian_phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        student_id,
        hallIdInt,
        safePreferredRoom,
        safeReason,
        parsedCgpa,
        address.trim(),
        guardian_name.trim(),
        guardian_phone.trim()
      ]
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
