# MoneyField

Collect monetary values from users with built-in currency formatting and validation.

```html
<s-money-field
  label="Regional Price"
  placeholder="99.99"
  currencyCode="EUR"
  details="Recommended price for the European market"
></s-money-field>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-money-field
  label="Regional Price"
  placeholder="99.99"
  currencyCode="EUR"
  details="Recommended price for the European market"
></s-money-field>
</body></html>
```

## Properties

### MoneyField

### __@internals$2@4791

value: `ElementInternals`


### adoptedCallback

value: `() => void`


### attributeChangedCallback

value: `(name: string) => void`


### autocomplete

value: `string`

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


### currencyCode

value: `AnyString | CurrencyCode`

  - AnyString: string & {}
  - CurrencyCode: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AFN' | 'ALL' | 'DZD' | 'AOA' | 'ARS' | 'AMD' | 'AWG' | 'AUD' | 'BBD' | 'AZN' | 'BDT' | 'BSD' | 'BHD' | 'BIF' | 'BZD' | 'BMD' | 'BTN' | 'BAM' | 'BRL' | 'BOB' | 'BWP' | 'BND' | 'BGN' | 'MMK' | 'KHR' | 'CVE' | 'KYD' | 'XAF' | 'CLP' | 'CNY' | 'COP' | 'KMF' | 'CDF' | 'CRC' | 'HRK' | 'CZK' | 'DKK' | 'DOP' | 'XCD' | 'EGP' | 'ETB' | 'XPF' | 'FJD' | 'GMD' | 'GHS' | 'GTQ' | 'GYD' | 'GEL' | 'HTG' | 'HNL' | 'HKD' | 'HUF' | 'ISK' | 'INR' | 'IDR' | 'ILS' | 'IQD' | 'JMD' | 'JPY' | 'JEP' | 'JOD' | 'KZT' | 'KES' | 'KWD' | 'KGS' | 'LAK' | 'LVL' | 'LBP' | 'LSL' | 'LRD' | 'LTL' | 'MGA' | 'MKD' | 'MOP' | 'MWK' | 'MVR' | 'MXN' | 'MYR' | 'MUR' | 'MDL' | 'MAD' | 'MNT' | 'MZN' | 'NAD' | 'NPR' | 'ANG' | 'NZD' | 'NIO' | 'NGN' | 'NOK' | 'OMR' | 'PAB' | 'PKR' | 'PGK' | 'PYG' | 'PEN' | 'PHP' | 'PLN' | 'QAR' | 'RON' | 'RUB' | 'RWF' | 'WST' | 'SAR' | 'RSD' | 'SCR' | 'SGD' | 'SDG' | 'SYP' | 'ZAR' | 'KRW' | 'SSP' | 'SBD' | 'LKR' | 'SRD' | 'SZL' | 'SEK' | 'CHF' | 'TWD' | 'THB' | 'TZS' | 'TTD' | 'TND' | 'TRY' | 'TMT' | 'UGX' | 'UAH' | 'AED' | 'UYU' | 'UZS' | 'VUV' | 'VND' | 'XOF' | 'YER' | 'ZMW' | 'BYN' | 'BYR' | 'DJF' | 'ERN' | 'FKP' | 'GIP' | 'GNF' | 'IRR' | 'KID' | 'LYD' | 'MRU' | 'SLL' | 'SHP' | 'SOS' | 'STD' | 'STN' | 'TJS' | 'TOP' | 'VED' | 'VEF' | 'VES' | 'XXX'
Specifies the currency code that will be displayed.

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

### max

value: `number`

The highest decimal or integer to be accepted for the field. When used with `step` the value will round down to the max number.

Note: a user will still be able to use the keyboard to input a number higher than the max. It is up to the developer to add appropriate validation.

### min

value: `number`

The lowest decimal or integer to be accepted for the field. When used with `step` the value will round up to the min number.

Note: a user will still be able to use the keyboard to input a number lower than the min. It is up to the developer to add appropriate validation.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

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


### step

value: `number`

The amount the value can increase or decrease by. This can be an integer or decimal. If a `max` or `min` is specified with `step` when increasing/decreasing the value via the buttons, the final value will always round to the `max` or `min` rather than the closest valid amount.

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

### MoneyFieldEvents

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

