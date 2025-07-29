# Image

Embeds an image within the interface and controls its presentation. Use to visually illustrate concepts, showcase products, or support user tasks and interactions.

```html
<s-image
  src="/assets/home/icons/icon-community-small-02dccda350b673dbd5d87a40cdd900de45ddef6f69b8dd9498c4ca9ab652cc0b.png"
  alt="Four pixelated characters ready to build amazing Shopify apps"
  aspectRatio="59/161"
  inlineSize="auto"
></s-image>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-image
  src="/assets/home/icons/icon-community-small-02dccda350b673dbd5d87a40cdd900de45ddef6f69b8dd9498c4ca9ab652cc0b.png"
  alt="Four pixelated characters ready to build amazing Shopify apps"
  aspectRatio="59/161"
  inlineSize="auto"
></s-image>
</body></html>
```

## Properties

### Image

### accessibilityRole

value: `"none" | "presentation" | "img"`

Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### adoptedCallback

value: `() => void`


### alt

value: `string`

An alternative text description that describe the image for the reader to understand what it is about. It is extremely useful for both users using assistive technology and sighted users. A well written description provides people with visual impairments the ability to participate in consuming non-text content. When a screen readers encounters an `s-image`, the description is read and announced aloud. If an image fails to load, potentially due to a poor connection, the `alt` is displayed on screen instead. This has the benefit of letting a sighted buyer know an image was meant to load here, but as an alternative, they’re still able to consume the text content. Read [considerations when writing alternative text](https://www.shopify.com/ca/blog/image-alt-text#4) to learn more.

### aspectRatio

value: ``${number}` | `${number}/${number}` | `${number}/ ${number}` | `${number} /${number}` | `${number} / ${number}``

The aspect ratio of the image.

The rendering of the image will depend on the `inlineSize` value:

- `inlineSize="fill"`: the aspect ratio will be respected and the image will take the necessary space.
- `inlineSize="auto"`: the image will not render until it has loaded and the aspect ratio will be ignored.

For example, if the value is set as `50 / 100`, the getter returns `50 / 100`. If the value is set as `0.5`, the getter returns `0.5 / 1`.

### attributeChangedCallback

value: `(name: string) => void`


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


### inlineSize

value: `"auto" | "fill"`

The displayed inline width of the image.

- `fill`: the image will takes up 100% of the available inline size.
- `auto`: the image will be displayed at its natural size.

### loading

value: `"eager" | "lazy"`

Determines the loading behavior of the image:
- `eager`: Immediately loads the image, irrespective of its position within the visible viewport.
- `lazy`: Delays loading the image until it approaches a specified distance from the viewport.

### objectFit

value: `"contain" | "cover"`

Determines how the content of the image is resized to fit its container. The image is positioned in the center of the container.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### setAttribute

value: `(name: string, value: string) => void`


### sizes

value: `string`

A set of media conditions and their corresponding sizes.

### src

value: `string`

The image source (either a remote URL or a local file resource).

When the image is loading or no `src` is provided, a placeholder will be rendered.

### srcSet

value: `string`

A set of image sources and their width or pixel density descriptors.

This overrides the `src` property.

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

### ImageEvents

### error

value: `OnErrorEventHandler`


### load

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

