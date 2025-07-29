# QueryContainer

Establishes a query container for responsive design. Use `s-query-container` to define an element as a containment context, enabling child components or styles to adapt based on the container’s size.

```html
<s-query-container>
  <s-box
    padding="@container (inline-size > 500px) large-500, none"
    background="strong"
  >
    Padding is applied when the inline-size '>' 500px
  </s-box>
</s-query-container>
```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; padding: 0}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-query-container>
  <s-box
    padding="@container (inline-size > 500px) large-500, none"
    background="strong"
  >
    Padding is applied when the inline-size '>' 500px
  </s-box>
</s-query-container></body></html>
```

## Properties

Use to define an element as a containment context, enabling child components or styles to adapt based on the container’s size.

### QueryContainer

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


### containerName

value: `string`

The name of the container, which can be used in your container queries to target this container specifically.

We place the container name of `s-default` on every container. Because of this, it is not required to add a `containerName` identifier in your queries. For example, a `@container (inline-size <= 300px) none, auto` query is equivalent to `@container s-default (inline-size <= 300px) none, auto`.

Any value set in `containerName` will be set alongside alongside `s-default`. For example, `containerName="my-container-name"` will result in a value of `s-default my-container-name` set on the `container-name` CSS property of the rendered HTML.

### disconnectedCallback

value: `() => void`


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


