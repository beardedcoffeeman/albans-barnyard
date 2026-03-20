/**
 * Database abstraction layer.
 * Uses Upstash Redis when REDIS_URL is available, falls back to filesystem for local dev.
 */

import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  // Also try REDIS_URL format (upstash:// protocol)
  const redisUrl = process.env.REDIS_URL;

  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }
  if (redisUrl && redisUrl.startsWith("rediss://")) {
    // Parse Upstash Redis URL
    try {
      const parsed = new URL(redisUrl);
      redis = new Redis({
        url: `https://${parsed.hostname}`,
        token: parsed.password,
      });
      return redis;
    } catch {
      return null;
    }
  }
  return null;
}

// Filesystem fallback for local dev
async function getFs() {
  const fs = await import("fs");
  const path = await import("path");
  return { fs, path };
}

export async function dbGet<T>(key: string, fallback: T): Promise<T> {
  const r = getRedis();
  if (r) {
    try {
      const data = await r.get<T>(key);
      return data ?? fallback;
    } catch {
      return fallback;
    }
  }

  // Filesystem fallback
  const { fs, path } = await getFs();
  const fp = path.join(process.cwd(), "data", `${key}.json`);
  if (!fs.existsSync(fp)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  } catch {
    return fallback;
  }
}

export async function dbSet<T>(key: string, data: T): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.set(key, data);
    return;
  }

  // Filesystem fallback
  const { fs, path } = await getFs();
  const fp = path.join(process.cwd(), "data", `${key}.json`);
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}
