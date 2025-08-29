"use client";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function Registration() {
  const [captcha, setCaptcha] = useState("qGphJD");

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl overflow-hidden">
        {/* Left Section - Registration Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Registration</h2>

          {/* Applicant Name */}
          <div className="mb-4">
            <label className="text-sm font-medium">Applicant name</label>
            <div className="flex items-center border rounded-md bg-gray-100 px-2">
              <User className="w-5 h-5 text-blue-500" />
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-transparent p-2 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium">Email ID</label>
            <div className="flex items-center border rounded-md bg-gray-100 px-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <input
                type="email"
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
                placeholder="***************"
                className="w-full bg-transparent p-2 outline-none"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="flex items-center border rounded-md bg-gray-100 px-2">
              <Lock className="w-5 h-5 text-blue-500" />
              <input
                type="password"
                placeholder="***************"
                className="w-full bg-transparent p-2 outline-none"
              />
            </div>
          </div>

          {/* Captcha */}
          <div className="mb-4 flex items-center">
            <img
              src="https://dummyimage.com/120x40/f0e68c/000000&text=qGphJD"
              alt="captcha"
              className="inline-block mr-2 rounded"
            />
            <button
              onClick={() => setCaptcha("newCap")}
              className="inline-block text-xl"
            >
              🔄
            </button>
          </div>

          {/* Captcha Input */}
          <div className="mb-4">
            <label className="text-sm font-medium">Enter the Captcha</label>
            <input
              type="text"
              placeholder="Enter the code above"
              className="w-full border rounded-md p-2 bg-gray-100 outline-none"
            />
          </div>

          {/* Register Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Register
          </button>
        </div>

        {/* Right Section - Instructions */}
        <div className="bg-gray-100  flex items-center p-8">
          <div className=" text-center">
            <h2 className="text-xl font-bold mb-4">Instructions :</h2>
            <ul className="space-y-4 text-sm text-gray-700">
              <li>
                • You need to register using your student email ID allocated to
                you in order to be able to book halls.
              </li>
              <li>
                • If you already have registered through your student email ID,
                then you need not register here. Please click here to{" "}
                <Link href="/login" className="text-blue-600 underline">
                  Login
                </Link>
                .
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
    </div>
  );
}
