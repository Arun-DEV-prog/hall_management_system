"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images (2).png";
import { IoHome } from "react-icons/io5";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

export default function NavbarWithBlurBg() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[5px]"
        style={{ backgroundImage: "url('/BSMRSTU_View.jpg')" }}
      ></div>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent p-6 md:p-7">
        {/* Top Section */}
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo + Title */}
          <Link
            href="/"
            className="flex gap-3 items-center hover:opacity-90 transition"
          >
            <Image
              src={logo}
              alt="University Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-lg md:text-xl text-white font-bold leading-tight">
                GSTU Hall Booking
              </h1>
              <p className="text-xs md:text-sm text-blue-100">
                Campus Management
              </p>
            </div>
          </Link>

          {/* Hamburger Button (mobile only) */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Left Links */}
            <ul className="flex items-center text-white text-base gap-6">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-200 transition flex items-center gap-2"
                >
                  <IoHome size={20} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Admin
                </Link>
              </li>
            </ul>

            {/* Right Auth Links */}
            <ul className="flex gap-3 items-center">
              <li>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/70 rounded-lg p-5 backdrop-blur-sm">
            <ul className="flex flex-col gap-4 text-white text-base">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 hover:text-blue-200 transition"
                >
                  <IoHome size={20} /> Home
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="hover:text-blue-200 transition font-medium"
                >
                  Admin
                </Link>
              </li>
              <li className="border-t border-white/20 pt-4 mt-2">
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 hover:text-blue-200 transition"
                >
                  <UserPlus size={20} /> Register
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 hover:text-green-200 transition"
                >
                  <LogIn size={20} /> Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
