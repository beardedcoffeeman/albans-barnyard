/**
 * Database abstraction layer.
 * Uses Upstash Redis (REST) when KV_REST_API_URL is available,
 * standard Redis (ioredis) when REDIS_URL is available,
 * falls back to filesystem for local dev.
 */

import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

let upstashRedis: UpstashRedis | null = null;
let ioRedis: IORedis | null = null;

function getUpstashRedis(): UpstashRedis | null {
  if (upstashRedis) return upstashRedis;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    upstashRedis = new UpstashRedis({ url, token });
    return upstashRedis;
  }
  return null;
}

function getIORedis(): IORedis | null {
  if (ioRedis) return ioRedis;
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl && (redisUrl.startsWith("redis://") || redisUrl.startsWith("rediss://"))) {
    ioRedis = new IORedis(redisUrl, { lazyConnect: false, maxRetriesPerRequest: 1 });
    return ioRedis;
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
  // Try Upstash first
  const upstash = getUpstashRedis();
  if (upstash) {
    try {
      const data = await upstash.get<T>(key);
      return data ?? fallback;
    } catch {
      return fallback;
    }
  }

  // Try standard Redis
  const io = getIORedis();
  if (io) {
    try {
      const raw = await io.get(key);
      if (raw) return JSON.parse(raw) as T;
      return fallback;
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
  // Try Upstash first
  const upstash = getUpstashRedis();
  if (upstash) {
    await upstash.set(key, data);
    return;
  }

  // Try standard Redis
  const io = getIORedis();
  if (io) {
    await io.set(key, JSON.stringify(data));
    return;
  }

  // Filesystem fallback
  const { fs, path } = await getFs();
  const fp = path.join(process.cwd(), "data", `${key}.json`);
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}
