// src/services/rateLimiter.ts

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const rateLimitCache = new Map<string, RateLimitRecord>();

const MAX_TOKENS = 100; // Maximum requests allowed per window
const REFILL_RATE = 10; // Tokens refilled per minute
const REFILL_INTERVAL_MS = 60 * 1000; // 1 minute in milliseconds

/**
 * Enterprise Token-Bucket Rate Limiter.
 * Ensures an IP or user ID cannot spam the API endpoints.
 * @param identifier The unique identifier (e.g., IP address).
 * @returns boolean True if the request is allowed, false if rate limited.
 */
export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(identifier);

  if (!record) {
    rateLimitCache.set(identifier, { tokens: MAX_TOKENS - 1, lastRefill: now });
    return true;
  }

  // Calculate tokens to refill based on elapsed time
  const timePassed = now - record.lastRefill;
  const refillAmount = Math.floor(timePassed / REFILL_INTERVAL_MS) * REFILL_RATE;

  if (refillAmount > 0) {
    record.tokens = Math.min(MAX_TOKENS, record.tokens + refillAmount);
    record.lastRefill = now;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    rateLimitCache.set(identifier, record);
    return true; // Allowed
  }

  return false; // Rate Limited (429 Too Many Requests)
}
