"use client";

import { useState, useEffect, useCallback } from "react";

interface PageSection {
  id: string;
  page: string;
  label: string;
  fields: Record<string, string | string[] | boolean | number>;
}

const pageRoutes = [
  { id: "home", label: "Homepage", path: "/" },
  { id: "cox-cottage", label: "Cox Cottage", path: "/cox-cottage" },
  { id: "the-farm", label: "The Farm", path: "/the-farm" },
  { id: "farm-shop", label: "Farm Shop", path: "/farm-shop" },
  { id: "lambcam", label: "Lambcam", path: "/lambcam" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export function InlineEditor() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingField, setEditingField] = useState<{
    sectionId: string;
    field: string;
    value: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchSections = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSections(data.sections || []);
    }
  }, [token]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/content", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      setToken(password);
      sessionStorage.setItem("admin_token", password);
    }
  };

  const saveField = async () => {
    if (!editingField || !token) return;
    setSaving(true);
    const section = sections.find((s) => s.id === editingField.sectionId);
    if (section) {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sectionId: editingField.sectionId,
          fields: { [editingField.field]: editingField.value },
        }),
      });
    }
    setSaving(false);
    setSaved(true);
    setEditingField(null);
    fetchSections();
    setTimeout(() => setSaved(false), 2000);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-dark flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-serif text-xl">A</span>
            </div>
            <h1 className="font-serif text-xl text-stone-900">Page Editor</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-5 py-3 border border-stone-200 rounded-xl font-sans text-sm focus:outline-none focus:border-green-mid"
            autoFocus
          />
          <button className="w-full px-5 py-3 bg-green-dark text-white rounded-xl font-sans text-sm font-medium">
            Log In
          </button>
        </form>
      </div>
    );
  }

  const pageSections = sections.filter((s) => s.page === activePage);
  const activeRoute = pageRoutes.find((p) => p.id === activePage);

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/admin" className="font-sans text-xs text-stone-400 hover:text-green-dark transition-colors">
              &larr; Dashboard
            </a>
            <span className="text-stone-200">|</span>
            <h1 className="font-sans text-sm font-semibold text-stone-900">Page Editor</h1>
          </div>

          {/* Page selector */}
          <div className="flex gap-1 bg-stone-50 rounded-lg p-1">
            {pageRoutes.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-all ${
                  activePage === page.id
                    ? "bg-green-dark text-white"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="font-sans text-xs text-green-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            <a
              href={activeRoute?.path || "/"}
              target="_blank"
              className="px-3 py-1.5 bg-stone-100 rounded-lg font-sans text-xs text-stone-600 hover:bg-stone-200 transition-colors"
            >
              View Live Page
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-16 max-w-5xl mx-auto px-4">
        {pageSections.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-stone-400">No editable sections on this page yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pageSections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden"
              >
                {/* Section header */}
                <div className="px-6 py-4 bg-stone-50 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-dark" />
                    <h2 className="font-sans text-sm font-semibold text-stone-900">
                      {section.label}
                    </h2>
                  </div>
                </div>

                {/* Editable fields */}
                <div className="p-6 space-y-6">
                  {Object.entries(section.fields).map(([key, value]) => {
                    if (typeof value === "boolean" || typeof value === "number") {
                      return (
                        <div key={key} className="flex items-center justify-between py-2">
                          <span className="font-sans text-sm text-stone-500">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                          </span>
                          {typeof value === "boolean" ? (
                            <button
                              onClick={async () => {
                                await fetch("/api/admin/content", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    sectionId: section.id,
                                    fields: { [key]: !value },
                                  }),
                                });
                                fetchSections();
                              }}
                              className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-colors ${
                                value
                                  ? "bg-green-100 text-green-800"
                                  : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              {value ? "On" : "Off"}
                            </button>
                          ) : (
                            <span className="font-sans text-sm text-stone-700">{value}</span>
                          )}
                        </div>
                      );
                    }

                    const strValue = String(value);
                    const isImage = strValue.startsWith("/images") || strValue.startsWith("/uploads");
                    const isLink = key.toLowerCase().includes("link") || key.toLowerCase().includes("alias");
                    const isEditing =
                      editingField?.sectionId === section.id &&
                      editingField?.field === key;

                    return (
                      <div key={key} className="group">
                        <label className="block font-sans text-xs text-stone-400 mb-1.5">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                        </label>

                        {isImage ? (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-20 h-14 rounded-lg bg-cover bg-center border border-stone-200"
                              style={{ backgroundImage: `url(${strValue})` }}
                            />
                            <input
                              type="text"
                              value={
                                isEditing ? editingField.value : strValue
                              }
                              onChange={(e) =>
                                setEditingField({
                                  sectionId: section.id,
                                  field: key,
                                  value: e.target.value,
                                })
                              }
                              onFocus={() =>
                                !isEditing &&
                                setEditingField({
                                  sectionId: section.id,
                                  field: key,
                                  value: strValue,
                                })
                              }
                              onBlur={() => isEditing && saveField()}
                              className="flex-1 px-3 py-2 border border-transparent hover:border-stone-200 focus:border-green-mid rounded-lg font-sans text-sm text-stone-700 focus:outline-none transition-colors bg-transparent"
                            />
                          </div>
                        ) : isLink ? (
                          <input
                            type="text"
                            value={isEditing ? editingField.value : strValue}
                            onChange={(e) =>
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: e.target.value,
                              })
                            }
                            onFocus={() =>
                              !isEditing &&
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: strValue,
                              })
                            }
                            onBlur={() => isEditing && saveField()}
                            className="w-full px-3 py-2 border border-transparent hover:border-stone-200 focus:border-green-mid rounded-lg font-sans text-sm text-stone-500 font-mono focus:outline-none transition-colors bg-transparent"
                          />
                        ) : strValue.length > 80 ? (
                          <textarea
                            value={isEditing ? editingField.value : strValue}
                            onChange={(e) =>
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: e.target.value,
                              })
                            }
                            onFocus={() =>
                              !isEditing &&
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: strValue,
                              })
                            }
                            onBlur={() => isEditing && saveField()}
                            rows={3}
                            className="w-full px-3 py-2 border border-transparent hover:border-stone-200 focus:border-green-mid rounded-lg font-sans text-sm text-stone-700 focus:outline-none transition-colors resize-none bg-transparent leading-relaxed"
                          />
                        ) : (
                          <input
                            type="text"
                            value={isEditing ? editingField.value : strValue}
                            onChange={(e) =>
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: e.target.value,
                              })
                            }
                            onFocus={() =>
                              !isEditing &&
                              setEditingField({
                                sectionId: section.id,
                                field: key,
                                value: strValue,
                              })
                            }
                            onBlur={() => isEditing && saveField()}
                            className={`w-full px-3 py-2 border border-transparent hover:border-stone-200 focus:border-green-mid rounded-lg font-sans focus:outline-none transition-colors bg-transparent ${
                              key.includes("title") || key.includes("Title")
                                ? "text-xl font-serif text-stone-900"
                                : "text-sm text-stone-700"
                            }`}
                          />
                        )}

                        {isEditing && (
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={saveField}
                              disabled={saving}
                              className="px-3 py-1 bg-green-dark text-white rounded-md font-sans text-xs hover:bg-green-mid transition-colors"
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={() => setEditingField(null)}
                              className="px-3 py-1 bg-stone-100 text-stone-500 rounded-md font-sans text-xs hover:bg-stone-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
