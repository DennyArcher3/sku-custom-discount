# SKU Custom Discount App - Development Guide

**Last Updated**: January 28, 2025  
**Architecture**: Cloudflare Workers + Shopify Remix

## Quick Start

### Development Commands
```bash
# Local development with Shopify CLI
npm run dev

# Cloudflare Workers development
npm run dev:cf

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Architecture Overview

### Tech Stack
- **Frontend**: Remix (React-based) with Shopify Polaris
- **Backend**: Cloudflare Workers (Edge Runtime)
- **Database**: D1 (Cloudflare's SQLite)
- **Session Storage**: KV (Key-Value) Namespace
- **Discount Logic**: Rust (compiled to WASM)
- **Framework**: Shopify Remix Template

### Key Services
1. **Cloudflare Workers**: Runs your entire app at the edge
2. **KV Storage**: Stores Shopify OAuth sessions
3. **D1 Database**: Stores shops, installation logs, and settings

## Project Structure

```
sku-custom-discount/
├── app/                    # Remix app code
│   ├── routes/            # Page routes and API endpoints
│   ├── shopify.server.ts  # Shopify configuration
│   └── db.server.ts       # Database queries
├── extensions/            # Shopify extensions
│   └── sku-discount/      # Rust discount function
├── wrangler.toml          # Cloudflare configuration
└── package.json           # Scripts and dependencies
```

## Database Schema

### Current Tables in D1

1. **shops**
   - Tracks app installations
   - Fields: id, shop, installed_at, uninstalled_at, is_active

2. **installation_logs**
   - History of all install/uninstall events
   - Fields: id, shop, event_type, metadata, created_at

3. **app_settings**
   - Shop-specific settings (currently unused)
   - Fields: id, shop, settings, created_at, updated_at

## Development Workflow

### 1. Local Development Options

**Option A: Using Shopify CLI (Recommended for UI work)**
```bash
npm run dev
# Opens tunnel URL automatically
# Hot reload enabled
# Uses local SQLite for development
```

**Option B: Using Wrangler (For Cloudflare-specific features)**
```bash
npm run dev:cf
# Runs at http://localhost:8787
# Uses actual D1 and KV bindings
# Better for testing Cloudflare features
```

### 2. Making Changes

1. **UI Changes**: Edit files in `app/routes/`
2. **Database Queries**: Update `app/db.server.ts`
3. **Discount Logic**: Modify `extensions/sku-discount/src/run.rs`

### 3. Testing

```bash
# Run linter
npm run lint

# Type checking (if configured)
npm run typecheck
```

### 4. Deployment

**Staging Deployment**
```bash
# Build and deploy to staging
npm run deploy:staging

# View logs
npm run logs:staging
```

**Production Deployment**
```bash
# Build and deploy to production
npm run deploy:production

# View logs
npm run logs:production
```

## Environment Configuration

### Cloudflare Resources

**Production**
- Worker: `sku-custom-discount-production`
- D1 Database: `sku-discount-db`
- KV Namespace: `SESSIONS`

**Staging**
- Worker: `sku-custom-discount-staging`
- D1 Database: `sku-discount-db-staging`
- KV Namespace: `SESSIONS` (staging)

### Environment Variables

Set in `wrangler.toml`:
```toml
[vars]
SHOPIFY_API_KEY = "your-api-key"
SHOPIFY_APP_URL = "https://your-app-url.workers.dev"
SCOPES = "write_discounts,read_products"
```

Secrets (set via CLI):
```bash
wrangler secret put SHOPIFY_API_SECRET --env production
```

## Common Tasks

### Creating a New Route

1. Create file in `app/routes/`
2. Export loader for data fetching
3. Export default component for UI
4. Use Shopify Polaris components

Example:
```typescript
// app/routes/app.example.tsx
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Page, Card, Text } from "@shopify/polaris";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  // Fetch data
  return { message: "Hello" };
};

export default function ExamplePage() {
  return (
    <Page title="Example">
      <Card>
        <Text>Your content here</Text>
      </Card>
    </Page>
  );
}
```

### Database Operations

```typescript
// Query shops
const shops = await env.DB.prepare(
  "SELECT * FROM shops WHERE is_active = TRUE"
).all();

// Insert log
await env.DB.prepare(
  "INSERT INTO installation_logs (shop, event_type) VALUES (?, ?)"
).bind(shop, 'install').run();
```

### Working with KV Sessions

Sessions are automatically managed by Shopify's KV adapter:
```typescript
// In shopify.server.ts
const sessionStorage = new KVSessionStorage(env.SESSIONS);
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Run `npm install`
   - Check import paths

2. **Database not found**
   - Ensure D1 database is created
   - Check wrangler.toml configuration

3. **Authentication errors**
   - Verify SHOPIFY_API_SECRET is set
   - Check app URL configuration

### Debugging

```bash
# View live logs
wrangler tail --env production

# Check D1 database
wrangler d1 execute sku-discount-db --command "SELECT * FROM shops"
```

## Best Practices

1. **Never commit secrets** - Use `wrangler secret`
2. **Test locally first** - Use staging before production
3. **Monitor logs** - Check wrangler tail regularly
4. **Use TypeScript** - Helps catch errors early
5. **Follow Shopify guidelines** - Use Polaris components

## Additional Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Shopify App Development](https://shopify.dev/docs/apps)
- [Remix Documentation](https://remix.run/docs)
- [Polaris Components](https://polaris.shopify.com/)

## Archived Documentation

For detailed historical information, see the `docs/shopify-app-deployment/archive/` folder.