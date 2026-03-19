"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

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

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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
  const [tab, setTab] = useState<"chat" | "pages" | "media" | "bookings" | "analytics">("chat");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string | boolean | number>>({});
  const [uploading, setUploading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    fetchData();
    fetchMedia();
    fetchAnalytics();
  }, [fetchData, fetchMedia, fetchAnalytics]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Chat
  const sendMessage = async (overrideMsg?: string) => {
    const msg = overrideMsg || chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const apiMessages = [
        ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: msg },
      ];
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.error ? `Error: ${data.error}` : data.message },
      ]);
      fetchData();
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't connect. Please try again." },
      ]);
    }
    setChatLoading(false);
    inputRef.current?.focus();
  };

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

  // Save section edits
  const saveSection = async (id: string) => {
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ sectionId: id, fields: editFields }),
    });
    setEditingSection(null);
    fetchData();
  };

  const updateBooking = async (id: string, status: "approved" | "declined") => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const quickPrompts = [
    "Show me all pending bookings",
    "Make the whole of May available at £160/night",
    "Turn off the lambcam for the summer",
    "Change the seasonal banner to summer theme",
    "What are the current site settings?",
    "Show me all the editable sections",
  ];

  const tabs = [
    { id: "chat" as const, label: "Assistant", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
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
            <h1 className="font-serif text-xl text-stone-900">Alban&apos;s Barnyard</h1>
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

      {/* ===== CHAT ===== */}
      {tab === "chat" && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 220px)" }}>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-green-dark/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-stone-900 mb-2">Hi Simon! How can I help?</h3>
                <p className="font-sans text-sm text-stone-400 max-w-md mb-8">
                  I can manage your bookings, update the website content, change what&apos;s shown on each page, toggle the lambcam, and more. Just ask!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left px-4 py-3 rounded-xl border border-stone-200 font-sans text-sm text-stone-600 hover:border-green-dark hover:text-green-dark transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === "user" ? "bg-green-dark text-white rounded-br-md" : "bg-stone-100 text-stone-800 rounded-bl-md"
                }`}>
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-dark flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">A</span>
                      </div>
                      <span className="font-sans text-xs font-medium text-stone-500">Assistant</span>
                    </div>
                  )}
                  <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-stone-100 p-4">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-stone-50 rounded-xl text-stone-400 hover:text-green-dark hover:bg-stone-100 transition-colors"
                title="Upload image or video"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  await handleUpload(e);
                  sendMessage("I just uploaded some new files. They're now in the media library.");
                }}
              />
              <input
                ref={inputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Tell me what you'd like to change..."
                className="flex-1 px-5 py-3.5 bg-stone-50 rounded-xl font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-dark/20 focus:bg-white transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 py-3.5 bg-green-dark text-white rounded-xl hover:bg-green-mid transition-colors disabled:opacity-40"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== PAGES ===== */}
      {tab === "pages" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <h2 className="font-serif text-lg text-stone-900 mb-1">Editable Sections</h2>
            <p className="font-sans text-sm text-stone-400 mb-6">Click any section to edit its content. Changes update the website immediately.</p>
          </div>
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
              <button
                onClick={() => {
                  if (editingSection === section.id) {
                    setEditingSection(null);
                  } else {
                    setEditingSection(section.id);
                    setEditFields(section.fields as Record<string, string | boolean | number>);
                  }
                }}
                className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-sans text-sm font-semibold text-stone-900">{section.label}</h3>
                  <p className="font-sans text-xs text-stone-400 mt-0.5">
                    {section.page} &middot; {Object.keys(section.fields).length} fields
                  </p>
                </div>
                <svg className={`w-5 h-5 text-stone-400 transition-transform ${editingSection === section.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {editingSection === section.id && (
                <div className="border-t border-stone-100 p-5 space-y-4">
                  {Object.entries(editFields).map(([key, value]) => (
                    <div key={key}>
                      <label className="block font-sans text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      {typeof value === "boolean" ? (
                        <button
                          onClick={() => setEditFields((f) => ({ ...f, [key]: !value }))}
                          className={`px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors ${
                            value ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {value ? "Enabled" : "Disabled"}
                        </button>
                      ) : typeof value === "string" && value.length > 80 ? (
                        <textarea
                          value={value}
                          onChange={(e) => setEditFields((f) => ({ ...f, [key]: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-stone-200 rounded-xl font-sans text-sm focus:outline-none focus:border-green-mid resize-none"
                        />
                      ) : typeof value === "string" && (value.startsWith("/images") || value.startsWith("/uploads")) ? (
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image src={value} alt="" fill className="object-cover" sizes="64px" />
                          </div>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setEditFields((f) => ({ ...f, [key]: e.target.value }))}
                            className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl font-sans text-sm focus:outline-none focus:border-green-mid"
                          />
                        </div>
                      ) : (
                        <input
                          type={typeof value === "number" ? "number" : "text"}
                          value={String(value)}
                          onChange={(e) =>
                            setEditFields((f) => ({
                              ...f,
                              [key]: typeof value === "number" ? Number(e.target.value) : e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2.5 border border-stone-200 rounded-xl font-sans text-sm focus:outline-none focus:border-green-mid"
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => saveSection(section.id)}
                      className="px-6 py-2.5 bg-green-dark text-white rounded-xl font-sans text-sm font-medium hover:bg-green-mid transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="px-6 py-2.5 bg-stone-100 text-stone-600 rounded-xl font-sans text-sm font-medium hover:bg-stone-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <p className="font-sans text-sm text-stone-500 mb-1">
              {uploading ? "Uploading..." : "Click to upload images or videos"}
            </p>
            <p className="font-sans text-xs text-stone-400">JPG, PNG, WebP, MP4, MOV</p>
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
        <div className="space-y-4">
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
