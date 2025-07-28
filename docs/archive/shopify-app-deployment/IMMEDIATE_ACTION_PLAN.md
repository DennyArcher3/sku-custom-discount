# Immediate Action Plan for Development/Production Separation

## Your Current Situation
- Production app deployed to Cloudflare Workers
- `shopify app dev` breaks production deployment
- Hitting Cloudflare deployment limits
- No backup strategy

## Quick Fix (Do This Today)

### 1. Create Staging Environment (15 minutes)

#### Update wrangler.toml:
```toml
# Add this section to your existing wrangler.toml
[env.staging]
name = "sku-custom-discount-staging"
vars = { ENVIRONMENT = "staging" }

[[env.staging.d1_databases]]
binding = "DB"
database_name = "sku-discount-db-staging"
database_id = "create-new-staging-db"  # We'll create this

[[env.staging.kv_namespaces]]
binding = "SESSIONS"
id = "create-new-staging-kv"  # We'll create this
```

#### Create staging resources:
```bash
# Create staging D1 database
wrangler d1 create sku-discount-db-staging

# Create staging KV namespace
wrangler kv:namespace create SESSIONS --env staging

# Copy the IDs from output and update wrangler.toml
```

#### Deploy to staging:
```bash
npm run build
wrangler deploy --env staging
```

Your staging URL will be: https://sku-custom-discount-staging.<your-subdomain>.workers.dev

### 2. Update Package.json Scripts (5 minutes)

```json
{
  "scripts": {
    "dev": "shopify app dev --reset",
    "dev:tunnel": "cloudflared tunnel --url http://localhost:8788",
    "deploy:staging": "npm run build && wrangler deploy --env staging",
    "deploy:production": "npm run build && wrangler deploy",
    "logs:staging": "wrangler tail --env staging",
    "logs:production": "wrangler tail"
  }
}
```

### 3. Development Workflow (Use Daily)

#### For Local Development:
```bash
# Terminal 1: Run the app locally
npm run dev

# This uses ngrok and won't affect production
```

#### For Staging Tests:
```bash
# Deploy to staging (not production!)
npm run deploy:staging

# Check logs
npm run logs:staging
```

#### For Production:
```bash
# Only after testing on staging
npm run deploy:production
```

### 4. Backup Your Code Now (10 minutes)

```bash
# If you haven't already, initialize git
git init

# Add GitHub remote
git remote add origin https://github.com/yourusername/sku-discount-app.git

# Create .gitignore if missing
echo "node_modules/
.env
.env.*
.wrangler/
dist/
build/
*.log" > .gitignore

# Commit everything
git add .
git commit -m "Backup current working state"

# Push to GitHub
git push -u origin main
```

### 5. Cloudflare Deployment Limits

#### Free Plan Limits:
- 100 daily deployments
- 100,000 daily requests
- 10ms CPU time per request

#### How to Avoid Hitting Limits:
1. Use staging for all testing
2. Batch your changes before deploying
3. Use `wrangler dev` for local testing without deployment
4. Only deploy to production 1-2 times per day

### 6. Separate Shopify Apps (Optional but Recommended)

Create two apps in Shopify Partners:

#### Development App:
- Name: "SKU Discount (Dev)"
- URL: Your ngrok URL from `shopify app dev`
- For testing only

#### Production App:
- Name: "SKU Discount"  
- URL: https://sku-custom-discount-production.eromage3.workers.dev
- For real merchants

### 7. Emergency Commands

```bash
# If production breaks, rollback
git checkout main
npm run deploy:production

# Check production status
curl https://sku-custom-discount-production.eromage3.workers.dev/app

# View production logs
wrangler tail

# Export production database
wrangler d1 export sku-discount-db --output=backup-$(date +%Y%m%d).sql
```

## Next Steps

1. **Today**: Set up staging environment (15 mins)
2. **Tomorrow**: Push code to GitHub (10 mins)  
3. **This Week**: Create development Shopify app (20 mins)
4. **Next Week**: Set up CI/CD with GitHub Actions

## Key Takeaways

- **Never use `shopify app dev` with production URLs**
- **Always test on staging first**
- **Deploy to production max 2x per day**
- **Keep code in GitHub for backup**
- **Use separate Shopify apps for dev/prod**

This setup will prevent you from breaking production while developing!