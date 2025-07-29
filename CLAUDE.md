# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ✅ WORKING STATUS & QUICK REFERENCE

## Currently Working Features ✅
- **Individual Remove Buttons**: X icon button on each product row - removes single products
- **Clear All Button**: Removes all products with confirmation dialog  
- **Table Auto-Updates**: Products appear/disappear immediately when added/removed
- **Product Selection**: Resource picker opens, allows multiple selection, adds to table
- **Metafield Persistence**: Save/load configuration using 2025-10 API
- **Discount Types**: Percentage and fixed amount switching works
- **Form Integration**: Integrates with Shopify save bar (s-function-settings wrapper)
- **Reload Functionality**: Loads previously saved product configurations

## 🔧 Working Technical Patterns
- **Event Handlers**: Use `onclick` (lowercase), not `onClick`
- **Product Identifiers**: `const identifier = product.sku || product.title || \`product_\${index}\`;`
- **Metafield Operations**: `applyMetafieldChange({ type: 'updateMetafield', namespace, key, value, valueType: 'json' })`
- **Component Structure**: Wrap with `<s-function-settings onsave={handleSubmit} onreset={handleReset}>`
- **API Version**: `api_version = "2025-10"` in shopify.extension.toml  
- **Namespace**: `"app--269949796353--sku-custom-discount"` (app-specific)
- **Form Labels**: Always add `label` and `labelAccessibilityVisibility="hidden"` to form inputs
- **No Unnecessary Reloads**: Don't reload data after successful saves - causes lag
- **Multiple Variant Selection**: Resource picker with `type: 'product'` returns `variants` array when variants are selected:
  ```javascript
  // Check if variants were selected
  if (product.variants && product.variants.length > 0) {
    // Process each selected variant
    for (const variant of product.variants) {
      // Add variant to products list
    }
  }
  ```

## ⚠️ CRITICAL THINGS TO AVOID
- **Excessive Console Logging**: Causes `__SOURCE__ is not defined` HMR errors
- **Empty Loops After Debug Removal**: Can make entire extension disappear
- **Complex Object Logging**: Never `console.log(JSON.stringify(largeObject))`
- **Too Many State Variables**: Adding debug state variables crashes extension
- **Unused Variables**: Always clean up unused variable declarations
- **Over-Engineering Solutions**: Don't try to "fix" normal Shopify behaviors with complex retry logic
- **Interfering with Shopify APIs**: Let Shopify's APIs work as designed, don't add wrapper logic
- **🚨 INVALID COMPONENT PROPS**: Using invalid prop values (like `background="critical-subdued"`) crashes entire extension
- **Untested JSX Additions**: Always test new UI components incrementally - invalid props cause loading freeze
- **🚨 COMPLEX INLINE FUNCTIONS**: Large async functions in onclick handlers cause `__SOURCE__` errors - keep handlers simple
- **🚨 COMPLEX NESTED LOOPS**: Nested forEach/map with complex logic causes `__SOURCE__` errors - use simple for loops instead
- **🚨 FOREACH WITH ASYNC**: NEVER use forEach() in async contexts - ALWAYS use for loops
- **🚨 ARRAY METHODS IN EVENT HANDLERS**: Avoid .map(), .forEach(), .filter() in event handlers - use simple for loops
- **🚨 CAMELCASE ATTRIBUTES**: NEVER use camelCase attributes like `paddingBlock`, `paddingInlineStart` - causes `__SOURCE__` errors. Use kebab-case or standard props only

## 🚨 EMERGENCY FIXES
- **Extension Disappeared**: Check for empty loops, unused variables, or syntax errors
- **`__SOURCE__` Error**: Remove all recent console.log statements  
- **Products Not Showing**: Usually caused by crashes, fix crashes first
- **Save Errors**: Check identifier uniqueness and metafield structure
- **localStorage SecurityError**: Normal Shopify behavior - DO NOT try to fix with retry logic
- **confirm() is not defined**: Browser confirm() not available in sandbox - use state-based confirmation UI
- **🚨 STUCK ON LOADING**: Invalid component props crash extension - use `{false &&` to disable suspicious JSX blocks for debugging
- **🚨 `__SOURCE__` on Resource Picker**: Simplify handler logic - avoid complex nested loops, array methods, or inline async functions

## 🔴 GOLDEN RULE TO PREVENT __SOURCE__ ERRORS
**ALWAYS USE SIMPLE FOR LOOPS** - Never use forEach(), map(), filter(), reduce() in:
- Event handlers (onclick, onchange, etc.)
- Async functions
- Functions that update state
- Any code inside components

**BAD (CAUSES __SOURCE__ ERROR):**
```javascript
variantDetails.forEach(variant => {
  newProducts.push({...});
});
```

**GOOD (ALWAYS WORKS):**
```javascript
for (let i = 0; i < variantDetails.length; i++) {
  const variant = variantDetails[i];
  newProducts.push({...});
}
```

# SKU Custom Discount Extension Project

## Project Overview
This is a Shopify discount function extension that allows merchants to create SKU-based discounts with a custom UI using the latest Shopify Admin UI Extensions (2025-10 API).

## Key Files
- Main UI component: `/extensions/discount-function-settings/src/DiscountFunctionSettingsPreact.jsx`
- Extension config: `/extensions/discount-function-settings/shopify.extension.toml`
- Type definitions: `/extensions/discount-function-settings/src/polaris-web-components.d.ts`
- Discount function: `/extensions/discount-function/src/main.rs`
- App configuration: `/shopify.app.toml`

## Common Commands
```bash
# IMPORTANT: NEVER run the development server via Claude Code
# The user will run it manually if needed

# Build for production
npm run build

# Deploy extension only
npm run deploy

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Run linting
npm run lint

# Generate new extension
POLARIS_UNIFIED=true shopify app generate extension
```

## Architecture Overview

### Tech Stack
- **Admin UI**: Preact with Shopify Polaris Web Components (s-box, s-button, etc.)
- **Discount Function**: Rust/WebAssembly for high-performance discount calculations
- **App Framework**: Remix running on Cloudflare Workers
- **Database**: D1 (Cloudflare's SQLite) for production
- **Session Storage**: KV (Cloudflare Workers KV)

### Extension Structure
1. **UI Extension** (`discount-function-settings`): Provides the merchant-facing configuration UI
2. **Function Extension** (`discount-function`): Executes the discount logic at checkout

## UI Design Requirements
- **Compact design** - Limited space in Shopify discount settings panel
- **Minimal borders and spacing** - Use `gap="tight"` or `gap="extra-tight"`
- **No unnecessary sections** - Remove summary boxes, grid layouts, extra dividers
- **Clean table layout** - Custom table using s-box instead of s-table
- **Size="slim"** on all interactive components

## Polaris Web Components Guidelines (2025-10 API)

### Component Usage
- Use `s-box` instead of `s-card` for better control
- Use `padding="tight"` instead of `padding="base"` or `padding="large"`
- Use `size="small"` for badges and icons
- Use `size="slim"` for all form controls (buttons, inputs, selects)
- Use alternating row backgrounds for table readability
- Remove all mock/sample data - connect to real Shopify APIs

### Event Handling
- Use lowercase event names: `onclick`, `oninput`, `onchange` (not `onClick`)
- Event handlers receive native DOM events
- Access values via `e.target.value`

### Available Components and Properties

#### `s-box` - Flexible container
**Padding**: `padding`, `padding-block`, `padding-inline`, `padding-block-start`, `padding-block-end`, `padding-inline-start`, `padding-inline-end`
**Values**: `extra-tight`, `tight`, `small`, `base`, `large`
**Other**: `background` (default/subdued/strong/success/warning/critical/info), `border-radius` (none/small/base/large/full), `width`, `height`, `min-width`, `max-width`
**IMPORTANT**: Use kebab-case (padding-inline), NOT camelCase (paddingInline)

#### `s-text-field` - Text inputs
**Props**: `name`, `value`, `label`, `placeholder`, `type`, `min`, `max`, `suffix`, `prefix`, `error`, `disabled`, `readonly`, `size` (slim/medium)
**Events**: `oninput`, `onchange`, `onfocus`, `onblur`
**Label hiding**: Use `label` + `label-accessibility-visibility="hidden"`

#### `s-select` - Dropdown selections  
**Props**: `name`, `value`, `label`, `disabled`, `error`, `size` (slim/medium)
**Events**: `onchange`
**Label hiding**: Use `label` + `label-accessibility-visibility="hidden"`

#### `s-button` - Action buttons
**Props**: `variant` (primary/secondary/plain), `tone` (critical/success), `size` (slim/medium/large), `disabled`, `icon`
**Events**: `onclick`

#### `s-text` - Typography
**Props**: `variant` (bodySm/bodyMd/bodyLg/headingSm/headingMd/headingLg), `tone` (base/subdued/critical/success), `font-weight` (regular/medium/bold)

#### `s-badge` - Status indicators
**Props**: `size` (small/medium), `tone` (success/warning/critical/info/default)

#### `s-stack` - Layout container
**Props**: `direction` (block/inline), `gap` (extra-tight/tight/small/base/large), `align`, `distribution`

#### `s-grid` - Grid layout
**Props**: `grid-template-columns`, `gap`, `align-items`

#### Other Components
- `s-function-settings` - Root container with `onsave` and `onreset` events
- `s-form` - Form wrapper for save bar integration
- `s-text-area` - Multi-line text with `rows`, `label` props
- `s-thumbnail` - Product images
- `s-icon` - Shopify icons with `name` prop
- `s-heading` - Section headings with `size` prop

## Available Shopify APIs

### Window APIs
- `window.shopify.applyMetafieldChange` - Save discount configuration
- `window.shopify.resourcePicker` - Product selection modal
- `window.shopify.query` - GraphQL queries
- `window.shopify.data` - Access to discount and metafield data

### Metafield Configuration
- Namespace: `"$app:sku-custom-discount"`
- Key: `"function-configuration"`
- Type: JSON structure containing product discounts

## Technical Implementation Details

### Product Selection
```javascript
const selected = await window.shopify.resourcePicker({
  type: 'product',
  multiple: true
});

// Handle multiple variant selection (2025-10 API)
// When variants are selected, the picker returns:
// [{ id: 'gid://shopify/Product/123', variants: [{ id: 'gid://shopify/ProductVariant/456' }, ...] }]
```

### Saving Configuration
```javascript
await window.shopify.applyMetafieldChange({
  type: 'updateMetafield',
  namespace: '$app:sku-custom-discount',
  key: 'function-configuration',
  value: JSON.stringify(configuration)
});
```

### GraphQL Product Query (2025-10 API)
```graphql
query ProductSearch($query: String!) {
  products(first: 50, query: $query) {
    nodes {
      id
      title
      variants(first: 10) {
        nodes {
          id
          sku
          price {
            amount
            currencyCode
          }
        }
      }
      images(first: 1) {
        nodes {
          url
        }
      }
    }
  }
}
```

**IMPORTANT**: In 2025-10 API, `price` is no longer a scalar Money type. It's now an object with `amount` and `currencyCode` fields. Always access price as `variant.price.amount`.

## Important Notes
- Extensions run in sandboxed iframe environment
- Limited vertical space - design must be compact
- Use Shopify's resource picker for product selection
- Save configuration to metafields with namespace "$app:sku-custom-discount"
- The extension module path in `shopify.extension.toml` must match the actual file
- Always use `POLARIS_UNIFIED=true` when generating or running extensions

## Common Issues & Solutions

### Extension Not Loading
- Ensure `api_version = "2025-10"` in extension toml
- Check that module path matches actual file location
- Verify target is `admin.discount-details.function-settings.render`

### Extension Crashing / Disappearing
- **CRITICAL**: Avoid extensive console.log statements in the extension code
- Hot module replacement (HMR) can break with too much logging
- Complex object logging (especially with circular references) causes `__SOURCE__ is not defined` errors
- Keep console.log statements minimal and simple
- Never use `JSON.stringify` on the full data object in console.log
- **IMPORTANT**: When removing console.log statements, ensure no empty loops or unused variables remain
- Empty forEach loops or unused variable declarations can cause the extension to disappear
- Always test the extension after removing debug code

### Styling Issues
- Use inline styles sparingly with proper syntax
- Prefer component props over custom CSS
- Test on both desktop and mobile viewports

### Data Persistence
- Always save to metafields, not local state
- Handle loading states while fetching configuration
- Validate data before saving

## Deployment Workflow

### Development
1. Run `POLARIS_UNIFIED=true npm run dev`
2. Test in development store
3. Use `shopify app logs` for debugging

### Staging
1. Update `shopify.app.staging.toml` with staging URLs
2. Run `npm run deploy:staging`
3. Test in staging environment

### Production
1. Update `shopify.app.production.toml` with production URLs
2. Run `npm run deploy:production`
3. Submit for Shopify App Store review if needed