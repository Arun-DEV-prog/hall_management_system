import { connectDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM halls");
    return Response.json({ data: rows });
  } catch (error) {
    console.error("GET /halls ERROR:", error); // 👈 See real error
    return Response.json({ error: error.message }, { status: 500 });
  }
}
