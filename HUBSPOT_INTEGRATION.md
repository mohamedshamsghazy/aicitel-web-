# HubSpot Integration Guide

## Overview

The Aicitel application is now fully integrated with HubSpot CRM for automatic contact management. When forms are submitted (applications or inquiries), contacts are automatically created or updated in your HubSpot account.

---

## Features

✅ **Automatic Contact Creation**
- Creates contacts in HubSpot when forms are submitted
- Updates existing contacts if email already exists
- No duplicate contacts

✅ **Smart Data Mapping**
- Email → `email`
- First Name → `firstname`
- Last Name → `lastname`
- Phone → `phone`
- Company → `company`
- Website → `website`
- Lifecycle Stage → `lifecyclestage`
- Lead Source → `hs_lead_source`

✅ **Graceful Failure**
- Forms continue to work even if HubSpot is down
- Data is always saved to Strapi (your database)
- CRM failures are logged but don't block users

✅ **Search Before Create**
- Searches for existing contacts by email
- Updates existing contacts instead of creating duplicates
- Merges new information with existing data

---

## Setup Instructions

### Step 1: Create a Private App in HubSpot

1. **Log in to HubSpot**
   - Go to https://app.hubspot.com

2. **Navigate to Private Apps**
   - Settings (gear icon) → Integrations → Private Apps
   - Click "Create private app"

3. **Configure App Details**
   - **Name**: "Aicitel Web Integration"
   - **Description**: "Contact management from Aicitel website forms"
   - **Logo**: (optional) Upload your company logo

4. **Set Scopes (Permissions)**
   
   Go to the "Scopes" tab and enable these permissions:

   **CRM Scopes:**
   - ✅ `crm.objects.contacts.read` - View contacts
   - ✅ `crm.objects.contacts.write` - Create and update contacts

   **Optional (for advanced features):**
   - `crm.schemas.contacts.read` - Read contact properties
   - `crm.schemas.contacts.write` - Create custom properties

5. **Create App**
   - Click "Create app"
   - Review and accept the permissions dialog

6. **Copy Access Token**
   - After creation, you'll see an "Access token" (starts with `pat-`)
   - **IMPORTANT**: Copy this immediately - it won't be shown again!
   - Example: `pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Step 2: Get Your Portal ID

1. **Navigate to Account Settings**
   - Settings → Account Setup → Account Defaults

2. **Copy Hub ID**
   - Look for "Hub ID" or "Account ID"
   - It's a numeric value (e.g., `12345678`)

### Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# HubSpot CRM Integration
HUBSPOT_API_KEY=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_PORTAL_ID=12345678
```

**For Production (Vercel):**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add both variables
3. Redeploy your application

### Step 4: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Submit a test form**:
   - Go to `/en/career` or `/en/contact`
   - Fill out and submit the form

3. **Check HubSpot**:
   - Go to Contacts in HubSpot
   - Verify the contact was created
   - Check that all fields are populated correctly

4. **Check logs**:
   ```
   CRM: Creating/updating contact test@example.com in HubSpot...
   CRM: Successfully created new contact test@example.com (ID: 12345)
   ```

---

## How It Works

### Contact Creation Flow

```
User submits form
       ↓
Rate limiting check
       ↓
Input validation
       ↓
Turnstile verification
       ↓
───────────────────────────────
CRM Integration (Parallel)    │
  ↓                            │
Search for contact by email   │
  ↓                            │
If exists → Update             │
If not → Create new            │
  ↓                            │
Log result (success/failure)   │
───────────────────────────────
       ↓
Save to Strapi (always succeeds)
       ↓
Return success to user
```

**Key Point**: CRM integration happens in parallel and failures won't block form submission.

### Contact Update Logic

When a contact with the same email already exists:

1. **HubSpot searches** for existing contact
2. **Merges data**: Updates only provided fields
3. **Preserves existing data**: Other fields remain unchanged
4. **Logs the update**: Records which contact was updated

Example:
- Existing contact: `{ email, firstname, phone }`
- New submission: `{ email, company }`
- Result: `{ email, firstname, phone, company }` (merged)

---

## Data Mapping

### From Application Form (`/api/apply`)

| Form Field | HubSpot Property | Notes |
|------------|------------------|-------|
| Email | `email` | Primary identifier |
| Full Name | `firstname`, `lastname` | Split on first space |
| Phone | `phone` | As submitted |
| Position Applied | `hs_lead_source` | Stored as lead source |
| - | `lifecyclestage` | Set to "lead" |

### From Inquiry Form (`/api/inquiry`)

| Form Field | HubSpot Property | Notes |
|------------|------------------|-------|
| Email | `email` | Primary identifier |
| Contact Person | `firstname`, `lastname` | Split on first space |
| Phone | `phone` | As submitted |
| Company Name | `company` | As submitted |
| Inquiry Type | Custom property | Can be configured |
| - | `lifecyclestage` | Set to "lead" |

---

## Custom Properties (Optional)

If you want to track additional data, create custom properties in HubSpot:

### Create Custom Property

1. **Go to Properties**
   - Settings → Data Management → Properties

2. **Create Contact Property**
   - Click "Create property"
   - Choose "Contact" object

3. **Configure Property**
   - **Internal name**: `inquiry_type`
   - **Label**: "Inquiry Type"
   - **Type**: Dropdown select
   - **Options**: Partnership, Sales, Support, General

4. **Update Code**
   
   In `frontend/lib/crm.ts`, add:
   ```typescript
   if (data.inquiryType) properties.inquiry_type = data.inquiryType;
   ```

---

## Monitoring & Troubleshooting

### Check Integration Status

**Logs to watch for:**

✅ **Success:**
```
CRM: HubSpot integration initialized
CRM: Successfully created new contact john@example.com (ID: 12345)
```

⚠️ **Not Configured:**
```
CRM: HubSpot API Key not configured. CRM integration disabled.
```

❌ **Error:**
```
CRM: HubSpot API error
```

### Common Issues

#### 1. "HubSpot API Key not configured"

**Cause**: Environment variable not set

**Solution**:
```bash
# Verify environment variable is set
echo $HUBSPOT_API_KEY

# If empty, add to .env.local
HUBSPOT_API_KEY=your_key_here

# Restart server
npm run dev
```

#### 2. "401 Unauthorized"

**Cause**: Invalid or expired access token

**Solutions**:
- Verify the token is correct (starts with `pat-`)
- Check if the Private App is still active in HubSpot
- Regenerate the access token if needed

#### 3. "403 Forbidden"

**Cause**: Missing required scopes

**Solutions**:
- Go to Private App settings in HubSpot
- Verify `crm.objects.contacts.read` and `crm.objects.contacts.write` are enabled
- Save changes and wait a few minutes for propagation

#### 4. "Contact creation failed but form submitted"

**This is expected behavior!** 

- Forms always save to Strapi first
- CRM failures don't block users
- Check logs to see specific HubSpot error
- Contacts can be manually added to HubSpot later

---

## Managing Contacts in HubSpot

### View Contacts

1. Go to HubSpot → Contacts
2. Use filters to find website submissions
3. Look for `hs_lead_source` to identify source

### Export Contacts

1. Contacts → Export
2. Choose format (CSV, Excel)
3. Select properties to export

### Create Lists

**Application Submissions:**
- Filter: `hs_lead_source` contains "Application"

**Inquiries:**
- Filter: `hs_lead_source` contains "Inquiry"

### Workflows (Optional)

Create automated workflows:

1. **New Contact Alert**
   - Trigger: Contact created
   - Filter: `hs_lead_source` is known
   - Action: Send email notification to sales team

2. **Follow-up Task**
   - Trigger: Contact created
   - Action: Create task to follow up
   - Assign to: appropriate team member

---

## Security Best Practices

### Protect Your Access Token

- ✅ Store in environment variables
- ✅ Never commit to version control
- ✅ Use different tokens for dev/staging/production
- ✅ Rotate tokens periodically (every 6-12 months)
- ❌ Don't share tokens via email or Slack
- ❌ Don't log tokens in application logs

### Minimum Permissions

Only grant scopes you actually need:
- Required: `crm.objects.contacts.read`, `crm.objects.contacts.write`
- Avoid: "Full access" or admin scopes

### Monitor Access

- Regularly review private apps in HubSpot
- Check access logs for unusual activity
- Disable unused private apps

---

## Disabling HubSpot Integration

If you need to temporarily disable HubSpot:

1. **Remove the API key** from environment variables
2. **Restart the application**
3. Forms will continue to work (data saved to Strapi only)

To re-enable, simply add the API key back.

---

## Alternative: Using OAuth (Advanced)

For multi-user scenarios or marketplace apps, consider OAuth instead of Private Apps:

- **Private Apps** (current): Server-to-server, single token
- **OAuth**: User-based authentication, refresh tokens

See [HubSpot OAuth documentation](https://developers.hubspot.com/docs/api/oauth-quickstart-guide) for details.

---

## Rate Limits

HubSpot has API rate limits:

- **Free/Starter**: 100 requests per 10 seconds
- **Professional**: 120 requests per 10 seconds
- **Enterprise**: 150 requests per 10 seconds

Our integration makes 1-2 requests per form submission, so limits shouldn't be an issue for typical traffic.

---

## Support Resources

- [HubSpot Developer Docs](https://developers.hubspot.com/docs/api/overview)
- [Private Apps Guide](https://developers.hubspot.com/docs/api/private-apps)
- [Contacts API Reference](https://developers.hubspot.com/docs/api/crm/contacts)
- [HubSpot Community](https://community.hubspot.com/)

---

## Summary

✅ **Setup**: 5-10 minutes  
✅ **Complexity**: Low (just 2 environment variables)  
✅ **Maintenance**: Minimal (token rotation every 6-12 months)  
✅ **Cost**: Free (included with all HubSpot plans)  
✅ **Reliability**: High (graceful failure, doesn't block users)  

The integration is production-ready and battle-tested. Forms will work perfectly even without HubSpot configured, giving you flexibility in your deployment.
