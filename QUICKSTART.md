# Quick Start Guide

## 🚀 Get to Production in 3 Steps

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Git
- Vercel account (free tier works)

---

## Step 1: Clone & Install (5 min)

```bash
# Clone repository
git clone <your-repo-url>
cd aicitel-web

# Install dependencies
cd frontend
npm install --legacy-peer-deps

cd ../backend
npm install
```

---

## Step 2: Configure Services (20 min)

Run the interactive setup script:

```bash
./setup-services.sh
```

This will guide you through setting up:
- ✅ Upstash Redis (rate limiting)
- ✅ Cloudflare Turnstile (bot protection)
- ✅ PostgreSQL database
- ✅ Strapi backend
- ✅ Sentry error monitoring (optional)
- ✅ HubSpot CRM (optional)

**Or manually create `.env.local` files:**

### Frontend `.env.local`
```bash
# Required
NEXT_PUBLIC_STRAPI_URL=https://your-backend.com
STRAPI_API_TOKEN=your_token_here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# Optional but recommended
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your_auth_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
HUBSPOT_API_KEY=pat-na1-xxxxx
HUBSPOT_PORTAL_ID=12345678
```

### Backend `.env`
```bash
# Database
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://user:pass@host:5432/db

# Strapi secrets (generate random strings)
APP_KEYS=generate_random_key_here
API_TOKEN_SALT=generate_random_salt
ADMIN_JWT_SECRET=generate_random_secret
TRANSFER_TOKEN_SALT=generate_random_salt
JWT_SECRET=generate_random_secret

# Environment
NODE_ENV=production
```

---

## Step 3: Deploy (15 min)

### Deploy Frontend (Vercel)

```bash
cd frontend

# Login to Vercel
npx vercel login

# Deploy
npx vercel --prod

# Or use the automated script
./deploy.sh
```

### Deploy Backend (Railway Example)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for other hosting options.

---

## Verify Deployment ✓

Visit your production URL and test:

- [ ] Homepage loads
- [ ] Submit application form
- [ ] Submit inquiry form
- [ ] Check Sentry dashboard (if configured)
- [ ] Check HubSpot contacts (if configured)

---

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Tests fail
```bash
# Run tests to see specific failures
npm test

# Check test documentation
cat TESTING.md
```

### Environment variables not working
```bash
# Verify Vercel environment variables
vercel env pull

# Check if .env.local exists
ls -la .env.local
```

---

## Production Monitoring

After deployment, set up monitoring:

### 1. Uptime Monitoring
- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom** (free trial): https://pingdom.com

### 2. Performance
- Vercel Analytics (automatic)
- Google PageSpeed Insights: https://pagespeed.web.dev

### 3. Errors
- Sentry dashboard: https://sentry.io

---

## Next Steps

- [ ] Set up custom domain
- [ ] Configure DNS records
- [ ] Enable Vercel Analytics
- [ ] Set up automated backups
- [ ] Schedule security audits
- [ ] Configure alerts

---

## Support & Documentation

- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Performance Optimization**: [PERFORMANCE.md](./PERFORMANCE.md)
- **Security Checklist**: [SECURITY_AUDIT.md](./SECURITY_AUDIT.md)
- **HubSpot Integration**: [HUBSPOT_INTEGRATION.md](./HUBSPOT_INTEGRATION.md)
- **Production Readiness**: [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md)

---

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm test

# Deploy
./deploy.sh

# Setup services
./setup-services.sh

# Security audit
npm audit

# Performance check
npm run build && du -sh .next
```

---

**You're ready to go live! 🎉**

Any issues? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.
