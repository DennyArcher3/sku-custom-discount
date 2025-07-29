# Paragraph

Displays a block of text, and can contain inline elements such as buttons, links, or emphasized text. Use to present standalone blocks of content, as opposed to inline text.

```html
<s-paragraph>
  Shopify POS is the easiest way to sell your products in person. Available for
  iPad, iPhone, and Android.
</s-paragraph>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-paragraph>
  Shopify POS is the easiest way to sell your products in person. Available for
  iPad, iPhone, and Android.
</s-paragraph>
</body></html>
```

## Properties

### Paragraph

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

### color

value: `"base" | "subdued"`

Modify the color to be more or less intense.

### connectedCallback

value: `() => void`


### dir

value: `"" | "auto" | "ltr" | "rtl"`

Indicates the directionality of the element’s text.

- `ltr`: languages written from left to right (e.g. English)
- `rtl`: languages written from right to left (e.g. Arabic)
- `auto`: the user agent determines the direction based on the content
- `''`: direction is inherited from parent elements (equivalent to not setting the attribute)

### disconnectedCallback

value: `() => void`


### fontVariantNumeric

value: `"auto" | "normal" | "tabular-nums"`

Set the numeric properties of the font.

### lineClamp

value: `number`

Truncates the text content to the specified number of lines.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### setAttribute

value: `(name: string, value: string) => void`


### tone

value: `"info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution"`

Sets the tone of the component, based on the intention of the information being conveyed.

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


