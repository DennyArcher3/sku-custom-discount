# Shopify App Store Requirements Checklist

## Technical Requirements

### Authentication & Security
- [ ] **OAuth Implementation**
  - App uses OAuth before any other authentication steps
  - Merchants cannot interact with UI before completing OAuth
  - Session tokens are implemented securely
  
- [ ] **Security Measures**
  - Valid TLS/SSL certificate on production domain
  - Protection against common web vulnerabilities (XSS, CSRF, SQL injection)
  - Secure storage of API credentials
  - No exposed network services

### Performance
- [ ] **Lighthouse Testing**
  - Run Lighthouse tests on a test store
  - Document baseline performance score
  - Ensure app doesn't reduce score by more than 10 points
  - Include screenshot of results in submission

### Data & Privacy
- [ ] **GDPR Compliance**
  - Implement mandatory GDPR webhooks:
    - `customers/data_request`
    - `customers/redact`  
    - `shop/redact`
  - Privacy policy created and accessible
  - Data deletion mechanisms in place

### Webhooks
- [x] **Mandatory Webhooks**
  - ✅ `app/uninstalled` - Already implemented
  - ✅ `app/scopes_update` - Already implemented
  - ✅ `customers/data_request` - Implemented
  - ✅ `customers/redact` - Implemented
  - ✅ `shop/redact` - Implemented

### App Functionality
- [x] **Core Features Working** ✅
  - ✅ Discount creation flow works smoothly
  - ✅ SKU-based discounts apply correctly
  - ✅ Configuration saves properly
  - ✅ Error handling is user-friendly

## App Listing Requirements

### Basic Information
- [x] **App Name**: "SKU Custom Discount" (18 characters) ✅
- [x] **Tagline**: "Surgical discount control for smart inventory management" (56 characters) ✅
- [x] **App URL**: https://skucustomdiscount.com ✅

### Visual Assets
- [x] **App Icon** ✅
  - ✅ Size: 1200x1200 pixels
  - ✅ Format: PNG with transparent background
  - ✅ No text or screenshots
  - ✅ Bold, simple design (barcode with % badge)
  - ✅ High contrast

- [ ] **Screenshots** (Desktop - Required)
  - Minimum: 3 screenshots
  - Size: 1600x900 pixels
  - Show actual app UI
  - No Shopify logos or navigation
  - Highlight key features

- [ ] **Screenshots** (Mobile - Optional)
  - Size: 900x1600 pixels
  - Show responsive design

### Content
- [x] **App Introduction** (100 characters) ✅
  - ✅ Clear value proposition
  - ✅ Compelling and concise
  - **Text**: "Create precise SKU-based discounts. Target specific products without affecting your entire catalog."

- [x] **Detailed Description** ✅
  - ✅ Explains SKU-based discount functionality
  - ✅ Lists key features (bulk import, visual picker)
  - ✅ Clear merchant benefits (precision control, time savings)
  - ✅ Specific use cases (clearance, B2B, seasonal)
  - ✅ No unverifiable claims

- [x] **Key Features List** (3-5 bullet points) ✅
  - ✅ Feature 1: Target exact SKUs with percentage discounts
  - ✅ Feature 2: Bulk import from Excel in seconds
  - ✅ Feature 3: Visual product picker with savings preview
  - ✅ Feature 4: Native Shopify integration
  - ✅ Feature 5: Perfect for clearance and B2B pricing

### Pricing
- [x] **Pricing Model Defined** ✅
  - [ ] Free
  - [ ] One-time charge
  - [x] Recurring subscription ✅
  - [ ] Usage-based
  - ✅ Professional Plan: $19/month
  - ✅ 7-day free trial included
  - ✅ Unlimited SKU discounts
  - ✅ All features included

### Support
- [x] **Support Email**: support@skucustomdiscount.com ✅
- [x] **Support Documentation**: https://docs.skucustomdiscount.com ✅
- [x] **FAQ Section**: https://help.skucustomdiscount.com/faq ✅

## Submission Requirements

### Demo & Testing
- [ ] **Demo Store Setup**
  - Test store with sample data
  - Demo credentials for reviewers
  - Clear paths to test all features

- [ ] **Demo Video/Screencast**
  - Shows complete app flow
  - English or with English subtitles
  - Demonstrates all major features
  - Includes configuration steps

### Review Instructions
- [ ] **Step-by-Step Guide**
  - How to install the app
  - How to configure discounts
  - How to test discount application
  - Expected results
  - Common troubleshooting

- [ ] **Test Data**
  - Sample SKUs to use
  - Discount percentages to test
  - Expected outcomes

## Platform Compatibility

### Browser Support
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

### Shopify Admin
- [ ] Works in new admin (admin.shopify.com)
- [ ] Responsive design
- [ ] Proper mobile experience

## Legal & Compliance

### Documentation
- [x] **Privacy Policy** ✅
  - ✅ URL: https://skucustomdiscount.com/privacy
  - ✅ Data collection practices documented
  - ✅ Data usage explained
  - ✅ Storage and security detailed
  - ✅ User rights (GDPR/CCPA)
  - ✅ Contact information included

- [ ] **Terms of Service**
  - Usage terms
  - Limitations
  - Liability

### Compliance
- [ ] GDPR compliant
- [ ] CCPA considerations
- [ ] Accessibility standards (WCAG 2.1 AA recommended)

## Pre-Submission Verification

### Final Checks
- [ ] All links working
- [ ] No development/test URLs visible
- [ ] No console errors
- [ ] Proper error messages
- [ ] Loading states implemented
- [ ] Empty states handled

### Review Preparation
- [ ] Partner account ready
- [ ] App listing draft saved
- [ ] All assets uploaded
- [ ] Review instructions clear
- [ ] Support channels active

## Notes
- Review process typically takes 10-15 business days
- Be prepared for feedback and iterations
- Quick responses to reviewer feedback speed up approval
- Common rejection reasons:
  - Missing GDPR webhooks
  - Poor performance impact
  - Unclear value proposition
  - Security vulnerabilities
  - Incomplete documentation