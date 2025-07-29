# Shopify S-* Web Components Styling Guide

## Key Principles for S-* Components

### 1. Spacing System
Instead of using gap/alignItems, use the proper attributes:
- **s-stack**: Use `spacing` attribute with values: "none", "100", "200", "300", "400", "500"
- **s-stack**: Use `orientation` for direction: "horizontal" or "vertical" (default)
- **s-stack**: Use `align` for alignment: "start", "center", "end", "stretch"

### 2. Padding System
Use numeric values for padding:
- `padding="100"` - Extra tight
- `padding="200"` - Tight  
- `padding="300"` - Base
- `padding="400"` - Loose
- `padding="500"` - Extra loose

### 3. Background Colors
Use semantic color names:
- `background="surface"` - Default surface
- `background="surface-subdued"` - Subdued background
- `background="surface-critical"` - Critical/error background
- `background="surface-success"` - Success background

### 4. Button Variants
- `variant="primary"` - Primary action
- `variant="secondary"` - Secondary action
- `variant="plain"` - Text-only button
- Use `destructive` attribute for delete actions (not `tone="critical"`)

### 5. Text Variants
- `variant="heading-lg"`, `variant="heading-md"`, `variant="heading-sm"`
- `variant="body-lg"`, `variant="body-md"`, `variant="body-sm"`
- Use `weight` attribute: "regular", "medium", "semibold", "bold"
- Use `color` attribute: "default", "subdued", "success", "critical", "warning", "info"

### 6. Thumbnail Component
- Use `src` attribute (not `source`)
- Sizes: "extra-small", "small", "medium", "large"
- Always provide `alt` attribute

### 7. Form Components
- Always use `label-hidden` if you don't want to show labels
- Use `size` attribute: "small", "medium", "large"
- For multiline text, use `multiline` attribute with `rows`

### 8. Icons
- Use `source` attribute with icon name (lowercase, hyphenated)
- Use `size` attribute with numeric values: "100", "200", "300"

### 9. Borders
- Use `border` attribute: "divider", "divider-strong"
- Use `border-radius` attribute: "050", "100", "200", "300"

### 10. Style Objects
- Use camelCase in style objects: `style={{ marginTop: '16px' }}`
- Not string format: `style="margin-top: 16px"`

## Common Mistakes to Avoid

1. ❌ `gap="tight"` → ✅ `spacing="200"`
2. ❌ `direction="inline"` → ✅ `orientation="horizontal"`
3. ❌ `tone="critical"` → ✅ `destructive` or `status="critical"`
4. ❌ `fontWeight="semibold"` → ✅ `weight="semibold"`
5. ❌ `variant="bodySm"` → ✅ `variant="body-sm"`
6. ❌ `source={imageUrl}` → ✅ `src={imageUrl}` (for thumbnails)
7. ❌ `padding="tight"` → ✅ `padding="200"`
8. ❌ `size="slim"` → ✅ `size="small"` or `size="medium"`

## Example Patterns

### Properly Spaced Card:
```jsx
<s-box padding="400" background="surface" border-radius="100" border="divider">
  <s-stack spacing="300">
    <s-text variant="heading-sm">Title</s-text>
    <s-text variant="body-md" color="subdued">Description</s-text>
  </s-stack>
</s-box>
```

### Button Group:
```jsx
<s-stack orientation="horizontal" spacing="200">
  <s-button variant="primary" size="medium">Save</s-button>
  <s-button variant="secondary" size="medium">Cancel</s-button>
</s-stack>
```

### Product Row:
```jsx
<s-stack orientation="horizontal" spacing="300" align="center">
  <s-thumbnail src={productImage} alt={productTitle} size="small" />
  <s-box style={{ flex: '1' }}>
    <s-text variant="body-sm" weight="medium">{productTitle}</s-text>
  </s-box>
  <s-button variant="plain" destructive icon="delete" />
</s-stack>
```