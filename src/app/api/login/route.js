import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, captcha } = await request.json();

    // 1️⃣ Verify the reCAPTCHA token with Google
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // set this in .env
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaResponse = await fetch(verifyUrl, { method: "POST" });
    const captchaData = await captchaResponse.json();

    if (!captchaData.success) {
      return NextResponse.json(
        { message: "Captcha verification failed!" },
        { status: 400 }
      );
    }

    // 2️⃣ Validate email/password (replace with real DB check)
    if (email === "student@example.com" && password === "123456") {
      return NextResponse.json({ message: "Login successful!" });
    } else {
      return NextResponse.json(
        { message: "Invalid email or password!" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
