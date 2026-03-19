/**
 * Database abstraction layer.
 * Uses Vercel KV (Redis) when available, falls back to filesystem for local dev.
 *
 * To enable Vercel KV:
 * 1. Go to Vercel dashboard > your project > Storage > Create KV Store
 * 2. It auto-creates KV_REST_API_URL and KV_REST_API_TOKEN env vars
 * 3. Redeploy - it just works
 */

import { kv } from "@vercel/kv";

const IS_KV_AVAILABLE =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

// Filesystem fallback for local dev
let fsModule: typeof import("fs") | null = null;
let pathModule: typeof import("path") | null = null;

async function getFs() {
  if (!fsModule) {
    fsModule = await import("fs");
    pathModule = await import("path");
  }
  return { fs: fsModule, path: pathModule! };
}

function filePath(key: string): string {
  // Convert key like "bookings" to "data/bookings.json"
  return `data/${key}.json`;
}

export async function dbGet<T>(key: string, fallback: T): Promise<T> {
  if (IS_KV_AVAILABLE) {
    try {
      const data = await kv.get<T>(key);
      return data ?? fallback;
    } catch {
      return fallback;
    }
  }

  // Filesystem fallback
  const { fs, path } = await getFs();
  const fp = path.join(process.cwd(), filePath(key));
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return fallback;
  }
}

export async function dbSet<T>(key: string, data: T): Promise<void> {
  if (IS_KV_AVAILABLE) {
    await kv.set(key, data);
    return;
  }

  // Filesystem fallback
  const { fs, path } = await getFs();
  const fp = path.join(process.cwd(), filePath(key));
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

export { IS_KV_AVAILABLE };
