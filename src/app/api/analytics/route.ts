import { NextRequest, NextResponse } from "next/server";
import { trackPageView, getAnalyticsSummary } from "@/lib/analytics";

// POST - Track a page view (called from client)
export async function POST(request: NextRequest) {
  const { path } = await request.json();
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });

  trackPageView({
    path,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || undefined,
    referer: request.headers.get("referer") || undefined,
  });

  return NextResponse.json({ ok: true });
}

// GET - Get analytics summary (admin only)
export async function GET() {
  return NextResponse.json(getAnalyticsSummary());
}
