# Production Readiness Checklist

## Overview

This checklist ensures the Aicitel application is ready for production deployment. Complete all items before going live.

---

## 🔴 Critical (Must Complete)

### Security
- [ ] Run `npm audit` and fix critical vulnerabilities
- [ ] Verify all secrets in environment variables (not hardcoded)
- [ ] Enable HTTPS/SSL certificates (automatic on Vercel)
- [ ] Configure security headers in `next.config.ts` ✅
- [ ] Test rate limiting on production URLs
- [ ] Verify Cloudflare Turnstile works on production domain

### Environment Configuration
- [ ] Set up production environment variables on Vercel
- [ ] Set up production environment variables for backend (Railway/DigitalOcean)
- [ ] Configure production database (PostgreSQL)
- [ ] Set up Upstash Redis for production
- [ ] Add production Sentry DSN
- [ ] Add HubSpot API keys (if using CRM)

### Database
- [ ] PostgreSQL configured and tested
- [ ] Database migrations run successfully
- [ ] Automated backups configured
- [ ] Test restore procedure
- [ ] Connection pooling configured

### Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Railway/DigitalOcean/VPS)
- [ ] Custom domain configured
- [ ] DNS records set up correctly
- [ ] SSL certificates active

---

## 🟡 Important (Should Complete)

### Testing
- [ ] Run all component tests (`npm test`)
- [ ] Run all API tests
- [ ] Test forms on staging
- [ ] Test file uploads
- [ ] Test bot protection
- [ ] Test rate limiting

### Performance
- [ ] Run Lighthouse audit (target: >90)
- [ ] Optimize images (WebP format)
- [ ] Check bundle size (<250KB first load)
- [ ] Test on slow 3G connection
- [ ] Verify Core Web Vitals

### Monitoring
- [ ] Sentry configured and receiving errors
- [ ] Vercel Analytics enabled
- [ ] Set up uptime monitoring (UptimeRobot/Pingdom)
- [ ] Configure error alerts
- [ ] Set up monthly audit schedule

### Documentation
- [ ] Update README with deployment instructions ✅
- [ ] Document all environment variables ✅
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures ✅

---

## 🟢 Nice to Have (Optional)

### Additional Testing
- [ ] Run load tests with k6
- [ ] Accessibility audit (WAVE, axe)
- [ ] Cross-browser testing (Safari, Firefox, Edge)
- [ ] Mobile device testing

### Optimization
- [ ] Implement image CDN
- [ ] Enable ISR (Incremental Static Regeneration)
- [ ] Add service worker for offline support
- [ ] Implement advanced caching strategies

### Monitoring & Analytics
- [ ] Google Analytics configured
- [ ] Google Search Console verified
- [ ] Set up conversion tracking
- [ ] Configure custom Sentry dashboards

---

## Pre-Launch Execution Plan

### Phase 1: Testing (Now)
```bash
# 1. Install dependencies
cd frontend
npm install --legacy-peer-deps

# 2. Run component tests
npm test

# 3. Run API tests  
npm test app/api/

# 4. Check for vulnerabilities
npm audit

# 5. Fix critical issues
npm audit fix
```

### Phase 2: Security Audit (30 min)
```bash
# 1. Check exposed secrets
git grep -i "password\|secret\|api_key" | grep -v ".env.example"

# 2. Test API security
cd aicitel-web/load-tests
# Modify scripts to test production URL
k6 run apply-endpoint.test.js

# 3. Verify headers
curl -I https://aicitel-web.vercel.app

# 4. Run dependency audit
npm audit --production
```

### Phase 3: Performance Audit (20 min)
```bash
# 1. Build production bundle
npm run build

# 2. Analyze bundle size
ANALYZE=true npm run build

# 3. Run Lighthouse
lighthouse https://aicitel-web.vercel.app --output=html --output-path=./lighthouse-report.html

# 4. Check image optimization
# Review /public/images/ for large files
```

### Phase 4: Staging Deployment (1 hour)
```bash
# 1. Deploy to Vercel (staging)
vercel --prod=false

# 2. Test staging thoroughly
# - Submit application form
# - Submit inquiry form
# - Test file uploads
# - Verify HubSpot integration
# - Check Sentry errors

# 3. Run smoke tests
curl -X POST https://staging-url/api/apply -d @test-data.json
```

### Phase 5: Production Deployment (30 min)
```bash
# 1. Final check
npm run build
npm run start  # Test locally

# 2. Deploy frontend
vercel --prod

# 3. Deploy backend
# Follow DEPLOYMENT.md

# 4. Verify production
curl https://aicitel.com
```

### Phase 6: Post-Deployment (30 min)
```bash
# 1. Smoke tests
# - Visit all pages
# - Submit test forms
# - Check analytics

# 2. Monitor
# - Check Sentry for errors
# - Monitor Vercel Analytics
# - Check uptime status

# 3. Enable monitoring
# - Set up UptimeRobot
# - Configure alert emails
```

---

## Quick Command Reference

### Testing
```bash
# All tests
npm test

# Component tests only
npm test components/

# API tests only
npm test app/api/

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Security
```bash
# Vulnerability scan
npm audit

# Fix automatically
npm audit fix

# Production only
npm audit --production

# Check for secrets
git grep -E "sk_|pk_|token|secret" --cached
```

### Performance
```bash
# Build and analyze
ANALYZE=true npm run build

# Lighthouse
lighthouse https://aicitel.com

# Check bundle
npm run build && ls -lh .next/static/chunks
```

### Deployment
```bash
# Staging
vercel

# Production
vercel --prod

# Check deployment
curl -I https://aicitel.com
```

---

## Production Environment Variables

### Frontend (Vercel)
```bash
NEXT_PUBLIC_STRAPI_URL=https://api.aicitel.com
STRAPI_API_TOKEN=<production_token>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<production_key>
TURNSTILE_SECRET_KEY=<production_secret>
UPSTASH_REDIS_REST_URL=<production_redis_url>
UPSTASH_REDIS_REST_TOKEN=<production_redis_token>
HUBSPOT_API_KEY=<production_api_key>
HUBSPOT_PORTAL_ID=<portal_id>
NEXT_PUBLIC_SENTRY_DSN=<sentry_dsn>
SENTRY_AUTH_TOKEN=<sentry_token>
SENTRY_ORG=<org_name>
SENTRY_PROJECT=<project_name>
SENTRY_ENVIRONMENT=production
```

### Backend (Railway/DigitalOcean)
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=<postgres_host>
DATABASE_PORT=5432
DATABASE_NAME=aicitel_production
DATABASE_USERNAME=<db_user>
DATABASE_PASSWORD=<db_password>
DATABASE_SSL=true
APP_KEYS=<generate_random>
API_TOKEN_SALT=<generate_random>
ADMIN_JWT_SECRET=<generate_random>
TRANSFER_TOKEN_SALT=<generate_random>
JWT_SECRET=<generate_random>
NODE_ENV=production
```

---

## Post-Launch Monitoring

### Day 1
- [ ] Check Sentry for errors every 2 hours
- [ ] Monitor form submissions
- [ ] Verify HubSpot contacts are created
- [ ] Check uptime status

### Week 1
- [ ] Review analytics daily
- [ ] Check error rates
- [ ] Monitor performance metrics
- [ ] Review user feedback

### Month 1
- [ ] Run security audit
- [ ] Run performance audit
- [ ] Review and optimize
- [ ] Update dependencies

---

## Rollback Plan

If issues occur after deployment:

### Immediate Rollback
```bash
# Vercel (automatic)
vercel rollback <deployment-url>

# Or in dashboard: Deployments → Previous → Promote to Production
```

### Database Rollback
```bash
# Restore from backup
pg_restore -h <host> -U <user> -d aicitel_production backup.dump

# Or use cloud provider's restore feature
```

### Investigation
1. Check Sentry for errors
2. Review Vercel logs
3. Check database connectivity
4. Test forms manually
5. Review recent changes

---

## Success Criteria

### Performance
- ✅ Lighthouse score > 90
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1

### Functionality
- ✅ All forms work
- ✅ File uploads work
- ✅ Rate limiting active
- ✅ Bot protection active
- ✅ CRM integration works (if configured)

### Security
- ✅ HTTPS enabled
- ✅ Security headers present
- ✅ No critical vulnerabilities
- ✅ Secrets not exposed

### Monitoring
- ✅ Sentry receiving events
- ✅ Analytics tracking
- ✅ Uptime monitoring active
- ✅ Alerts configured

---

## Sign-Off

- [ ] All critical items completed
- [ ] All important items completed
- [ ] Testing passed
- [ ] Security audit passed
- [ ] Performance audit passed
- [ ] Deployment successful
- [ ] Monitoring active

**Ready for Production:** ☐ Yes ☐ No

**Deployed By:** _______________  
**Date:** _______________  
**Production URL:** https://aicitel.com

---

Last Updated: 2026-02-17
