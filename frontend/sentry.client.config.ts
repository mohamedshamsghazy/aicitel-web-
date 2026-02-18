import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps

    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Configure which environments to track
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',

    // Filter out sensitive data
    beforeSend(event, hint) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
            return null;
        }

        // Filter out low-value errors
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'message' in error) {
            const message = String(error.message);
            // Filter out common bot/scraper errors
            if (message.includes('ResizeObserver') ||
                message.includes('Non-Error promise rejection')) {
                return null;
            }
        }

        return event;
    },

    // Ignore certain errors
    ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        'chrome-extension://',
        'moz-extension://',
        // Network errors that are often user-related
        'NetworkError',
        'Network request failed',
        // Ignore canceled requests
        'AbortError',
    ],

    // Don't send sensitive request headers
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],
});
