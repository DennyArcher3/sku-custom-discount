# Heading

Renders hierarchical titles to communicate the structure and organization of page content. Heading levels adjust automatically based on nesting within parent Section components, ensuring a meaningful and accessible page outline.

```html
<s-heading>Online store dashboard</s-heading>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-heading>Online store dashboard</s-heading>
</body></html>
```

## Properties

### Heading

### accessibilityRole

value: `"none" | "presentation" | "heading"`

Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

- `heading`: defines the element as a heading to a page or section.
- `presentation`: the heading level will be stripped, and will prevent the element’s implicit ARIA semantics from being exposed to the accessibility tree.
- `none`: a synonym for the `presentation` role.

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

### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### lineClamp

value: `number`

Truncates the text content to the specified number of lines.

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


