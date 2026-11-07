interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const MAX_TRACKED_KEYS = 5000;

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string, now = Date.now()): RateLimitResult {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      for (const [storedKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(storedKey);
      }
      if (buckets.size >= MAX_TRACKED_KEYS) buckets.clear();
    }

    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    bucket.count += 1;
    return {
      allowed: bucket.count <= limit,
      retryAfterSeconds: bucket.count <= limit ? 0 : Math.ceil((bucket.resetAt - now) / 1000),
    };
  };
}

export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
