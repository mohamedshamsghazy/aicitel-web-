import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock environment variables for tests
process.env.NEXT_PUBLIC_STRAPI_URL = 'http://localhost:1337';
process.env.STRAPI_API_TOKEN = 'test-token';
process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'test-site-key';
process.env.TURNSTILE_SECRET_KEY = 'test-secret-key';
process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:8079';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
