import { NextRequest, NextResponse } from "next/server";
import { getContent, updateSection } from "@/lib/contentStore";

export async function GET() {
  return NextResponse.json(getContent());
}

export async function POST(request: NextRequest) {
  const { sectionId, fields } = await request.json();
  if (!sectionId) {
    return NextResponse.json({ error: "sectionId required" }, { status: 400 });
  }
  const section = updateSection(sectionId, fields);
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, section });
}
