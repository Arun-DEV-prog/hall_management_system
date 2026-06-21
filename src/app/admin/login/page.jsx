"use client";

import { useState } from "react";
import { Mail, Lock, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your admin email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Wait a brief moment to show success animation before redirect
        setTimeout(() => {
          router.push("/Dashboard/admin");
        }, 800);
      } else {
        setError(data.message || "Invalid credentials!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-slate-900 via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10 transition-all duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 mb-4">
            <span className="text-2xl">🏛️</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Portal</h2>
          <p className="text-sm text-gray-400 mt-2">Log in to manage halls and applications</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
              Admin Email ID
            </label>
            <div className="relative flex items-center group">
              <Mail className="absolute left-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hall.com"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center group">
              <Lock className="absolute left-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Error notifications */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400 animate-shake">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success notifications */}
          {success && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm text-green-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Authentication successful! Redirecting...</span>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-medium shadow-lg shadow-blue-500/25 transition duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying Credentials...
              </span>
            ) : (
              "Log In as Admin"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-5">
          <p className="text-xs text-gray-500">
            For student access, go to the{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Student Login Page
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
