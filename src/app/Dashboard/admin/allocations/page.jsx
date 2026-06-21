"use client";

import { useEffect, useState } from "react";

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/halls/allocations");
        const data = await res.json();
        if (res.ok) setAllocations(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const STATUS_BADGE = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-600",
    terminated: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Room Allocations
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading allocations…</p>
      ) : allocations.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          No allocations found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "#",
                    "Student",
                    "Reg. No",
                    "Hall",
                    "Block",
                    "Room",
                    "Rent",
                    "Move In",
                    "Status",
                    "Assigned By",
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
                {allocations.map((a) => (
                  <tr
                    key={a.allocation_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-400">
                      #{a.allocation_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {a.student_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.student_number}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.hall_name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.block_name}</td>
                    <td className="px-4 py-3 text-gray-600">{a.room_no}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.rent ?? "—"} ৳
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {a.move_in
                        ? new Date(a.move_in).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[a.allocation_status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {a.allocation_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.assigned_staff_name || "—"}
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
