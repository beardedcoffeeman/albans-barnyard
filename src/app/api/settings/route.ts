import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/settingsStore";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function POST(request: NextRequest) {
  const updates = await request.json();
  const settings = updateSettings(updates);
  return NextResponse.json(settings);
}
