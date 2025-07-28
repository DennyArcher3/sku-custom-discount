# Shopify App Development & Production Workflow Guide (2025)

## Overview
This guide establishes best practices for separating development and production environments for Shopify apps deployed on Cloudflare Workers.

## Current Architecture Issues
1. Single environment causing production disruption during development
2. No backup/recovery strategy from Cloudflare
3. `shopify app dev` command conflicts with production deployment
4. Hitting Cloudflare deployment limits

## Recommended Architecture

### 1. Environment Separation Strategy

#### Option A: Branch-Based Deployment (Recommended)
```
├── main branch → Production (Cloudflare Workers)
├── develop branch → Staging (Cloudflare Workers)
└── feature/* branches → Local development only
```

#### Option B: Separate Apps (More Complex)
```
├── my-app-production → Production Cloudflare account
├── my-app-staging → Separate Cloudflare account
└── my-app-dev → Local development
```

### 2. Implementation Steps

#### Step 1: Create Environment Configuration
```bash
# Create environment-specific config files
touch .env.production
touch .env.development
touch .env.local
```

#### Step 2: Update wrangler.toml for Multiple Environments
```toml
name = "sku-custom-discount"
compatibility_date = "2025-07-25"

[env.production]
name = "sku-custom-discount-production"
vars = { ENVIRONMENT = "production" }
routes = [
  { pattern = "sku-custom-discount-production.eromage3.workers.dev/*", zone_name = "" }
]

[env.staging]
name = "sku-custom-discount-staging"
vars = { ENVIRONMENT = "staging" }
routes = [
  { pattern = "sku-custom-discount-staging.eromage3.workers.dev/*", zone_name = "" }
]

[[d1_databases]]
binding = "DB"
database_name = "sku-discount-db"
database_id = "your-production-db-id"

[[env.staging.d1_databases]]
binding = "DB"
database_name = "sku-discount-db-staging"
database_id = "your-staging-db-id"
```

#### Step 3: Create Deployment Scripts
```json
// package.json
{
  "scripts": {
    // Development
    "dev": "shopify app dev",
    "dev:cloudflare": "wrangler dev --env development",
    
    // Deployment
    "deploy:staging": "npm run build && wrangler deploy --env staging",
    "deploy:production": "npm run build && wrangler deploy --env production",
    
    // Database migrations
    "migrate:staging": "wrangler d1 migrations apply sku-discount-db-staging --env staging",
    "migrate:production": "wrangler d1 migrations apply sku-discount-db --env production"
  }
}
```

### 3. Development Workflow

#### Local Development
```bash
# For Shopify CLI development (uses ngrok)
npm run dev

# For Cloudflare Workers local development
npm run dev:cloudflare
```

#### Staging Deployment
```bash
# Deploy to staging environment
npm run deploy:staging

# Test on staging URL
# https://sku-custom-discount-staging.eromage3.workers.dev
```

#### Production Deployment
```bash
# Only after staging is tested
npm run deploy:production
```

### 4. Shopify App Configuration

#### Create Two Shopify Apps
1. **Development App**: For local development and testing
   - URL: Your ngrok URL from `shopify app dev`
   - Test on development stores only
   
2. **Production App**: For live merchants
   - URL: https://sku-custom-discount-production.eromage3.workers.dev
   - Listed on App Store

#### shopify.app.toml Configuration
```toml
# shopify.app.development.toml
client_id = "dev-client-id"
name = "SKU Discount (Dev)"
application_url = "https://your-ngrok-url.ngrok.io"
embedded = true

# shopify.app.production.toml  
client_id = "prod-client-id"
name = "SKU Discount"
application_url = "https://sku-custom-discount-production.eromage3.workers.dev"
embedded = true
```

### 5. Git Workflow

#### Branching Strategy
```bash
# Create develop branch
git checkout -b develop

# Create feature branches from develop
git checkout -b feature/new-feature

# Merge to develop first
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

### 6. Backup & Recovery

#### Code Backup
```bash
# Push all branches to GitHub
git push origin main
git push origin develop

# Tag releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

#### Database Backup
```bash
# Export D1 database
wrangler d1 export sku-discount-db --output backup.sql --env production

# Schedule regular backups
# Create a GitHub Action or scheduled worker
```

### 7. Environment Variables Management

#### Using Cloudflare Secrets
```bash
# Set production secrets
wrangler secret put SHOPIFY_API_SECRET --env production

# Set staging secrets  
wrangler secret put SHOPIFY_API_SECRET --env staging
```

### 8. Monitoring & Limits

#### Cloudflare Workers Limits (Free Plan)
- 100,000 requests/day
- 1,000 requests/min
- 10ms CPU time per request

#### Monitoring Setup
```javascript
// Add to your worker
export default {
  async fetch(request, env, ctx) {
    const start = Date.now();
    
    try {
      // Your app logic
      const response = await handleRequest(request, env);
      
      // Log metrics
      ctx.waitUntil(
        logMetrics(env, {
          duration: Date.now() - start,
          status: response.status,
          environment: env.ENVIRONMENT
        })
      );
      
      return response;
    } catch (error) {
      // Error handling
    }
  }
};
```

### 9. Quick Commands Reference

```bash
# Development
shopify app dev                    # Local Shopify development
npm run dev:cloudflare             # Local Cloudflare development

# Deployment
npm run deploy:staging             # Deploy to staging
npm run deploy:production          # Deploy to production

# Database
wrangler d1 execute sku-discount-db --sql "SELECT * FROM settings" --env production
wrangler d1 backup create sku-discount-db --env production

# Logs
wrangler tail --env production     # Production logs
wrangler tail --env staging        # Staging logs
```

### 10. Migration from Current Setup

1. **Create staging environment first**
   ```bash
   wrangler deploy --env staging
   ```

2. **Test thoroughly on staging**

3. **Update production only when ready**
   ```bash
   git tag -a pre-migration-backup -m "Backup before env separation"
   npm run deploy:production
   ```

### 11. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main
      - develop

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/develop'
        run: npm run deploy:staging
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 12. Emergency Recovery

If you lose your local codebase:
1. Clone from GitHub: `git clone <your-repo>`
2. Restore environment variables from Cloudflare dashboard
3. Export D1 database: `wrangler d1 export`
4. Restore to new environment if needed

### Summary

This workflow provides:
- ✅ Separate development and production environments
- ✅ Protection against breaking production
- ✅ Backup and recovery options
- ✅ Clear deployment process
- ✅ Monitoring and limits awareness
- ✅ CI/CD automation option

Start by implementing the staging environment first, then gradually migrate to this workflow to avoid disruption.