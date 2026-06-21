"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Home,
  LogOut,
  CreditCard,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/Dashboard/students", icon: LayoutDashboard },
  {
    label: "Apply for Hall",
    href: "/Dashboard/students/apply",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/Dashboard/students/payments",
    icon: CreditCard,
  },
  {
    label: "Complaints",
    href: "/Dashboard/students/complaint",
    icon: MessageSquare,
  },
];

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/students/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl flex flex-col z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-blue-900">📚</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">Student Portal</p>
              <p className="text-xs text-blue-200">Hall Booking</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-blue-200 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700/50 hover:text-white transition-all duration-200"
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-blue-700 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-700/50 hover:text-white transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/40 hover:text-red-200 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Mobile Only */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Student Portal</h1>
          <div className="w-8" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
