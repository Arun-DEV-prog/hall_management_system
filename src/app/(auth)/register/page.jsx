"use client";

import { useState } from "react";
import { Mail, Lock, User, IdCard, Phone, GraduationCap, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Registration() {
  const router = useRouter();
  const [form, setForm] = useState({
    student_number: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    intake_year: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (
      !form.student_number ||
      !form.first_name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.department ||
      !form.intake_year ||
      !form.gender
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/students/registers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_number: form.student_number,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          department: form.department,
          intake_year: form.intake_year,
          gender: form.gender,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl grid grid-cols-1 lg:grid-cols-12 w-full max-w-5xl overflow-hidden border border-gray-100">
        {/* Left Section - Registration Form */}
        <div className="lg:col-span-8 p-6 md:p-10">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Student Registration</h2>
            <p className="text-sm text-gray-500 mt-1">Provide your university credentials to request hall booking access</p>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 animate-pulse">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl p-3">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Student Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Student Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <IdCard className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="text"
                  name="student_number"
                  value={form.student_number}
                  onChange={handleChange}
                  placeholder="e.g. 21CSE020"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Email ID <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Mail className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. student@univ.edu"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <User className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Last Name
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <User className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <GraduationCap className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. CSE, EEE"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Intake Year / Session */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Intake Year / Session <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Calendar className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="number"
                  name="intake_year"
                  value={form.intake_year}
                  onChange={handleChange}
                  placeholder="e.g. 2021"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Phone className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +88017xxxxxxxx"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Users className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Lock className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition px-3 py-2.5">
                <Lock className="w-5 h-5 text-blue-500 shrink-0 mr-2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent outline-none text-sm text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200 active:scale-[0.98] disabled:opacity-50 text-sm shadow-lg shadow-blue-500/10"
          >
            {loading ? "Registering student account..." : "Register"}
          </button>
        </div>

        {/* Right Section - Instructions */}
        <div className="lg:col-span-4 bg-gray-50 p-6 md:p-10 border-l border-gray-100 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
          <ul className="space-y-4 text-xs md:text-sm text-gray-600">
            <li className="leading-relaxed">
              <strong>Email:</strong> Register using the university email ID allocated to you.
            </li>
            <li className="leading-relaxed">
              <strong>Intake & Dept:</strong> These are required to verify your eligibility and cohort mapping.
            </li>
            <li className="leading-relaxed">
              <strong>Gender:</strong> Mandatory field to ensure allocations are correctly mapped to gender-segregated halls.
            </li>
            <li className="leading-relaxed pt-4 border-t border-gray-200">
              Already registered?{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </li>
            <li className="leading-relaxed">
              Need assistance? Email{" "}
              <a href="mailto:studenthelp@gmail.com" className="text-blue-600 hover:underline font-semibold">
                studenthelp@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
