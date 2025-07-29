# TextField

Lets users enter or edit text within a single-line input. Use to collect short, free-form information from users.

```html
<s-text-field
  label="Store name"
  value="Jaded Pixel"
  placeholder="Become a merchant"
></s-text-field>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-text-field
  label="Store name"
  value="Jaded Pixel"
  placeholder="Become a merchant"
></s-text-field>
</body></html>
```

## TextField

A text input field that allows users to enter and edit text.

### TextField

### __@internals$2@4791

value: `ElementInternals`


### adoptedCallback

value: `() => void`


### attributeChangedCallback

value: `(name: string) => void`


### autocomplete

value: `"on" | "off" | TextAutocompleteField | `section-${string} one-time-code` | "shipping one-time-code" | "billing one-time-code" | `section-${string} shipping one-time-code` | `section-${string} billing one-time-code` | `section-${string} language` | `section-${string} organization` | `section-${string} additional-name` | `section-${string} address-level1` | `section-${string} address-level2` | `section-${string} address-level3` | `section-${string} address-level4` | `section-${string} address-line1` | `section-${string} address-line2` | `section-${string} address-line3` | `section-${string} country-name` | `section-${string} country` | `section-${string} family-name` | `section-${string} given-name` | `section-${string} honorific-prefix` | `section-${string} honorific-suffix` | `section-${string} name` | `section-${string} nickname` | `section-${string} organization-title` | `section-${string} postal-code` | `section-${string} sex` | `section-${string} street-address` | `section-${string} transaction-currency` | `section-${string} username` | `section-${string} cc-additional-name` | `section-${string} cc-family-name` | `section-${string} cc-given-name` | `section-${string} cc-name` | `section-${string} cc-type` | "shipping language" | "shipping organization" | "shipping additional-name" | "shipping address-level1" | "shipping address-level2" | "shipping address-level3" | "shipping address-level4" | "shipping address-line1" | "shipping address-line2" | "shipping address-line3" | "shipping country-name" | "shipping country" | "shipping family-name" | "shipping given-name" | "shipping honorific-prefix" | "shipping honorific-suffix" | "shipping name" | "shipping nickname" | "shipping organization-title" | "shipping postal-code" | "shipping sex" | "shipping street-address" | "shipping transaction-currency" | "shipping username" | "shipping cc-additional-name" | "shipping cc-family-name" | "shipping cc-given-name" | "shipping cc-name" | "shipping cc-type" | "billing language" | "billing organization" | "billing additional-name" | "billing address-level1" | "billing address-level2" | "billing address-level3" | "billing address-level4" | "billing address-line1" | "billing address-line2" | "billing address-line3" | "billing country-name" | "billing country" | "billing family-name" | "billing given-name" | "billing honorific-prefix" | "billing honorific-suffix" | "billing name" | "billing nickname" | "billing organization-title" | "billing postal-code" | "billing sex" | "billing street-address" | "billing transaction-currency" | "billing username" | "billing cc-additional-name" | "billing cc-family-name" | "billing cc-given-name" | "billing cc-name" | "billing cc-type" | `section-${string} shipping language` | `section-${string} shipping organization` | `section-${string} shipping additional-name` | `section-${string} shipping address-level1` | `section-${string} shipping address-level2` | `section-${string} shipping address-level3` | `section-${string} shipping address-level4` | `section-${string} shipping address-line1` | `section-${string} shipping address-line2` | `section-${string} shipping address-line3` | `section-${string} shipping country-name` | `section-${string} shipping country` | `section-${string} shipping family-name` | `section-${string} shipping given-name` | `section-${string} shipping honorific-prefix` | `section-${string} shipping honorific-suffix` | `section-${string} shipping name` | `section-${string} shipping nickname` | `section-${string} shipping organization-title` | `section-${string} shipping postal-code` | `section-${string} shipping sex` | `section-${string} shipping street-address` | `section-${string} shipping transaction-currency` | `section-${string} shipping username` | `section-${string} shipping cc-additional-name` | `section-${string} shipping cc-family-name` | `section-${string} shipping cc-given-name` | `section-${string} shipping cc-name` | `section-${string} shipping cc-type` | `section-${string} billing language` | `section-${string} billing organization` | `section-${string} billing additional-name` | `section-${string} billing address-level1` | `section-${string} billing address-level2` | `section-${string} billing address-level3` | `section-${string} billing address-level4` | `section-${string} billing address-line1` | `section-${string} billing address-line2` | `section-${string} billing address-line3` | `section-${string} billing country-name` | `section-${string} billing country` | `section-${string} billing family-name` | `section-${string} billing given-name` | `section-${string} billing honorific-prefix` | `section-${string} billing honorific-suffix` | `section-${string} billing name` | `section-${string} billing nickname` | `section-${string} billing organization-title` | `section-${string} billing postal-code` | `section-${string} billing sex` | `section-${string} billing street-address` | `section-${string} billing transaction-currency` | `section-${string} billing username` | `section-${string} billing cc-additional-name` | `section-${string} billing cc-family-name` | `section-${string} billing cc-given-name` | `section-${string} billing cc-name` | `section-${string} billing cc-type``

  - TextAutocompleteField: 'url' | 'email' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'one-time-code' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

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


### defaultValue

value: `string`

The default value for the field.

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


### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### icon

value: `"replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x" | AnyString`

  - AnyString: string & {}
The type of icon to be displayed in the field.

### id

value: `string`

A unique identifier for the element.

### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### prefix

value: `string`

A value to be displayed immediately before the editable portion of the field.

This is useful for displaying an implied part of the value, such as "https://" or "+353".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the prefix until the user focuses the input.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### setAttribute

value: `(name: string, value: string) => void`


### suffix

value: `string`

A value to be displayed immediately after the editable portion of the field.

This is useful for displaying an implied part of the value, such as "@shopify.com", or "%".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the suffix until the user focuses the input.

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


## Slots

### TextFieldSlots

### accessory

value: `HTMLElement`

The accessory to display in the text field.

## Events

Learn more about [registering events](https://shopify.dev/docs/api/app-home/using-polaris-components#event-handling).

### TextFieldEvents

### blur

value: `CallbackEventListener<'input'>`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### change

value: `CallbackEventListener<'input'>`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### focus

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

