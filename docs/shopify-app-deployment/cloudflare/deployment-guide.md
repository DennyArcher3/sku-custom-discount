# Shopify Remix App Deployment Guide for Cloudflare Workers

## Overview

This guide walks you through deploying your SKU Custom Discount Shopify app to Cloudflare Workers with D1 database and Workers KV for session storage.

## Prerequisites

1. **Cloudflare Account**
   - Sign up at https://cloudflare.com
   - Get your Account ID from the dashboard

2. **Wrangler CLI**
   ```bash
   npm install -g wrangler@latest
   wrangler login
   ```

3. **API Token**
   - Create at https://dash.cloudflare.com/profile/api-tokens
   - Required permissions:
     - Workers Scripts: Edit
     - Workers KV Storage: Edit
     - D1: Edit

## Step 1: Install Dependencies

```bash
# Install Cloudflare-specific packages
npm install @remix-run/cloudflare @cloudflare/workers-types wrangler@latest
npm install @shopify/shopify-app-session-storage-kv
npm install drizzle-orm drizzle-kit @cloudflare/d1
```

## Step 2: Create Cloudflare Configuration

### 2.1 Create `wrangler.toml`

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
binding = "SESSIONS_KV"
id = "your-kv-namespace-id"

[[d1_databases]]
binding = "DB"
database_name = "sku-discount-db"
database_id = "your-d1-database-id"

[vars]
NODE_ENV = "production"
SCOPES = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"

# Sensitive vars go in .dev.vars for local dev
```

### 2.2 Create `.dev.vars` for local development

```env
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret
SHOPIFY_APP_URL=https://your-app.workers.dev
```

## Step 3: Create Cloudflare Resources

```bash
# Create D1 Database
wrangler d1 create sku-discount-db

# Create KV Namespace for sessions
wrangler kv:namespace create "SESSIONS_KV"

# Note the IDs returned and update wrangler.toml
```

## Step 4: Modify Code for Cloudflare

### 4.1 Create `server.ts`

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

### 4.2 Update `vite.config.ts`

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

### 4.3 Create `load-context.ts`

```typescript
import { AppLoadContext } from "@remix-run/cloudflare";

export interface Env {
  SESSIONS_KV: KVNamespace;
  DB: D1Database;
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_APP_URL: string;
  SCOPES: string;
}

export function getLoadContext(env: Env): AppLoadContext {
  return {
    env,
  };
}
```

### 4.4 Update `app/shopify.server.ts`

```typescript
import "@shopify/shopify-app-remix/server/adapters/cloudflare";
import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { KVSessionStorage } from "@shopify/shopify-app-session-storage-kv";
import { restResources } from "@shopify/shopify-api/rest/admin/2025-01";

export function createShopifyApp(env: Env) {
  const shopify = shopifyApp({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecret: env.SHOPIFY_API_SECRET,
    appUrl: env.SHOPIFY_APP_URL,
    scopes: env.SCOPES?.split(","),
    sessionStorage: new KVSessionStorage(env.SESSIONS_KV),
    distribution: "PUBLIC",
    restResources,
    webhooks: {
      APP_UNINSTALLED: {
        deliveryMethod: "HTTP",
        callbackUrl: "/webhooks/app/uninstalled",
      },
      CUSTOMERS_DATA_REQUEST: {
        deliveryMethod: "HTTP",
        callbackUrl: "/webhooks/customers/data_request",
      },
      CUSTOMERS_REDACT: {
        deliveryMethod: "HTTP",
        callbackUrl: "/webhooks/customers/redact",
      },
      SHOP_REDACT: {
        deliveryMethod: "HTTP",
        callbackUrl: "/webhooks/shop/redact",
      },
    },
    future: {
      unstable_newEmbeddedAuthStrategy: true,
    },
  });

  return shopify;
}
```

### 4.5 Update Route Loaders

Update all route files to use context-based Shopify instance:

```typescript
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context;
  const shopify = createShopifyApp(env);
  const { admin } = await shopify.authenticate.admin(request);
  
  // Your loader logic here
};
```

## Step 5: Database Migration

### 5.1 Create Drizzle Schema

```typescript
// app/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  shop: text("shop").notNull(),
  state: text("state").notNull(),
  isOnline: integer("isOnline", { mode: "boolean" }).notNull(),
  scope: text("scope"),
  expires: text("expires"),
  accessToken: text("accessToken"),
  userId: text("userId"),
});
```

### 5.2 Generate Migrations

```bash
# Generate migration files
npx drizzle-kit generate:sqlite

# Apply migrations to local D1
wrangler d1 execute sku-discount-db --local --file=./drizzle/0000_init.sql

# Apply to production D1
wrangler d1 execute sku-discount-db --file=./drizzle/0000_init.sql
```

### 5.3 Create Database Client

```typescript
// app/db.server.ts
import { drizzle } from "drizzle-orm/d1";
import type { AppLoadContext } from "@remix-run/cloudflare";

export function getDb(context: AppLoadContext) {
  return drizzle(context.env.DB);
}
```

## Step 6: Update Build Process

### 6.1 Update `package.json` scripts

```json
{
  "scripts": {
    "build": "remix build",
    "dev": "wrangler pages dev --compatibility-date=2025-01-01 -- npm run dev:remix",
    "dev:remix": "remix dev",
    "deploy": "npm run build && wrangler deploy",
    "deploy:production": "npm run build && wrangler deploy --env production"
  }
}
```

### 6.2 Update `.gitignore`

```
.dev.vars
.wrangler/
```

## Step 7: Deploy to Cloudflare

### 7.1 Initial Deployment

```bash
# Build the application
npm run build

# Deploy to Cloudflare Workers
wrangler deploy

# Your app will be available at:
# https://sku-custom-discount.your-subdomain.workers.dev
```

### 7.2 Set Production Secrets

```bash
# Set production secrets
wrangler secret put SHOPIFY_API_KEY
wrangler secret put SHOPIFY_API_SECRET
```

### 7.3 Update Shopify App URLs

1. Go to your Shopify Partner Dashboard
2. Update your app URLs:
   - App URL: `https://sku-custom-discount.your-subdomain.workers.dev`
   - Redirect URLs: 
     - `https://sku-custom-discount.your-subdomain.workers.dev/auth/callback`
     - `https://sku-custom-discount.your-subdomain.workers.dev/auth/shopify/callback`

## Step 8: Custom Domain (Optional)

```bash
# Add custom domain
wrangler domains add your-app.com

# Update DNS records as instructed
```

## Step 9: Monitoring & Debugging

### 9.1 View Logs

```bash
# Tail production logs
wrangler tail

# View specific deployment logs
wrangler deployment tail
```

### 9.2 Analytics

Access analytics at: https://dash.cloudflare.com/workers-and-pages

### 9.3 Debug Locally

```bash
# Run with Cloudflare environment locally
npm run dev
```

## Common Issues & Solutions

### Issue: Environment Variables Not Available
**Solution**: Use context.env instead of process.env

### Issue: Database Connection Errors
**Solution**: Ensure D1 database ID is correct in wrangler.toml

### Issue: Session Storage Not Working
**Solution**: Verify KV namespace is bound correctly

### Issue: Webhook Failures
**Solution**: Check webhook URLs include full domain

## Performance Optimization

1. **Enable Smart Placement**
   ```toml
   [placement]
   mode = "smart"
   ```

2. **Add Caching Headers**
   ```typescript
   return new Response(html, {
     headers: {
       "Cache-Control": "public, max-age=3600",
     },
   });
   ```

3. **Use Durable Objects for State**
   - For real-time features
   - Shopping cart persistence

## Next Steps

1. ✅ Test all functionality on production URL
2. ✅ Set up monitoring alerts
3. ✅ Configure custom domain
4. ✅ Submit app for Shopify review

## Rollback Process

```bash
# List deployments
wrangler deployments list

# Rollback to previous version
wrangler rollback [deployment-id]
```

## Support Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Remix on Cloudflare](https://remix.run/docs/en/main/guides/cloudflare)
- [Shopify App Development](https://shopify.dev/docs/apps)

---

*Note: This guide assumes you're migrating from the standard Remix setup. Some code modifications may be needed based on your specific implementation.*