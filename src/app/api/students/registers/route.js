import { connectDB } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { student_number, first_name, last_name, email, password } =
      await req.json();

    if (!student_number || !first_name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const db = await connectDB();

    // Check if email or student_number already exists
    const [existing] = await db.execute(
      "SELECT * FROM students WHERE email = ? OR student_number = ?",
      [email, student_number]
    );
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: "Student already exists" }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student
    await db.execute(
      "INSERT INTO students (student_number, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [student_number, first_name, last_name || "", email, hashedPassword]
    );

    return new Response(
      JSON.stringify({ message: "Registration successful" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /students/register ERROR:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
