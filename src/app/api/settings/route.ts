import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/adminAuth";
import { getSettings, updateSettings } from "@/lib/settingsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const updates = await request.json();
  const settings = await updateSettings(updates);
  return NextResponse.json(settings);
}
