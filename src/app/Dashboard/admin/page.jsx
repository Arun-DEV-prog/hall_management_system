"use client";

import { useEffect, useState } from "react";
import { Users, ClipboardList, BedDouble, MessageSquareWarning } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {value ?? <span className="text-gray-300 text-base">Loading…</span>}
      </p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={stats?.total_students} color="bg-blue-500" />
        <StatCard icon={ClipboardList} label="Pending Applications" value={stats?.pending_applications} color="bg-yellow-500" />
        <StatCard icon={BedDouble} label="Active Allocations" value={stats?.active_allocations} color="bg-green-500" />
        <StatCard icon={MessageSquareWarning} label="Open Complaints" value={stats?.open_complaints} color="bg-red-500" />
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Pending Applications</h2>
        <RecentApplications />
      </div>
    </div>
  );
}

function RecentApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/halls/applications/pending");
        const data = await res.json();
        if (res.ok) setApps(data.data.slice(0, 5));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;
  if (!apps.length) return <p className="text-gray-400 text-sm">No pending applications.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2 pr-4">Student</th>
            <th className="pb-2 pr-4">Student No.</th>
            <th className="pb-2 pr-4">Hall</th>
            <th className="pb-2">Applied At</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a.application_id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="py-2 pr-4 font-medium text-gray-800">{a.student_name}</td>
              <td className="py-2 pr-4 text-gray-600">{a.student_number}</td>
              <td className="py-2 pr-4 text-gray-600">{a.hall_name}</td>
              <td className="py-2 text-gray-500">{new Date(a.applied_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
