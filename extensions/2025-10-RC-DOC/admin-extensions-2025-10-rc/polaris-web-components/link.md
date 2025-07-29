# Link

Makes text interactive, allowing users to navigate to other pages or perform specific actions. Supports standard URLs, custom protocols, and navigation within Shopify or app pages.

```html
<s-link href="#beep">fufilling orders</s-link>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-link href="#beep">fufilling orders</s-link>
</body></html>
```

## Properties

### Link

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the Link. It will be read to users using assistive technologies such as screen readers.

Use this when using only an icon or the content of the link is not enough context for users using assistive technologies.

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


### disconnectedCallback

value: `() => void`


### download

value: `string`

Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs, or the blob: and data: schemes.

### href

value: `string`

The URL to link to.

- If set, it will navigate to the location specified by `href` after executing the `click` event.
- If a `commandFor` is set, the `command` will be executed instead of the navigation.

### lang

value: `string`

Indicate the text language. Useful when the text is in a different language than the rest of the page. It will allow assistive technologies such as screen readers to invoke the correct pronunciation. [Reference of values](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) ("subtag" label)

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### setAttribute

value: `(name: string, value: string) => void`


### target

value: `"auto" | AnyString | "_blank" | "_self" | "_parent" | "_top"`

  - AnyString: string & {}
Specifies where to display the linked URL.

### tone

value: `"critical" | "auto" | "neutral"`

Sets the tone of the Link, based on the intention of the information being conveyed.

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

### LinkEvents

### click

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

