# Database Backup Strategy

## Overview

This document outlines the backup and recovery strategy for the Aicitel PostgreSQL database, ensuring business continuity and data protection.

---

## Backup Requirements

### Recovery Point Objective (RPO)
**Target: 1 hour**
- Maximum acceptable data loss: 1 hour of data
- Backup frequency: Hourly incremental, daily full backups

### Recovery Time Objective (RTO)
**Target: 4 hours**
- Maximum acceptable downtime: 4 hours
- Time to restore from backup and verify: <4 hours

---

## Backup Strategy

### 1. Automated Cloud Provider Backups

Most managed PostgreSQL services include automated backups:

#### Neon (https://neon.tech)
- **Automatic**: Yes, built-in
- **Frequency**: Continuous WAL archiving
- **Retention**: 7 days (free tier), 30 days (paid)
- **Point-in-Time Recovery**: Yes, to any point in retention window
- **Configuration**: No setup required

#### Supabase (https://supabase.com)
- **Automatic**: Yes, built-in
- **Frequency**: Daily
- **Retention**: 7 days (free), 30 days (pro)
- **Point-in-Time Recovery**: Available on Pro plan
- **Location**: Verify backups are stored in different region

#### Railway (https://railway.app)
- **Automatic**: Yes, built-in for PostgreSQL plugin
- **Frequency**: Daily
- **Retention**: 7 days
- **Manual Snapshots**: Create via Railway dashboard
- **Configuration**: Automatic with PostgreSQL plugin

#### DigitalOcean Managed Database
- **Automatic**: Yes
- **Frequency**: Daily
- **Retention**: 7 days (configurable up to 35 days)
- **Point-in-Time Recovery**: Yes, last 7 days
- **Backup Window**: Configure time in dashboard

---

### 2. Manual Backup Procedures

For additional protection or migration purposes.

#### Using pg_dump

**Full Database Backup:**

```bash
# From local machine with psql client installed
pg_dump -h hostname -U username -d database_name -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# With compression
pg_dump -h hostname -U username -d database_name -F c -Z 9 -f backup_$(date +%Y%m%d_%H%M%S).dump
```

**Schema-Only Backup:**

```bash
pg_dump -h hostname -U username -d database_name -F c -s -f schema_$(date +%Y%m%d).dump
```

**Data-Only Backup:**

```bash
pg_dump -h hostname -U username -d database_name -F c -a -f data_$(date +%Y%m%d).dump
```

#### Backup Script

Create `/backend/scripts/backup.sh`:

```bash
#!/bin/bash

# Database backup script
# Usage: ./backup.sh

# Load environment variables
source ../.env

# Configuration
BACKUP_DIR="$HOME/aicitel-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/aicitel_$TIMESTAMP.dump"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Parse DATABASE_URL if using connection string
# Example: postgresql://user:pass@host:port/dbname
if [ -n "$DATABASE_URL" ]; then
  # Extract components from DATABASE_URL
  DB_USER=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/\([^:]*\).*/\1/p')
  DB_PASS=$(echo "$DATABASE_URL" | sed -n 's/.*\/\/[^:]*:\([^@]*\).*/\1/p')
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
else
  # Use individual variables
  DB_HOST="$DATABASE_HOST"
  DB_PORT="$DATABASE_PORT"
  DB_USER="$DATABASE_USERNAME"
  DB_NAME="$DATABASE_NAME"
fi

# Perform backup
echo "Starting backup at $(date)"
PGPASSWORD="$DB_PASS" pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -F c \
  -f "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_FILE"
  
  # Get backup size
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup size: $BACKUP_SIZE"
  
  # Clean up old backups
  echo "Cleaning up backups older than $RETENTION_DAYS days..."
  find "$BACKUP_DIR" -name "aicitel_*.dump" -type f -mtime +$RETENTION_DAYS -delete
  
  echo "Backup completed at $(date)"
else
  echo "ERROR: Backup failed!"
  exit 1
fi
```

Make it executable:
```bash
chmod +x backend/scripts/backup.sh
```

---

### 3. Automated Backup Scheduling

#### Using Cron (Linux/macOS)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/aicitel/backend/scripts/backup.sh >> /var/log/aicitel-backup.log 2>&1

# Add hourly backup (keep last 24 hours only)
0 * * * * /path/to/aicitel/backend/scripts/backup.sh >> /var/log/aicitel-backup.log 2>&1
```

#### Using GitHub Actions (for cloud backups)

Create `.github/workflows/backup.yml`:

```yaml
name: Database Backup

on:
  schedule:
    # Daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    
    steps:
      - name: Install PostgreSQL client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-client
      
      - name: Create backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          pg_dump "$DATABASE_URL" -F c -f backup_$(date +%Y%m%d).dump
      
      - name: Upload to cloud storage
        uses: actions/upload-artifact@v4
        with:
          name: database-backup-${{ github.run_number }}
          path: backup_*.dump
          retention-days: 30
```

---

## Restore Procedures

### Full Database Restore

**Prerequisites:**
- PostgreSQL client tools installed
- Backup file available
- Target database created (can be empty)

**Steps:**

1. **Create Target Database** (if needed):
   ```bash
   createdb -h hostname -U username new_database_name
   ```

2. **Restore from Backup**:
   ```bash
   pg_restore -h hostname -U username -d database_name -c backup_file.dump
   ```

3. **Verify Restoration**:
   ```bash
   psql -h hostname -U username -d database_name -c "\dt"
   psql -h hostname -U username -d database_name -c "SELECT COUNT(*) FROM applications;"
   ```

### Point-in-Time Recovery (Cloud Providers)

#### Neon

1. Go to Neon Dashboard → Your Project
2. Click "Restore" button
3. Select date and time
4. Choose "Create new branch" (recommended)
5. Verify data in new branch
6. Update application to point to new branch if needed

#### Supabase

1. Go to Database → Backups
2. Select backup to restore
3. Click "Restore"
4. Confirm (this will replace current database)

#### DigitalOcean

1. Go to Managed Databases → Your Database
2. Click "Backups & Restore"
3. Select backup
4. Choose "Restore to new cluster" (safer)
5. Verify data
6. Update application database URL

### Selective Table Restore

If you only need to restore specific tables:

```bash
# Restore only specific tables
pg_restore -h hostname -U username -d database_name -t applications -t inquiries backup_file.dump

# Restore with data transformation
pg_restore -h hostname -U username -d database_name -a -t applications backup_file.dump
```

---

## Backup Testing

### Monthly Backup Verification

**Schedule**: First Monday of every month

**Procedure**:

1. **Download Latest Backup**
   ```bash
   # From cloud provider or backup directory
   ```

2. **Create Test Database**
   ```bash
   createdb aicitel_test
   ```

3. **Restore to Test Database**
   ```bash
   pg_restore -d aicitel_test backup_file.dump
   ```

4. **Verify Data Integrity**
   ```bash
   # Check table counts
   psql aicitel_test -c "SELECT 
     (SELECT COUNT(*) FROM applications) as applications,
     (SELECT COUNT(*) FROM inquiries) as inquiries,
     (SELECT COUNT(*) FROM jobs) as jobs;"
   
   # Check recent records
   psql aicitel_test -c "SELECT * FROM applications ORDER BY created_at DESC LIMIT 5;"
   ```

5. **Test Application Connection**
   - Update test environment to point to test database
   - Verify Strapi can connect and read data
   - Test form submissions

6. **Cleanup**
   ```bash
   dropdb aicitel_test
   ```

7. **Document Results**
   - Date of test
   - Backup file used
   - Success/failure
   - Any issues found

---

## Disaster Recovery Scenarios

### Scenario 1: Accidental Data Deletion

**Example**: Accidentally deleted production applications

**Recovery**:
1. Immediately stop application to prevent further changes
2. Identify time of deletion
3. Restore from point-in-time backup (if available)
4. Otherwise, restore from most recent backup
5. Manually add any data created after backup
6. Verify data integrity
7. Resume application

**Time Estimate**: 1-2 hours

### Scenario 2: Database Corruption

**Recovery**:
1. Assess extent of corruption
2. If partial: restore affected tables only
3. If total: full database restore required
4. Point-in-time recovery to just before corruption
5. Verify all tables and indexes
6. REINDEX if necessary

**Time Estimate**: 2-4 hours

### Scenario 3: Complete Provider Outage

**Recovery**:
1. Spin up new PostgreSQL instance (different provider)
2. Restore from most recent backup
3. Update application DATABASE_URL
4. Verify connectivity
5. Test critical functions
6. Monitor for issues

**Time Estimate**: 4-6 hours

---

## Backup Storage Locations

### Primary: Cloud Provider Native Backups
- **Location**: Provider's infrastructure (multi-region)
- **Access**: Provider dashboard
- **Retention**: 7-30 days (depending on plan)

### Secondary: Local Backups (Optional)
- **Location**: Secure local storage or NAS
- **Frequency**: Weekly
- **Retention**: 3 months
- **Use Case**: Long-term archival, compliance

### Tertiary: Cloud Storage (Recommended for Production)

**AWS S3:**
```bash
# Install AWS CLI
brew install awscli

# Configure
aws configure

# Upload backup
aws s3 cp backup_file.dump s3://aicitel-backups/$(date +%Y/%m/%d)/
```

**Google Cloud Storage:**
```bash
# Install gcloud
brew install google-cloud-sdk

# Upload
gsutil cp backup_file.dump gs://aicitel-backups/$(date +%Y/%m/%d)/
```

---

## Monitoring & Alerts

### Backup Monitoring Checklist

- [ ] Automated backups running successfully
- [ ] Backup file sizes reasonable (not 0 bytes)
- [ ] Backup completion time acceptable
- [ ] Storage space available for backups
- [ ] Backup retention policy being followed
- [ ] Test restores completed monthly

### Alert Setup

Configure alerts for:
- Backup failures
- Backup size anomalies (too large or too small)
- Storage space running low
- Backup older than 36 hours (for daily backups)

---

## Compliance & Security

### Data Security

- **Encryption at Rest**: Verify backups are encrypted
- **Encryption in Transit**: Use SSL for backup transfer
- **Access Control**: Limit who can trigger restores
- **Audit Logging**: Log all backup/restore operations

### Compliance Considerations

- **GDPR**: Ensure backups can be purged for "right to be forgotten"
- **Data Residency**: Verify backup location complies with regulations
- **Retention Policy**: Document and adhere to legal requirements

---

## Backup Checklist

### Daily
- [ ] Verify automated backup completed
- [ ] Check backup logs for errors

### Weekly
- [ ] Review backup file sizes
- [ ] Verify retention policy compliance

### Monthly
- [ ] Perform test restore
- [ ] Review and update backup strategy
- [ ] Check storage capacity

### Quarterly
- [ ] Full disaster recovery drill
- [ ] Review and update documentation
- [ ] Audit backup access controls

---

## Troubleshooting

### Backup Fails with "Permission Denied"

**Solution**: Verify database user has backup privileges:
```sql
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
```

### Restore Fails with "Database Already Exists"

**Solution**: Use `-c` flag to clean (drop) existing objects:
```bash
pg_restore -c -d database_name backup_file.dump
```

### Out of Disk Space

**Solution**:
1. Clean old backups: `find /backups -mtime +30 -delete`
2. Use compression: `-Z 9` flag
3. Consider cloud storage for older backups

---

## Resources

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [pg_dump Manual](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore Manual](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Cloud Provider Backup Guides](See deployment documentation)

---

## Contacts

**Database Administrator**: [Your DBA contact]  
**Cloud Provider Support**: [Provider support link]  
**Emergency Contact**: [On-call engineer]

---

Last Updated: 2026-02-17  
Next Review: 2026-03-17
