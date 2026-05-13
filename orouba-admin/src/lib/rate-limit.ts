/**
 * Simple in-memory rate limiter for API endpoints.
 * Limits requests per IP address within a sliding time window.
 * 
 * Note: This is per-process. In production with multiple instances,
 * consider using Redis-based rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

// Default configs for different endpoint types
export const RATE_LIMITS = {
  // Login: 5 attempts per 15 minutes
  login: { maxRequests: 5, windowSeconds: 15 * 60 } as RateLimitConfig,
  // Contact/Career forms: 3 submissions per 10 minutes
  form: { maxRequests: 3, windowSeconds: 10 * 60 } as RateLimitConfig,
  // File uploads: 10 uploads per 5 minutes
  upload: { maxRequests: 10, windowSeconds: 5 * 60 } as RateLimitConfig,
  // General API: 60 requests per minute
  api: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,
};

/**
 * Check if a request should be rate limited.
 * @param identifier - Unique identifier (usually IP + endpoint)
 * @param config - Rate limit configuration
 * @returns { limited: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired — start new window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    });
    return { limited: false, remaining: config.maxRequests - 1, resetIn: config.windowSeconds };
  }

  if (entry.count >= config.maxRequests) {
    // Rate limited
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { limited: true, remaining: 0, resetIn };
  }

  // Increment count
  entry.count++;
  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}
