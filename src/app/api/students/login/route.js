import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(request) {
  try {
    const { email, password, captcha } = await request.json();

    // 1️⃣ Verify reCAPTCHA
    //const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    //const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    //const captchaResponse = await fetch(verifyUrl, { method: "POST" });
    //const captchaData = await captchaResponse.json();

    //if (!captchaData.success) {
    //  return NextResponse.json(
    //    { message: "Captcha verification failed!" },
    //    { status: 400 }
    //  );
    //}

    // 2️⃣ Connect to DB
    const db = connectDB();

    // 3️⃣ Check if student exists
    const { rows } = await db.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Student not found!" },
        { status: 404 }
      );
    }

    const student = rows[0];

    // 4️⃣ Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 }
      );
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      { student_id: student.student_id, email: student.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6️⃣ Return success response
    const response = NextResponse.json(
      { message: "Login successful!", token },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /students/login ERROR:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
