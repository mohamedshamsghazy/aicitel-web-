# Security Audit Checklist

## Overview

This document provides a comprehensive security audit checklist for the Aicitel web application, covering common vulnerabilities, best practices, and remediation strategies.

---

## OWASP Top 10 Security Risks

### 1. Broken Access Control

**Risks:**
- Unauthorized access to admin functions
- Bypassing authentication
- Accessing other users' data

**Current Protection:**
- ✅ Strapi built-in RBAC (Role-Based Access Control)
- ✅ API tokens for frontend-backend communication
- ✅ Environment variables for secrets

**Audit Steps:**
```bash
# Check for exposed admin routes
curl https://aicitel.com/admin

# Verify API tokens are required
curl https://aicitel.com/api/applications
```

**Checklist:**
- [ ] Verify admin panel requires authentication
- [ ] Test API endpoints without auth tokens
- [ ] Check file upload permissions
- [ ] Verify rate limiting is active

---

### 2. Cryptographic Failures

**Risks:**
- Sensitive data exposure
- Weak encryption
- Insecure data storage

**Current Protection:**
- ✅ HTTPS enforced (Vercel automatic)
- ✅ Secure headers configured
- ✅ Environment variables not in code

**Checklist:**
- [ ] Verify HTTPS is enforced
- [ ] Check for hardcoded secrets (`git grep -i "password\|secret\|key"`)
- [ ] Verify sensitive data is encrypted at rest (database)
- [ ] Check TLS/SSL certificate validity

---

### 3. Injection

**Risks:**
- SQL injection
- NoSQL injection
- Command injection

**Current Protection:**
- ✅ Strapi ORM (prevents SQL injection)
- ✅ Input validation with Zod
- ✅ No direct database queries in frontend

**Audit Steps:**
```bash
# Test SQL injection in forms
email: admin'--
name: 1' OR '1'='1

# Test NoSQL injection
email: {"$gt": ""}
```

**Checklist:**
- [ ] Test all form inputs for injection
- [ ] Verify Zod validation is active
- [ ] Check file upload validation
- [ ] Review any raw database queries

---

### 4. Insecure Design

**Risks:**
- Missing security controls
- Inadequate threat modeling
- Business logic flaws

**Current Protection:**
- ✅ Rate limiting on forms
- ✅ Bot protection (Turnstile)
- ✅ Input validation

**Checklist:**
- [ ] Review rate limiting effectiveness
- [ ] Test bot protection bypass attempts
- [ ] Verify business logic (e.g., can't submit unlimited applications)
- [ ] Check for race conditions

---

### 5. Security Misconfiguration

**Risks:**
- Default credentials
- Unnecessary services enabled
- Verbose error messages

**Current Protection:**
- ✅ Custom Strapi configuration
- ✅ Security headers set
- ✅ Telemetry disabled

**Checklist:**
- [ ] Verify no default credentials (admin/admin)
- [ ] Check error messages don't leak info
- [ ] Review CORS configuration
- [ ] Verify unnecessary endpoints are disabled

---

### 6. Vulnerable Components

**Risks:**
- Using components with known vulnerabilities
- Outdated dependencies

**Current Protection:**
- ⚠️ Regular dependency updates needed

**Audit Steps:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for outdated packages
npm outdated
```

**Checklist:**
- [ ] Run `npm audit` on frontend
- [ ] Run `npm audit` on backend
- [ ] Update critical vulnerabilities
- [ ] Review dependency licenses

---

### 7. Authentication Failures

**Risks:**
- Weak passwords
- Credential stuffing
- Session hijacking

**Current Protection:**
- ✅ Strapi handles admin authentication
- ✅ No user authentication on frontend (public forms only)

**Checklist:**
- [ ] Verify Strapi admin uses strong passwords
- [ ] Check session timeout configuration
- [ ] Verify JWT secrets are strong
- [ ] Test password reset flow

---

### 8. Software and Data Integrity Failures

**Risks:**
- Insecure CI/CD
- Untrusted updates
- Insecure deserialization

**Current Protection:**
- ✅ GitHub Actions for CI/CD
- ✅ Environment variables in secure storage
- ✅ No deserialization of untrusted data

**Checklist:**
- [ ] Verify CI/CD secrets are secure
- [ ] Check npm package integrity
- [ ] Review deployment process
- [ ] Verify no eval() or similar functions

---

### 9. Security Logging Failures

**Risks:**
- Insufficient logging
- No monitoring
- Missing audit trail

**Current Protection:**
- ✅ Winston logger configured
- ✅ Sentry error monitoring
- ⚠️ Audit logging needed

**Checklist:**
- [ ] Verify all errors are logged
- [ ] Check Sentry is receiving errors
- [ ] Review log retention policy
- [ ] Implement audit logging for admin actions

---

### 10. Server-Side Request Forgery (SSRF)

**Risks:**
- Accessing internal services
- Port scanning
- Data exfiltration

**Current Protection:**
- ✅ No server-side requests based on user input
- ✅ Strapi configuration restricts external requests

**Checklist:**
- [ ] Review any URL parameters
- [ ] Check file upload processing
- [ ] Verify webhook configurations
- [ ] Test with internal IPs (127.0.0.1, 192.168.x.x)

---

## Security Headers Audit

### Current Headers

Check `/frontend/next.config.ts`:

```typescript
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
  key: 'X- Content-Type-Options',
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
```

### Recommended Additional Headers

```typescript
{
  key: 'Content-Security-Policy',
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
},
{
  key: 'X-XSS-Protection',
  value: '1; mode=block'
}
```

### Test Security Headers

```bash
# Using securityheaders.com
curl -I https://aicitel.com | grep -i "x-\|content-security\|strict-transport"

# Or use online tool
# https://securityheaders.com/?q=https://aicitel.com
```

---

## API Security

### Rate Limiting

**Current Implementation:**
- Upstash Redis for rate limiting
- 10 requests per 1 minute for `/api/apply`
- 10 requests per 1 minute for `/api/inquiry`

**Test Rate Limiting:**
```bash
# Send multiple rapid requests
for i in {1..15}; do
  curl -X POST https://aicitel.com/api/inquiry \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com", ...}'
done

# Should return 429 after 10 requests
```

**Checklist:**
- [ ] Test rate limiting on all API routes
- [ ] Verify 429 status code is returned
- [ ] Check rate limit headers are present
- [ ] Test with different IP addresses

### Input Validation

**Zod Schemas:**
- Email validation
- Phone number format
- String length limits
- File type validation

**Test Invalid Input:**
```bash
# Very long string
email: "a".repeat(10000) + "@example.com"

# Invalid email
email: "not-an-email"

# XSS attempt
name: "<script>alert('XSS')</script>"

# SQL injection
email: "test@example.com'; DROP TABLE users; --"
```

**Checklist:**
- [ ] Test all Zod schemas with invalid data
- [ ] Verify proper error messages
- [ ] Check XSS prevention
- [ ] Test file upload size limits

---

## File Upload Security

### Current Protection

- File size limit: 5MB
- Allowed types: PDF, DOC, DOCX
- Validation on both client and server

### Security Tests

**Malicious Files:**
```bash
# Test executable upload
# Rename .exe to .pdf
mv malware.exe malware.pdf

# Test PHP file upload
echo "<?php system($_GET['cmd']); ?>" > shell.pdf

# Test double extension
upload: resume.pdf.exe
```

**Large Files:**
```bash
# Test file size limit
dd if=/dev/zero of=large.pdf bs=1M count=10  # 10MB file
```

**Checklist:**
- [ ] Verify file type validation
- [ ] Test file size limits
- [ ] Check for path traversal (../../etc/passwd)
- [ ] Verify files are scanned (if antivirus configured)
- [ ] Test MIME type spoofing

---

## Database Security

### PostgreSQL Security

**Connection Security:**
```bash
# Verify SSL is enabled
DATABASE_SSL=true

# Check connection string doesn't contain password
echo $DATABASE_URL  # Should use environment variable
```

**Access Control:**
```sql
-- Verify least privilege
SHOW ROLE aicitel_user;

-- Check permissions
\dp applications
\dp inquiries
```

**Checklist:**
- [ ] SSL/TLS enabled for database connections
- [ ] Strong database passwords
- [ ] Least privilege principle applied
- [ ] Regular backups configured
- [ ] Database firewall configured

---

## Third-Party Service Security

### HubSpot

**Security:**
- Private App access token (not public API key)
- Token stored in environment variable
- Minimum required scopes

**Checklist:**
- [ ] Verify token is private (starts with `pat-`)
- [ ] Check only required scopes are granted
- [ ] Rotate token every 6-12 months
- [ ] Monitor API usage

### Cloudflare Turnstile

**Security:**
- Site key is public (safe)
- Secret key is private (server-side only)

**Checklist:**
- [ ] Verify secret key not in client code
- [ ] Test bypassing Turnstile (should fail)
- [ ] Check Turnstile verification is server-side

### Sentry

**Security:**
- DSN is semi-public (ok to expose)
- Filters sensitive data before sending

**Checklist:**
- [ ] Verify PII is filtered
- [ ] Check auth headers removed
- [ ] Review sample rate (not 100%)
- [ ] Verify error grouping works

---

## Penetration Testing

### Automated Scanning

**OWASP ZAP:**
```bash
# Docker version
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://aicitel.com

# Full scan (takes longer)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://aicitel.com
```

**Nikto:**
```bash
nikto -h https://aicitel.com
```

**SSL Labs:**
- Go to https://www.ssllabs.com/ssltest/
- Enter: `aicitel.com`
- Aim for A+ rating

### Manual Testing

**XSS (Cross-Site Scripting):**
```javascript
// Test in all input fields
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
```

**CSRF (Cross-Site Request Forgery):**
- Verify CSRF tokens on forms
- Check SameSite cookie attribute

**Clickjacking:**
- Verify X-Frame-Options header
- Test if site can be embedded in iframe

---

## Security Monitoring

### Set Up Alerts

**Critical Alerts:**
- Multiple failed login attempts
- Unusual API usage patterns
- Rate limit violations
- Database connection errors

**Sentry Alerts:**
- Configure in Sentry dashboard
- Set up Slack/email notifications
- Define alert rules

### Log Monitoring

**What to Log:**
- Authentication attempts
- API requests and responses
- File uploads
- Admin actions
- Errors and exceptions

**What NOT to Log:**
- Passwords (plain or hashed)
- API keys/tokens
- Credit card numbers
- PII unless necessary

---

## Compliance & Privacy

### GDPR Compliance

**Checklist:**
- [ ] Privacy policy published
- [ ] Cookie consent implemented (if using cookies)
- [ ] Data processing documented
- [ ] Right to deletion process
- [ ] Data breach notification plan

### Data Minimization

**Current Data Collection:**
- Email, name, phone (necessary)
- CV file (necessary for applications)
- Company info (necessary for inquiries)

**Checklist:**
- [ ] Only collect necessary data
- [ ] Document data retention policy
- [ ] Implement data deletion procedures
- [ ] Anonymize logs

---

## Remediation Tracking

### Severity Levels

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | 24 hours | RCE, SQL injection, data breach |
| High | 3 days | XSS, authentication bypass |
| Medium | 7 days | Missing headers, weak config |
| Low | 30 days | Info disclosure, outdated libraries |

### Issue Template

```markdown
## Security Issue: [Title]

**Severity:** Critical/High/Medium/Low
**Component:** Frontend/Backend/Infrastructure
**Discovered:** YYYY-MM-DD
**Status:** Open/In Progress/Resolved

### Description
[Describe the vulnerability]

### Impact
[What could an attacker do?]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Remediation
[How to fix]

### Verification
[How to verify the fix]
```

---

## Security Best Practices

### Development

- [ ] Use environment variables for secrets
- [ ] Never commit `.env` files
- [ ] Enable 2FA on all accounts
- [ ] Use SSH keys for Git
- [ ] Review code before merging
- [ ] Keep dependencies updated

### Deployment

- [ ] Use separate staging/production environments
- [ ] Rotate secrets regularly
- [ ] Limit production access
- [ ] Enable audit logging
- [ ] Monitor for anomalies

### Maintenance

- [ ] Run security audits quarterly
- [ ] Update dependencies monthly
- [ ] Review access permissions quarterly
- [ ] Test backups and recovery
- [ ] Review logs regularly

---

## Useful Security Tools

- **OWASP ZAP** - Automated vulnerability scanner
- **Burp Suite** - Web application security testing
- **npm audit** - Dependency vulnerability scanner
- **Snyk** - Continuous security monitoring
- **Security Headers** - Header checking tool
- **SSL Labs** - SSL/TLS configuration test
- **SecurityHeaders.com** - Security header analyzer

---

## Next Steps

1. Run initial security scan (OWASP ZAP)
2. Fix critical vulnerabilities
3. Implement missing security headers
4. Set up security monitoring
5. Schedule regular audits
6. Create incident response plan

---

Last Updated: 2026-02-17  
Next Audit: 2026-05-17
