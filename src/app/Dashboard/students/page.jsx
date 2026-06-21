"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  BookOpen,
  Home,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/students/profile", {
          credentials: "include",
        });
        const data = await res.json();
        setProfile(data.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  if (!profile)
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-semibold">Profile Not Found</p>
          <p className="text-red-600 text-sm">Please try logging in again.</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile.name}!
            </h1>
            <p className="text-blue-100">
              Student ID: {profile.student_number}
            </p>
          </div>
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
            👨‍🎓
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Personal Info */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Personal Information
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: BookOpen,
                label: "Department",
                value: profile.department || "N/A",
              },
              {
                icon: Calendar,
                label: "Session",
                value: profile.session || "N/A",
              },
              {
                icon: Phone,
                label: "Phone",
                value: profile.phone || "N/A",
              },
              {
                icon: Mail,
                label: "Email",
                value: profile.email || "N/A",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 pb-4 border-b border-gray-200"
                >
                  <Icon className="text-blue-600 w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-gray-600 text-sm">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/Dashboard/students/apply"
              className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition"
            >
              Apply for Hall
            </Link>
            <Link
              href="/Dashboard/students/complaint"
              className="block bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition"
            >
              File Complaint
            </Link>
          </div>
        </div>
      </div>

      {/* Room Allocation Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Home className="text-blue-600" size={28} />
          Room Allocation Status
        </h2>

        {profile.allocation ? (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <p className="text-lg font-semibold text-green-700">
                Room Allocated Successfully
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: "Hall Name",
                  value: profile.allocation.hall || "N/A",
                  icon: "🏛️",
                },
                {
                  label: "Block",
                  value: profile.allocation.block || "N/A",
                  icon: "🏗️",
                },
                {
                  label: "Room Number",
                  value: profile.allocation.room_no || "N/A",
                  icon: "🚪",
                },
                {
                  label: "Status",
                  value: profile.allocation.room_status || "N/A",
                  icon: "✓",
                },
                {
                  label: "Monthly Rent",
                  value: `${profile.allocation.rent || 0} ৳`,
                  icon: "💰",
                },
                {
                  label: "Move-In Date",
                  value: profile.allocation.move_in
                    ? new Date(profile.allocation.move_in).toLocaleDateString(
                        "en-BD",
                      )
                    : "N/A",
                  icon: "📅",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-gray-600 text-sm font-medium">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-500 w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-semibold text-yellow-800 mb-2">
                  No Room Allocated Yet
                </p>
                <p className="text-yellow-700 mb-4">
                  You haven't been assigned a room yet. Your application is
                  being reviewed by the hall authority.
                </p>
                <Link
                  href="/Dashboard/students/apply"
                  className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  Submit Application
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
