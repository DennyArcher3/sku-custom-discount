# Proper Development/Production Setup for Shopify App on Cloudflare Workers

## Current Issues
1. Single production deployment getting hit with every change
2. Using production resources during development
3. No staging environment
4. `shopify app dev` conflicts with Cloudflare deployment

## Solution: Cloudflare Workers Environments

Based on official Cloudflare documentation, you should use **Wrangler Environments** - not separate apps.

### 1. Update wrangler.toml for Multiple Environments

```toml
# Default configuration (shared by all environments)
name = "sku-custom-discount"
main = "server.ts"
compatibility_date = "2025-07-27"
compatibility_flags = ["nodejs_compat"]
assets = { directory = "./build/client" }

# Development environment
[env.development]
name = "sku-custom-discount-dev"
vars = { 
  ENVIRONMENT = "development",
  NODE_ENV = "development",
  SCOPES = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects",
  SHOPIFY_API_KEY = "3122acfb32ed2de15a381bde53864f1f",
  SHOPIFY_APP_URL = "https://sku-custom-discount-dev.eromage3.workers.dev",
  SHOPIFY_DISCOUNT_FUNCTION_ID = "fe78075e-5113-4962-a155-4a63009f85c7"
}

[[env.development.kv_namespaces]]
binding = "SESSIONS"
id = "create-new-dev-kv-id" # You'll create this

[[env.development.d1_databases]]
binding = "DB"
database_name = "sku-discount-db-dev"
database_id = "create-new-dev-db-id" # You'll create this

# Staging environment
[env.staging]
name = "sku-custom-discount-staging"
vars = { 
  ENVIRONMENT = "staging",
  NODE_ENV = "production",
  SCOPES = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects",
  SHOPIFY_API_KEY = "3122acfb32ed2de15a381bde53864f1f",
  SHOPIFY_APP_URL = "https://sku-custom-discount-staging.eromage3.workers.dev",
  SHOPIFY_DISCOUNT_FUNCTION_ID = "fe78075e-5113-4962-a155-4a63009f85c7"
}

[[env.staging.kv_namespaces]]
binding = "SESSIONS"
id = "create-new-staging-kv-id" # You'll create this

[[env.staging.d1_databases]]
binding = "DB"
database_name = "sku-discount-db-staging"
database_id = "create-new-staging-db-id" # You'll create this

# Production environment
[env.production]
name = "sku-custom-discount-production"
vars = { 
  ENVIRONMENT = "production",
  NODE_ENV = "production",
  SCOPES = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects",
  SHOPIFY_API_KEY = "3122acfb32ed2de15a381bde53864f1f",
  SHOPIFY_APP_URL = "https://sku-custom-discount-production.eromage3.workers.dev",
  SHOPIFY_DISCOUNT_FUNCTION_ID = "fe78075e-5113-4962-a155-4a63009f85c7"
}

[[env.production.kv_namespaces]]
binding = "SESSIONS"
id = "8b252d829fc1454182e2c6814bdcae2e"

[[env.production.d1_databases]]
binding = "DB"
database_name = "sku-discount-db"
database_id = "0ce2dfcb-1c94-4ee8-b630-8349cc9a54b3"

# Observability for all environments
[observability]
enabled = true

[observability.logs]
enabled = true
invocation_logs = true
```

### 2. Create Resources for Each Environment

```bash
# Create development D1 database
wrangler d1 create sku-discount-db-dev
# Copy the database_id to wrangler.toml

# Create development KV namespace
wrangler kv:namespace create SESSIONS --env development
# Copy the id to wrangler.toml

# Create staging D1 database
wrangler d1 create sku-discount-db-staging
# Copy the database_id to wrangler.toml

# Create staging KV namespace
wrangler kv:namespace create SESSIONS --env staging
# Copy the id to wrangler.toml
```

### 3. Set Secrets for Each Environment

```bash
# Development secrets
wrangler secret put SHOPIFY_API_SECRET --env development

# Staging secrets
wrangler secret put SHOPIFY_API_SECRET --env staging

# Production secrets (already set)
wrangler secret put SHOPIFY_API_SECRET --env production
```

### 4. Create Environment-Specific Files

Create `.dev.vars` for local development:
```
SHOPIFY_API_SECRET=your-dev-secret
```

Create `.dev.vars.staging`:
```
SHOPIFY_API_SECRET=your-staging-secret
```

### 5. Update package.json Scripts

```json
{
  "scripts": {
    // Local development
    "dev": "shopify app dev",
    "dev:worker": "wrangler dev --env development",
    
    // Building
    "build": "npm run build:remix && npm run build:cf",
    "build:remix": "remix build",
    "build:cf": "node cloudflare-build.js",
    
    // Deployment
    "deploy:dev": "npm run build && wrangler deploy --env development",
    "deploy:staging": "npm run build && wrangler deploy --env staging",
    "deploy:production": "npm run build && wrangler deploy --env production",
    
    // Database migrations
    "migrate:dev": "wrangler d1 migrations apply sku-discount-db-dev --env development",
    "migrate:staging": "wrangler d1 migrations apply sku-discount-db-staging --env staging",
    "migrate:production": "wrangler d1 migrations apply sku-discount-db --env production",
    
    // Logs
    "logs:dev": "wrangler tail --env development",
    "logs:staging": "wrangler tail --env staging",
    "logs:production": "wrangler tail --env production"
  }
}
```

### 6. Shopify App Configuration

Create separate Shopify app configurations:

**shopify.app.development.toml**:
```toml
name = "SKU Discount (Dev)"
client_id = "dev-client-id-from-partners"
application_url = "https://sku-custom-discount-dev.eromage3.workers.dev"
embedded = true

[access_scopes]
scopes = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"

[auth]
redirect_urls = [
  "https://sku-custom-discount-dev.eromage3.workers.dev/auth/callback"
]

[webhooks]
api_version = "2025-07"
```

**shopify.app.staging.toml**:
```toml
name = "SKU Discount (Staging)"
client_id = "3122acfb32ed2de15a381bde53864f1f"
application_url = "https://sku-custom-discount-staging.eromage3.workers.dev"
embedded = true

[access_scopes]
scopes = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"

[auth]
redirect_urls = [
  "https://sku-custom-discount-staging.eromage3.workers.dev/auth/callback"
]

[webhooks]
api_version = "2025-07"
```

**shopify.app.production.toml** (rename current shopify.app.toml):
```toml
name = "SKU Discount"
client_id = "3122acfb32ed2de15a381bde53864f1f"
application_url = "https://sku-custom-discount-production.eromage3.workers.dev"
embedded = true

[access_scopes]
scopes = "read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"

[auth]
redirect_urls = [
  "https://sku-custom-discount-production.eromage3.workers.dev/auth/callback"
]

[webhooks]
api_version = "2025-07"
```

### 7. Development Workflow

#### For Local Development:
```bash
# Use Shopify CLI with ngrok
shopify app dev

# Or test Cloudflare Workers locally
npm run dev:worker
```

#### For Staging Deployment:
```bash
# Deploy to staging
npm run deploy:staging

# Check logs
npm run logs:staging

# Test at: https://sku-custom-discount-staging.eromage3.workers.dev
```

#### For Production Deployment:
```bash
# Only after testing on staging
npm run deploy:production
```

### 8. Git Workflow

```bash
# Create branches
git checkout -b develop
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "Add new feature"

# Deploy to development
npm run deploy:dev

# Merge to develop
git checkout develop
git merge feature/new-feature

# Deploy to staging
npm run deploy:staging

# After testing, merge to main
git checkout main
git merge develop

# Deploy to production
npm run deploy:production
```

### 9. Benefits of This Setup

1. **Separate Resources**: Each environment has its own database and KV namespace
2. **No Conflicts**: Development doesn't affect production
3. **Easy Testing**: Test on staging before production
4. **Cost Effective**: All under one Cloudflare account
5. **Simple Management**: Use wrangler commands with --env flag

### 10. Cloudflare Limits (Free Plan)

- 100,000 requests/day
- 100 deployments/day (across all environments)
- 10ms CPU time per request

To avoid hitting limits:
- Use staging for all testing
- Deploy to production only 1-2 times per day
- Use `wrangler dev` for local testing

### 11. Recovery Strategy

Always maintain backups:
```bash
# Backup production database
wrangler d1 export sku-discount-db --output=backup-$(date +%Y%m%d).sql --env production

# Push to GitHub
git add .
git commit -m "Backup: $(date)"
git push origin main
```

This setup follows Cloudflare's official best practices and ensures you never break production while developing!