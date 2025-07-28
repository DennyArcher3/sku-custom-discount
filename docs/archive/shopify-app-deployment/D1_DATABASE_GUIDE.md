# D1 Database Guide - Custom Variant Discounts App

**Date**: January 28, 2025  
**Database**: `sku-discount-db` (ID: 0ce2dfcb-1c94-4ee8-b630-8349cc9a54b3)

## Current Database Status ✅

### **YES, Your Database is ACTIVE and Working!**

Here's proof from your production database:

```sql
-- Current Data (as of Jan 28, 2025)
shops table: 2 records
- discount-function-ui.myshopify.com (uninstalled)
- coach-test1.myshopify.com (ACTIVE)

installation_logs: 17 events tracked
- Installs, uninstalls, reinstalls all logged
```

---

## What Data You're Storing

### 1. **Shops Table**
```sql
CREATE TABLE shops (
  id INTEGER PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  uninstalled_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Current Records**:
- `coach-test1.myshopify.com` - Active installation
- `discount-function-ui.myshopify.com` - Uninstalled

### 2. **Installation Logs Table**
```sql
CREATE TABLE installation_logs (
  id INTEGER PRIMARY KEY,
  shop TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'install', 'uninstall', 'reinstall'
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Recent Activity**:
- Latest: `coach-test1.myshopify.com` installed on 2025-07-27
- Tracks complete history of all installs/uninstalls

### 3. **App Settings Table**
```sql
CREATE TABLE app_settings (
  id INTEGER PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  settings TEXT DEFAULT '{}',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Status**: Empty (ready for future use)

---

## When Data is Written

### 1. **On App Installation** (`app._index.tsx`)
```javascript
// When merchant installs your app:
if (!existingShop) {
  // New installation
  await env.DB.prepare(
    "INSERT INTO shops (shop) VALUES (?)"
  ).bind(session.shop).run();
  
  await env.DB.prepare(
    "INSERT INTO installation_logs (shop, event_type) VALUES (?, 'install')"
  ).bind(session.shop).run();
}
```

### 2. **On App Uninstall** (`webhooks.app.uninstalled.tsx`)
```javascript
// When merchant uninstalls:
await env.DB.prepare(
  "UPDATE shops SET uninstalled_at = CURRENT_TIMESTAMP, is_active = FALSE WHERE shop = ?"
).bind(shop).run();
```

### 3. **On Reinstallation**
```javascript
// When merchant reinstalls:
await env.DB.prepare(
  "UPDATE shops SET uninstalled_at = NULL, is_active = TRUE WHERE shop = ?"
).bind(session.shop).run();
```

---

## D1 Pricing & Limits (as of Jan 2025)

### Free Tier (What You Have)
- **Rows read**: 5 million/month
- **Rows written**: 100,000/month
- **Storage**: 5 GB total
- **Databases**: 10 per account

### Your Current Usage
```
Database size: 57,344 bytes (0.05 MB)
Tables: 3 active tables
Records: ~20 total rows
```

**You're using < 0.001% of free tier!**

### Paid Tiers

#### Workers Paid ($5/month)
- **Rows read**: 25 billion/month
- **Rows written**: 50 million/month
- **Storage**: 10 GB
- **Cost**: First 25B reads included, then $0.001/million

#### Scale as Needed
- Additional reads: $0.001 per million
- Additional writes: $1.00 per million
- Additional storage: $0.75 per GB/month

---

## How to View Your Database

### 1. **Command Line** (Current Method)
```bash
# View all shops
wrangler d1 execute sku-discount-db --command="SELECT * FROM shops;" --remote

# Check installation logs
wrangler d1 execute sku-discount-db --command="SELECT * FROM installation_logs ORDER BY created_at DESC;" --remote

# Count active shops
wrangler d1 execute sku-discount-db --command="SELECT COUNT(*) FROM shops WHERE is_active = 1;" --remote
```

### 2. **Cloudflare Dashboard** 
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Navigate to Workers & Pages → D1
4. Click on `sku-discount-db`
5. Use the Query Console

### 3. **Build Your Own Dashboard**
```javascript
// Add to your app routes (e.g., app/routes/app.analytics.tsx)
export const loader = async ({ context }) => {
  const { env } = context;
  
  const stats = await env.DB.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM shops WHERE is_active = 1) as active_shops,
      (SELECT COUNT(*) FROM installation_logs) as total_events,
      (SELECT COUNT(*) FROM installation_logs WHERE event_type = 'install') as installs
  `).first();
  
  return json({ stats });
};
```

---

## Example Queries for Your Data

### Get Active Shops
```sql
SELECT shop, installed_at 
FROM shops 
WHERE is_active = 1 
ORDER BY installed_at DESC;
```

### Installation Analytics
```sql
SELECT 
  event_type,
  COUNT(*) as count,
  DATE(created_at) as date
FROM installation_logs
GROUP BY event_type, DATE(created_at)
ORDER BY date DESC;
```

### Shop Lifetime
```sql
SELECT 
  shop,
  installed_at,
  uninstalled_at,
  ROUND(JULIANDAY(COALESCE(uninstalled_at, CURRENT_TIMESTAMP)) - JULIANDAY(installed_at)) as days_active
FROM shops
ORDER BY days_active DESC;
```

---

## Adding More Data

### Example: Track Discount Usage
```javascript
// Create new table
await env.DB.prepare(`
  CREATE TABLE IF NOT EXISTS discount_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop TEXT NOT NULL,
    discount_id TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Track usage
await env.DB.prepare(
  "INSERT INTO discount_usage (shop, discount_id) VALUES (?, ?)"
).bind(shop, discountId).run();
```

### Example: Store Shop Preferences
```javascript
// Save settings
await env.DB.prepare(
  "INSERT OR REPLACE INTO app_settings (shop, settings) VALUES (?, ?)"
).bind(shop, JSON.stringify(settings)).run();

// Load settings
const result = await env.DB.prepare(
  "SELECT settings FROM app_settings WHERE shop = ?"
).bind(shop).first();
const settings = JSON.parse(result?.settings || '{}');
```

---

## Best Practices

1. **Always use prepared statements** (you already do ✅)
   ```javascript
   // Good - prevents SQL injection
   .prepare("SELECT * FROM shops WHERE shop = ?").bind(shop)
   ```

2. **Handle errors gracefully** (you already do ✅)
   ```javascript
   try {
     await env.DB.prepare(...).run();
   } catch (error) {
     console.error('Database error:', error);
   }
   ```

3. **Use transactions for multiple operations**
   ```javascript
   await env.DB.batch([
     env.DB.prepare("UPDATE shops SET...").bind(...),
     env.DB.prepare("INSERT INTO logs...").bind(...)
   ]);
   ```

4. **Add indexes for performance**
   ```sql
   CREATE INDEX idx_shops_active ON shops(is_active);
   CREATE INDEX idx_logs_date ON installation_logs(created_at);
   ```

---

## Monitoring & Alerts

### Quick Health Check
```bash
# Check database size
wrangler d1 info sku-discount-db

# Recent activity
wrangler d1 execute sku-discount-db --command="
  SELECT 
    (SELECT COUNT(*) FROM shops WHERE is_active = 1) as active,
    (SELECT COUNT(*) FROM installation_logs WHERE created_at > datetime('now', '-24 hours')) as recent_events
" --remote
```

### Set Up Monitoring
1. Use Cloudflare Analytics
2. Add custom metrics in your app
3. Set up alerts for unusual patterns

---

## Conclusion

✅ **Your D1 database is working perfectly!**
- Tracking installations correctly
- Recording all events
- Ready to scale to millions of shops
- Using < 0.001% of free tier limits

You have room to add much more functionality without worrying about limits or costs!