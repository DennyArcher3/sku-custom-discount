# Stack

Organizes elements horizontally or vertically along the block or inline axis. Use to structure layouts, group related components, or control spacing between elements.

```html
<s-stack gap="base">
  <s-badge>Paid</s-badge>
  <s-badge>Processing</s-badge>
  <s-badge>Filled</s-badge>
  <s-badge>Completed</s-badge>
</s-stack>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-stack gap="base">
  <s-badge>Paid</s-badge>
  <s-badge>Processing</s-badge>
  <s-badge>Filled</s-badge>
  <s-badge>Completed</s-badge>
</s-stack>
</body></html>
```

## Properties

### Stack

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### adoptedCallback

value: `() => void`


### alignContent

value: `AlignContentKeyword`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
Aligns the Stack along the cross axis.

### alignItems

value: `AlignItemsKeyword`

  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the Stack's children along the cross axis.

### attributeChangedCallback

value: `(name: string) => void`


### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### columnGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the inline axis.

This overrides the column value of `gap`. `columnGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### connectedCallback

value: `() => void`


### direction

value: `MakeResponsive<"inline" | "block">`

  - MakeResponsive: T | `@container${string}`
Sets how the Stack's children are placed within the Stack.

`direction` either accepts: * a single value either `inline` or `block` *OR a container query string with either of these values as a query value (e.g. `@container (inline-size > 500px) inline, block`)

### disconnectedCallback

value: `() => void`


### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### gap

value: `MakeResponsive<MaybeTwoValuesShorthandProperty<SpacingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements.

`gap` can either accept: * a single SpacingKeyword value applied to both axes (e.g. `large-100`). * OR a pair of values (eg `large-100 large-500`) can be used to set the inline and block axes respectively. * OR a container query string with supported SpacingKeyword values as query values (e.g.@container (inline-size > 500px) large-300, small-300)

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### justifyContent

value: `JustifyContentKeyword`

  - JustifyContentKeyword: 'normal' | ContentDistribution | OverflowPosition | ContentPosition
Aligns the Stack along the main axis.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### rowGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the block axis.

This overrides the row value of `gap`. `rowGap` either accepts a single SpacingKeyword value (e.g. `large-100`) OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### setAttribute

value: `(name: string, value: string) => void`


### ClickOptions

### sourceEvent

value: `ActivationEventEsque`

  - ActivationEventEsque: export interface ActivationEventEsque {
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  button: number;
}
The event you want to influence the synthetic click.

### ActivationEventEsque

### button

value: `number`


### ctrlKey

value: `boolean`


### metaKey

value: `boolean`


### shiftKey

value: `boolean`


