"use client";

import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/students");
        const data = await res.json();
        if (res.ok) setStudents(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.student_number?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <input
          type="text"
          placeholder="Search by name, email or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-72"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading students…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          No students found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "#",
                    "Student No.",
                    "Full Name",
                    "Email",
                    "Department",
                    "Session",
                    "Phone",
                    "Registered At",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-gray-500 font-semibold whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s.student_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-400">#{s.student_id}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.student_number}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {s.first_name} {s.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.department || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.intake_year || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-gray-400 border-t">
            Showing {filtered.length} of {students.length} students
          </div>
        </div>
      )}
    </div>
  );
}
