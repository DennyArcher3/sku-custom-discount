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
- [ ] **Core Features Working**
  - Discount creation flow works smoothly
  - SKU-based discounts apply correctly
  - Configuration saves properly
  - Error handling is user-friendly

## App Listing Requirements

### Basic Information
- [x] **App Name**: "SKU Custom Discount" (18 characters) ✓
- [ ] **Tagline**: _______________ (max 62 characters)
- [ ] **App URL**: https://________________

### Visual Assets
- [ ] **App Icon**
  - Size: 1200x1200 pixels
  - Format: PNG or JPG
  - No text or screenshots
  - Bold, simple design
  - High contrast

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
- [ ] **App Introduction** (100 characters)
  - Clear value proposition
  - Compelling and concise

- [ ] **Detailed Description**
  - Explain what the app does
  - List key features
  - Describe benefits to merchants
  - Include use cases
  - No unverifiable claims ("the best", "the only")

- [ ] **Key Features List** (3-5 bullet points)
  - Feature 1: _______________
  - Feature 2: _______________
  - Feature 3: _______________

### Pricing
- [ ] **Pricing Model Defined**
  - [ ] Free
  - [ ] One-time charge
  - [ ] Recurring subscription
  - [ ] Usage-based
  - Clearly explain what's included

### Support
- [ ] **Support Email**: _______________
- [ ] **Support Documentation**: _______________
- [ ] **FAQ Section**: _______________

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
- [ ] **Privacy Policy**
  - How data is collected
  - How data is used
  - How data is stored
  - User rights
  - Contact information

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