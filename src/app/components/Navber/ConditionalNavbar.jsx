"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navber";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Hide navbar on dashboard pages
  if (
    pathname.startsWith("/Dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  ) {
    return null;
  }

  return <Navbar />;
}
