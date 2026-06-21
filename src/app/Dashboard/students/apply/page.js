"use client";

import { useState, useEffect } from "react";

export default function HallApplyPage() {
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [preferredRoom, setPreferredRoom] = useState("");
  const [reason, setReason] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch halls for dropdown
  useEffect(() => {
    async function fetchHalls() {
      try {
        const res = await fetch("/api/halls");
        const data = await res.json();
        if (res.ok) setHalls(data.data);
      } catch (err) {
        console.error("Error fetching halls:", err);
      }
    }
    fetchHalls();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!selectedHall || !cgpa || !address || !guardianName || !guardianPhone) {
      setError("Please fill in all required fields (Hall, CGPA, Address, and Guardian details)!");
      setLoading(false);
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 4.00) {
      setError("Invalid CGPA! Must be between 0.00 and 4.00.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/halls/apply", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hall_id: selectedHall,
          preferred_room: preferredRoom,
          reason,
          cgpa: parsedCgpa,
          address,
          guardian_name: guardianName,
          guardian_phone: guardianPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong!");
      } else {
        setMessage(data.message);
        setPreferredRoom("");
        setReason("");
        setSelectedHall("");
        setCgpa("");
        setAddress("");
        setGuardianName("");
        setGuardianPhone("");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-gray-100 font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Apply for Hall Seat</h1>
        <p className="text-sm text-gray-500 mt-1">Please provide accurate academic and personal details to submit your application</p>
      </div>

      {message && (
        <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hall Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Select Hall <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none cursor-pointer"
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
            >
              <option value="">-- Choose Hall --</option>
              {halls.map((hall) => (
                <option key={hall.hall_id} value={hall.hall_id}>
                  {hall.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Room */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Preferred Room (Optional)
            </label>
            <input
              type="text"
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="e.g., A-305"
              value={preferredRoom}
              onChange={(e) => setPreferredRoom(e.target.value)}
            />
          </div>

          {/* CGPA */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Current CGPA <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.00"
              max="4.00"
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="e.g., 3.85"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />
          </div>

          {/* Guardian Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Guardian's Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="Full Name"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
            />
          </div>

          {/* Guardian Phone */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Guardian's Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="e.g., +88017xxxxxxxx"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Permanent Address <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              rows="3"
              placeholder="Your home address (village, sub-district, district)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Reason / Justification
            </label>
            <textarea
              className="w-full border rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              rows="3"
              placeholder="State why you require hall allocation (e.g. distance, financial reasons)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200 active:scale-[0.98] disabled:opacity-50 text-sm shadow-lg shadow-blue-500/15"
        >
          {loading ? "Submitting application..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
