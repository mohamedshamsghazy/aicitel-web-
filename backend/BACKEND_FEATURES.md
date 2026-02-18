# Backend Features Documentation

## Overview

The Aicitel Strapi backend is fully configured with 4 content types and 1 custom API endpoint. All features are working and production-ready.

---

## Content Types (4 Total)

### 1. Applications ✅
**Path:** `api::application.application`  
**Collection:** `applications`  
**Purpose:** Job application submissions

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | String | ✅ | Applicant's full name |
| `email` | Email | ✅ | Contact email |
| `phone` | String | ❌ | Phone number |
| `cv` | Media (File) | ✅ | Resume/CV upload |
| `linkedJob` | Relation | ❌ | Link to job posting |
| `stage` | Enum | ❌ | Application stage (New/Reviewed/Interview/Rejected/Hired) |
| `internalNotes` | Blocks | ❌ | Admin notes |

**Features:**
- ✅ File upload support (CV/Resume)
- ✅ Relation to Job postings
- ✅ Stage tracking for hiring workflow
- ✅ Rich text notes for internal use
- ✅ No draft/publish (instant save)

**Permissions:**
- Public: Create (via API route)
- Authenticated: Full CRUD

---

### 2. Inquiries ✅
**Path:** `api::inquiry.inquiry`  
**Collection:** `inquiries`  
**Purpose:** Contact form submissions (partners/general)

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `companyName` | String | ❌ | Company name (for partners) |
| `contactPerson` | String | ✅ | Contact person's name |
| `email` | Email | ✅ | Contact email |
| `phone` | String | ❌ | Phone number |
| `message` | Text | ❌ | Inquiry message |
| `type` | Enum | ❌ | Partner or General (default: General) |

**Features:**
- ✅ Separate partner and general inquiries
- ✅ Simple validation
- ✅ No draft/publish (instant save)

**Permissions:**
- Public: Create (via API route)
- Authenticated: Full CRUD

---

### 3. Jobs ✅
**Path:** `api::job.job`  
**Collection:** `jobs`  
**Purpose:** Job listings/postings

**Fields:**
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | String | ✅ | ✅ | Job title  |
| `slug` | UID | ✅ | ✅ | URL-friendly identifier |
| `description` | Blocks | ❌ | ✅ | Job description (rich text) |
| `location` | String | ✅ | ❌ | Job location |
| `highlight` | Boolean | ❌ | ❌ | Featured job flag |
| `featuredOrder` | Integer | ❌ | ❌ | Display order for featured jobs |
| `jobStatus` | String | ❌ | ❌ | Open/Closed (default: Open) |
| `closingDate` | Date | ❌ | ❌ | Application deadline |
| `metaTitle` | String | ❌ | ✅ | SEO title |
| `metaDescription` | Text | ❌ | ✅ | SEO description |
| `applications` | Relation | ❌ | ❌ | Link to applications |

**Features:**
- ✅ **i18n Support** (Arabic & English)
- ✅ Draft/Publish workflow
- ✅ SEO metadata fields
- ✅ Featured jobs support
- ✅ Rich text job descriptions
- ✅ Relation to applications
- ✅ Auto-generated slugs

**Locales Supported:**
- English (en)
- Arabic (ar)

**Permissions:**
- Public: Read (published only)
- Authenticated: Full CRUD

---

### 4. FAQs ✅
**Path:** `api::faq.faq`  
**Collection:** `faqs`  
**Purpose:** Frequently asked questions

**Fields:**
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `question` | String | ✅ | ✅ | FAQ question |
| `answer` | Blocks | ❌ | ✅ | FAQ answer (rich text) |
| `category` | Enum | ✅ | ❌ | Career or Partner |
| `order` | Integer | ❌ | ❌ | Display order |

**Features:**
- ✅ **i18n Support** (Arabic & English)
- ✅ Draft/Publish workflow
- ✅ Category-based organization
- ✅ Custom ordering
- ✅ Rich text answers

**Categories:**
- Career (job-related FAQs)
- Partner (partnership FAQs)

**Permissions:**
- Public: Read (published only)
- Authenticated: Full CRUD

---

## Custom API Endpoint

### Dashboard Stats ✅
**Route:** `GET /api/dashboard/stats`  
**Purpose:** Aggregate statistics for admin dashboard

**Returns:**
```json
{
  "applications": {
    "total": 150,
    "byStage": {
      "New": 45,
      "Reviewed": 30,
      "Interview": 25,
      "Rejected": 35,
      "Hired": 15
    },
    "recent": 12  // Last 7 days
  },
  "inquiries": {
    "total": 200,
    "byType": {
      "Partner": 80,
      "General": 120
    },
    "recent": 15  // Last 7 days
  },
  "jobs": {
    "total": 25,
    "published": 20,
    "highlighted": 5
  },
  "faqs": {
    "total": 30,
    "byCategory": {
      "Career": 18,
      "Partner": 12
    }
  }
}
```

**Features:**
- ✅ Real-time aggregation
- ✅ Stage/type breakdown
- ✅ Recent activity tracking (7 days)
- ✅ Optimized queries

**Permissions:**
- Authenticated only (admin dashboard)

---

## Plugins Installed

### Core Plugins ✅
1. **Users & Permissions** - Authentication & authorization
2. **Upload** - File upload handling (CV uploads)
3. **i18n** - Internationalization (Arabic/English)
4. **Cloud** - Strapi Cloud integration

---

## Database Configuration

### Development ✅
```bash
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Production ✅
```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=your-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=aicitel_production
DATABASE_USERNAME=postgres_user
DATABASE_PASSWORD=secure_password
DATABASE_SSL=true
```

**Migrations:**
- Automatic schema sync enabled
- Migration guide available: `POSTGRESQL_MIGRATION.md`

---

## API Endpoints Summary

### Public Endpoints (Frontend)
```bash
# Jobs
GET    /api/jobs                    # List all published jobs
GET    /api/jobs/:id                # Get single job
GET    /api/jobs?locale=ar          # Arabic jobs
GET    /api/jobs?filters[highlight][$eq]=true  # Featured jobs

# FAQs
GET    /api/faqs                    # List all published FAQs
GET    /api/faqs?locale=ar          # Arabic FAQs
GET    /api/faqs?filters[category][$eq]=Career  # Career FAQs

# Applications (via custom route)
POST   /api/apply                   # Submit application

# Inquiries (via custom route)
POST   /api/inquiry                 # Submit inquiry
```

### Admin Endpoints (Authenticated)
```bash
# Dashboard
GET    /api/dashboard/stats         # Get dashboard statistics

# Applications
GET    /api/applications            # List all applications
GET    /api/applications/:id        # Get single application
PUT    /api/applications/:id        # Update application
DELETE /api/applications/:id        # Delete application

# Inquiries
GET    /api/inquiries               # List all inquiries
GET    /api/inquiries/:id           # Get single inquiry
PUT    /api/inquiries/:id           # Update inquiry
DELETE /api/inquiries/:id           # Delete inquiry

# Jobs (Admin CRUD)
POST   /api/jobs                    # Create job
PUT    /api/jobs/:id                # Update job
DELETE /api/jobs/:id                # Delete job

# FAQs (Admin CRUD)
POST   /api/faqs                    # Create FAQ
PUT    /api/faqs/:id                # Update FAQ
DELETE /api/faqs/:id                # Delete FAQ
```

---

## Testing the Backend

### 1. Start the Backend
```bash
cd backend
npm run develop
```

### 2. Create Admin User
1. Visit `http://localhost:1337/admin`
2. Create your admin account
3. Login to the admin panel

### 3. Configure API Tokens
1. Go to Settings → API Tokens
2. Create new token with appropriate permissions
3. Copy token for frontend use

### 4. Test Endpoints

**Get Jobs:**
```bash
curl http://localhost:1337/api/jobs
```

**Get FAQs:**
```bash
curl http://localhost:1337/api/faqs
```

**Dashboard Stats (requires auth):**
```bash
curl http://localhost:1337/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

---

## Features Verification Checklist

### Content Types ✅
- [x] Applications schema configured
- [x] Inquiries schema configured
- [x] Jobs schema configured with i18n
- [x] FAQs schema configured with i18n
- [x] All relations working
- [x] All enums defined

### Functionality ✅
- [x] File uploads working (CV)
- [x] i18n working (Arabic/English)
- [x] Draft/Publish working (Jobs, FAQs)
- [x] Custom dashboard API
- [x] Permissions configured

### Database ✅
- [x] SQLite configured (development)
- [x] PostgreSQL configured (production)
- [x] Migrations documented
- [x] Backup strategy documented

### Dependencies ✅
- [x] Strapi 5.36.0 installed
- [x] PostgreSQL driver (pg) installed
- [x] SQLite driver installed
- [x] All plugins working

---

## Production Readiness ✅

**Backend Status: 100% Ready**

All features are:
- ✅ Configured correctly
- ✅ Tested and working
- ✅ Documented
- ✅ Production-ready

**Deployment Requirements:**
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Create admin user
5. Generate API tokens
6. Configure file upload storage

**See:** [DEPLOYMENT.md](../DEPLOYMENT.md) for full deployment instructions

---

## Next Steps

1. **Configure Database:**
   ```bash
   # Follow PostgreSQL migration guide
   cat POSTGRESQL_MIGRATION.md
   ```

2. **Set Environment Variables:**
   ```bash
   # Copy and edit
   cp .env.example .env
   ```

3. **Deploy Backend:**
   ```bash
   # Follow deployment guide
   cat ../DEPLOYMENT.md
   ```

4. **Create Content:**
   - Add Jobs in admin panel
   - Add FAQs
   - Configure API permissions
   - Generate API tokens

---

## Support Files

- [PostgreSQL Migration Guide](./POSTGRESQL_MIGRATION.md)
- [Backup Strategy](./BACKUP_STRATEGY.md)
- [Deployment Guide](../DEPLOYMENT.md)
- [Environment Variables](./.env.example)

---

**Last Updated:** 2026-02-17  
**Backend Version:** Strapi 5.36.0  
**Status:** Production Ready ✅
