# Performance Audit & Optimization Guide

## Overview

This guide covers performance testing, optimization strategies, and monitoring for the Aicitel web application to ensure excellent user experience and Core Web Vitals scores.

---

## Performance Goals

### Target Metrics

| Metric | Target | Good | Needs Improvement |
|--------|--------|------|-------------------|
| **Lighthouse Score** | >90 | >90 | <90 |
| **First Contentful Paint (FCP)** | <1.5s | <1.8s | >3.0s |
| **Largest Contentful Paint (LCP)** | <2.5s | <2.5s | >4.0s |
| **Time to Interactive (TTI)** | <3.5s | <3.8s | >7.3s |
| **Total Blocking Time (TBT)** | <200ms | <300ms | >600ms |
| **Cumulative Layout Shift (CLS)** | <0.1 | <0.1 | >0.25 |
| **Speed Index** | <3.0s | <3.4s | >5.8s |

### Bundle Size Targets

| Bundle | Target | Warning | Critical |
|--------|--------|---------|----------|
| First Load JS | <200KB | >250KB | >300KB |
| Total Page Weight | <1MB | >1.5MB | >2MB |

---

## Running Performance Audits

### 1. Lighthouse (Chrome DevTools)

**Built-in browser tool for comprehensive audits:**

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select categories:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
4. Device: Desktop and Mobile
5. Click "Analyze page load"

**Command Line (CI/CD):**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://aicitel.com --output=html --output-path=./lighthouse-report.html

# Run with specific config
lighthouse https://aicitel.com \
  --only-categories=performance \
  --chrome-flags="--headless" \
  --output=json \
  --output-path=./report.json
```

### 2. WebPageTest

**Detailed performance testing from multiple locations:**

1. Go to https://www.webpagetest.org
2. Enter URL: `https://aicitel.com`
3. Select test location (e.g., Germany)
4. Select browser (Chrome)
5. Run test

**Analyze:**
- Waterfall chart (resource loading)
- Filmstrip view (visual progression)
- Core Web Vitals
- Opportunities for improvement

### 3. Next.js Analytics

**Built-in performance monitoring:**

```typescript
// app/layout.tsx (already configured)
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

View metrics at: https://vercel.com/dashboard → Your Project → Analytics

### 4. Chrome User Experience Report (CrUX)

**Real user performance data:**

- PageSpeed Insights: https://pagespeed.web.dev/
- Enter your URL
- See real user metrics from Chrome users

---

## Performance Optimization Strategies

### 1. Image Optimization

#### Current Status
Next.js Image component is already used throughout the site.

#### Optimizations

**Convert to Modern Formats:**
```bash
# Convert images to WebP
for file in public/images/*.{jpg,png}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

**Lazy Loading (already implemented):**
```tsx
import Image from 'next/image';

<Image
  src="/hero-bg.jpg"
  alt="Hero background"
  loading="lazy"  // or "eager" for above-the-fold
  priority={false} // Set true for LCP image
/>
```

**Responsive Images:**
```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
/>
```

### 2. Code Splitting & Bundle Optimization

#### Dynamic Imports

**For heavy components:**
```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const ContactForms = dynamic(() => import('@/components/ContactForms'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // If component doesn't need SSR
});
```

**For client-only libraries:**
```typescript
const AnimatedComponent = dynamic(
  () => import('@/components/AnimatedHero'),
  { ssr: false }
);
```

#### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 3. Font Optimization

**Next.js Font Optimization (recommended):**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text while loading
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Font Subsetting:**
```bash
# Load only required characters
const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
```

### 4. Critical CSS

**Inline critical CSS:**
Currently handled by Next.js automatically. To verify:
1. View page source
2. Check for `<style data-href="...">` in `<head>`
3. Critical CSS should be inlined

### 5. Resource Hints

**Preconnect to third-party domains:**
```tsx
// app/layout.tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://cdn.vercel-analytics.com" />
  <link rel="dns-prefetch" href="https://api.hubspot.com" />
</head>
```

### 6. Reduce JavaScript Execution Time

**Remove unused dependencies:**
```bash
# Analyze dependencies
npm install -g depcheck
depcheck

# Remove unused packages
npm uninstall <package-name>
```

**Tree shaking verification:**
```typescript
// Import only what you need
import { useState } from 'react'; // ✅ Good
import * as React from 'react';   // ❌ Imports everything
```

### 7. Server-Side Optimization

**Static Generation where possible:**
```typescript
// For pages that don't change often
export const dynamic = 'force-static';

// Or with revalidation
export const revalidate = 3600; // Revalidate every hour
```

**Streaming SSR:**
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  );
}
```

### 8. Caching Strategy

**Configure cache headers:**
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/images/:all*(svg|jpg|png|webp)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

---

## Optimization Checklist

### Images
- [ ] Convert images to WebP format
- [ ] Optimize image sizes (max 1920px wide)
- [ ] Use `priority` for LCP image
- [ ] Implement lazy loading for below-fold images
- [ ] Use proper `sizes` attribute
- [ ] Remove unused images

### JavaScript
- [ ] Analyze bundle size with analyzer
- [ ] Remove unused dependencies
- [ ] Implement code splitting for heavy components
- [ ] Use dynamic imports for client-only code
- [ ] Defer non-critical JavaScript
- [ ] Minimize third-party scripts

### CSS
- [ ] Remove unused CSS
- [ ] Inline critical CSS (automatic in Next.js)
- [ ] Use CSS modules to ensure tree-shaking
- [ ] Minimize use of global styles

### Fonts
- [ ] Use Next.js font optimization
- [ ] Enable font display swap
- [ ] Subset fonts to required characters
- [ ] Limit font variations (weights, styles)

### Network
- [ ] Enable compression (Gzip/Brotli)
- [ ] Use HTTP/2 (automatic on Vercel)
- [ ] Implement proper caching headers
- [ ] Preconnect to required origins
- [ ] Minimize API requests

### Core Web Vitals
- [ ] Optimize LCP image
- [ ] Minimize layout shifts (CLS)
- [ ] Reduce JavaScript execution (TBT)
- [ ] Optimize server response time (TTFB)

---

## Monitoring Performance

### Production Monitoring

**Vercel Analytics:**
- Real User Monitoring (RUM)
- Core Web Vitals tracking
- Page load times
- Geographic distribution

**Google Search Console:**
- Core Web Vitals report
- Mobile usability
- Page experience signals

**Sentry Performance:**
```typescript
// Already configured in sentry.client.config.ts
tracesSampleRate: 0.1, // 10% of transactions
```

### Setting Up Alerts

**Performance Budget (Lighthouse CI):**

```yaml
# .github/workflows/lighthouse-ci.yml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @lhci/cli
      - run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Performance budgets:**
```json
// lighthouse-budget.json
{
  "budgets": [{
    "resourceSizes": [{
      "resourceType": "script",
      "budget": 250
    }, {
      "resourceType": "image",
      "budget": 500
    }],
    "resourceCounts": [{
      "resourceType": "third-party",
      "budget": 10
    }]
  }]
}
```

---

## Common Performance Issues & Fixes

### Issue 1: Large Bundle Size

**Symptoms:**
- First Load JS > 300KB
- Slow initial page load

**Solutions:**
1. Analyze with `@next/bundle-analyzer`
2. Remove unused dependencies
3. Use dynamic imports
4. Split vendor chunks

### Issue 2: Poor LCP

**Symptoms:**
- LCP > 2.5s
- Images load slowly

**Solutions:**
1. Add `priority` to hero image
2. Optimize image sizes
3. Use CDN for images
4. Preload critical resources

### Issue 3: High CLS

**Symptoms:**
- CLS > 0.1
- Layout jumps during load

**Solutions:**
1. Set explicit sizes for images
2. Reserve space for dynamic content
3. Avoid inserting content above existing content
4. Use CSS transforms instead of layout properties

### Issue 4: Slow TTFB

**Symptoms:**
- Time to First Byte > 600ms
- Slow server response

**Solutions:**
1. Use static generation
2. Implement caching
3. Optimize database queries
4. Use Edge functions
5. Enable CDN caching

---

## Performance Testing Workflow

### Before Deployment

1. **Run Lighthouse locally:**
   ```bash
   npm run build
   npm run start
   lighthouse http://localhost:3000
   ```

2. **Check bundle size:**
   ```bash
   ANALYZE=true npm run build
   ```

3. **Test on slow network:**
   - Chrome DevTools → Network → Slow 3G
   - Verify page is usable

### After Deployment

1. **Verify Vercel Analytics:**
   - Check real user metrics
   - Compare to previous deployment

2. **Run WebPageTest:**
   - Test from multiple locations
   - Verify Core Web Vitals

3. **Check Google Search Console:**
   - Monitor Core Web Vitals report
   - Address any issues

---

## Next Steps

1. Run initial Lighthouse audit
2. Document baseline metrics
3. Implement high-impact optimizations
4. Set up continuous monitoring
5. Establish performance budgets
6. Schedule regular audits (monthly)

---

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [Vercel Analytics](https://vercel.com/docs/analytics)

---

Last Updated: 2026-02-17
