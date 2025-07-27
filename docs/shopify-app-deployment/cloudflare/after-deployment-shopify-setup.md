# What to Do After Cloudflare Deployment - Simple Guide

## Understanding the Big Picture 🖼️

Think of it like moving your store from one building to another:
- **Before**: Your app lived on a local computer (localhost)
- **After**: Your app now lives in Cloudflare's building (their servers)
- **Shopify**: Needs to know your new address!

## What Actually Changed?

### Before Deployment (Local Development)
```
Your App URL: http://localhost:3000
Shopify talks to → Your computer
```

### After Deployment (Cloudflare)
```
Your App URL: https://sku-custom-discount.yourname.workers.dev
Shopify talks to → Cloudflare's servers → Your app
```

## Step-by-Step: Update Shopify Partner Dashboard 🚀

### 1. Get Your New Cloudflare URL

After deploying, Cloudflare gives you a URL like:
```
https://sku-custom-discount.yourname.workers.dev
```

Write this down! This is your app's new home address.

### 2. Login to Shopify Partner Dashboard

1. Go to: https://partners.shopify.com
2. Click on "Apps" in the left menu
3. Find your app: "SKU Custom Discount"
4. Click on it to open settings

### 3. Update Your App URLs

You need to update these 4 places:

#### A. App URL
```
Old: https://voltage-lebanon-kate-detect.trycloudflare.com
New: https://sku-custom-discount.yourname.workers.dev
```

#### B. Redirect URLs (Authentication)
Remove old ones and add new ones:
```
https://sku-custom-discount.yourname.workers.dev/auth/callback
https://sku-custom-discount.yourname.workers.dev/auth/shopify/callback
https://sku-custom-discount.yourname.workers.dev/api/auth/callback
```

#### C. Webhook URLs
Update each webhook:
```
Old: https://overall-quarterly-deemed-careers.trycloudflare.com/webhooks/app/uninstalled
New: https://sku-custom-discount.yourname.workers.dev/webhooks/app/uninstalled

Do the same for:
- /webhooks/app/scopes_update
- /webhooks/customers/data_request
- /webhooks/customers/redact
- /webhooks/shop/redact
```

#### D. Extensions Configuration
Go to "Extensions" → Your discount function → Update any URLs there too

### 4. Save Everything!

Click "Save" on each page where you made changes.

## Do We Use Cloudflare APIs? 🤔

**Simple Answer: NO!**

Here's what happens:
```
Merchant uses app → Shopify → Your App (on Cloudflare) → Back to Shopify
```

- **Your app** only talks to **Shopify's API**
- **Cloudflare** is just the hosting platform (like a building)
- You don't need to write any Cloudflare API code
- Everything works automatically!

## What Else Changes? 📝

### 1. Database Location
- **Before**: SQLite on your computer
- **After**: D1 database in Cloudflare (but your app code stays the same!)

### 2. Session Storage
- **Before**: Stored in local files
- **After**: Stored in Cloudflare KV (but works the same way!)

### 3. Environment Variables
- **Before**: In `.env` file
- **After**: In Cloudflare dashboard (more secure!)

## Testing Your Updated App 🧪

### 1. Install on Test Store
1. Go to your test store
2. Uninstall the old app (if installed)
3. Visit your new URL: `https://sku-custom-discount.yourname.workers.dev`
4. Click "Install app"
5. It should work exactly the same as before!

### 2. Create a Test Discount
1. Go to Discounts in your test store
2. Create new discount
3. Select "SKU Custom Discount"
4. It should work exactly like before!

## Common Questions 🙋

### Q: Will my app work differently on Cloudflare?
**A**: No! It works exactly the same. Cloudflare is just faster hosting.

### Q: Do I need to change my app code?
**A**: We already did that in the deployment guide. No more changes needed!

### Q: What if I need to update my app later?
**A**: Just run `npm run deploy` and it updates automatically!

### Q: Is Cloudflare more secure?
**A**: Yes! Cloudflare provides:
- Automatic SSL/HTTPS
- DDoS protection
- Global security network

## Visual Summary 📊

```
OLD SETUP:
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Shopify   │ --> │  localhost   │ --> │  Your App   │
└─────────────┘     └──────────────┘     └─────────────┘

NEW SETUP:
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Shopify   │ --> │  Cloudflare  │ --> │  Your App   │
└─────────────┘     │  (Global!)   │     │  (Faster!)  │
                    └──────────────┘     └─────────────┘
```

## Checklist ✅

- [ ] Got your Cloudflare URL
- [ ] Updated App URL in Partner Dashboard
- [ ] Updated all Redirect URLs
- [ ] Updated all Webhook URLs
- [ ] Saved all changes
- [ ] Tested app installation
- [ ] Tested discount creation

## What's Next?

Once you complete this checklist:
1. Your app is live on the internet! 🎉
2. It's faster than before (80ms vs 1500ms)
3. It works globally (300+ locations)
4. You can submit to App Store!

## Need Help?

If something doesn't work:
1. Check the URL is typed correctly (no typos!)
2. Make sure you clicked "Save" in Partner Dashboard
3. Wait 5 minutes (sometimes Shopify needs time to update)
4. Try uninstalling and reinstalling the app

Remember: Cloudflare is just the hosting. Your app still works the same way, just faster and globally available!

---

*Tip: Save your Cloudflare URL in a safe place. You'll need it for App Store submission!*