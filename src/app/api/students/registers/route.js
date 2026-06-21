import { connectDB } from "../../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { student_number, first_name, last_name, email, password, phone, department, intake_year, gender } =
      await req.json();

    if (!student_number || !first_name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const db = connectDB();

    // Check if email or student_number already exists
    const { rows: existing } = await db.query(
      "SELECT * FROM students WHERE email = $1 OR student_number = $2",
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
    await db.query(
      "INSERT INTO students (student_number, first_name, last_name, email, password, phone, department, intake_year, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        student_number,
        first_name,
        last_name || "",
        email,
        hashedPassword,
        phone || null,
        department || null,
        intake_year ? parseInt(intake_year, 10) : null,
        gender || null
      ]
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
