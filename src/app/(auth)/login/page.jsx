"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    // Basic validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/Dashboard/students");
      } else {
        setError(data.message || "Login failed!");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden">
        {/* Left Section - Login */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium">Email ID</label>
            <div className="flex items-center border rounded-md bg-gray-100 px-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email here"
                className="w-full bg-transparent p-2 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center border rounded-md bg-gray-100 px-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="***************"
                className="w-full bg-transparent p-2 outline-none"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Right Section - Instructions */}
        <div className="bg-gray-100 p-8">
          <h2 className="text-xl font-bold mb-4">Instructions :</h2>
          <ul className="space-y-4 text-sm text-gray-700">
            <li>
              • If you have already registered using your student email ID, you
              can login and book halls.
            </li>
            <li>
              • If you haven’t registered yet,{" "}
              <Link href="/register" className="text-blue-600 underline">
                click here
              </Link>{" "}
              to register through your student email ID to book halls.
            </li>
            <li>
              • If you are facing any problems in logging in or registering,
              please contact us at{" "}
              <a
                href="mailto:studenthelp@gmail.com"
                className="text-blue-600 underline"
              >
                studenthelp@gmail.com
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
