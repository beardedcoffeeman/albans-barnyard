"use client";

import { useState, useEffect } from "react";
import { AdminDashboard } from "./AdminDashboard";

export function AdminApp() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Test the password by hitting an admin endpoint
    const res = await fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      setToken(password);
      sessionStorage.setItem("admin_token", password);
    } else {
      setError("Incorrect password");
    }
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-green-dark flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-serif text-2xl">A</span>
            </div>
            <h1 className="font-serif text-2xl text-stone-900">Admin Login</h1>
            <p className="font-sans text-sm text-stone-400 mt-1">
              Alban&apos;s Barnyard
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-5 py-3.5 border border-stone-200 rounded-xl font-sans text-sm focus:outline-none focus:border-green-mid transition-colors"
              autoFocus
            />
            {error && (
              <p className="font-sans text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-5 py-3.5 bg-green-dark text-white rounded-xl font-sans text-sm font-medium hover:bg-green-mid transition-colors"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard token={token} />;
}
