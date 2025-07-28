# Custom Variant Discounts App - Comprehensive Security & Compliance Audit

**Date**: January 28, 2025  
**App Name**: Custom Variant Discounts (SKU Custom Discount)  
**Status**: ⚠️ **REQUIRES FIXES BEFORE SUBMISSION**

## Executive Summary

This audit identified several issues that need to be addressed before submitting to Shopify:

### Critical Issues (Must Fix)
1. **API secrets exposed in wrangler.toml** - Move to environment variables
2. **TypeScript compilation errors** - 2 errors preventing build
3. **App name mismatch** - shopify.app.toml still shows old name

### High Priority Issues
1. **Security vulnerabilities** in dependencies (7 moderate)
2. **1917 ESLint errors/warnings** - mostly in generated code
3. **No error tracking** or monitoring configured
4. **Missing rate limiting** on API endpoints

### Medium Priority Issues
1. **No tests** implemented
2. **Incomplete error handling** in some routes
3. **Missing accessibility features** in UI components

---

## 1. Security Audit ⚠️

### 🔴 CRITICAL: Exposed API Secrets
```toml
# wrangler.toml - Lines 24-25
SHOPIFY_API_KEY = "3122acfb32ed2de15a381bde53864f1f"
SHOPIFY_API_SECRET = "640cbc2a69ce6306bf4f25a78ff17c56"  # EXPOSED SECRET!
```

**Fix Required**: Move API secret to Cloudflare secrets:
```bash
wrangler secret put SHOPIFY_API_SECRET
```

### 🟡 Dependency Vulnerabilities
```
7 moderate severity vulnerabilities:
- esbuild: Development server vulnerability (GHSA-67mh-4wv8-2f99)
- estree-util-value-to-estree: Prototype pollution (GHSA-f7f6-9jq7-3rqj)
```

**Impact**: Low - These are development dependencies only

### ✅ Authentication & Authorization
- Using Shopify's official authentication flow
- Session storage in Cloudflare KV
- Proper webhook validation implemented

### ✅ Data Handling
- No customer PII stored
- Only discount configuration data in D1 database
- Proper GDPR webhook handlers implemented

---

## 2. Code Quality Audit ⚠️

### 🔴 TypeScript Errors
```typescript
// app/routes/app.tsx:72
Property 'apiKey' does not exist on type 'unknown'

// app/shopify.server.ts:28
'v3_webhookAdminContext' does not exist in type 'FutureFlags'
```

### 🟡 ESLint Issues
- **21 errors** (mostly unused variables)
- **1896 warnings** (mostly in generated discount-function-settings.js)

### Key Code Issues:
1. **Unused variables**: `admin` in app.new.tsx, `session` in webhooks.app.uninstalled.tsx
2. **Generated code issues**: The minified discount-function-settings.js has many linting warnings

---

## 3. Shopify Compliance Audit ✅

### ✅ API Usage
- Using latest API version (January 2025)
- Correct scopes requested
- Proper webhook subscriptions

### ✅ Required Webhooks
All mandatory GDPR webhooks implemented:
- ✅ customers/data_request
- ✅ customers/redact
- ✅ shop/redact

### ⚠️ App Configuration Issues
```toml
# shopify.app.toml - Line 4
name = "Sku Custom Discount"  # Should be "Custom Variant Discounts"
```

### ✅ Permissions
Minimal required scopes:
- read_cart_transforms
- read_discounts, write_discounts
- read_products
- read_metaobjects, write_metaobjects

---

## 4. Performance Audit 🟡

### Bundle Size
- Main app bundle: Not analyzed (needs build)
- Discount function (Rust): Optimized WASM

### Database
- Using Cloudflare D1 (serverless SQLite)
- No connection pooling needed
- No query optimization analysis done

### Caching
- Session storage in KV (good)
- No application-level caching implemented

---

## 5. GDPR/Privacy Audit ✅

### ✅ Data Collection
- **No customer data stored**
- Only merchant discount configurations

### ✅ Webhook Compliance
All handlers correctly respond with no data:
```javascript
// webhooks.customers.data_request.tsx
return json({
  success: true,
  message: "No customer data stored by this app"
});
```

### ✅ Privacy Policy
- Comprehensive policy created
- Includes all required sections
- Contact info: EG Commerce

---

## 6. UI/UX Audit 🟡

### Issues Found:
1. **No loading states** in discount creation flow
2. **No error boundaries** in extension UI
3. **Large minified JS file** (987 lines) may impact performance
4. **No accessibility attributes** in custom components

### Positive:
- Using native Shopify discount UI
- Consistent with Shopify admin design

---

## 7. Error Handling Audit 🟡

### Issues:
1. **Generic error messages** - Not user-friendly
2. **Console.log for errors** - Should use proper logging service
3. **Missing try-catch** in some async operations

### Example:
```javascript
// app/routes/app.tsx
console.error("Authentication error in app.tsx:", error);
// Should provide user feedback
```

---

## 8. Dependencies Audit 🟡

### Outdated Packages:
- Check with `npm outdated` after fixing vulnerabilities

### Security:
- 7 moderate vulnerabilities in dev dependencies
- Run `npm audit fix` to attempt fixes

---

## 9. Deployment Configuration Audit ⚠️

### 🔴 Critical Issues:
1. **API Secret in wrangler.toml** - Must use secrets
2. **Production URL mismatch** between configs

### ✅ Good Practices:
- Using Cloudflare Workers for scalability
- Proper environment separation
- KV and D1 bindings configured correctly

---

## Required Actions Before Shopify Submission

### 🔴 Critical (Block Submission):
1. **Remove API secret from wrangler.toml**
   ```bash
   wrangler secret put SHOPIFY_API_SECRET
   ```

2. **Fix TypeScript errors**
   - Update loader return type in app.tsx
   - Remove deprecated future flag in shopify.server.ts

3. **Update app name in shopify.app.toml**
   ```toml
   name = "Custom Variant Discounts"
   ```

### 🟡 High Priority:
1. **Fix ESLint errors** (at least the 21 errors)
2. **Add error monitoring** (Sentry, LogRocket, etc.)
3. **Implement rate limiting** for API endpoints
4. **Run npm audit fix** for vulnerabilities

### 🟢 Nice to Have:
1. Add unit tests
2. Improve error messages
3. Add loading states in UI
4. Implement proper logging

---

## Security Checklist

- [ ] Remove API secrets from code
- [ ] Fix TypeScript compilation errors
- [ ] Update app name everywhere
- [ ] Fix critical ESLint errors
- [ ] Add error monitoring
- [ ] Test all webhook handlers
- [ ] Verify GDPR compliance
- [ ] Test with multiple shops
- [ ] Load test the discount function
- [ ] Security scan dependencies

---

## Conclusion

The app has a solid foundation but requires several fixes before Shopify submission:

1. **Security**: Remove exposed API secret immediately
2. **Code Quality**: Fix TypeScript and critical ESLint errors
3. **Configuration**: Update app name to match rebrand
4. **Monitoring**: Add error tracking for production

Once these issues are addressed, the app should pass Shopify's review process.