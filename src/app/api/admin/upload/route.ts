import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/adminAuth";
import { writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");
const IMAGES_DIR = join(process.cwd(), "public", "images");

// GET - list all media (uploads + existing site images)
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const allFiles: { name: string; url: string; size: number; category: string }[] = [];

  // Scan uploads
  if (existsSync(UPLOADS_DIR)) {
    readdirSync(UPLOADS_DIR)
      .filter((f) => /\.(jpg|jpeg|png|webp|mp4|mov|gif|pdf)$/i.test(f))
      .forEach((f) => {
        const stat = statSync(join(UPLOADS_DIR, f));
        allFiles.push({ name: f, url: `/uploads/${f}`, size: stat.size, category: "Uploads" });
      });
  }

  // Scan existing site images
  const scanDir = (dir: string, prefix: string, category: string) => {
    if (!existsSync(dir)) return;
    readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .forEach((f) => {
        try {
          const stat = statSync(join(dir, f));
          allFiles.push({ name: f, url: `${prefix}/${f}`, size: stat.size, category });
        } catch { /* skip */ }
      });
  };

  scanDir(join(IMAGES_DIR, "farm"), "/images/farm", "Farm");
  scanDir(join(IMAGES_DIR, "cottage"), "/images/cottage", "Cottage");
  scanDir(join(IMAGES_DIR, "products"), "/images/products", "Products");

  return NextResponse.json(allFiles);
}

// POST - upload file
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
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
