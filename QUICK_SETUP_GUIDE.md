# Quick Setup Guide - Development/Production Separation

## What I've Done
1. Updated `wrangler.toml` to support multiple environments (staging & production)
2. Added new deployment scripts to `package.json`

## What You Need to Do Now (15 minutes)

### Step 1: Create Staging Resources (5 minutes)
```bash
# Create staging database
npm run db:create:staging

# Copy the database_id from output, then update wrangler.toml line 36

# Create staging KV namespace
npm run kv:create:staging

# Copy the id from output, then update wrangler.toml line 31
```

### Step 2: Set Staging Secret (2 minutes)
```bash
# When prompted, enter your SHOPIFY_API_SECRET
wrangler secret put SHOPIFY_API_SECRET --env staging
```

### Step 3: Create .gitignore Updates (1 minute)
Add these to your `.gitignore`:
```
.dev.vars
.dev.vars.*
.env
.env.*
```

### Step 4: Test Staging Deployment (5 minutes)
```bash
# Deploy to staging
npm run deploy:staging

# Your staging URL will be:
# https://sku-custom-discount-staging.eromage3.workers.dev

# Check logs
npm run logs:staging
```

## Your New Development Workflow

### Daily Development:
```bash
# For local Shopify development (uses ngrok)
npm run dev

# For testing Cloudflare Workers locally
npm run dev:cf
```

### Testing Changes:
```bash
# Always deploy to staging first
npm run deploy:staging

# Check staging logs
npm run logs:staging

# Test at: https://sku-custom-discount-staging.eromage3.workers.dev
```

### Production Deployment:
```bash
# Only after testing on staging
npm run deploy:production

# Monitor production
npm run logs:production
```

## Benefits
1. **Production is safe**: No more breaking production during development
2. **Test everything**: Staging environment for testing before production
3. **Same resources**: Each environment has its own database and sessions
4. **Easy commands**: Simple npm scripts for everything

## Important Notes
- Staging URL: `https://sku-custom-discount-staging.eromage3.workers.dev`
- Production URL: `https://sku-custom-discount-production.eromage3.workers.dev`
- Use staging for ALL testing
- Deploy to production only 1-2 times per day

## Backup Your Code Now
```bash
git add .
git commit -m "Add staging environment setup"
git push origin main
```

## Troubleshooting
If you get "resource not found" errors:
1. Make sure you created the staging resources (Step 1)
2. Check that IDs are correctly updated in wrangler.toml
3. Ensure secrets are set for staging environment

## Next Steps (Optional)
1. Create a development Shopify app in Partners dashboard
2. Set up GitHub Actions for automated deployments
3. Configure different API keys for each environment

This setup follows Cloudflare's official best practices and prevents production breakage!