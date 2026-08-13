# Vercel Deployment with Upstash Redis

## Overview

This application uses a dual-backend storage architecture:
- **Local Development**: JSON files in `data/` directory (via `JSONAdapter`)
- **Production (Vercel)**: Upstash Redis (via `@upstash/redis` package)

Storage adapter automatically detects environment and switches backends.

## Prerequisites

- Vercel account with project created
- GitHub repository connected to Vercel
- `vercel.json` configuration committed

## Step 1: Add Upstash Redis Integration

1. Go to **Vercel Dashboard** → Your Project
2. Click **Storage** tab
3. Click **Create Database** → **Upstash Redis**
4. Follow Vercel's marketplace workflow (or create new Upstash account)
5. Confirm integration

**Result**: Vercel automatically adds to Project Settings:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

These are available to all Environments (Production, Preview, Development).

## Step 2: Set Other Required Environment Variables

Go to **Project Settings** → **Environment Variables** and add:

### Production Environment

```
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
JWT_SECRET=<generate-different-secret>
JWT_EXPIRES_IN=7d
```

### Optional (for email functionality)

```
RESEND_API_KEY=<from-resend.com>
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=<your-smtp-host>
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<your-password>
```

### Auto-Set by Vercel Marketplace (do NOT configure manually)

```
# These are automatically set when you add Upstash Redis integration
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=AbCdEfGhIjKlMnOpQrStUv...
```

## Storage Architecture

### Implementation File: [lib/storage/adapter.ts](../lib/storage/adapter.ts)

```typescript
export function getStorageAdapter(): StorageAdapter {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    // Production: Use Upstash Redis
    return new UpstashRedisAdapter()
  }
  // Development: Use JSON files
  return new JSONAdapter()
}
```

### UpstashRedisAdapter Details

- **Package**: `@upstash/redis` (v1.38.2)
- **Reason**: Non-deprecated replacement for deprecated `@vercel/kv`
- **API**: REST-based (optimal for Vercel serverless functions)
- **Features**:
  - Lazy-loads client on first use
  - Caches client instance for performance
  - JSON serialization for all values
  - Error logging with graceful degradation

## Verification Steps

### Local Testing (Before Deployment)

```bash
# Typecheck
pnpm typecheck --incremental false
# ✓ Should pass with no errors

# Lint
pnpm lint
# ✓ Should pass (only pre-existing warnings acceptable)

# Build
pnpm build
# ✓ Should complete successfully

# Local API test
curl http://localhost:3000/api/health
# ✓ Should return 200
```

### Post-Deployment Verification

1. **Check Vercel Deployment Status**
   - Go to Vercel Dashboard → Deployments
   - Ensure latest deployment shows "Ready"

2. **Test Health Endpoint**
   ```bash
   curl https://your-vercel-domain.vercel.app/api/health
   # ✓ Should return 200 and { status: "ok" }
   ```

3. **Test Registration (Data Persistence)**
   ```bash
   curl -X POST https://your-vercel-domain.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123!",
       "name": "Test User"
     }'
   # ✓ Should return 201 + JWT token
   ```

4. **Test Login (Verify Data Persisted)**
   ```bash
   curl -X POST https://your-vercel-domain.vercel.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "TestPass123!"
     }'
   # ✓ Should return 200 + JWT token
   ```

5. **Test Dashboard API (Role-Based Access)**
   ```bash
   curl -H "Authorization: Bearer <your-jwt-token>" \
     https://your-vercel-domain.vercel.app/api/users
   # ✓ Should return list of users
   ```

## Deployment Workflow

```
1. Make changes locally
   ↓
2. Run: pnpm typecheck && pnpm lint && pnpm build
   ↓
3. Commit to feature branch: git commit -m "..."
   ↓
4. Push to GitHub: git push origin feature-branch
   ↓
5. Vercel auto-detects push
   ↓
6. Vercel builds and deploys (check Deployments tab)
   ↓
7. Verify endpoints are working
   ↓
8. Create PR and merge to main (optional)
```

## Troubleshooting

### "Upstash Redis not configured" error

**Cause**: Environment variables not set in Vercel
**Solution**:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` exist
3. If missing, re-add Upstash Redis integration from Marketplace

### Build fails with "Cannot find module '@upstash/redis'"

**Cause**: Package not installed
**Solution**:
```bash
pnpm install @upstash/redis@1.38.2
pnpm install
```

### Data persists locally but not on Vercel

**Cause**: Vercel environment variables not properly set
**Solution**:
1. Verify `UPSTASH_REDIS_REST_URL` is set in **Production** environment (not just Preview)
2. Redeploy: Go to Vercel Deployments → Latest → Redeploy
3. Test again

### TypeScript errors with Upstash types

**Cause**: Type mismatch with `@upstash/redis`
**Solution**:
```bash
pnpm install -D @types/node
pnpm typecheck
```

## Configuration Files

- [vercel.json](../vercel.json) - Build config
- [lib/storage/adapter.ts](../lib/storage/adapter.ts) - Storage implementation
- [.env.example](../.env.example) - Local development variables
- [.env.production.example](../.env.production.example) - Production variables template

## Related Documentation

- [Storage Architecture](./storage-architecture.md)
- [Upstash Documentation](https://upstash.com/docs)
- [Vercel Redis Integration](https://vercel.com/docs/storage/redis)
- [@upstash/redis Package](https://github.com/upstash/upstash-redis)

## Summary

| Component | Local Dev | Production |
|-----------|-----------|------------|
| Storage Backend | JSON files (`data/`) | Upstash Redis |
| Package | File system (`fs`) | @upstash/redis |
| Environment Check | None (defaults to JSON) | `UPSTASH_REDIS_REST_URL` present |
| Persistence | Per-machine | Global + survives redeployment |
| Serverless-Compatible | N/A | ✓ Yes |
