"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/images (2).png";
import { IoHome } from "react-icons/io5";
import { Menu, X } from "lucide-react"; // hamburger & close icons

export default function NavbarWithBlurBg() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[5px]"
        style={{ backgroundImage: "url('/BSMRSTU_View.jpg')" }}
      ></div>
      {/* Optional semi-transparent overlay to make text readable */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Navbar */}
      <nav className="relative z-10 bg-transparent p-7 shadow-md">
        {/* Top Section */}
        <div className="flex justify-between items-center">
          {/* Logo + Title */}
          <div className="flex gap-2 items-center">
            <Image
              src={logo}
              alt="University Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl md:text-2xl text-white text-shadow-md font-bold">
              Gopalganj Science and Technology University
            </h1>
          </div>

          {/* Right Title (desktop only) */}
          <h2 className="hidden md:block text-2xl text-white font-bold">
            Campus Hall Booking
          </h2>

          {/* Hamburger Button (mobile only) */}
          <button
            className="md:hidden text-white text-3xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex mt-6 justify-between">
          {/* Left Links */}
          <ul className="flex items-center text-white text-lg gap-7">
            <li>
              <Link href="/">
                <IoHome size={30} className="text-white" />
              </Link>
            </li>
            <li className="border-b">
              <Link href="/">Calendar</Link>
            </li>
            <li className="border-b">
              <Link href="/">Admin</Link>
            </li>
            <li className="border-b">
              <Link href="/">Hall Details</Link>
            </li>
            <li className="border-b">
              <Link href="/">About</Link>
            </li>
          </ul>

          {/* Right Links */}
          <ul className="flex gap-5 text-white text-lg font-bold ml-6">
            <li className="border-b">
              <Link href="/">Register</Link>
            </li>
            <li className="border-b">
              <Link href="/">Login</Link>
            </li>
          </ul>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-black/60 rounded-lg p-4">
            <ul className="flex flex-col gap-4 text-white text-lg">
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-2">
                    <IoHome size={24} /> Home
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Hall Details
                </Link>
              </li>
              <li>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </li>
              <li className="font-bold border-t pt-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
              <li className="font-bold">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
