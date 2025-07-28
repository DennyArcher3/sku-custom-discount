# SKU Custom Discount - Shopify App Store Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the SKU Custom Discount app to the Shopify App Store. The app is a Remix-based application with discount function extensions that allows merchants to create SKU-based discounts.

## App Architecture
- **Framework**: Remix (Full-stack web framework)
- **Backend**: Node.js with Remix server
- **Database**: Prisma with SQLite (development) / PostgreSQL (production)
- **Extensions**: 
  - Discount Function (Rust/WASM)
  - Admin UI Extension (React)
- **Authentication**: OAuth 2.0 via Shopify App Bridge

## Deployment Status
✅ **This app CAN be published to the Shopify App Store** - It's a full Remix app with backend, not an extension-only app.

## Quick Links
- [Requirements Checklist](./requirements-checklist.md)
- [Submission Guide](./submission-guide.md)
- [Review Instructions](./review-instructions.md)
- [Privacy Policy](./privacy-policy.md)
- [Performance Testing](./performance-testing.md)

## Pre-Deployment Checklist

### 1. Technical Requirements ✓
- [x] OAuth authentication implemented
- [x] Discount function extension working
- [x] Admin UI extension functioning
- [ ] Production hosting setup
- [ ] SSL certificate configured
- [ ] Production database configured
- [x] GDPR webhooks implemented

### 2. App Listing Requirements
- [ ] App icon created (1200x1200px)
- [ ] Desktop screenshots (3 minimum, 1600x900px)
- [ ] App tagline written (max 62 chars)
- [ ] App description completed
- [ ] Pricing model defined
- [ ] Support email configured

### 3. Performance & Security
- [ ] Lighthouse performance tested
- [ ] Security audit completed
- [ ] Data privacy compliance verified
- [ ] Error handling tested

### 4. Documentation
- [ ] Demo video created
- [ ] Review instructions written
- [ ] Privacy policy published
- [ ] Support documentation ready

## Production Deployment Steps

### Step 1: Set Up Production Hosting
Choose one of these hosting providers:
- **Heroku** (Recommended for ease)
- **AWS EC2/ECS**
- **Google Cloud Run**
- **Vercel** (with custom server)

### Step 2: Configure Production Database
1. Set up PostgreSQL database
2. Update Prisma schema if needed
3. Run migrations: `npx prisma migrate deploy`

### Step 3: Environment Configuration
Create production `.env` file with:
```env
DATABASE_URL="postgresql://..."
SHOPIFY_APP_URL="https://your-production-domain.com"
SHOPIFY_API_KEY="your-api-key"
SHOPIFY_API_SECRET="your-api-secret"
SCOPES="read_cart_transforms,read_discounts,read_products,write_discounts,read_metaobjects,write_metaobjects"
```

### Step 4: Update Configuration Files
1. Update `shopify.app.toml` with production URLs
2. Configure webhook endpoints
3. Update redirect URLs

### Step 5: Deploy Application
```bash
# Build the app
npm run build

# Deploy to your chosen platform
# Example for Heroku:
git push heroku main
```

## App Store Submission Timeline

| Week | Tasks |
|------|-------|
| 1 | Technical setup: hosting, database, webhooks |
| 2 | Create assets: icon, screenshots, demo video |
| 3 | Write documentation and submit app |
| 4+ | Review process and iterations |

## Common Issues & Solutions

### Issue: Metafield Permission Errors
**Solution**: Already implemented - metafield definition is created automatically in UI extension

### Issue: Discount Not Appearing
**Solution**: Ensure discount function is properly linked to UI extension

### Issue: OAuth Errors
**Solution**: Verify redirect URLs match production domain exactly

## Support & Resources
- [Shopify App Development Docs](https://shopify.dev/docs/apps)
- [Shopify Partner Dashboard](https://partners.shopify.com)
- [App Review Guidelines](https://shopify.dev/docs/apps/store/requirements)

## Contact
For questions about this deployment guide, please contact: [your-email@example.com]