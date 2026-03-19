import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

// GET - list uploaded media
export async function GET() {
  if (!existsSync(UPLOADS_DIR)) return NextResponse.json([]);
  const files = readdirSync(UPLOADS_DIR)
    .filter((f) => /\.(jpg|jpeg|png|webp|mp4|mov|gif)$/i.test(f))
    .map((f) => {
      const stat = statSync(join(UPLOADS_DIR, f));
      return { name: f, url: `/uploads/${f}`, size: stat.size };
    })
    .sort((a, b) => b.name.localeCompare(a.name));
  return NextResponse.json(files);
}

// POST - upload file
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const filename = `${timestamp}-${safeName}`;
  const filepath = join(UPLOADS_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filepath, buffer);

  return NextResponse.json({
    success: true,
    url: `/uploads/${filename}`,
    name: filename,
    size: buffer.length,
  });
}
