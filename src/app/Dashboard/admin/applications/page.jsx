"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/halls/applications/pending");
      const data = await res.json();
      if (res.ok) setApps(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAction(application_id, status) {
    setActionLoading(application_id + status);
    setMessage("");
    try {
      const res = await fetch("/api/halls/applications/upadate-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id,
          status,
          staff_id: 1,
          remarks: "",
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      load();
    } catch (e) {
      setMessage("Server error.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Hall Applications
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Loading applications…</p>
      ) : apps.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          No pending applications found.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "ID",
                    "Student",
                    "Reg. No",
                    "Hall",
                    "Preferred Room",
                    "Reason",
                    "Applied At",
                    "Status",
                    "Actions",
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
                {apps.map((a) => (
                  <tr
                    key={a.application_id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-gray-400">
                      #{a.application_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {a.student_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.student_number}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.hall_name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {a.preferred_room || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                      {a.reason || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(a.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/Dashboard/admin/applications/${a.application_id}`}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleAction(a.application_id, "approved")
                          }
                          disabled={!!actionLoading}
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition disabled:opacity-40"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleAction(a.application_id, "rejected")
                          }
                          disabled={!!actionLoading}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-40"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
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
