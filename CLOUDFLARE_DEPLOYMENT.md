# Cloudflare Pages Deployment Guide

This guide explains how to deploy the Posso Ajudar application to Cloudflare Pages.

## Prerequisites

- Cloudflare account (free or paid)
- GitHub repository connected to Cloudflare
- Node.js and pnpm installed locally

## Deployment Steps

### 1. Connect Repository to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** > **Create a project**
3. Select **Connect to Git**
4. Authorize GitHub and select the repository
5. Choose the branch to deploy (e.g., `main` or `spark-forge`)

### 2. Configure Build Settings

When prompted, configure the following:

- **Framework**: None (we're using custom Vite config)
- **Build command**: `npm run build:client`
- **Build output directory**: `dist/spa`
- **Environment variables**: (optional) Add any needed env vars

**Important**: Cloudflare will use `pnpm` by default if `pnpm-lock.yaml` is detected. This is correct for this project.

### 3. Deployment Configuration Files

The following files are already configured for Cloudflare Pages:

#### `wrangler.toml`
- Contains build and deployment configuration
- Specifies output directory as `dist/spa`
- Defines compatibility settings for Node.js runtime features

#### `public/_redirects`
- Ensures all routes redirect to `index.html` for SPA routing
- Cloudflare Pages automatically processes this file

#### `public/_headers`
- Sets security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Configures caching policies:
  - `index.html`: No caching (always fresh)
  - Assets in `/assets/`: 1-year cache with immutable flag

### 4. Environment Variables

If your app needs environment variables at runtime:

1. In Cloudflare Dashboard, navigate to **Pages** > **Your Project** > **Settings** > **Environment Variables**
2. Add variables for both **Production** and **Preview** environments
3. For this SPA, variables are typically not needed (app uses localStorage)

### 5. Build Optimization

The app is optimized for Cloudflare Pages:

- **Code Splitting**: Vendor and UI libraries are separated for better caching
- **Asset Hashing**: All assets include content hashes for cache busting
- **Minification**: JavaScript is minified with Terser
- **Source Maps**: Disabled in production for smaller bundle size

### 6. First Deployment

Once configured in Cloudflare Dashboard:

1. **Automatic**: Cloudflare automatically deploys on every push to the connected branch
2. **Preview Deployments**: Each PR gets a preview deployment URL
3. **Production**: Main branch (or configured branch) deploys to the production URL

### 7. Custom Domain

To use a custom domain:

1. In **Pages** > **Your Project** > **Custom domains**
2. Add your domain and follow DNS configuration instructions
3. If domain is already on Cloudflare, it auto-configures

## Build Process

### Local Build

To test the build locally before pushing:

```bash
npm run build:client
```

Output will be in `dist/spa/`. You can serve this locally to test:

```bash
npx http-server dist/spa
```

### Production Build

Cloudflare automatically runs `npm run build:client` on every push.

Build logs are visible in the Cloudflare Dashboard under **Deployments**.

## Features & Configuration

### SPA Routing

The `_redirects` file ensures client-side routing works correctly:
- All non-asset routes return `index.html`
- React Router handles navigation in the browser
- No server-side routing needed

### Security Headers

The `_headers` file provides:
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Protects against XSS attacks
- **Referrer-Policy**: Controls referrer information

### Caching Strategy

- **HTML (`index.html`)**: No-cache (always fetches latest)
- **Assets (`/assets/*`)**: 1-year max-age with immutable flag

This ensures users get updates immediately while leveraging long-term caching for static assets.

## Troubleshooting

### Build Failures

1. Check build logs in Cloudflare Dashboard
2. Verify `npm run build:client` works locally
3. Check that all required dependencies are in `package.json`
4. Ensure Node version compatibility (currently using Node 22 target)

### White Screen / 404 Errors

- Verify `_redirects` file is in `public/` directory
- Ensure `dist/spa` contains `index.html`
- Check that React Router paths match your defined routes

### Environment Variables Not Found

- Ensure variables are set in Cloudflare Dashboard (not in `.env` file)
- Variables must be set in the appropriate environment (Production/Preview)
- Rebuild deployment after adding variables

## Monitoring & Analytics

Cloudflare Pages provides:

- **Page Views**: Traffic analytics
- **Build Times**: Track build performance
- **Request Logs**: Real-time request monitoring (Enterprise)

Access these in **Pages** > **Your Project** > **Analytics**.

## Local Development

For local development, use:

```bash
npm run dev
```

This starts the Vite dev server with hot reload and Express middleware for API testing.

## Rollback & Previews

Each deployment creates a snapshot:

1. **Production URL**: Latest deployment of main branch
2. **Preview URLs**: Available for each deployment
3. **Rollback**: Click any previous deployment in history to rollback instantly

## Questions?

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
