# Cloudflare D1 Database & Worker Deployment Guide

This guide explains how to manually deploy the Posso Ajudar application to Cloudflare Pages with D1 database integration.

## Architecture Overview

The application consists of:
- **Frontend**: React SPA deployed to Cloudflare Pages
- **Backend API**: Cloudflare Worker handling all database operations
- **Database**: Cloudflare D1 (serverless SQL database)

All data is persisted in D1 instead of localStorage.

---

## Prerequisites

### Required Tools
1. **PowerShell 7+** or command prompt
2. **Node.js 18+** and npm/pnpm
3. **Wrangler CLI** (Cloudflare's command-line tool)

### Cloudflare Account Setup
1. Create a free Cloudflare account at https://dash.cloudflare.com
2. Note your **Account ID** (visible in the sidebar or via API)
3. Create an **API Token** with permissions for:
   - Workers Scripts (edit)
   - D1 Database (read & write)
   - Pages (edit)

---

## Step 1: Install Dependencies

```powershell
# Install Node dependencies
npm install

# Install Wrangler CLI globally (if not already installed)
npm install -g wrangler
```

---

## Step 2: Configure Cloudflare Authentication

```powershell
# Authenticate with Cloudflare
wrangler login

# This will open a browser window to authorize access
# Copy the API token and paste it when prompted
```

Alternatively, set environment variables:
```powershell
$env:CLOUDFLARE_API_TOKEN = "your-api-token"
```

---

## Step 3: Create D1 Database

```powershell
# Create a new D1 database
wrangler d1 create posso-ajudar-db

# The output will show your DATABASE_ID - save this!
# Example output:
# ✨ Successfully created DB 'posso-ajudar-db'
# Created your database using D1. 
# Database name: posso-ajudar-db
# ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

---

## Step 4: Update Configuration Files

### Update `wrangler.toml`

Add your database IDs to the `wrangler.toml` file:

```toml
[[d1_databases]]
binding = "DB"
database_name = "posso-ajudar-db"
database_id = "your-database-id-here"  # Replace with your ID from Step 3
```

For production environment:
```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "posso-ajudar-db-prod"
database_id = "your-production-database-id"
```

---

## Step 5: Initialize Database Schema

Initialize the D1 database with the required schema:

```powershell
# Set environment variables for the initialization script
$env:CLOUDFLARE_API_TOKEN = "your-api-token"
$env:ACCOUNT_ID = "your-account-id"
$env:DATABASE_ID = "your-database-id"

# Run the initialization script
npm run db:init

# Or use wrangler directly to execute schema
wrangler d1 execute posso-ajudar-db --file=./schema.sql
```

Expected output:
```
✅ Database initialization completed successfully!
```

---

## Step 6: Build the Application

```powershell
# Build both client and worker
npm run build

# Or build separately:
npm run build:client
npm run build:worker
```

This creates:
- `dist/spa/` - Frontend files for Cloudflare Pages
- Worker bundle for API routes

---

## Step 7: Deploy Worker API

```powershell
# Deploy the Cloudflare Worker
wrangler deploy

# Verify deployment
wrangler deployments list
```

The Worker will be available at: `https://posso-ajudar.<your-subdomain>.workers.dev`

---

## Step 8: Deploy Frontend to Pages

### Option A: Deploy via Wrangler (Recommended)

```powershell
# Deploy Pages project
wrangler pages deploy dist/spa

# If this is your first deployment, you'll be prompted to create a new Pages project
```

### Option B: Manual Deployment via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Select your domain → Pages
3. Create a new project → Connect to Git (or upload manually)
4. Set build command: `npm run build:client`
5. Set output directory: `dist/spa`
6. Deploy

---

## Step 9: Configure Environment Variables

### For Worker
Set environment variables in `wrangler.toml` or via the Cloudflare Dashboard:

```toml
[env.production]
vars = { ENVIRONMENT = "production" }
```

### For Frontend
The frontend automatically detects the API endpoint. If your Worker is on a different domain, set:

```javascript
// In client/hooks/useAppData.ts
const API_BASE_URL = 'https://posso-ajudar.example.workers.dev/api';
```

---

## Step 10: Configure CORS & Security Headers

The `public/_headers` file already includes recommended security headers. Verify it's deployed:

```
# public/_headers
/
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: no-cache
```

---

## Verification Checklist

After deployment, verify everything works:

```powershell
# 1. Check Worker is running
curl https://posso-ajudar.<your-subdomain>.workers.dev/api/products

# 2. Check Database is initialized
wrangler d1 execute posso-ajudar-db --command "SELECT COUNT(*) FROM products"

# 3. Check Pages deployment
curl https://posso-ajudar.pages.dev

# 4. Test login endpoint
curl -X POST https://posso-ajudar.<your-subdomain>.workers.dev/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"matricula":"test","senha":"12345678901"}'
```

---

## Monitoring & Debugging

### View Worker Logs
```powershell
wrangler tail

# Or view specific Worker
wrangler tail --format json
```

### Check D1 Database Status
```powershell
# List all databases
wrangler d1 list

# Execute query
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM users LIMIT 5"

# Get database info
wrangler d1 info posso-ajudar-db
```

### View Page Deployment Logs
```powershell
# List deployments
wrangler pages deployments list

# View deployment details
wrangler pages deployments list --project-name=posso-ajudar
```

---

## Database Backup & Export

### Export Data as JSON
```powershell
# Export users
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM users" > users.json

# Export all tables
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM products" > products.json
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM sales" > sales.json
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM donations" > donations.json
```

### Create Database Backup
```powershell
# Cloudflare D1 automatically backs up your database daily
# Backups are retained for 7 days
# To restore, contact Cloudflare Support or use API
```

---

## Troubleshooting

### Issue: Database not found after deployment

**Solution:**
```powershell
# Verify database exists
wrangler d1 list

# If missing, recreate it
wrangler d1 create posso-ajudar-db

# Re-run initialization
wrangler d1 execute posso-ajudar-db --file=./schema.sql
```

### Issue: CORS errors when calling API

**Solution:**
Add CORS headers to Worker responses in `src/index.ts`:
```typescript
headers: {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
```

### Issue: Files not found on Pages

**Solution:**
```powershell
# Check if build output directory is correct
ls dist/spa

# Ensure _redirects file exists
cat public/_redirects

# Redeploy pages
wrangler pages deploy dist/spa --project-name=posso-ajudar
```

### Issue: Default products not created

**Solution:**
```powershell
# Manually insert default products
wrangler d1 execute posso-ajudar-db --command @"
INSERT INTO products (id, nome, preco, imagem, createdAt, updatedAt)
VALUES
  ('1', 'Água (500ml)', 2.0, NULL, datetime('now'), datetime('now')),
  ('2', 'Café', 1.5, NULL, datetime('now'), datetime('now')),
  ('3', 'Suco', 3.0, NULL, datetime('now'), datetime('now')),
  ('4', 'Bracelete Hospital', 5.0, NULL, datetime('now'), datetime('now'));
"@
```

---

## Performance Optimization

### Database Query Optimization

The application includes several optimizations:
- Indexed columns on frequently queried fields (userId, data, matricula, cpf)
- Prepared statements to prevent SQL injection
- Pagination support for large datasets

### Add Cloudflare Cache

To cache API responses, update `wrangler.toml`:

```toml
[build]
command = "npm run build:client"
routes = [
  { pattern = "*/api/*", zone_name = "" }
]

# Cache configuration
[[routes]]
pattern = "*.example.com/api/products"
zone_name = "example.com"
cache_default_ttl = 3600
```

---

## Scaling & Limits

### Cloudflare D1 Limits
- **Max database size**: 10 GB
- **Max concurrent connections**: 100
- **Read operations**: Unlimited
- **Write operations**: Unlimited
- **Backup retention**: 7 days

### Cloudflare Workers Limits
- **CPU time**: 50ms (Bundled plan) or 30s (Paid plan)
- **Memory**: 128 MB
- **Execution timeout**: 30 seconds max

For higher limits, upgrade to a paid Cloudflare Workers plan.

---

## Security Best Practices

1. **Never commit secrets** to version control
2. **Use API tokens** instead of full account credentials
3. **Enable 2FA** on your Cloudflare account
4. **Restrict API token permissions** to minimum required
5. **Use HTTPS** exclusively (enforced by Cloudflare)
6. **Validate & sanitize** all user inputs
7. **Use prepared statements** to prevent SQL injection

---

## Rollback & Recovery

### Rollback to Previous Deployment

```powershell
# View deployment history
wrangler deployments list

# Rollback Worker
wrangler rollback

# Rollback Pages
wrangler pages deployments list --project-name=posso-ajudar
# Then manually select and rollback via dashboard
```

### Restore Database from Backup

```powershell
# Cloudflare D1 keeps 7-day backups
# Contact Cloudflare Support to restore
# Or manually re-initialize with schema.sql
```

---

## Maintenance

### Regular Tasks

- **Weekly**: Monitor Worker error logs
- **Monthly**: Review database size and optimize if needed
- **Quarterly**: Update dependencies and security patches
- **Yearly**: Review access logs and rotate API tokens

### Update Application

```powershell
# Pull latest code
git pull

# Install dependencies
npm install

# Rebuild
npm run build

# Redeploy
wrangler deploy
wrangler pages deploy dist/spa
```

---

## Support & Resources

- **Cloudflare Docs**: https://developers.cloudflare.com
- **D1 Documentation**: https://developers.cloudflare.com/d1
- **Workers Documentation**: https://developers.cloudflare.com/workers
- **Pages Documentation**: https://developers.cloudflare.com/pages
- **Wrangler CLI**: https://developers.cloudflare.com/workers/cli-wrangler/install-update/

---

## Next Steps

1. ✅ Deploy to Cloudflare Pages & Workers
2. ✅ Initialize D1 database
3. ✅ Test all endpoints
4. ✅ Monitor logs and performance
5. ✅ Configure custom domain (optional)
6. ✅ Set up Analytics
7. ✅ Enable DDoS protection

---

**Last Updated**: February 2026
**Version**: 1.0
