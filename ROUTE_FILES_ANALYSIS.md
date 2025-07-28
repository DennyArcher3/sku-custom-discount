# Route Files Analysis - What's Used and What's Not

## Understanding Remix File-Based Routing
In Remix, every `.tsx` file in the `routes/` folder automatically becomes a route. So technically, all files are "connected" but not all are necessary.

## File Categories:

### 🔴 **REQUIRED BY SHOPIFY** (DO NOT DELETE):
1. **auth.$.tsx** - Handles auth redirects
2. **auth.callback.tsx** - OAuth callback from Shopify
3. **auth.login/route.tsx** - Login flow
4. **auth.session-token.tsx** - Session token exchange
5. **webhooks.app.scopes_update.tsx** - Required webhook
6. **webhooks.app.uninstalled.tsx** - Required webhook
7. **webhooks.customers.data_request.tsx** - GDPR compliance
8. **webhooks.customers.redact.tsx** - GDPR compliance
9. **webhooks.shop.redact.tsx** - GDPR compliance

### 🟢 **YOUR APP FEATURES** (KEEP):
1. **app.tsx** - Main app layout wrapper
2. **app._index.tsx** - App homepage
3. **app.discounts.tsx** - Discount management page ✅
4. **app.settings.tsx** - Settings page ✅
5. **app.new.tsx** - Create new discount page

### 🟡 **OPTIONAL/TEST FILES** (CAN DELETE):
1. **app.discounts.test-query.tsx** - Test file for GraphQL queries
   - Status: Not referenced anywhere
   - Purpose: Was used for debugging discount queries
   - **Recommendation: DELETE** ❌

### 🔵 **FRAMEWORK FILES** (KEEP):
1. **_index/route.tsx** - Root route (redirects to /app)
2. **auth.login/error.server.tsx** - Error handling for login
3. **root.tsx** - Remix root component
4. **entry.server.tsx** - Server entry point

### 📁 **OTHER APP FILES** (KEEP):
1. **db.server.ts** - Prisma database client
2. **globals.d.ts** - TypeScript global types
3. **routes.ts** - Route configuration
4. **shopify.server.ts** - Shopify API setup

## Files You Can Safely Delete:

```bash
# Delete the test query file
rm app/routes/app.discounts.test-query.tsx
```

## Why Each File Exists:

### Auth Files (auth.*)
- Required by Shopify for OAuth flow
- Handles login, logout, and session management

### Webhook Files (webhooks.*)
- Required by Shopify App Store
- Handle app lifecycle and GDPR compliance
- Automatically called by Shopify

### App Files (app.*)
- Your actual application pages
- Users navigate to these

### Framework Files
- Required by Remix framework
- Handle routing, rendering, and server logic

## Visual Map:
```
User visits app → 
  → auth.$.tsx (checks auth) → 
    → auth.login (if not logged in) →
      → auth.callback (after Shopify OAuth) →
        → app._index.tsx (homepage) →
          → app.discounts.tsx (your feature)
          → app.settings.tsx (your feature)
          → app.new.tsx (create discount)

Shopify calls →
  → webhooks.* (automatic, no user interaction)
```

## Summary:
- **Total files**: 22
- **Required**: 18
- **Optional/Test**: 1 (app.discounts.test-query.tsx)
- **Can delete**: 1 file

All other files are connected and used by either Shopify, Remix framework, or your app features.