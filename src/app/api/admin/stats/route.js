import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function GET(request) {
  try {
    // Auth Check
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized! Login required." },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const db = connectDB();

    // Query counts
    const { rows: studentsRes } = await db.query("SELECT COUNT(*)::int AS count FROM students");
    const { rows: pendingAppsRes } = await db.query("SELECT COUNT(*)::int AS count FROM hall_applications WHERE status = 'pending'");
    const { rows: activeAllocationsRes } = await db.query("SELECT COUNT(*)::int AS count FROM allocations WHERE status = 'active'");
    const { rows: openComplaintsRes } = await db.query("SELECT COUNT(*)::int AS count FROM complaints WHERE status = 'open'");

    const stats = {
      total_students: studentsRes[0]?.count || 0,
      pending_applications: pendingAppsRes[0]?.count || 0,
      active_allocations: activeAllocationsRes[0]?.count || 0,
      open_complaints: openComplaintsRes[0]?.count || 0,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/stats ERROR:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
