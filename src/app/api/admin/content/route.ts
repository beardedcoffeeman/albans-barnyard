import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/adminAuth";
import { getContent, updateSection } from "@/lib/contentStore";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  return NextResponse.json(await getContent());
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const { sectionId, fields } = await request.json();
  if (!sectionId) return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  const section = await updateSection(sectionId, fields);
  if (!section) return NextResponse.json({ error: "Section not found" }, { status: 404 });
  return NextResponse.json({ success: true, section });
}
