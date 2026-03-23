# API Troubleshooting Guide

## Error: "Failed to fetch from API, using localStorage"

If you see this error during development:
```
Failed to fetch from API, using localStorage: SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON
```

### What This Means

The application tried to connect to the Cloudflare Worker API but couldn't find it. The server returned HTML (an error page) instead of JSON, which caused a parsing error.

### Root Causes

1. **Cloudflare Worker is not deployed**
2. **Wrong API URL** in environment variables
3. **Network connectivity issue**
4. **Browser is trying to access API on localhost but Worker is on Cloudflare**

---

## ✅ Solution: Deploy the Cloudflare Worker

### Step 1: Install Wrangler
```powershell
npm install -g wrangler
```

### Step 2: Authenticate
```powershell
wrangler login
# Follow the browser prompt
```

### Step 3: Create D1 Database
```powershell
wrangler d1 create posso-ajudar-db
# Copy the DATABASE_ID from output
```

### Step 4: Update wrangler.toml
Edit `wrangler.toml` and add your DATABASE_ID:
```toml
[[d1_databases]]
binding = "DB"
database_name = "posso-ajudar-db"
database_id = "your-id-from-step-3"
```

### Step 5: Initialize Database Schema
```powershell
wrangler d1 execute posso-ajudar-db --file=./schema.sql
```

Output should show successful schema creation.

### Step 6: Deploy Worker
```powershell
npm run build
wrangler deploy
```

Output will show:
```
✓ Uploaded posso-ajudar (X.XX KiB)
▲ [Worker] https://posso-ajudar.<random>.workers.dev
```

### Step 7: Deploy Frontend to Pages
```powershell
wrangler pages deploy dist/spa
```

Output will show your Pages URL:
```
✓ Uploading... (XX files)
▲ Deployment complete! Take a look over here:
▲ https://posso-ajudar.pages.dev
```

---

## 🔍 Verify Deployment

### Test Worker is Running
```powershell
curl https://posso-ajudar.<random>.workers.dev/api/products
```

Should return:
```json
[]
```
(Empty array if no products yet)

### Test with Error
```powershell
curl https://posso-ajudar.<random>.workers.dev/api/products123
```

Should return 404 with proper error JSON, NOT HTML.

---

## 📋 Common Issues During Development

### Issue: Still getting HTML errors after deployment

**Solution 1: Check Worker URL**
```powershell
# List deployed workers
wrangler deployments list

# Check worker subdomain is correct in logs
```

**Solution 2: Update API URL if using different domain**

If your Worker is on `https://posso-ajudar-api.example.workers.dev` but Pages is on `posso-ajudar.pages.dev`, you need to set:

```powershell
# Set environment variable for frontend
$env:REACT_APP_API_URL = "https://posso-ajudar-api.example.workers.dev/api"
```

**Solution 3: Clear browser cache**
```powershell
# In browser DevTools:
# 1. Open Application tab
# 2. Clear localStorage
# 3. Clear cookies
# 4. Refresh page
```

### Issue: "API endpoint not available (404)"

This means the Worker is deployed but the endpoint path is wrong.

**Check:**
- Worker is properly deployed: `wrangler deploy`
- Routes in `src/index.ts` are correct
- Endpoint path matches (e.g., `/api/products` not `/products`)

```powershell
# Test specific endpoint
curl https://posso-ajudar.<random>.workers.dev/api/users

# Should return empty array or error JSON, not HTML
```

### Issue: "API returned non-JSON response"

The Worker is responding but with wrong content-type header.

**Check:**
- Worker responses have correct headers:
  ```typescript
  headers: { 'Content-Type': 'application/json' }
  ```
- No HTML is being returned for success cases

### Issue: CORS errors in browser console

If you see CORS errors in the browser developer console:

**Solution:**
Add CORS headers to Worker responses in `src/index.ts`:

```typescript
const response = new Response(JSON.stringify(data), {
  status: 200,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  },
});
```

---

## 🛠️ Development vs Production

### During Development (localhost)

The app will:
1. Try to connect to Worker API at `/api`
2. If Worker is not running, fall back to localStorage
3. Display warning in console but continue working
4. Data persists in localStorage only

### After Deployment (Cloudflare)

The app will:
1. Connect to deployed Worker API
2. All data persists in D1 database
3. Changes sync across devices/sessions
4. No localStorage fallback needed

---

## 🧪 Testing the Full Stack

### Scenario 1: Add a Product

1. Go to "Cadastrar Produtos" page
2. Fill in product name and price
3. Click "Cadastrar Produto"

**Expected:**
- Success message appears
- Product appears in list
- Product is stored in D1 database

**If error occurs:**
- Check Worker is deployed: `wrangler deployments list`
- Check database has schema: `wrangler d1 execute posso-ajudar-db --command "SELECT COUNT(*) FROM products"`
- Check Worker logs: `wrangler tail`

### Scenario 2: Login

1. Go to login page
2. Enter matrícula and 11-digit password
3. Click "Entrar"

**Expected:**
- Login succeeds
- Redirect to dashboard
- User data loaded from D1

**If error occurs:**
- Check user exists in database: `wrangler d1 execute posso-ajudar-db --command "SELECT * FROM users"`
- Check password validation: 11 digits, matches CPF
- Check Worker logs: `wrangler tail --format json`

---

## 🔧 Database Inspection

### Check Database Status
```powershell
wrangler d1 info posso-ajudar-db
```

### View Table Structure
```powershell
wrangler d1 execute posso-ajudar-db --command "SELECT sql FROM sqlite_master WHERE type='table'"
```

### Check Data
```powershell
# Get all users
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM users LIMIT 10"

# Get all products
wrangler d1 execute posso-ajudar-db --command "SELECT * FROM products"

# Count records
wrangler d1 execute posso-ajudar-db --command "SELECT COUNT(*) as count FROM products"
```

### Reset Database
```powershell
# Delete all data from a table
wrangler d1 execute posso-ajudar-db --command "DELETE FROM products"

# Or recreate all tables
wrangler d1 execute posso-ajudar-db --file=./schema.sql
```

---

## 📱 Environment Variables

### For Development
No special setup needed. API falls back to localStorage.

### For Production
If your Worker is on a different domain:

```toml
# wrangler.toml
[env.production]
vars = { REACT_APP_API_URL = "https://your-worker-url.workers.dev/api" }
```

Or set at build time:
```powershell
$env:REACT_APP_API_URL = "https://your-worker-url.workers.dev/api"
npm run build
```

---

## 🆘 Getting More Help

### Check Worker Logs in Real-time
```powershell
wrangler tail

# Or with JSON format for structured logs
wrangler tail --format json
```

### Enable Debug Logging

Edit `client/hooks/useAppData.ts` and change:
```typescript
const isProduction = process.env.NODE_ENV === 'production';
// Change to:
const isProduction = false; // Force debug logging
```

### Check Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Make an API request (e.g., login)
4. Check:
   - Request URL: Should be `/api/users/login`
   - Response: Should be valid JSON
   - Status: Should be 200 or 401 (not 404)
   - Content-Type: Should be `application/json`

### Check Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Select your domain
3. Go to Workers & Pages → Deployments
4. Check latest deployment
5. Click on deployment to see build logs

---

## ✨ After Everything Works

Once the Worker is deployed and working:

1. **Data persistence** is automatic via D1
2. **Offline mode** still works with localStorage cache
3. **Scalability** is handled by Cloudflare infrastructure
4. **No local database** needed

Enjoy using Posso Ajudar on Cloudflare! 🚀

---

**Last Updated:** February 2026
