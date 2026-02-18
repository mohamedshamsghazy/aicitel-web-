import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production (0.1 = 10% of requests)
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',

    // Configure which environments to track
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',

    // Filter out sensitive data before sending
    beforeSend(event, hint) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
            return null;
        }

        // Remove sensitive data from context
        if (event.request) {
            // Remove authorization headers
            if (event.request.headers) {
                delete event.request.headers['authorization'];
                delete event.request.headers['cookie'];
            }

            // Remove query parameters that might contain tokens
            if (event.request.query_string) {
                const params = new URLSearchParams(event.request.query_string);
                params.delete('token');
                params.delete('key');
                params.delete('secret');
                event.request.query_string = params.toString();
            }
        }

        return event;
    },

    // Ignore certain errors
    ignoreErrors: [
        // Database connection errors (handled by retry logic)
        'ECONNREFUSED',
        'ETIMEDOUT',
        // Expected API errors
        'Not Found',
        '404',
    ],
});
