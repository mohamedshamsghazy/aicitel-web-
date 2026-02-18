# PostgreSQL Migration Guide

## Overview

This guide will help you migrate the Aicitel backend from SQLite to PostgreSQL for production use.

## Prerequisites

- PostgreSQL database instance (version 13 or higher recommended)
- Database credentials (host, port, username, password, database name)
- Backend local development environment

## Step 1: Set Up PostgreSQL Database

### Option A: Local Development with PostgreSQL

Install PostgreSQL locally:

```bash
# macOS (using Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create database and user
createdb aicitel
createuser aicitel_user -P  # You'll be prompted for a password
```

### Option B: Cloud-Hosted PostgreSQL

Popular managed PostgreSQL options:
- **Neon** (https://neon.tech) - Serverless PostgreSQL, generous free tier
- **Supabase** (https://supabase.com) - PostgreSQL with additional features
- **Railway** (https://railway.app) - Simple deployment platform
- **DigitalOcean Managed Databases** - Reliable and scalable
- **AWS RDS** - Enterprise-grade solution

Create a PostgreSQL database instance and note the connection details.

## Step 2: Configure Environment Variables

Update your backend `.env` file with PostgreSQL connection details:

```bash
# Database Configuration
DATABASE_CLIENT=postgres

# Option 1: Use connection string (recommended)
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Option 2: Use individual parameters
DATABASE_HOST=your-pg-host.com
DATABASE_PORT=5432
DATABASE_NAME=aicitel
DATABASE_USERNAME=aicitel_user
DATABASE_PASSWORD=your_secure_password

# PostgreSQL specific settings
DATABASE_SCHEMA=public
DATABASE_SSL=false  # Set to true for cloud providers that require SSL

# Connection pool settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_CONNECTION_TIMEOUT=60000
```

### SSL Configuration (for cloud providers)

If your PostgreSQL provider requires SSL (most cloud providers do):

```bash
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=true  # Set to false only for self-signed certs
```

## Step 3: Install Dependencies

The `pg` package has already been added to `package.json`. Install it:

```bash
cd backend
npm install
```

## Step 4: Test the Connection

Start the Strapi development server:

```bash
npm run dev
```

You should see output indicating successful database connection:

```
[INFO] Database connection established
[INFO] Server started on port 1337
```

If you see connection errors, verify your database credentials and ensure the PostgreSQL server is running.

## Step 5: Run Database Migrations

Strapi will automatically create the database schema on first run. The schema includes:

- **Content Types**: Applications, Inquiries, Jobs
- **System Tables**: Users, Permissions, Roles, Tokens
- **Media Library**: Upload files metadata

Monitor the console output for migration status.

## Step 6: Access Strapi Admin Panel

1. Navigate to `http://localhost:1337/admin`
2. If this is a fresh database, you'll be prompted to create an admin account
3. Complete the admin setup wizard

## Step 7: Verify Data Models

Check that all content types are present in the admin panel:

1. Navigate to Content-Type Builder
2. Verify these collection types exist:
   - Applications
   - Inquiries
   - Jobs

If any are missing, you may need to rebuild:

```bash
npm run build
npm run dev
```

## Step 8: Generate API Tokens

Generate API tokens for frontend communication:

1. Go to Settings → API Tokens
2. Click "Create new API Token"
3. Name: "Frontend API Token"
4. Token duration: Unlimited (for production)
5. Token type: Full access (or customize permissions)
6. Save and copy the token

Update your frontend `.env.local`:

```bash
STRAPI_API_TOKEN=your_generated_token_here
```

## Data Migration (If Needed)

If you have existing data in SQLite that needs to be migrated:

### Export from SQLite

```bash
# From backend directory
npx strapi export --no-encrypt --file ./export/data
```

### Import to PostgreSQL

After configuring PostgreSQL:

```bash
npx strapi import --file ./export/data
```

**Note**: This feature may vary based on Strapi version. Test carefully.

## Production Deployment Checklist

- [ ] PostgreSQL database provisioned
- [ ] Database credentials securely stored (use secrets management)
- [ ] SSL enabled for database connection
- [ ] Connection pooling configured appropriately
- [ ] Backup strategy implemented
- [ ] Database monitoring set up
- [ ] Performance indexes created (if needed for large datasets)
- [ ] Database firewall rules configured (allow only app server access)

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Solutions**:
- Verify PostgreSQL is running
- Check `DATABASE_HOST` and `DATABASE_PORT`
- Confirm firewall rules allow connection
- For cloud databases, check IP allowlist

### Authentication Failed

```
Error: password authentication failed
```

**Solutions**:
- Verify `DATABASE_USERNAME` and `DATABASE_PASSWORD`
- Check user permissions in PostgreSQL
- Ensure user has access to the specified database

### SSL Required

```
Error: no pg_hba.conf entry for host
```

**Solutions**:
- Set `DATABASE_SSL=true`
- For self-signed certs: `DATABASE_SSL_REJECT_UNAUTHORIZED=false`

### Schema Sync Issues

If tables aren't created automatically:

```bash
# Rebuild admin panel and restart
npm run build
npm run develop
```

### Performance Issues

Large datasets may need indexes. Connect to PostgreSQL:

```sql
-- Example: Index on email for faster lookups
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_inquiries_email ON inquiries(email);
```

## Rollback to SQLite

If you need to rollback to SQLite:

1. Update `.env`:
   ```bash
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db
   ```

2. Restart Strapi:
   ```bash
   npm run dev
   ```

## Next Steps

- Set up automated database backups
- Configure database monitoring and alerting
- Optimize query performance with indexes
- Implement database connection retry logic
- Consider read replicas for high-traffic scenarios

## Resources

- [Strapi Database Configuration](https://docs.strapi.io/dev-docs/configurations/database)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Connection Pooling Guide](https://node-postgres.com/features/pooling)
