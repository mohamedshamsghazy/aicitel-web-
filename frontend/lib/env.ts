/**
 * Environment Configuration
 * 
 * This file centralizes all environment variable access and provides
 * safe fallbacks for development and production environments.
 */

// Backend API URL
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || '';

// CRM Configuration
export const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || '';
export const SALESFORCE_AUTH_URL = process.env.SALESFORCE_AUTH_URL || '';

// Redis/KV Configuration (optional)
export const KV_REST_API_URL = process.env.KV_REST_API_URL || '';
export const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN || '';

// Turnstile Configuration
export const NEXT_PUBLIC_TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';

// Environment validation
export function validateEnvironment() {
    const warnings: string[] = [];

    if (!STRAPI_URL) {
        warnings.push('NEXT_PUBLIC_STRAPI_URL is not set - backend features will be disabled');
    }

    if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
        warnings.push('Redis/KV not configured - using in-memory rate limiting');
    }

    if (!NEXT_PUBLIC_TURNSTILE_SITE_KEY || !TURNSTILE_SECRET_KEY) {
        warnings.push('Turnstile not configured - CAPTCHA protection disabled');
    }

    return warnings;
}

// Check if backend is available
export const isBackendAvailable = () => !!STRAPI_URL;

// Check if feature is enabled
export const isFeatureEnabled = (feature: 'crm' | 'redis' | 'turnstile') => {
    switch (feature) {
        case 'crm':
            return !!HUBSPOT_ACCESS_TOKEN || !!SALESFORCE_AUTH_URL;
        case 'redis':
            return !!KV_REST_API_URL && !!KV_REST_API_TOKEN;
        case 'turnstile':
            return !!NEXT_PUBLIC_TURNSTILE_SITE_KEY && !!TURNSTILE_SECRET_KEY;
        default:
            return false;
    }
};
