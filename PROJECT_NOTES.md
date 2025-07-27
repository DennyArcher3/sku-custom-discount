# SKU Custom Discount - Project Notes

## Overview
This is a Shopify embedded app that allows merchants to create SKU-based percentage discounts. Built with Remix and deployed to Cloudflare Workers.

## Tech Stack
- **Framework**: Remix (React Router)
- **UI Components**: Polaris Web Components (s-*)
- **Deployment**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Session Storage**: Cloudflare KV
- **Discount Function**: Rust (WebAssembly)

## Key Features
- SKU-based discount targeting
- Percentage-based discounts
- Bulk SKU import capability
- Real-time product preview
- Shopify Admin integration

## Important Configuration

### Environment Variables
```env
SHOPIFY_API_KEY=3122acfb32ed2de15a381bde53864f1f
SHOPIFY_APP_URL=https://sku-custom-discount-production.eromage3.workers.dev
SHOPIFY_DISCOUNT_FUNCTION_ID=fe78075e-5113-4962-a155-4a63009f85c7
```

### Cloudflare Resources
- **Worker Name**: sku-custom-discount-production
- **KV Namespace**: SESSIONS (ID: 8b252d829fc1454182e2c6814bdcae2e)
- **D1 Database**: sku-discount-db (ID: 0ce2dfcb-1c94-4ee8-b630-8349cc9a54b3)

## Deployment Commands

### Local Development
```bash
npm run dev:cf  # Run with Cloudflare Workers locally
```

### Production Deployment
```bash
# Deploy to Shopify
npm run deploy -- --force

# Deploy to Cloudflare Workers
npm run deploy:cf
# or
wrangler deploy --env production
```

## Known Issues & Solutions

### 1. "200 OK" Display Issue
**Fixed**: Error boundaries now properly handle Response objects from Shopify authentication.

### 2. URL Changes on Deployment
**Fixed**: Set `automatically_update_urls_on_dev = false` in shopify.app.toml

### 3. Static Assets 404 Errors
**Fixed**: Updated wrangler.toml to use `assets = { directory = "./build/client" }`

### 4. Function ID Mismatch
**Solution**: Implemented dynamic function ID retrieval using GraphQL query

## Development Notes

### UI Components
We're using Polaris web components (not React components):
- `<s-page>`, `<s-card>`, `<s-button>`, etc.
- Loaded via CDN: `https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js`

### Authentication Flow
1. App uses Shopify OAuth for authentication
2. Sessions stored in Cloudflare KV
3. Online access tokens used for API calls

### Database Schema
- `shops` table: Tracks installations
- `installation_logs` table: Tracks install/uninstall events

## Future Improvements
1. Implement proper Remix routes for discount creation/editing:
   - `app.discount.$functionId.new.tsx`
   - `app.discount.$functionId.$id.tsx`

2. Add discount management features:
   - List existing discounts
   - Edit/delete functionality
   - Usage analytics

3. Enhance bulk import:
   - CSV upload support
   - Validation and error handling
   - Progress tracking

## Monitoring
```bash
# View production logs
wrangler tail sku-custom-discount-production
```

## Resources
- [Shopify Discount Function API](https://shopify.dev/docs/api/functions/latest/discount)
- [Build Discount UI with Remix](https://shopify.dev/docs/apps/build/discounts/build-ui-with-remix)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)