# Production Deployment Checklist for Shopify App Store

## Current State ✅
Your app is working perfectly in development! Now let's prepare for production and App Store submission.

## Key Differences: Development vs Production

### Development Store
- Uses temporary Cloudflare tunnel URLs
- `automatically_update_urls_on_dev = true` handles URL changes
- Function IDs are generated dynamically
- Testing environment only

### Production/App Store
- Requires stable, permanent URLs
- Fixed configuration that doesn't change
- Consistent function IDs
- Must pass Shopify review process

## Production Deployment Steps

### 1. Choose Your Production Hosting ⚡

Since you tested successfully, you have 3 options:

#### Option A: Cloudflare Workers (Recommended)
```bash
# Deploy command
wrangler deploy

# Result: https://sku-custom-discount.YOUR-SUBDOMAIN.workers.dev
```

#### Option B: Traditional Hosting
- Heroku, Railway, Render
- Result: https://your-app-name.herokuapp.com

#### Option C: Custom Domain
- Any hosting + your domain
- Result: https://discount.yourdomain.com

### 2. Environment Variables for Production 🔐

You need to set these BEFORE deploying:

```env
# Required for Production
SHOPIFY_API_KEY=3122acfb32ed2de15a381bde53864f1f
SHOPIFY_API_SECRET=[your-secret-from-partner-dashboard]
SHOPIFY_APP_URL=https://your-production-url.com
SCOPES=read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects

# For your discount function
SHOPIFY_DISCOUNT_FUNCTION_ID=[will be generated on deploy]
```

### 3. Get Your Function ID 🎯

Your app uses a function ID for the discount URL. To get it:

```bash
# After deploying your app
shopify app deploy

# Look for output like:
# Deployed function: discount-function
# ID: 01J6ABC123DEF456
```

Then add to your environment:
```env
SHOPIFY_DISCOUNT_FUNCTION_ID=01J6ABC123DEF456
```

### 4. Update shopify.app.toml 📝

Change from development URLs to production:

```toml
# Before (Development)
application_url = "https://sydney-walnut-metropolitan-cheers.trycloudflare.com"

# After (Production)
application_url = "https://your-production-url.com"

[auth]
redirect_urls = [
  "https://your-production-url.com/auth/callback",
  "https://your-production-url.com/auth/shopify/callback",
  "https://your-production-url.com/api/auth/callback"
]

[[webhooks.subscriptions]]
uri = "https://your-production-url.com/webhooks/app/scopes_update"
# Update all webhook URLs...
```

### 5. Deploy Configuration to Shopify 🚀

```bash
# This updates Shopify with your production URLs
shopify app deploy --reset

# This generates the final configuration
shopify app config push
```

### 6. Update Partner Dashboard 🏪

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Select your app: "SKU Custom Discount"
3. Update:
   - App URL: `https://your-production-url.com`
   - Redirect URLs (all 3)
   - Webhook URLs (all 5)

### 7. Test Production Deployment ✅

Before submitting to App Store:

1. **Fresh Install Test**
   ```
   - Uninstall from dev store
   - Visit: https://your-production-url.com
   - Install and test discount creation
   ```

2. **Function Test**
   - Create a discount
   - Verify it appears in "Apps" section
   - Test discount application

3. **Webhook Test**
   - Uninstall app
   - Check logs for webhook firing

## App Store Submission Checklist 📋

### Required Assets
- [ ] App icon (1200x1200 PNG)
- [ ] 3+ Desktop screenshots (1600x900)
- [ ] App tagline (max 62 chars)
- [ ] Full description
- [ ] Demo video (2-5 min)
- [ ] Privacy policy URL

### Technical Requirements
- [ ] Production URL is stable
- [ ] All webhooks respond correctly
- [ ] OAuth flow works
- [ ] Discount function deploys
- [ ] No console errors
- [ ] Performance impact < 10 points

### Review Preparation
- [ ] Demo store with test data
- [ ] Review instructions document
- [ ] Test credentials for reviewers

## Common Production Issues & Fixes

### Issue: Function ID not found
**Fix**: Run `shopify app generate extension` and redeploy

### Issue: URLs still showing Cloudflare tunnel
**Fix**: Set `automatically_update_urls_on_dev = false` for production

### Issue: Environment variables not working
**Fix**: Ensure they're set in your hosting platform, not just .env file

### Issue: Discount creation URL fails
**Fix**: Check `SHOPIFY_DISCOUNT_FUNCTION_ID` is set correctly

## Production Environment Variables Summary

```bash
# Cloudflare Workers
wrangler secret put SHOPIFY_API_KEY
wrangler secret put SHOPIFY_API_SECRET
wrangler secret put SHOPIFY_DISCOUNT_FUNCTION_ID

# Heroku
heroku config:set SHOPIFY_API_KEY=xxx
heroku config:set SHOPIFY_API_SECRET=xxx
heroku config:set SHOPIFY_DISCOUNT_FUNCTION_ID=xxx

# Railway/Render
# Use their dashboard to add secrets
```

## Final Pre-Submission Check

Run through this list before submitting:

1. [ ] App loads without errors
2. [ ] Can install on fresh store
3. [ ] Discount creation works
4. [ ] Discounts apply correctly
5. [ ] Webhooks fire properly
6. [ ] No development URLs anywhere
7. [ ] All assets ready
8. [ ] Review instructions clear

## Next Steps

1. **Deploy to production hosting**
2. **Get function ID from deployment**
3. **Update all URLs in Partner Dashboard**
4. **Test everything**
5. **Submit to App Store!**

Remember: The main difference is changing from temporary dev URLs to permanent production URLs. Everything else stays the same!

---

*Note: Keep your development environment separate so you can continue making updates without affecting production.*