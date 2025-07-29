# Button

Triggers actions or events, such as submitting forms, opening dialogs, or navigating to other pages. Use Button to let users perform specific tasks or initiate interactions throughout the interface. Buttons can also function as links, guiding users to internal or external destinations.

```html
<s-button variant="primary">Add Product</s-button>
<s-button variant="secondary">Save Theme</s-button>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: flex; justify-content: center; align-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-button variant="primary">Add Product</s-button>
<s-button variant="secondary">Save Theme</s-button>
</body></html>
```

## Properties

### Button

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the Button. It will be read to users using assistive technologies such as screen readers.

Use this when using only an icon or the button text is not enough context for users using assistive technologies.

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


### disabled

value: `boolean`

Disables the button, meaning it cannot be clicked or receive focus.

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

### icon

value: `"" | "replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x"`


### loading

value: `boolean`

Replaces content with a loading indicator while a background action is being performed.

This also disables the button.

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

Sets the tone of the Button, based on the intention of the information being conveyed.

### type

value: `"button" | "reset" | "submit"`

The behavior of the button.

- `submit`: Used to indicate the component acts as a submit button, meaning it submits the closest form.
- `button`: Used to indicate the component acts as a button, meaning it has no default action.
- `reset`: Used to indicate the component acts as a reset button, meaning it resets the closest form (returning fields to their default values).

This property is ignored if the component supports `href` or `commandFor`/`command` and one of them is set.

### variant

value: `"auto" | "primary" | "secondary" | "tertiary"`

Changes the visual appearance of the Button.

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

### ButtonEvents

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

