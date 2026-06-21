"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/halls/applications/${id}`);
        const data = await res.json();
        if (res.ok) setApp(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleAction(status) {
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/halls/applications/upadate-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: parseInt(id),
          status,
          staff_id: 1,
          remarks,
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      setApp((prev) => ({ ...prev, status }));
    } catch {
      setMessage("Server error.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-gray-400 mt-10">Loading…</p>;
  if (!app) return <p className="text-red-500 mt-10">Application not found.</p>;

  const STATUS_COLOR = {
    pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
    approved: "text-green-700 bg-green-50 border-green-200",
    rejected: "text-red-700 bg-red-50 border-red-200",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Application #{app.application_id}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_COLOR[app.status]}`}
          >
            {app.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Info label="Student Name" value={app.student_name} />
          <Info label="Student No." value={app.student_number} />
          <Info label="Email" value={app.email} />
          <Info label="Phone" value={app.phone || "—"} />
          <Info label="Hall" value={app.hall_name} />
          <Info label="Preferred Room" value={app.preferred_room || "—"} />
          <Info
            label="Applied At"
            value={new Date(app.applied_at).toLocaleString()}
          />
          {app.reviewed_at && (
            <Info
              label="Reviewed At"
              value={new Date(app.reviewed_at).toLocaleString()}
            />
          )}
          {app.reviewed_by_name && (
            <Info
              label="Reviewed By"
              value={`${app.reviewed_by_name} (${app.reviewed_by_role})`}
            />
          )}
        </div>

        {app.reason && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-semibold uppercase mb-1">
              Reason
            </p>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
              {app.reason}
            </p>
          </div>
        )}

        {app.status === "pending" && (
          <div className="border-t pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks (optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add a remark for the student…"
              className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-300 mb-4"
            />
            {message && <p className="mb-3 text-sm text-blue-600">{message}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => handleAction("approved")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => handleAction("rejected")}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        )}

        {message && app.status !== "pending" && (
          <p className="mt-4 text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-semibold uppercase">{label}</p>
      <p className="text-gray-800 text-sm mt-0.5">{value}</p>
    </div>
  );
}
