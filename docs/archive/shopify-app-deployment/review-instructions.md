# SKU Custom Discount - Review Instructions for Shopify

## Overview
SKU Custom Discount allows merchants to create percentage-based discounts for specific products identified by their SKU. This app is perfect for clearance sales, vendor-specific promotions, or targeted inventory management.

## Test Store Access
```
Store URL: [your-test-store].myshopify.com
Email: reviewer@example.com
Password: ReviewTest2024!
```

## Installation Process (2 minutes)

1. **Install the App**
   - Click "Add app" from the app listing
   - You'll be redirected to authenticate
   - Approve the requested permissions
   - Installation completes automatically

2. **Initial Setup**
   - After installation, you'll see the app dashboard
   - No additional configuration required
   - The app is ready to use immediately

## Creating a Discount (5 minutes)

### Method 1: Direct Navigation
1. From the app page, click "Create Discount"
2. You'll be redirected to Shopify's discount creation page
3. Select "SKU Custom Discount" from the apps section

### Method 2: From Discounts Menu
1. Navigate to **Discounts** in Shopify Admin
2. Click **"Create discount"**
3. Select **"SKU Custom Discount"** from the apps section

### Configure the Discount
1. **Discount Code**: Enter a code (e.g., "SKUTEST20")
2. **Configure SKU Discounts**:
   - Click "Select Products" to browse and add products
   - Or use "Bulk Import" for multiple SKUs
   - Set discount percentage for each SKU (0-100%)
3. **Save** the configuration

## Test Scenarios

### Scenario 1: Single SKU Discount
1. Add these products via "Select Products":
   - Find any product in your store
   - Set discount to 25%
2. Save the discount
3. Add that product to cart
4. Apply the discount code
5. **Expected**: 25% discount applied to that product only

### Scenario 2: Multiple SKUs with Different Discounts
1. Use "Bulk Import" with this data:
   ```
   GIFT-CARD    15
   T-SHIRT-S    30
   HAT-BLUE     50
   ```
2. Save the discount
3. Add these products to cart
4. Apply the discount code
5. **Expected**: Each product has its specific discount applied

### Scenario 3: Mixed Cart
1. Add both configured and non-configured products to cart
2. Apply the discount code
3. **Expected**: Discount only applies to configured SKUs

## Testing the Bulk Import Feature

1. Click "Bulk Import" in the configuration
2. Paste the following test data:
   ```
   TEST-001    20
   TEST-002    35
   TEST-003    10
   ```
3. Click "Import"
4. **Expected**: Products with these SKUs appear with correct discount percentages

## Key Features to Test

### 1. Product Selection
- ✓ Browse and select products
- ✓ Search by product name
- ✓ View product images and prices
- ✓ Select multiple products at once

### 2. Discount Configuration
- ✓ Set individual discount percentages
- ✓ Update existing discounts
- ✓ Remove products from list
- ✓ Clear all products

### 3. Data Persistence
- ✓ Edit an existing discount
- ✓ Verify previously configured SKUs are loaded
- ✓ Make changes and save
- ✓ Verify changes persist

## Performance Testing

1. **Page Load Time**
   - The configuration interface loads within 2 seconds
   - No impact on Shopify Admin performance

2. **Lighthouse Score**
   - Baseline score: [Include screenshot]
   - Score with app: [Include screenshot]
   - Impact: Less than 10 points

## Error Handling

### Test Invalid Inputs
1. Try to set discount > 100%
   - **Expected**: Input limited to 100%
2. Import invalid data format
   - **Expected**: Clear error message displayed
3. Save without any products
   - **Expected**: Saves successfully (empty configuration)

## Common Issues & Solutions

### Issue: Products not found during import
**Solution**: The bulk import searches by exact SKU match. Ensure SKUs exist in your store.

### Issue: Discount not applying
**Solution**: Verify the discount code is active and the product SKU matches exactly.

### Issue: Can't save configuration
**Note**: Due to a known Shopify platform limitation, if you see a metafield error:
1. Save the discount without products first
2. Edit the discount and add products
3. Save again (usually works on second attempt)

## GDPR Compliance

The app implements required GDPR webhooks:
- Customer data request: No customer data stored
- Customer redact: No customer data to delete
- Shop redact: Removes all shop configuration data

## Support Information

- **Email**: support@[yourdomain].com
- **Response Time**: Within 24 hours
- **Documentation**: [Link to docs]

## Additional Notes for Reviewers

1. **App Type**: This is a discount function app with admin UI extension
2. **Data Storage**: Discount configurations are stored in Shopify metafields
3. **Performance**: Minimal impact as processing happens at checkout
4. **Compatibility**: Works with all Shopify plans that support discount functions

## Checklist for Review

- [ ] Installation completes successfully
- [ ] OAuth flow works correctly
- [ ] Discount creation interface loads
- [ ] Products can be added via selection
- [ ] Bulk import functionality works
- [ ] Discounts apply correctly at checkout
- [ ] Configuration persists between sessions
- [ ] No console errors during operation
- [ ] Performance impact is minimal

Thank you for reviewing SKU Custom Discount! If you encounter any issues or have questions, please don't hesitate to contact us.