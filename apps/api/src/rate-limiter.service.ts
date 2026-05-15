import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger("RateLimiterService");
  
  // In-memory sliding window sliding window cache: key -> timestamp arrays
  private memoryCache = new Map<string, number[]>();
  
  // Rate limit configurations: limit is 60 requests per minute
  private readonly WINDOW_SIZE_MS = 60 * 1000;
  private readonly DEFAULT_LIMIT = 60;

  /**
   * Evaluates request rate and determines if rate limited.
   * Graced with fallback sliding window in memory if Redis URL is absent.
   * @param clientKey API key or IP address identifier.
   * @returns object containing limit, remaining, and reset epoch timestamp.
   */
  async checkRateLimit(clientKey: string, limit: number = this.DEFAULT_LIMIT) {
    const now = Date.now();
    
    // Check if memoryCache exists for this clientKey
    if (!this.memoryCache.has(clientKey)) {
      this.memoryCache.set(clientKey, []);
    }
    
    const requestTimes = this.memoryCache.get(clientKey)!;
    
    // Filter out timestamps outside the sliding window size
    const cutoffTime = now - this.WINDOW_SIZE_MS;
    const activeRequests = requestTimes.filter(t => t > cutoffTime);
    
    const count = activeRequests.length;
    const isRateLimited = count >= limit;
    
    if (!isRateLimited) {
      activeRequests.push(now);
      this.memoryCache.set(clientKey, activeRequests);
    } else {
      this.logger.warn(`Client key ${clientKey} exceeded rate limits: ${count}/${limit} req/min`);
    }

    const remaining = Math.max(0, limit - activeRequests.length);
    const resetTime = now + this.WINDOW_SIZE_MS;

    return {
      allowed: !isRateLimited,
      limit,
      remaining,
      resetTime,
    };
  }
}
