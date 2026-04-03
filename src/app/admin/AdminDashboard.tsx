"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { VisualEditor } from "./VisualEditor";

interface PageSection {
  id: string;
  page: string;
  label: string;
  fields: Record<string, string | string[] | boolean | number>;
}

interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

interface MediaFile {
  name: string;
  url: string;
  size: number;
}

interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  thisWeekViews: number;
  thisMonthViews: number;
  topPages: { path: string; views: number }[];
  viewsByDay: { date: string; views: number }[];
  topReferers: { referer: string; count: number }[];
}

export function AdminDashboard({ token }: { token: string }) {
  const authHeaders = { Authorization: `Bearer ${token}` };
  const [tab, setTab] = useState<"pages" | "media" | "bookings" | "analytics">("pages");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [availability, setAvailability] = useState<{ date: string; pricePerNight?: number }[]>([]);
  const [availCalMonth, setAvailCalMonth] = useState(new Date());
  const [availPrice, setAvailPrice] = useState("150");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    const [contentRes, bkRes] = await Promise.all([
      fetch("/api/admin/content", { headers: authHeaders }),
      fetch("/api/bookings"),
    ]);
    const content = await contentRes.json();
    setSections(content.sections || []);
    setBookings(await bkRes.json());
  }, []);

  const fetchMedia = useCallback(async () => {
    // Scan uploads directory via a simple endpoint
    try {
      const res = await fetch("/api/admin/upload", { headers: authHeaders });
      if (res.ok) setMedia(await res.json());
    } catch {
      // no-op
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) setAnalytics(await res.json());
    } catch { /* no-op */ }
  }, []);

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability");
      if (res.ok) setAvailability(await res.json());
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    fetchData();
    fetchMedia();
    fetchAnalytics();
    fetchAvailability();
  }, [fetchData, fetchMedia, fetchAnalytics, fetchAvailability]);

  // Upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", body: formData, headers: authHeaders });
    }
    setUploading(false);
    fetchMedia();
    e.target.value = "";
  };

  const updateBooking = async (id: string, status: "approved" | "declined") => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const toggleAvailDate = async (dateStr: string) => {
    const isAvail = availability.some((d) => d.date === dateStr);
    if (isAvail) {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ dates: [dateStr], action: "remove" }),
      });
    } else {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ dates: [{ date: dateStr, pricePerNight: Number(availPrice) || 150 }] }),
      });
    }
    fetchAvailability();
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const tabs = [
    { id: "pages" as const, label: "Pages", icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
    { id: "media" as const, label: "Media", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" },
    { id: "bookings" as const, label: "Bookings", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
    { id: "analytics" as const, label: "Analytics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-dark flex items-center justify-center">
            <span className="text-white font-serif text-lg">A</span>
          </div>
          <div>
            <h1 className="font-serif text-xl text-stone-900">Albans Barnyard</h1>
            <p className="font-sans text-xs text-stone-400">Content Manager</p>
          </div>
        </div>
        <a href="/" target="_blank" className="px-4 py-2 rounded-lg border border-stone-200 font-sans text-xs text-stone-500 hover:border-green-dark hover:text-green-dark transition-colors">
          View Site &rarr;
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-stone-200/60 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-sans text-sm font-medium transition-all whitespace-nowrap ${
              tab === t.id ? "bg-green-dark text-white shadow-sm" : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
            </svg>
            <span className="hidden sm:inline">{t.label}</span>
            {t.id === "bookings" && pendingCount > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ===== PAGES (Visual Editor) ===== */}
      {tab === "pages" && <VisualEditor token={token} />}

      {/* ===== MEDIA ===== */}
      {tab === "media" && (
        <div>
          {/* Upload area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-stone-200 p-12 text-center cursor-pointer hover:border-green-dark transition-colors mb-6"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*,application/pdf,.pdf"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="font-sans text-sm text-stone-500 mb-1">
              {uploading ? "Uploading..." : "Click to upload images, videos, or PDFs"}
            </p>
            <p className="font-sans text-xs text-stone-400">JPG, PNG, WebP, MP4, MOV, PDF</p>
          </div>

          {/* Media grid */}
          {media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {media.map((file) => (
                <div key={file.name} className="group relative bg-white rounded-xl shadow-sm border border-stone-200/60 overflow-hidden">
                  <div className="relative aspect-square">
                    {file.name.match(/\.(mp4|mov)$/i) ? (
                      <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <Image src={file.url} alt={file.name} fill className="object-cover" sizes="200px" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-sans text-xs text-stone-600 truncate">{file.name}</p>
                    <p className="font-sans text-xs text-stone-400">{(file.size / 1024).toFixed(0)} KB</p>
                  </div>
                  {/* Copy path button */}
                  <button
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy path"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-16 text-center">
              <p className="font-sans text-sm text-stone-400">No uploaded media yet. Upload images and videos above.</p>
            </div>
          )}
        </div>
      )}

      {/* ===== ANALYTICS ===== */}
      {tab === "analytics" && analytics && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Today", value: analytics.todayViews },
              { label: "This Week", value: analytics.thisWeekViews },
              { label: "This Month", value: analytics.thisMonthViews },
              { label: "All Time", value: analytics.totalViews },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-5">
                <p className="font-sans text-xs text-stone-400 uppercase tracking-wider">{s.label}</p>
                <p className="font-serif text-3xl text-stone-900 mt-1">{s.value}</p>
                <p className="font-sans text-xs text-stone-400 mt-1">page views</p>
              </div>
            ))}
          </div>

          {/* Chart - simple bar chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <h3 className="font-sans text-sm font-semibold text-stone-900 mb-4">Views - Last 30 Days</h3>
            <div className="flex items-end gap-1 h-40">
              {analytics.viewsByDay.map((day) => {
                const maxViews = Math.max(...analytics.viewsByDay.map((d) => d.views), 1);
                const height = (day.views / maxViews) * 100;
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div className="absolute -top-6 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {day.date}: {day.views}
                    </div>
                    <div
                      className="w-full bg-green-dark/80 rounded-t hover:bg-green-dark transition-colors min-h-[2px]"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-sans text-xs text-stone-400">30 days ago</span>
              <span className="font-sans text-xs text-stone-400">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top pages */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
              <h3 className="font-sans text-sm font-semibold text-stone-900 mb-4">Top Pages</h3>
              {analytics.topPages.length === 0 ? (
                <p className="font-sans text-sm text-stone-400">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topPages.map((page) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <span className="font-sans text-sm text-stone-700 truncate">{page.path}</span>
                      <span className="font-sans text-sm font-medium text-stone-900 ml-4">{page.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top referrers */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
              <h3 className="font-sans text-sm font-semibold text-stone-900 mb-4">Top Referrers</h3>
              {analytics.topReferers.length === 0 ? (
                <p className="font-sans text-sm text-stone-400">No referrer data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topReferers.map((ref) => (
                    <div key={ref.referer} className="flex items-center justify-between">
                      <span className="font-sans text-sm text-stone-700 truncate">{ref.referer}</span>
                      <span className="font-sans text-sm font-medium text-stone-900 ml-4">{ref.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={fetchAnalytics}
            className="px-6 py-2.5 bg-stone-100 text-stone-600 rounded-xl font-sans text-sm hover:bg-stone-200 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}

      {/* ===== BOOKINGS ===== */}
      {tab === "bookings" && (
        <div className="space-y-6">
          {/* Availability Calendar */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-stone-900">Manage Availability</h3>
              <div className="flex items-center gap-3">
                <label className="font-sans text-xs text-stone-500">Price per night:</label>
                <div className="flex items-center gap-1">
                  <span className="font-sans text-sm text-stone-400">&pound;</span>
                  <input
                    type="number"
                    value={availPrice}
                    onChange={(e) => setAvailPrice(e.target.value)}
                    className="w-20 px-3 py-1.5 border border-stone-200 rounded-lg font-sans text-sm focus:outline-none focus:border-green-mid"
                  />
                </div>
              </div>
            </div>
            <p className="font-sans text-xs text-stone-400 mb-4">Click dates to toggle availability. Green dates are available for booking on the website.</p>

            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setAvailCalMonth(new Date(availCalMonth.getFullYear(), availCalMonth.getMonth() - 1, 1))}
                className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h4 className="font-serif text-base text-stone-900">
                {availCalMonth.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </h4>
              <button
                onClick={() => setAvailCalMonth(new Date(availCalMonth.getFullYear(), availCalMonth.getMonth() + 1, 1))}
                className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-xs font-sans text-stone-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({
                length: (new Date(availCalMonth.getFullYear(), availCalMonth.getMonth(), 1).getDay() + 6) % 7,
              }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square" />
              ))}
              {Array.from({
                length: new Date(availCalMonth.getFullYear(), availCalMonth.getMonth() + 1, 0).getDate(),
              }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${availCalMonth.getFullYear()}-${String(availCalMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isPast = dateStr < new Date().toISOString().split("T")[0];
                const availEntry = availability.find((d) => d.date === dateStr);
                const isAvail = !!availEntry;

                return (
                  <button
                    key={dateStr}
                    disabled={isPast}
                    onClick={() => toggleAvailDate(dateStr)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-sans transition-all ${
                      isPast
                        ? "text-stone-200 cursor-not-allowed"
                        : isAvail
                          ? "bg-green-dark text-white hover:bg-green-mid"
                          : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span>{day}</span>
                    {isAvail && !isPast && (
                      <span className="text-[9px] opacity-75">&pound;{availEntry?.pricePerNight || 150}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-sans text-stone-500">
                <span className="w-3 h-3 rounded bg-green-dark" />
                Available
              </div>
              <div className="flex items-center gap-2 text-xs font-sans text-stone-500">
                <span className="w-3 h-3 rounded bg-stone-50 border border-stone-200" />
                Unavailable
              </div>
              <span className="ml-auto text-xs font-sans text-stone-400">{availability.length} dates available</span>
            </div>
          </div>

          {/* Booking Requests */}
          <h3 className="font-serif text-lg text-stone-900">Booking Requests</h3>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-16 text-center">
              <p className="font-sans text-stone-400">No booking requests yet</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${booking.status === "pending" ? "border-amber-200" : "border-stone-200/60"}`}>
                {booking.status === "pending" && (
                  <div className="bg-amber-50 px-6 py-2">
                    <span className="font-sans text-xs font-medium text-amber-700">Awaiting your response</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                          <span className="font-serif text-lg text-stone-600">{booking.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-stone-900">{booking.name}</h3>
                          <p className="font-sans text-xs text-stone-400">{booking.email}{booking.phone && ` · ${booking.phone}`}</p>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-sans font-medium ${
                          booking.status === "pending" ? "bg-amber-100 text-amber-800"
                            : booking.status === "approved" ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>{booking.status}</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 rounded-xl p-4 mb-3">
                        {[
                          { l: "Check-in", v: new Date(booking.checkIn).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
                          { l: "Check-out", v: new Date(booking.checkOut).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) },
                          { l: "Guests", v: String(booking.guests) },
                          { l: "Nights", v: String(Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000)) },
                        ].map((d) => (
                          <div key={d.l}>
                            <span className="font-sans text-xs text-stone-400 block">{d.l}</span>
                            <span className="font-sans text-sm font-medium text-stone-800">{d.v}</span>
                          </div>
                        ))}
                      </div>
                      {booking.message && (
                        <p className="font-sans text-sm text-stone-600 italic bg-stone-50 rounded-xl p-4">&ldquo;{booking.message}&rdquo;</p>
                      )}
                    </div>
                    {booking.status === "pending" && (
                      <div className="flex gap-2 md:flex-col md:min-w-[120px]">
                        <button onClick={() => updateBooking(booking.id, "approved")} className="flex-1 px-5 py-3 bg-green-dark text-white rounded-xl font-sans text-sm font-medium hover:bg-green-mid transition-colors">Approve</button>
                        <button onClick={() => updateBooking(booking.id, "declined")} className="flex-1 px-5 py-3 bg-stone-100 text-stone-600 rounded-xl font-sans text-sm font-medium hover:bg-red-50 hover:text-red-700 transition-colors">Decline</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
