import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { LRUCache } from 'lru-cache';

type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

// Fallback LRU for development or if Redis is not configured
function createLocalLimiter(options: Options) {
    const tokenCache = new LRUCache({
        max: options.uniqueTokenPerInterval || 500,
        ttl: options.interval || 60000,
    });

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const tokenCount = (tokenCache.get(token) as number[]) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, [1]);
                } else {
                    tokenCount[0] += 1;
                    tokenCache.set(token, tokenCount);
                }
                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;
                return isRateLimited ? reject() : resolve();
            }),
    };
}

export default function rateLimit(options: Options) {
    const isRedisConfigured = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    if (isRedisConfigured) {
        try {
            const redis = new Redis({
                url: process.env.KV_REST_API_URL!,
                token: process.env.KV_REST_API_TOKEN!,
            });

            // Create a new Ratelimit instance
            // We use fixed window associated with the interval provided in options (default 60s)
            const duration = options.interval ? `${Math.floor(options.interval / 1000)} s` : "60 s";

            // We cannot dynamically create headers-based limiter easily with this pattern, 
            // so we return a check function that mimics the LRU interface but uses Redis.

            return {
                check: async (limit: number, token: string) => {
                    // Create a limiter on the fly or cache it? 
                    // Ideally, we should reuse the limiter instance, but the limit number varies per route.
                    // Upstash Ratelimit takes the limit in the constructor usually.
                    // Let's use a sliding window.

                    const ratelimit = new Ratelimit({
                        redis,
                        limiter: Ratelimit.slidingWindow(limit, duration as any),
                        analytics: true,
                    });

                    const { success } = await ratelimit.limit(token);

                    if (!success) {
                        throw new Error('Rate limit exceeded');
                    }
                }
            };
        } catch (error) {
            console.warn("Redis Rate Limit Failed, falling back to LRU:", error);
            return createLocalLimiter(options);
        }
    }

    // Default to Local LRU if no Redis
    if (process.env.NODE_ENV === 'production') {
        console.warn("⚠️ WARNING: Redis not configured. Using in-memory rate limiting (not safe for serverless).");
    }
    return createLocalLimiter(options);
}
