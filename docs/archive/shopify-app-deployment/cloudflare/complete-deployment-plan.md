# Complete Cloudflare Deployment Plan for SKU Custom Discount App

## Current State Analysis

### What You Have ✅
- Wrangler CLI installed
- Shopify Remix app with Prisma + SQLite
- Discount function extension (Rust/WASM)
- Admin UI extension (React)
- GDPR webhooks implemented
- Working app on local development

### What You Need 🔧

## 1. Required NPM Packages

```bash
# Core Cloudflare packages
npm install --save @remix-run/cloudflare @cloudflare/workers-types

# Session storage adapter
npm install --save @shopify/shopify-app-session-storage-kv

# Database ORM (Choose ONE):
# Option A: Drizzle (Recommended for D1)
npm install --save drizzle-orm @cloudflare/d1
npm install --save-dev drizzle-kit

# Option B: Keep Prisma (External PostgreSQL)
npm install --save @prisma/adapter-d1
```

## 2. Cloudflare Resources to Create

### Using Wrangler CLI:
```bash
# 1. Create D1 Database
wrangler d1 create sku-discount-db

# 2. Create KV Namespace for Sessions
wrangler kv:namespace create "SESSIONS"

# 3. Create KV Namespace for App Data (Optional)
wrangler kv:namespace create "APP_DATA"
```

**Save the IDs returned!** You'll need them for configuration.

## 3. Code Modifications Required

### 3.1 Create `wrangler.toml`
```toml
name = "sku-custom-discount"
main = "build/server.js"
compatibility_date = "2025-01-01"

[build]
command = "npm run build"

[build.upload]
format = "modules"
main = "./build/server.js"

[[kv_namespaces]]
binding = "SESSIONS"
id = "YOUR_KV_NAMESPACE_ID"

[[d1_databases]]
binding = "DB"
database_name = "sku-discount-db"
database_id = "YOUR_D1_DATABASE_ID"

[vars]
NODE_ENV = "production"
SCOPES = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"
```

### 3.2 Create `.dev.vars` (for local dev)
```env
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret
SHOPIFY_APP_URL=https://your-app.workers.dev
```

### 3.3 Update `vite.config.ts`
```typescript
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      serverAdapter: "cloudflare",
      serverModuleFormat: "esm",
    }),
  ],
  ssr: {
    target: "webworker",
    noExternal: true,
  },
});
```

### 3.4 Create `server.ts`
```typescript
import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./build";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const handler = createRequestHandler(build, env);
    return handler(request, env, ctx);
  },
};
```

### 3.5 Update `app/shopify.server.ts`
```typescript
import "@shopify/shopify-app-remix/server/adapters/cloudflare";
import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { KVSessionStorage } from "@shopify/shopify-app-session-storage-kv";

// Change from direct export to function
export function createShopifyApp(env: Env) {
  return shopifyApp({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecret: env.SHOPIFY_API_SECRET,
    appUrl: env.SHOPIFY_APP_URL,
    scopes: env.SCOPES?.split(","),
    sessionStorage: new KVSessionStorage(env.SESSIONS),
    // ... rest of config
  });
}
```

### 3.6 Update ALL Route Files
Every route needs to get env from context:
```typescript
export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context;
  const shopify = createShopifyApp(env);
  const { admin } = await shopify.authenticate.admin(request);
  // ... rest of loader
};
```

## 4. Database Migration Strategy

### Option A: Switch to D1 + Drizzle (Recommended)
1. Create Drizzle schema matching your Prisma schema
2. Generate migrations: `npx drizzle-kit generate:sqlite`
3. Apply to D1: `wrangler d1 execute sku-discount-db --file=migrations/0001_init.sql`

### Option B: Use External PostgreSQL
1. Set up PostgreSQL on Neon/Supabase
2. Keep Prisma but update connection strings
3. More complex but keeps current ORM

## 5. Environment Variables

### Required for Production:
```
SHOPIFY_API_KEY        # From Partner Dashboard
SHOPIFY_API_SECRET     # From Partner Dashboard  
SHOPIFY_APP_URL        # https://sku-custom-discount.workers.dev
DATABASE_URL           # If using external DB
```

### Set via Wrangler:
```bash
wrangler secret put SHOPIFY_API_KEY
wrangler secret put SHOPIFY_API_SECRET
```

## 6. Deployment Steps

### Step 1: Prepare Code
```bash
# Install packages
npm install @remix-run/cloudflare @cloudflare/workers-types @shopify/shopify-app-session-storage-kv

# Create Cloudflare resources
wrangler d1 create sku-discount-db
wrangler kv:namespace create "SESSIONS"
```

### Step 2: Update Configuration
1. Create `wrangler.toml` with your IDs
2. Create `.dev.vars` with secrets
3. Update `vite.config.ts`
4. Create `server.ts`
5. Update `shopify.server.ts`
6. Update all route files

### Step 3: Test Locally
```bash
# Run with Wrangler
npm run dev:wrangler
# or
wrangler pages dev --compatibility-date=2025-01-01 -- npm run dev:remix
```

### Step 4: Deploy
```bash
# Build
npm run build

# Deploy
wrangler deploy

# You'll get: https://sku-custom-discount.YOUR-SUBDOMAIN.workers.dev
```

### Step 5: Update Shopify
1. Go to Partner Dashboard
2. Update all URLs to your Workers URL
3. Update webhooks
4. Test installation

## 7. What Will Break & How to Fix

### Common Issues:
1. **process.env doesn't work**
   - Use `context.env` instead

2. **Database queries fail**
   - Switch from Prisma to Drizzle
   - Or use external PostgreSQL

3. **File system operations**
   - No file system in Workers
   - Use KV or R2 for storage

4. **Node.js APIs missing**
   - Some Node APIs unavailable
   - Use Web APIs instead

## 8. Testing Checklist

- [ ] Local development works with Wrangler
- [ ] Can create KV namespace
- [ ] Can create D1 database
- [ ] Sessions persist in KV
- [ ] Database queries work
- [ ] Webhooks respond correctly
- [ ] Discount function deploys
- [ ] UI extension works
- [ ] OAuth flow completes
- [ ] App installs on test store

## 9. Performance Benefits

After deployment:
- Response time: ~80ms (vs 1500ms on other platforms)
- Global deployment: 300+ locations
- Auto-scaling: Handles any traffic
- Cost: $0-5/month vs $20+

## 10. Missing Pieces?

The main challenges:
1. **Database Migration** - Biggest change
2. **Environment Variables** - Different handling
3. **Route Updates** - Every file needs context

But with Wrangler CLI, you have everything needed!

## Next Action: Choose Your Database Strategy

**Decision Needed**: 
- Option A: D1 + Drizzle (simpler, all Cloudflare)
- Option B: External PostgreSQL + Prisma (keep current ORM)

Once you decide, I can provide specific migration code!