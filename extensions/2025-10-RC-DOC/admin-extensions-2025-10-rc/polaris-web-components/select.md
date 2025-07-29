# Select

Allow users to pick one option from a menu. Ideal when presenting four or more choices to keep interfaces uncluttered.

```html
<s-select label="Date range">
  <s-option value="1">Today</s-option>
  <s-option value="2">Yesterday</s-option>
  <s-option value="3">Last 7 days</s-option>
</s-select>
```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-select label="Date range">
  <s-option value="1">Today</s-option>
  <s-option value="2">Yesterday</s-option>
  <s-option value="3">Last 7 days</s-option>
</s-select></body></html>
```

## Properties

### Select

### __@hasInitialValueSymbol@5152

value: `boolean`


### __@internals$2@4791

value: `ElementInternals`


### __@usedFirstOptionSymbol@5151

value: `boolean`

used to determine if no value or defaultValue was set, in which case the first non-disabled option was used

this is important because we need to use the placeholder in these situations, even though the first value will be submitted as part of the form

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


### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### disconnectedCallback

value: `() => void`


### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### formResetCallback

value: `() => void`


### icon

value: `"replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x" | AnyString`

  - AnyString: string & {}
The type of icon to be displayed in the field.

### id

value: `string`

A unique identifier for the element.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### setAttribute

value: `(name: string, value: string) => void`


### value

value: `string`


The current value for the field. If omitted, the field will be empty.

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

### SelectEvents

### change

value: `CallbackEventListener<'input'>`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### input

value: `CallbackEventListener<'input'>`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

