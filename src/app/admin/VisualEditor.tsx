"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface PageSection {
  id: string;
  page: string;
  label: string;
  fields: Record<string, string | string[] | boolean | number>;
}

// Map section IDs to their visual preview components
const sectionPreviews: Record<string, (fields: Record<string, string | boolean | number>) => React.ReactNode> = {
  hero: (f) => (
    <div className="relative h-48 overflow-hidden rounded-lg bg-stone-900">
      {f.image && (
        <Image src={String(f.fallbackImage || f.image)} alt="" fill className="object-cover opacity-60" sizes="400px" />
      )}
      <div className="absolute inset-0 flex items-center justify-center text-center p-4">
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-white/70 mb-1">{String(f.eyebrow)}</p>
          <h3 className="font-serif text-xl text-white leading-tight">{String(f.title)}</h3>
          <h3 className="font-serif text-xl text-white italic">{String(f.titleLine2)}</h3>
          <p className="text-[9px] text-white/60 mt-2 max-w-[200px] mx-auto">{String(f.subtitle).slice(0, 80)}...</p>
        </div>
      </div>
    </div>
  ),
  about: (f) => (
    <div className="flex gap-3 p-4 bg-white rounded-lg">
      <div className="w-24 h-32 relative rounded overflow-hidden flex-shrink-0">
        {f.mainImage && <Image src={String(f.mainImage)} alt="" fill className="object-cover" sizes="96px" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] tracking-widest uppercase text-green-mid">{String(f.eyebrow)}</p>
        <h4 className="font-serif text-sm text-stone-900">{String(f.title)}</h4>
        <h4 className="font-serif text-sm text-stone-900 italic">{String(f.titleLine2)}</h4>
        <p className="text-[9px] text-stone-500 mt-1 line-clamp-3">{String(f.paragraph1)}</p>
      </div>
    </div>
  ),
  seasonal: (f) => (
    <div className="relative h-36 overflow-hidden rounded-lg">
      {f.backgroundImage && (
        <Image src={String(f.backgroundImage)} alt="" fill className="object-cover" sizes="400px" />
      )}
      <div className="absolute inset-0 bg-green-dark/60 flex items-center justify-center text-center p-4">
        <div>
          <p className="text-[8px] tracking-widest uppercase text-gold">{String(f.season)}</p>
          <h4 className="font-serif text-lg text-white">{String(f.title)}</h4>
          <h4 className="font-serif text-lg text-white italic">{String(f.titleLine2)}</h4>
        </div>
      </div>
    </div>
  ),
  lambcam: (f) => (
    <div className="bg-green-dark rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-[9px] uppercase tracking-wider text-red-400">{f.enabled ? "Live" : "Offline"}</span>
      </div>
      <h4 className="font-serif text-base text-white">{String(f.title)}</h4>
      <p className="text-[9px] text-white/60 mt-1 line-clamp-2">{String(f.description)}</p>
    </div>
  ),
  "cottage-intro": (f) => (
    <div className="relative h-36 overflow-hidden rounded-lg">
      {f.heroImage && <Image src={String(f.heroImage)} alt="" fill className="object-cover" sizes="400px" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
        <h4 className="font-serif text-lg text-white">{String(f.title)}</h4>
      </div>
    </div>
  ),
  contact: (f) => (
    <div className="bg-white rounded-lg p-4">
      <h4 className="font-serif text-sm text-stone-900 mb-2">Contact Details</h4>
      <p className="text-[9px] text-stone-600">{String(f.phone)}</p>
      <p className="text-[9px] text-stone-600">{String(f.email)}</p>
      <p className="text-[9px] text-stone-600 whitespace-pre-line mt-1">{String(f.address)}</p>
    </div>
  ),
};

const fieldLabels: Record<string, string> = {
  image: "Hero Image",
  fallbackImage: "Fallback Image",
  eyebrow: "Eyebrow Text",
  title: "Title (Line 1)",
  titleLine2: "Title (Line 2, italic)",
  subtitle: "Subtitle",
  cta1Text: "Button 1 Text",
  cta1Link: "Button 1 Link",
  cta2Text: "Button 2 Text",
  cta2Link: "Button 2 Link",
  paragraph1: "Paragraph 1",
  paragraph2: "Paragraph 2",
  paragraph3: "Paragraph 3",
  mainImage: "Main Image",
  smallImage: "Small Overlay Image",
  ctaText: "Button Text",
  ctaLink: "Button Link",
  enabled: "Enabled",
  autoSeason: "Auto-detect Season",
  season: "Season Label",
  backgroundImage: "Background Image",
  showInMenu: "Show in Navigation",
  description: "Description",
  camera1Alias: "Camera 1 ID",
  camera1Label: "Camera 1 Name",
  camera2Alias: "Camera 2 ID",
  camera2Label: "Camera 2 Name",
  heroImage: "Hero Image",
  phone: "Phone Number",
  email: "Email Address",
  address: "Address",
};

export function VisualEditor({ token }: { token: string }) {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string | boolean | number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchSections = useCallback(async () => {
    const res = await fetch("/api/admin/content", { headers: authHeaders });
    if (res.ok) {
      const data = await res.json();
      setSections(data.sections || []);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const startEditing = (section: PageSection) => {
    setEditingId(section.id);
    setEditFields(section.fields as Record<string, string | boolean | number>);
    setSaved(false);
  };

  const saveSection = async () => {
    if (!editingId) return;
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ sectionId: editingId, fields: editFields }),
    });
    setSaving(false);
    setSaved(true);
    fetchSections();
    setTimeout(() => setSaved(false), 2000);
  };

  const pages = [...new Set(sections.map((s) => s.page))];

  return (
    <div className="space-y-8">
      {pages.map((page) => (
        <div key={page}>
          <h2 className="font-serif text-lg text-stone-900 mb-4 capitalize flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-dark" />
            {page === "home" ? "Homepage" : page.replace("-", " ")} Page
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sections
              .filter((s) => s.page === page)
              .map((section) => {
                const isEditing = editingId === section.id;
                const PreviewFn = sectionPreviews[section.id];

                return (
                  <div
                    key={section.id}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                      isEditing ? "border-green-dark lg:col-span-2" : "border-stone-200/60 hover:border-stone-300"
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() => isEditing ? setEditingId(null) : startEditing(section)}
                      className="w-full flex items-center justify-between p-4 hover:bg-stone-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-dark/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-sans text-sm font-semibold text-stone-900">{section.label}</h3>
                          <p className="font-sans text-xs text-stone-400">{Object.keys(section.fields).length} editable fields</p>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-stone-400 transition-transform ${isEditing ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>

                    {/* Preview (always visible) */}
                    {!isEditing && PreviewFn && (
                      <div className="px-4 pb-4">
                        {PreviewFn(section.fields as Record<string, string | boolean | number>)}
                      </div>
                    )}

                    {/* Editor */}
                    {isEditing && (
                      <div className="border-t border-stone-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
                          {/* Live preview */}
                          <div className="p-5 bg-stone-50/50">
                            <p className="font-sans text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Live Preview</p>
                            {PreviewFn && PreviewFn(editFields as Record<string, string | boolean | number>)}
                          </div>

                          {/* Fields */}
                          <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
                            <p className="font-sans text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Edit Content</p>
                            {Object.entries(editFields).map(([key, value]) => (
                              <div key={key}>
                                <label className="block font-sans text-xs font-medium text-stone-600 mb-1.5">
                                  {fieldLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}
                                </label>
                                {typeof value === "boolean" ? (
                                  <button
                                    onClick={() => setEditFields((f) => ({ ...f, [key]: !value }))}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-sans text-sm transition-colors ${
                                      value ? "bg-green-100 text-green-800" : "bg-stone-100 text-stone-500"
                                    }`}
                                  >
                                    <div className={`w-8 h-5 rounded-full transition-colors flex items-center ${value ? "bg-green-dark justify-end" : "bg-stone-300 justify-start"}`}>
                                      <div className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm" />
                                    </div>
                                    {value ? "On" : "Off"}
                                  </button>
                                ) : typeof value === "string" && (value.startsWith("/images") || value.startsWith("/uploads")) ? (
                                  <div className="flex items-center gap-3">
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                      <Image src={value} alt="" fill className="object-cover" sizes="56px" />
                                    </div>
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) => setEditFields((f) => ({ ...f, [key]: e.target.value }))}
                                      className="flex-1 px-3 py-2 border border-stone-200 rounded-lg font-sans text-sm focus:outline-none focus:border-green-mid"
                                    />
                                  </div>
                                ) : typeof value === "string" && value.length > 60 ? (
                                  <textarea
                                    value={value}
                                    onChange={(e) => setEditFields((f) => ({ ...f, [key]: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg font-sans text-sm focus:outline-none focus:border-green-mid resize-none"
                                  />
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
                                    className="w-full px-3 py-2 border border-stone-200 rounded-lg font-sans text-sm focus:outline-none focus:border-green-mid"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Save bar */}
                        <div className="flex items-center justify-between p-4 bg-stone-50 border-t border-stone-100">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-5 py-2.5 bg-stone-100 text-stone-600 rounded-lg font-sans text-sm hover:bg-stone-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <div className="flex items-center gap-3">
                            {saved && (
                              <span className="font-sans text-sm text-green-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Saved
                              </span>
                            )}
                            <button
                              onClick={saveSection}
                              disabled={saving}
                              className="px-6 py-2.5 bg-green-dark text-white rounded-lg font-sans text-sm font-medium hover:bg-green-mid transition-colors disabled:opacity-50"
                            >
                              {saving ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
