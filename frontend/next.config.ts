import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone' as const, // Required for Docker
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    }
                ]
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http' as const,
                hostname: 'localhost',
            },
            {
                protocol: 'https' as const,
                hostname: '**',
            }
        ]
    }
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Upload source maps to Sentry for better error tracking
    // Only in production builds
    widenClientFileUpload: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
};

// Export with both next-intl and Sentry wrappers
export default withSentryConfig(withNextIntl(nextConfig), sentryWebpackPluginOptions);
