import { connectDB } from "../../../lib/db";

export async function GET() {
  try {
    const db = connectDB();
    const { rows } = await db.query("SELECT * FROM halls");
    return Response.json({ data: rows });
  } catch (error) {
    console.error("GET /halls ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
