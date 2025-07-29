# Grid

Use `s-grid` to organize your content in a matrix of rows and columns and make responsive layouts for pages. Grid follows the same pattern as the [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout).

```html
<s-grid
  gridTemplateColumns="repeat(2, 1fr)"
  gap="small"
  justifyContent="center"
>
  <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
    Summary of sales
  </s-grid-item>
  <s-grid-item gridColumn="span 1" border="base" borderStyle="dashed">
    Orders
  </s-grid-item>
  <s-grid-item gridColumn="auto" border="base" borderStyle="dashed">
    Customers
  </s-grid-item>
</s-grid>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-grid
  gridTemplateColumns="repeat(2, 1fr)"
  gap="small"
  justifyContent="center"
>
  <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
    Summary of sales
  </s-grid-item>
  <s-grid-item gridColumn="span 1" border="base" borderStyle="dashed">
    Orders
  </s-grid-item>
  <s-grid-item gridColumn="auto" border="base" borderStyle="dashed">
    Customers
  </s-grid-item>
</s-grid>
</body></html>
```

## Properties

### Grid

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

value: `"" | AlignContentKeyword`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
Aligns the grid along the block (column) axis.

This overrides the block value of `placeContent`.

### alignItems

value: `"" | AlignItemsKeyword`

  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the grid items along the block (column) axis.

This overrides the block value of `placeItems`.

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

This overrides the column value of `gap`. `columnGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) * OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### connectedCallback

value: `() => void`


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

`gap` can either accept: * a single SpacingKeyword value applied to both axes (e.g. `large-100`). *OR a pair of values (eg `large-100 large-500`) can be used to set the inline and block axes respectively. OR a container query string with supported SpacingKeyword values as query values (e.g.@container (inline-size > 500px) large-300, small-300)

### gridTemplateColumns

value: `string`

Define columns and specify their size.

### gridTemplateRows

value: `string`

Define rows and specify their size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### justifyContent

value: `"" | JustifyContentKeyword`

  - JustifyContentKeyword: 'normal' | ContentDistribution | OverflowPosition | ContentPosition
Aligns the grid along the inline (row) axis.

This overrides the inline value of `placeContent`.

### justifyItems

value: `"" | JustifyItemsKeyword`

  - JustifyItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the grid items along the inline (row) axis.

This overrides the inline value of `placeItems`.

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

### placeContent

value: `"normal normal" | "normal stretch" | "normal start" | "normal end" | "normal center" | "normal unsafe start" | "normal unsafe end" | "normal unsafe center" | "normal safe start" | "normal safe end" | "normal safe center" | "stretch normal" | "stretch stretch" | "stretch start" | "stretch end" | "stretch center" | "stretch unsafe start" | "stretch unsafe end" | "stretch unsafe center" | "stretch safe start" | "stretch safe end" | "stretch safe center" | "baseline normal" | "baseline stretch" | "baseline start" | "baseline end" | "baseline center" | "baseline unsafe start" | "baseline unsafe end" | "baseline unsafe center" | "baseline safe start" | "baseline safe end" | "baseline safe center" | "first baseline normal" | "first baseline stretch" | "first baseline start" | "first baseline end" | "first baseline center" | "first baseline unsafe start" | "first baseline unsafe end" | "first baseline unsafe center" | "first baseline safe start" | "first baseline safe end" | "first baseline safe center" | "last baseline normal" | "last baseline stretch" | "last baseline start" | "last baseline end" | "last baseline center" | "last baseline unsafe start" | "last baseline unsafe end" | "last baseline unsafe center" | "last baseline safe start" | "last baseline safe end" | "last baseline safe center" | "start normal" | "start stretch" | "start start" | "start end" | "start center" | "start unsafe start" | "start unsafe end" | "start unsafe center" | "start safe start" | "start safe end" | "start safe center" | "end normal" | "end stretch" | "end start" | "end end" | "end center" | "end unsafe start" | "end unsafe end" | "end unsafe center" | "end safe start" | "end safe end" | "end safe center" | "center normal" | "center stretch" | "center start" | "center end" | "center center" | "center unsafe start" | "center unsafe end" | "center unsafe center" | "center safe start" | "center safe end" | "center safe center" | "unsafe start normal" | "unsafe start stretch" | "unsafe start start" | "unsafe start end" | "unsafe start center" | "unsafe start unsafe start" | "unsafe start unsafe end" | "unsafe start unsafe center" | "unsafe start safe start" | "unsafe start safe end" | "unsafe start safe center" | "unsafe end normal" | "unsafe end stretch" | "unsafe end start" | "unsafe end end" | "unsafe end center" | "unsafe end unsafe start" | "unsafe end unsafe end" | "unsafe end unsafe center" | "unsafe end safe start" | "unsafe end safe end" | "unsafe end safe center" | "unsafe center normal" | "unsafe center stretch" | "unsafe center start" | "unsafe center end" | "unsafe center center" | "unsafe center unsafe start" | "unsafe center unsafe end" | "unsafe center unsafe center" | "unsafe center safe start" | "unsafe center safe end" | "unsafe center safe center" | "safe start normal" | "safe start stretch" | "safe start start" | "safe start end" | "safe start center" | "safe start unsafe start" | "safe start unsafe end" | "safe start unsafe center" | "safe start safe start" | "safe start safe end" | "safe start safe center" | "safe end normal" | "safe end stretch" | "safe end start" | "safe end end" | "safe end center" | "safe end unsafe start" | "safe end unsafe end" | "safe end unsafe center" | "safe end safe start" | "safe end safe end" | "safe end safe center" | "safe center normal" | "safe center stretch" | "safe center start" | "safe center end" | "safe center center" | "safe center unsafe start" | "safe center unsafe end" | "safe center unsafe center" | "safe center safe start" | "safe center safe end" | "safe center safe center" | AlignContentKeyword | "normal space-between" | "normal space-around" | "normal space-evenly" | "baseline space-between" | "baseline space-around" | "baseline space-evenly" | "first baseline space-between" | "first baseline space-around" | "first baseline space-evenly" | "last baseline space-between" | "last baseline space-around" | "last baseline space-evenly" | "start space-between" | "start space-around" | "start space-evenly" | "end space-between" | "end space-around" | "end space-evenly" | "center space-between" | "center space-around" | "center space-evenly" | "unsafe start space-between" | "unsafe start space-around" | "unsafe start space-evenly" | "unsafe end space-between" | "unsafe end space-around" | "unsafe end space-evenly" | "unsafe center space-between" | "unsafe center space-around" | "unsafe center space-evenly" | "safe start space-between" | "safe start space-around" | "safe start space-evenly" | "safe end space-between" | "safe end space-around" | "safe end space-evenly" | "safe center space-between" | "safe center space-around" | "safe center space-evenly" | "stretch space-between" | "stretch space-around" | "stretch space-evenly" | "space-between normal" | "space-between start" | "space-between end" | "space-between center" | "space-between unsafe start" | "space-between unsafe end" | "space-between unsafe center" | "space-between safe start" | "space-between safe end" | "space-between safe center" | "space-between stretch" | "space-between space-between" | "space-between space-around" | "space-between space-evenly" | "space-around normal" | "space-around start" | "space-around end" | "space-around center" | "space-around unsafe start" | "space-around unsafe end" | "space-around unsafe center" | "space-around safe start" | "space-around safe end" | "space-around safe center" | "space-around stretch" | "space-around space-between" | "space-around space-around" | "space-around space-evenly" | "space-evenly normal" | "space-evenly start" | "space-evenly end" | "space-evenly center" | "space-evenly unsafe start" | "space-evenly unsafe end" | "space-evenly unsafe center" | "space-evenly safe start" | "space-evenly safe end" | "space-evenly safe center" | "space-evenly stretch" | "space-evenly space-between" | "space-evenly space-around" | "space-evenly space-evenly"`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
A shorthand property for `justify-content` and `align-content`.

### placeItems

value: `AlignItemsKeyword | "normal normal" | "normal stretch" | "normal baseline" | "normal first baseline" | "normal last baseline" | "normal start" | "normal end" | "normal center" | "normal unsafe start" | "normal unsafe end" | "normal unsafe center" | "normal safe start" | "normal safe end" | "normal safe center" | "stretch normal" | "stretch stretch" | "stretch baseline" | "stretch first baseline" | "stretch last baseline" | "stretch start" | "stretch end" | "stretch center" | "stretch unsafe start" | "stretch unsafe end" | "stretch unsafe center" | "stretch safe start" | "stretch safe end" | "stretch safe center" | "baseline normal" | "baseline stretch" | "baseline baseline" | "baseline first baseline" | "baseline last baseline" | "baseline start" | "baseline end" | "baseline center" | "baseline unsafe start" | "baseline unsafe end" | "baseline unsafe center" | "baseline safe start" | "baseline safe end" | "baseline safe center" | "first baseline normal" | "first baseline stretch" | "first baseline baseline" | "first baseline first baseline" | "first baseline last baseline" | "first baseline start" | "first baseline end" | "first baseline center" | "first baseline unsafe start" | "first baseline unsafe end" | "first baseline unsafe center" | "first baseline safe start" | "first baseline safe end" | "first baseline safe center" | "last baseline normal" | "last baseline stretch" | "last baseline baseline" | "last baseline first baseline" | "last baseline last baseline" | "last baseline start" | "last baseline end" | "last baseline center" | "last baseline unsafe start" | "last baseline unsafe end" | "last baseline unsafe center" | "last baseline safe start" | "last baseline safe end" | "last baseline safe center" | "start normal" | "start stretch" | "start baseline" | "start first baseline" | "start last baseline" | "start start" | "start end" | "start center" | "start unsafe start" | "start unsafe end" | "start unsafe center" | "start safe start" | "start safe end" | "start safe center" | "end normal" | "end stretch" | "end baseline" | "end first baseline" | "end last baseline" | "end start" | "end end" | "end center" | "end unsafe start" | "end unsafe end" | "end unsafe center" | "end safe start" | "end safe end" | "end safe center" | "center normal" | "center stretch" | "center baseline" | "center first baseline" | "center last baseline" | "center start" | "center end" | "center center" | "center unsafe start" | "center unsafe end" | "center unsafe center" | "center safe start" | "center safe end" | "center safe center" | "unsafe start normal" | "unsafe start stretch" | "unsafe start baseline" | "unsafe start first baseline" | "unsafe start last baseline" | "unsafe start start" | "unsafe start end" | "unsafe start center" | "unsafe start unsafe start" | "unsafe start unsafe end" | "unsafe start unsafe center" | "unsafe start safe start" | "unsafe start safe end" | "unsafe start safe center" | "unsafe end normal" | "unsafe end stretch" | "unsafe end baseline" | "unsafe end first baseline" | "unsafe end last baseline" | "unsafe end start" | "unsafe end end" | "unsafe end center" | "unsafe end unsafe start" | "unsafe end unsafe end" | "unsafe end unsafe center" | "unsafe end safe start" | "unsafe end safe end" | "unsafe end safe center" | "unsafe center normal" | "unsafe center stretch" | "unsafe center baseline" | "unsafe center first baseline" | "unsafe center last baseline" | "unsafe center start" | "unsafe center end" | "unsafe center center" | "unsafe center unsafe start" | "unsafe center unsafe end" | "unsafe center unsafe center" | "unsafe center safe start" | "unsafe center safe end" | "unsafe center safe center" | "safe start normal" | "safe start stretch" | "safe start baseline" | "safe start first baseline" | "safe start last baseline" | "safe start start" | "safe start end" | "safe start center" | "safe start unsafe start" | "safe start unsafe end" | "safe start unsafe center" | "safe start safe start" | "safe start safe end" | "safe start safe center" | "safe end normal" | "safe end stretch" | "safe end baseline" | "safe end first baseline" | "safe end last baseline" | "safe end start" | "safe end end" | "safe end center" | "safe end unsafe start" | "safe end unsafe end" | "safe end unsafe center" | "safe end safe start" | "safe end safe end" | "safe end safe center" | "safe center normal" | "safe center stretch" | "safe center baseline" | "safe center first baseline" | "safe center last baseline" | "safe center start" | "safe center end" | "safe center center" | "safe center unsafe start" | "safe center unsafe end" | "safe center unsafe center" | "safe center safe start" | "safe center safe end" | "safe center safe center"`

  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
A shorthand property for `justify-items` and `align-items`.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### rowGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the block axis.

This overrides the row value of `gap`. `rowGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) *OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

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


## GridItem

Display content within a single item of a grid layout.

### GridItem

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

### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### gridColumn

value: `"auto" | `span ${number}``

Number of columns the item will span across

### gridRow

value: `"auto" | `span ${number}``

Number of rows the item will span across

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

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
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
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
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
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


