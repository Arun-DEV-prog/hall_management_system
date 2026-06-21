"use client";

import { useState, useEffect } from "react";
import { MessageSquare, AlertCircle, CheckCircle } from "lucide-react";

export default function StudentComplaints() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Load student complaints
  const loadComplaints = async () => {
    try {
      const res = await fetch("/api/students/complaints/list");
      const data = await res.json();
      setComplaints(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/students/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setMessageType("success");
        setTitle("");
        setDescription("");
        loadComplaints();
      } else {
        setMessage(data.message || "Failed to submit complaint");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit complaint");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Submit Complaint Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={28} />
          Submit a Complaint
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              messageType === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={20}
              />
            ) : (
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
            )}
            <p
              className={`text-sm ${
                messageType === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Complaint Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Water leakage in room, Broken furniture"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your complaint in detail..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      {/* Complaints List Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Complaints</h2>

        {loading ? (
          <p className="text-center text-gray-500 py-8">
            Loading complaints...
          </p>
        ) : complaints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p>No complaints filed yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Raised At
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      #{complaint.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {complaint.title}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          complaint.status,
                        )}`}
                      >
                        {complaint.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(complaint.raised_at).toLocaleDateString(
                        "en-BD",
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
