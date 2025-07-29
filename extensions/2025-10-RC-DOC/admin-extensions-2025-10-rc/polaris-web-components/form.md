# Form

Wraps one or more form controls and enables implicit submission, letting users submit the form from any input by pressing “Enter.” Unlike the HTML form element, this component doesn’t automatically submit data via HTTP. You must register a `submit` event to handle form submission in JavaScript.

```html
<s-form>
  <s-text-field label="Email address" />
  <s-button variant="primary" accessibilityRole="submit">Submit</s-button>
</s-form>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-form>
  <s-text-field label="Email address" />
  <s-button variant="primary" accessibilityRole="submit">Submit</s-button>
</s-form>
</body></html>
```

## Events

Learn more about [registering events](https://shopify.dev/docs/api/app-home/using-polaris-components#event-handling).

### FormEvents

### reset

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}
A callback that is run when the form is reset.

### submit

value: `CallbackExtendableEventListener<typeof tagName> | null`

  - CallbackExtendableEventListener: (EventListener & {
      (event: CallbackExtendableEvent<TTagName>): void;
    }) | null
  - CallbackExtendableEvent: export interface CallbackExtendableEvent<
  TTagName extends keyof HTMLElementTagNameMap,
> extends CallbackEvent<TTagName>,
    Pick<ExtendableEvent, 'waitUntil'> {}
A callback that is run when the form is submitted.

### CallbackExtendableEvent

### AT_TARGET

value: `number`


### bubbles

value: `boolean`

Returns true or false depending on how event was initialized. True if event goes through its target's ancestors in reverse tree order, and false otherwise.

### BUBBLING_PHASE

value: `number`


### cancelable

value: `boolean`

Returns true or false depending on how event was initialized. Its return value does not always carry meaning, but true can indicate that part of the operation during which event was dispatched, can be canceled by invoking the preventDefault() method.

### cancelBubble

value: `boolean`


### CAPTURING_PHASE

value: `number`


### composed

value: `boolean`

Returns true or false depending on how event was initialized. True if event invokes listeners past a ShadowRoot node that is the root of its target, and false otherwise.

### composedPath

value: `() => EventTarget[]`

Returns the invocation target objects of event's path (objects on which listeners will be invoked), except for any nodes in shadow trees of which the shadow root's mode is "closed" that are not reachable from event's currentTarget.

### defaultPrevented

value: `boolean`

Returns true if preventDefault() was invoked successfully to indicate cancelation, and false otherwise.

### eventPhase

value: `number`

Returns the event's phase, which is one of NONE, CAPTURING_PHASE, AT_TARGET, and BUBBLING_PHASE.

### initEvent

value: `(type: string, bubbles?: boolean, cancelable?: boolean) => void`


### isTrusted

value: `boolean`

Returns true if event was dispatched by the user agent, and false otherwise.

### NONE

value: `number`


### preventDefault

value: `() => void`

If invoked when the cancelable attribute value is true, and while executing a listener for the event with passive set to false, signals to the operation that caused event to be dispatched that it needs to be canceled.

### returnValue

value: `boolean`


### srcElement

value: `EventTarget | null`


### stopImmediatePropagation

value: `() => void`

Invoking this method prevents event from reaching any registered event listeners after the current one finishes running and, when dispatched in a tree, also prevents event from reaching any other objects.

### stopPropagation

value: `() => void`

When dispatched in a tree, invoking this method prevents event from reaching any objects other than the current object.

### target

value: `EventTarget | null`

Returns the object to which event is dispatched (its target).

### timeStamp

value: `DOMHighResTimeStamp`

Returns the event's timestamp as the number of milliseconds measured relative to the time origin.

### type

value: `string`

Returns the type of event, e.g. "click", "hashchange", or "submit".

### waitUntil

value: `(promise: Promise<void>) => void`

Provide a promise that signals the length, and eventual success or failure of actions relating to the event.

This may be called many times, which adds promises to the event.

However, this may only be called synchronously during the dispatch of the event. As in, you cannot call it after a `setTimeout` or microtask.

