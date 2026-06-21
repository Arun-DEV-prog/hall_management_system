"use client";

import { useEffect, useState } from "react";

const STATUS_BADGE = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/complaints");
        const data = await res.json();
        if (res.ok) setComplaints(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Complaints</h1>

      {loading ? (
        <p className="text-gray-400">Loading complaints…</p>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          No complaints found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["#", "Student", "Hall", "Room", "Title", "Description", "Status", "Raised At", "Resolved At"].map((h) => (
                    <th key={h} className="px-4 py-3 text-gray-500 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaint_id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-400">#{c.complaint_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{c.student_name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.hall_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{c.room_no || "—"}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{c.description}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[c.status] || "bg-gray-100 text-gray-600"}`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(c.raised_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {c.resolved_at ? new Date(c.resolved_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
