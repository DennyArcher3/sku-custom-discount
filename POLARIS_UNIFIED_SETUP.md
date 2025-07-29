# Polaris Unified Web Components Setup

## What We've Done

### 1. Updated API Version
- Changed all extensions to use API version `2025-10RC` (Release Candidate)
- Updated `shopify.app.toml` and extension `.toml` files
- Updated `ApiVersion.October25` in `shopify.server.ts`

### 2. App Home Setup (Main Remix App)
✅ **Already configured:**
- Polaris web components script added in `app/root.tsx`
- TypeScript types installed and configured in `tsconfig.json`

### 3. Admin UI Extensions
- API version set to `2025-10RC` in extension configuration
- Created Preact-based example: `DiscountFunctionSettingsPreact.jsx`
- Updated package.json to use Preact instead of React

## Key Differences

### Before (2025-07 - React Components)
```jsx
import { Table, TableRow } from "@shopify/ui-extensions-react/admin";

<Table>
  <TableRow>...</TableRow>
</Table>
```

### Now (2025-10RC - Web Components)
```jsx
// No imports needed - web components are global
<s-table>
  <s-table-row>...</s-table-row>
</s-table>
```

## Available New Components

1. **Table** (`<s-table>`)
   - Full table support with headers, rows, cells
   - Responsive - auto-converts to list on mobile
   - Pagination support

2. **Grid** (`<s-grid>`)
   - CSS Grid-based layout
   - Responsive with `gridTemplateColumns`

3. **Stack** (`<s-stack>`)
   - Enhanced with responsive direction support
   - Container queries for responsive behavior

4. **QueryContainer** (`<s-query-container>`)
   - Enables container queries for responsive design

5. **OrderedList** (`<s-ordered-list>`)
   - Semantic numbered lists

## How to Use

### In App Home (Remix App)
```tsx
// Components are available globally after script inclusion
export function MyComponent() {
  return (
    <s-page title="My Page">
      <s-table>
        <s-table-header-row>
          <s-table-header>Column 1</s-table-header>
        </s-table-header-row>
        <s-table-body>
          <s-table-row>
            <s-table-cell>Data</s-table-cell>
          </s-table-row>
        </s-table-body>
      </s-table>
    </s-page>
  );
}
```

### In Admin UI Extensions
1. Ensure `api_version = "2025-10RC"` in extension's `shopify.extension.toml`
2. Use Preact (scaffolded by default with `POLARIS_UNIFIED=true`)
3. Components work the same way

## Development

### For Extensions
```bash
# Generate new extension with Polaris Unified
POLARIS_UNIFIED=true shopify app generate extension

# Deploy extensions only
shopify app deploy --only-extensions
```

### For Cloudflare Workers Development
```bash
# Your normal development command works
wrangler dev --port 8788
```

## Resources

- [Polaris Web Components Storybook](https://storybook.polaris-admin.shopify.dev/)
- [App Home Documentation](https://shopify.dev/docs/api/app-home)
- [Polaris Components List](https://shopify.dev/docs/api/app-home/polaris-web-components)

## Notes

- Web components work with any framework (React, Preact, Vue, vanilla JS)
- No React runtime overhead in extensions
- Consistent UI across all Shopify surfaces
- Always up-to-date via CDN