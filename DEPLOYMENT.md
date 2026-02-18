# Deployment Guide

## Overview

This guide covers deploying the Aicitel web application to production, including frontend (Next.js), backend (Strapi), and database (PostgreSQL) setup.

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│   Backend        │────────▶│   PostgreSQL    │
│   (Vercel)      │  API    │   (Railway/      │  Query  │   Database      │
│   Next.js       │  Calls  │    DigitalOcean) │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│   Cloudflare    │         │   File Storage   │
│   Turnstile     │         │   (Strapi Media) │
└─────────────────┘         └──────────────────┘
         │
         ▼
┌─────────────────┐
│   Upstash       │
│   Redis         │
│   (Rate Limit)  │
└─────────────────┘
```

---

## Prerequisites

Before deployment, ensure you have:

- [ ] **Vercel Account** - https://vercel.com
- [ ] **PostgreSQL Database** - Provisioned and accessible
- [ ] **Strapi Hosting** - Railway, DigitalOcean, or similar
- [ ] **Cloudflare Account** - For Turnstile (bot protection)
- [ ] **Upstash Account** - For Redis rate limiting
- [ ] **Sentry Account** - For error monitoring (optional but recommended)
- [ ] **Domain Name** - Configured and ready
- [ ] **HubSpot Account** - If using CRM integration (optional)

---

## Part 1: Third-Party Services Setup

### 1.1 Upstash Redis (Rate Limiting)

1. Sign up at https://console.upstash.com
2. Create a new Redis database
3. Note your credentials:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

### 1.2 Cloudflare Turnstile (Bot Protection)

1. Go to https://dash.cloudflare.com
2. Navigate to Turnstile
3. Create a new site
4. Note your credentials:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`

### 1.3 Sentry (Error Monitoring)

1. Sign up at https://sentry.io
2. Create a new project (Next.js)
3. Note your credentials:
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ORG`
   - `SENTRY_PROJECT`
4. Generate an auth token for source map uploads:
   - Settings → Auth Tokens → Create New Token
   - `SENTRY_AUTH_TOKEN`

### 1.4 HubSpot (Optional CRM)

1. Go to https://app.hubspot.com
2. Settings → Integrations → API Key
3. Note your credentials:
   - `HUBSPOT_API_KEY`
   - `HUBSPOT_PORTAL_ID`

---

## Part 2: Database Setup

### PostgreSQL Deployment

**Recommended Providers:**
- **Neon** - https://neon.tech (Serverless, generous free tier)
- **Supabase** - https://supabase.com (PostgreSQL + extras)
- **Railway** - https://railway.app (Simple deployment)
- **DigitalOcean** - Managed Databases
- **AWS RDS** - Enterprise solution

**Setup Steps:**

1. Create a PostgreSQL instance (version 13+)
2. Note your connection string:
   ```
   postgresql://username:password@host:port/database
   ```
3. Enable SSL if required by provider
4. Configure firewall rules (allow backend server IP)

See [POSTGRESQL_MIGRATION.md](file:///Users/mohamedshamnsghazy/aicitel/aicitel-web/backend/POSTGRESQL_MIGRATION.md) for detailed migration guide.

---

## Part 3: Backend Deployment (Strapi)

### Option A: Railway (Recommended)

**Why Railway?**
- Simple Git-based deployments
- Built-in PostgreSQL
- Auto-scaling
- Generous free tier

**Steps:**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `aicitel-web` repository
   - Select `backend` directory

3. **Add PostgreSQL Service**
   - In your Railway project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a database automatically

4. **Configure Environment Variables**
   
   In Railway project settings, add:

   ```bash
   # Server
   HOST=0.0.0.0
   PORT=1337
   
   # Database (use Railway's DATABASE_URL)
   DATABASE_CLIENT=postgres
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # Security (generate secure random strings)
   APP_KEYS=your_random_key_1,your_random_key_2
   API_TOKEN_SALT=your_random_salt
   ADMIN_JWT_SECRET=your_random_secret
   TRANSFER_TOKEN_SALT=your_random_salt
   JWT_SECRET=your_random_secret
   ENCRYPTION_KEY=your_random_key
   
   # Environment
   NODE_ENV=production
   ```

5. **Generate Secrets**
   
   Use this command to generate secure random strings:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

6. **Deploy**
   - Railway will automatically deploy on push to `main`
   - First deployment may take 5-10 minutes
   - Note your Railway URL (e.g., `https://your-app.railway.app`)

7. **Create Admin User**
   - Visit `https://your-app.railway.app/admin`
   - Create your first admin account
   - Complete the setup wizard

8. **Generate API Token**
   - In Strapi Admin: Settings → API Tokens → Create New
   - Name: "Frontend API Token"
   - Type: Full access (or customize permissions)
   - Duration: Unlimited
   - Save and copy the token

### Option B: DigitalOcean App Platform

1. Create a new App from GitHub repository
2. Select `backend` directory
3. Configure build command: `npm run build`
4. Configure run command: `npm run start`
5. Add PostgreSQL managed database
6. Set environment variables (same as Railway)

### Option C: Self-Hosted (VPS)

1. SSH into your server
2. Install Node.js 20+
3. Clone repository: `git clone [repo]`
4. Install dependencies: `cd backend && npm ci`
5. Build: `npm run build`
6. Use PM2 to manage process:
   ```bash
   npm install -g pm2
   pm2 start npm --name "strapi" -- start
   pm2 save
   pm2 startup
   ```
7. Configure Nginx reverse proxy
8. Set up SSL with Let's Encrypt

---

## Part 4: Frontend Deployment (Vercel)

### Deploying to Vercel

1. **Import Project**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import `aicitel-web` from GitHub
   - Select `frontend` as root directory

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

3. **Set Environment Variables**

   In Vercel project settings → Environment Variables:

   **Production Environment:**
   ```bash
   # Strapi Backend
   NEXT_PUBLIC_STRAPI_URL=https://your-backend.railway.app
   STRAPI_API_TOKEN=your_strapi_api_token
   
   # Cloudflare Turnstile
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
   TURNSTILE_SECRET_KEY=your_secret_key
   
   # Upstash Redis
   UPSTASH_REDIS_REST_URL=your_redis_url
   UPSTASH_REDIS_REST_TOKEN=your_redis_token
   
   # Sentry (Error Monitoring)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_ENVIRONMENT=production
   SENTRY_ORG=your_org
   SENTRY_PROJECT=your_project
   SENTRY_AUTH_TOKEN=your_auth_token
   
   # HubSpot (Optional)
   HUBSPOT_API_KEY=your_api_key
   HUBSPOT_PORTAL_ID=your_portal_id
   
   # Next.js
   NODE_ENV=production
   ```

   **Preview Environment:** (optional, for staging)
   Same as above but change:
   ```bash
   SENTRY_ENVIRONMENT=staging
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - First deployment takes 3-5 minutes

5. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `aicitel.com`)
   - Follow Vercel's DNS configuration instructions
   - Vercel automatically provisions SSL certificate

---

## Part 5: DNS Configuration

### For Vercel (Frontend)

**If using Vercel DNS:**
1. Add domain in Vercel
2. Update nameservers at your registrar to Vercel's nameservers

**If using external DNS:**
Add these records:
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### For Backend (Railway/DigitalOcean)

Add A record or CNAME:
```
Type    Name    Value
CNAME   api     your-backend.railway.app
```

---

## Part 6: Post-Deployment Verification

### Checklist

- [ ] **Frontend accessible** at your domain
- [ ] **Backend accessible** at API subdomain
- [ ] **Strapi admin panel** loads (`/admin`)
- [ ] **Forms submit successfully**
  - [ ] Test inquiry form
  - [ ] Test application form with file upload
- [ ] **Rate limiting works** (test multiple rapid submissions)
- [ ] **Turnstile verification** works
- [ ] **Errors reported to Sentry**
- [ ] **Database connections stable**
- [ ] **Images load from Strapi**
- [ ] **SSL certificates valid**
- [ ] **Performance metrics acceptable**
  - [ ] Lighthouse score >90
  - [ ] First Contentful Paint <1.5s
  - [ ] Time to Interactive <3.5s

---

## Part 7: Monitoring & Maintenance

### Sentry Dashboard

Monitor at https://sentry.io/organizations/[your-org]/issues/

**Key Metrics:**
- Error rate
- Response times
- User sessions
- Release health

### Uptime Monitoring

Set up monitoring with:
- **UptimeRobot** - https://uptimerobot.com (free)
- **Pingdom** - https://pingdom.com
- **Better Uptime** - https://betteruptime.com

Monitor these endpoints:
- `https://aicitel.com` (frontend)
- `https://api.aicitel.com/_health` (backend)

### Database Backups

See [BACKUP_STRATEGY.md](file:///Users/mohamedshamnsghazy/aicitel/aicitel-web/backend/BACKUP_STRATEGY.md) for details.

**Automated backups:**
- Daily automated backups (Railway/managed services do this automatically)
- Retention: 30 days
- Test restore quarterly

---

## Troubleshooting

### Frontend Issues

**Build Fails:**
```bash
# Check environment variables are set
# Verify Strapi URL is accessible
# Check Node.js version (should be 20+)
```

**Blank Page After Deploy:**
- Check browser console for errors
- Verify `NEXT_PUBLIC_` prefixed vars are set
- Check Sentry for error reports

### Backend Issues

**Database Connection Fails:**
```bash
# Verify DATABASE_URL is correct
# Check SSL settings (DATABASE_SSL=true for cloud providers)
# Verify firewall rules allow connection
```

**Build Fails:**
```bash
# Check all required environment variables are set
# Verify Node.js version
# Clear cache and rebuild
```

### Integration Issues

**Forms Not Submitting:**
- Check network tab for API errors
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct
- Check CORS settings in Strapi
- Verify `STRAPI_API_TOKEN` is valid

**Rate Limiting Not Working:**
- Verify Upstash Redis credentials
- Check Redis connection in Upstash dashboard

---

## Rollback Procedures

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "... " → "Promote to Production"

### Railway Rollback

1. Go to Railway project
2. Click on deployment
3. Select "Redeploy" on previous deployment

### Emergency Procedures

If production is completely down:

1. **Check Status Pages**
   - Vercel: https://www.vercel-status.com
   - Railway: https://status.railway.app

2. **Rollback Frontend** (Vercel, instant)

3. **Check Database** (connection, disk space)

4. **Check Error Logs** (Sentry, Railway logs)

5. **Notify Team** (Slack/email)

---

## Cost Estimates

### Free Tier (Development/Small Scale)

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | $0 | 100GB bandwidth, unlimited sites |
| Railway | $0 | $5 credit/month, ~500 hours |
| Neon PostgreSQL | $0 | 3 projects, 10GB storage |
| Upstash Redis | $0 | 10K commands/day |
| Cloudflare Turnstile | $0 | Unlimited |
| Sentry | $0 | 5K errors/month |
| **Total** | **$0/month** | |

### Production (Moderate Traffic)

| Service | Cost | Specs |
|---------|------|-------|
| Vercel Pro | $20 | Unlimited bandwidth |
| Railway | ~$20 | Backend + PostgreSQL |
| Upstash | $10 | Increased limits |
| Sentry | $26 | 50K errors/month |
| Domain | $12/year | .com domain |
| **Total** | **~$76/month** | |

---

## Security Checklist

- [ ] All secrets stored as environment variables (never in code)
- [ ] `.env` files added to `.gitignore`
- [ ] HTTPS enabled on all endpoints
- [ ] Security headers configured (see `next.config.ts`)
- [ ] Rate limiting active
- [ ] Bot protection enabled (Turnstile)
- [ ] Database firewall rules restrictive
- [ ] Strapi admin panel has strong password
- [ ] API tokens regularly rotated
- [ ] Dependencies regularly updated (`npm audit`)
- [ ] Error messages don't expose sensitive data

---

## Next Steps

After successful deployment:

1. **Performance Optimization**
   - Run Lighthouse audit
   - Optimize images
   - Enable CDN caching

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Configure Google Analytics
   - Verify meta tags

3. **Backup Testing**
   - Test database restore procedure
   - Document recovery process

4. **Load Testing**
   - Run load tests (see Week 2 tasks)
   - Verify auto-scaling

5. **Team Onboarding**
   - Document deployment process
   - Set up team access to all services
   - Create runbooks for common issues

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Strapi Docs**: https://docs.strapi.io
- **Next.js Docs**: https://nextjs.org/docs
- **Sentry Docs**: https://docs.sentry.io

For issues, check the project README or create an issue in the repository.
