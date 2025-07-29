# Clickable

A generic interactive container component that provides a flexible alternative for custom interactive elements not achievable with existing components like Button or Link. Use it to apply specific styling such as backgrounds, padding, or borders.

```html
<s-clickable padding="base">Create Store</s-clickable>

<s-clickable
  border="base"
  padding="base"
  background="subdued"
  borderRadius="base"
>
  View Shipping Settings
</s-clickable>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-clickable padding="base">Create Store</s-clickable>

<s-clickable
  border="base"
  padding="base"
  background="subdued"
  borderRadius="base"
>
  View Shipping Settings
</s-clickable>
</body></html>
```

## Properties

### Clickable

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

### command

value: `'--auto' | '--show' | '--hide' | '--toggle'`

Sets the action the `commandFor` should take when this clickable is activated.

See the documentation of particular components for the actions they support.

- `--auto`: a default action for the target component.
- `--show`: shows the target component.
- `--hide`: hides the target component.
- `--toggle`: toggles the target component.

### commandFor

value: `string`

ID of a component that should respond to activations (e.g. clicks) on this component.

See `command` for how to control the behavior of the target.

### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the clickable, meaning it cannot be clicked or receive focus.

In this state, onClick will not fire. If the click event originates from a child element, the event will immediately stop propagating from this element.

However, items within the clickable can still receive focus and be interacted with.

This has no impact on the visual state by default, but developers are encouraged to style the clickable accordingly.

### disconnectedCallback

value: `() => void`


### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### download

value: `string`

Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs, or the blob: and data: schemes.

### href

value: `string`

The URL to link to.

- If set, it will navigate to the location specified by `href` after executing the `click` event.
- If a `commandFor` is set, the `command` will be executed instead of the navigation.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### loading

value: `boolean`

Disables the clickable, and indicates to assistive technology that the loading is in progress.

This also disables the clickable.

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


### target

value: `"auto" | AnyString | "_blank" | "_self" | "_parent" | "_top"`

  - AnyString: string & {}
Specifies where to display the linked URL.

### type

value: `"button" | "reset" | "submit"`

The behavior of the button.

- `submit`: Used to indicate the component acts as a submit button, meaning it submits the closest form.
- `button`: Used to indicate the component acts as a button, meaning it has no default action.
- `reset`: Used to indicate the component acts as a reset button, meaning it resets the closest form (returning fields to their default values).

This property is ignored if the component supports `href` or `commandFor`/`command` and one of them is set.

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


## Events

Learn more about [registering events](https://shopify.dev/docs/api/app-home/using-polaris-components#event-handling).

### ClickableEvents

### blur

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### click

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### focus

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

