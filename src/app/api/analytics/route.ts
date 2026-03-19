import { NextRequest, NextResponse } from "next/server";
import { trackPageView, getAnalyticsSummary } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  if (!path) return NextResponse.json({ error: "path required" }, { status: 400 });
  await trackPageView({
    path,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") || undefined,
    referer: request.headers.get("referer") || undefined,
  });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json(await getAnalyticsSummary());
}
