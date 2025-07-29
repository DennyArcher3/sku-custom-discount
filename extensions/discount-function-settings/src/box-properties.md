# s-box Component Properties Documentation

## Overview

The `s-box` component is the most primitive layout component in Shopify's Polaris web components. It provides direct access to Polaris design tokens for creating custom layouts with consistent spacing and styling.

## Property Types

### SizeUnits Type
```typescript
type SizeUnits = `${number}px` | `${number}%` | `0`;
```

### Scale Type
The scale system moves from the middle out:
```typescript
type Scale =
  | 'small-300'  // Smallest
  | 'small-200'
  | 'small-100'
  | 'small'      // Alias of small-100
  | 'base'       // Default value
  | 'large'      // Alias of large-100
  | 'large-100'
  | 'large-200'
  | 'large-300'; // Largest
```

### BorderRadius Values
```typescript
type BorderRadius = 
  | 'none'
  | 'small'
  | 'base'
  | 'large'
  | 'full';
```

### Color Values
```typescript
type BackgroundColor = 
  | 'default'
  | 'subdued'
  | 'strong'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info';
```

### Border Values
```typescript
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'none';
type BorderColor = 'base' | 'strong' | 'subdued' | 'critical' | 'success' | 'warning' | 'info';
```

## Properties

### Padding Properties

| Property | Type | Description |
|----------|------|-------------|
| `padding` | `Scale` | Applies padding to all sides |
| `paddingBlock` | `Scale` | Vertical (top and bottom) padding |
| `paddingBlockStart` | `Scale` | Top padding (in vertical writing mode) |
| `paddingBlockEnd` | `Scale` | Bottom padding (in vertical writing mode) |
| `paddingInline` | `Scale` | Horizontal (left and right) padding |
| `paddingInlineStart` | `Scale` | Left padding (in LTR mode) |
| `paddingInlineEnd` | `Scale` | Right padding (in LTR mode) |

### Margin Properties

| Property | Type | Description |
|----------|------|-------------|
| `margin` | `Scale` | Applies margin to all sides |
| `marginBlock` | `Scale` | Vertical (top and bottom) margin |
| `marginBlockStart` | `Scale` | Top margin (in vertical writing mode) |
| `marginBlockEnd` | `Scale` | Bottom margin (in vertical writing mode) |
| `marginInline` | `Scale` | Horizontal (left and right) margin |
| `marginInlineStart` | `Scale` | Left margin (in LTR mode) |
| `marginInlineEnd` | `Scale` | Right margin (in LTR mode) |

### Border Properties

| Property | Type | Description |
|----------|------|-------------|
| `border` | `string` | Shorthand: `size-keyword color-keyword style-keyword` |
| `borderWidth` | `Scale` | Border width for all sides |
| `borderColor` | `BorderColor` | Border color for all sides |
| `borderStyle` | `BorderStyle` | Border style for all sides |
| `borderRadius` | `BorderRadius` | Border radius for all corners |
| `borderEndStartRadius` | `BorderRadius` | Bottom-left corner radius |
| `borderEndEndRadius` | `BorderRadius` | Bottom-right corner radius |
| `borderStartStartRadius` | `BorderRadius` | Top-left corner radius |
| `borderStartEndRadius` | `BorderRadius` | Top-right corner radius |

### Background Properties

| Property | Type | Description |
|----------|------|-------------|
| `background` | `BackgroundColor` | Background color of the box |

### Layout Properties

| Property | Type | Description |
|----------|------|-------------|
| `display` | `'block' \| 'inline' \| 'inline-block' \| 'flex' \| 'inline-flex' \| 'grid' \| 'none'` | Display type |
| `position` | `'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'` | Position type |
| `width` | `SizeUnits` | Width of the box |
| `height` | `SizeUnits` | Height of the box |
| `minWidth` | `SizeUnits` | Minimum width |
| `maxWidth` | `SizeUnits` | Maximum width |
| `minHeight` | `SizeUnits` | Minimum height |
| `maxHeight` | `SizeUnits` | Maximum height |

### Position Properties

| Property | Type | Description |
|----------|------|-------------|
| `insetBlockStart` | `SizeUnits` | Top position |
| `insetBlockEnd` | `SizeUnits` | Bottom position |
| `insetInlineStart` | `SizeUnits` | Left position (in LTR mode) |
| `insetInlineEnd` | `SizeUnits` | Right position (in LTR mode) |

### Responsive Values

Some properties support responsive values using container queries:

```html
<s-box padding="@container (inline-size < 500px) small, large">
  Content adapts based on container size
</s-box>
```

**Syntax Rules:**
1. Begin with `@container`
2. Optionally add a container name
3. Use `inline-size` in parentheses for the condition
4. Value if condition is true
5. Value if condition is false

## Usage Examples

### Basic Box with Padding and Border
```html
<s-box
  padding="base"
  background="subdued"
  border="base"
  borderRadius="base"
>
  Content with standard styling
</s-box>
```

### Complex Layout with Multiple Properties
```html
<s-box
  paddingInline="large"
  paddingBlock="small"
  marginBlock="base"
  background="info"
  borderRadius="large"
  borderWidth="base"
  borderColor="strong"
  borderStyle="solid"
>
  Custom styled content
</s-box>
```

### Responsive Box
```html
<s-query-container>
  <s-box 
    padding="@container (inline-size < 768px) small, large"
    display="@container (inline-size < 768px) block, flex"
  >
    Responsive content
  </s-box>
</s-query-container>
```

### Positioned Box
```html
<s-box
  position="absolute"
  insetBlockStart="0"
  insetInlineEnd="0"
  padding="small"
  background="critical"
  borderRadius="full"
>
  Positioned element
</s-box>
```

### Using Border Shorthand
```html
<!-- Order: size-keyword color-keyword style-keyword -->
<s-box border="base strong solid">
  Box with shorthand border
</s-box>
```

## Best Practices

1. **Use semantic properties**: Prefer logical properties (paddingInline, marginBlock) over physical ones for better internationalization support.

2. **Leverage the scale system**: Use the consistent scale values (small, base, large) rather than custom pixel values.

3. **Avoid custom CSS**: The component properties should handle most styling needs without custom CSS.

4. **Use responsive values sparingly**: Only when truly needed for adaptive layouts.

5. **Combine with layout components**: Use s-box for fine-tuned control, but prefer s-section and s-page for standard layouts.

## Notes

- All properties are optional
- Default values follow Polaris design system standards
- Properties follow CSS logical properties naming convention
- The component outputs with `display: contents` by default unless display property is set
- Use s-query-container when implementing responsive values