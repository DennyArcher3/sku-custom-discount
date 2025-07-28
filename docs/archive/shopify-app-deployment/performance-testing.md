# Performance Testing Guide - SKU Custom Discount

## Overview

This document outlines the performance testing requirements and procedures for the SKU Custom Discount app to ensure it meets Shopify App Store standards.

## Performance Requirements

Shopify requires that your app:
- Does not reduce Lighthouse performance score by more than 10 points
- Loads quickly and responds to user interactions promptly
- Does not negatively impact the merchant's store performance

## Testing Tools

### 1. Google Lighthouse
Primary tool for measuring performance impact

### 2. Shopify Web Performance Dashboard
Available in Partner Dashboard for monitoring real-world performance

### 3. Chrome DevTools
For detailed performance profiling

## Pre-Test Setup

### 1. Create Clean Test Store
```bash
# Use Shopify CLI to create a development store
shopify app generate test-store
```

### 2. Baseline Measurement
1. Install Chrome browser (latest version)
2. Open test store without app installed
3. Navigate to a product page
4. Run Lighthouse test and save results

## Lighthouse Testing Procedure

### Step 1: Baseline Test (Without App)

1. Open Chrome in Incognito mode
2. Navigate to test store admin
3. Open Chrome DevTools (F12)
4. Go to Lighthouse tab
5. Configure test:
   - Device: Desktop
   - Categories: Performance (required), Accessibility, Best Practices, SEO
   - Throttling: Simulated (default)
6. Run audit
7. Save results:
   ```
   Performance: ___/100
   Accessibility: ___/100
   Best Practices: ___/100
   SEO: ___/100
   ```

### Step 2: Install App
1. Install SKU Custom Discount app
2. Configure a test discount
3. Ensure app is fully loaded

### Step 3: Test With App Installed

1. Repeat Lighthouse test with same configuration
2. Test these specific pages:
   - Admin dashboard
   - Discounts list page
   - Discount creation page (with app UI)
   - Product page (to verify no frontend impact)

### Step 4: Calculate Impact
```
Performance Impact = Baseline Score - With App Score
(Must be less than 10 points)
```

## Performance Optimization Checklist

### JavaScript Optimization
- [ ] Bundle size minimized
- [ ] Code splitting implemented
- [ ] Lazy loading for non-critical components
- [ ] Tree shaking enabled
- [ ] No unused dependencies

### Asset Optimization
- [ ] Images optimized and compressed
- [ ] SVG icons instead of image files where possible
- [ ] Fonts loaded efficiently
- [ ] CSS minimized

### React Optimization
- [ ] React.memo used for expensive components
- [ ] useMemo/useCallback for expensive operations
- [ ] Virtual scrolling for long lists
- [ ] Proper key props for lists

### Network Optimization
- [ ] API calls batched when possible
- [ ] Proper caching implemented
- [ ] No unnecessary API calls
- [ ] GraphQL queries optimized

## Current Performance Metrics

### Bundle Sizes
```
Main bundle: ___ KB (gzipped)
Vendor bundle: ___ KB (gzipped)
UI Extension: ___ KB
Total: ___ KB
```

### Load Times
```
Initial Load: ___ ms
Time to Interactive: ___ ms
First Contentful Paint: ___ ms
Largest Contentful Paint: ___ ms
```

## Performance Test Results Template

### Test Environment
- Date: ___________
- Shopify Plan: ___________
- Browser: Chrome v___
- Network: Fast 3G / No throttling
- Device: Desktop / Mobile

### Baseline Scores (No App)
| Metric | Score |
|--------|-------|
| Performance | ___/100 |
| Accessibility | ___/100 |
| Best Practices | ___/100 |
| SEO | ___/100 |

### With App Installed
| Metric | Score | Impact |
|--------|-------|---------|
| Performance | ___/100 | -___ |
| Accessibility | ___/100 | -___ |
| Best Practices | ___/100 | -___ |
| SEO | ___/100 | -___ |

### Screenshots
- [ ] Baseline Lighthouse report
- [ ] With app Lighthouse report
- [ ] Performance trace if issues found

## Common Performance Issues & Solutions

### Issue: Large Bundle Size
**Solution**: 
- Implement code splitting
- Remove unused dependencies
- Use dynamic imports

### Issue: Slow API Calls
**Solution**:
- Batch GraphQL queries
- Implement proper caching
- Use pagination for large datasets

### Issue: Memory Leaks
**Solution**:
- Clean up event listeners
- Cancel pending requests
- Clear timers and intervals

### Issue: Render Blocking Resources
**Solution**:
- Async/defer script loading
- Critical CSS inline
- Preload key resources

## Monitoring Performance

### Post-Launch Monitoring
1. Set up Shopify Web Performance monitoring
2. Monitor Core Web Vitals
3. Set up alerts for performance degradation
4. Regular performance audits (monthly)

### Key Metrics to Track
- Page load time
- Time to interactive
- API response times
- Error rates
- Bundle size over time

## Performance Budget

Set limits to prevent regression:
- Main bundle: < 200KB gzipped
- Total JavaScript: < 500KB gzipped
- Time to Interactive: < 3 seconds
- Lighthouse Performance Score: > 90

## Submission Requirements

For App Store submission, include:
1. Lighthouse report screenshots (before/after)
2. Performance impact statement
3. Optimization efforts made
4. Monitoring plan

## Testing Commands

```bash
# Build production bundle
npm run build

# Analyze bundle size
npm run build:analyze

# Run local performance test
npm run perf:test

# Generate performance report
npm run perf:report
```

## Resources

- [Shopify Performance Best Practices](https://shopify.dev/docs/apps/best-practices/performance)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)

## Notes

- Test during different times of day
- Test with realistic data volumes
- Consider geographic distribution
- Test on various devices and networks
- Document all optimizations made