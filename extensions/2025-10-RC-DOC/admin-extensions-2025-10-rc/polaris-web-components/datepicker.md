# DatePicker

Allow users to select a specific date or date range.

```html
<s-date-picker
  view="2025-05"
  type="range"
  value="2025-05-28--2025-05-31"
></s-date-picker>

```

```preview
<!DOCTYPE html><html><head><style>html, body {height:100%} body {box-sizing: border-box; margin: 0; padding:0.5rem; display: grid; place-items: center; gap: 0.5rem;}</style><script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script></head><body><s-date-picker
  view="2025-05"
  type="range"
  value="2025-05-28--2025-05-31"
></s-date-picker>
</body></html>
```

## DatePicker

### DatePicker

### __@dirtyStateSymbol@4880

value: `boolean`


### __@internals@4879

value: `ElementInternals`


### adoptedCallback

value: `() => void`


### allow

value: `string`

Dates that can be selected.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` allows all dates.

- Dates in `YYYY-MM-DD` format allow a single date.
- Dates in `YYYY-MM` format allow a whole month.
- Dates in `YYYY` format allow a whole year.
- Ranges are expressed as `start--end`.     - Ranges are inclusive.
    - If either `start` or `end` is omitted, the range is unbounded in that direction.
    - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value.
      So `2024--` is equivalent to `2024-01-01--`.
    - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value.
      So `--2024` is equivalent to `--2024-12-31`.
    - Whitespace is allowed either side of `--`.

### allowDays

value: `string`

Days of the week that can be selected. These intersect with the result of `allowDates` and `disallowDates`.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` has no effect on the result of `allowDates` and `disallowDates`.

Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.

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


### defaultValue

value: `string`

Default selected value.

The default means no date is selected.

If the provided value is invalid, no date is selected.

- If `type="single"`, this is a date in `YYYY-MM-DD` format.
- If `type="multiple"`, this is a comma-separated list of dates in `YYYY-MM-DD` format.
- If `type="range"`, this is a range in `YYYY-MM-DD--YYYY-MM-DD` format. The range is inclusive.

### defaultView

value: `string`

Default month to display in `YYYY-MM` format.

This value is used until `view` is set, either directly or as a result of user interaction.

Defaults to the current month in the user's locale.

### disallow

value: `string`

Dates that cannot be selected. These subtract from `allowDates`.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` has no effect on `allowDates`.

- Dates in `YYYY-MM-DD` format disallow a single date.
- Dates in `YYYY-MM` format disallow a whole month.
- Dates in `YYYY` format disallow a whole year.
- Ranges are expressed as `start--end`.     - Ranges are inclusive.
    - If either `start` or `end` is omitted, the range is unbounded in that direction.
    - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value.
      So `2024--` is equivalent to `2024-01-01--`.
    - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value.
      So `--2024` is equivalent to `--2024-12-31`.
    - Whitespace is allowed either side of `--`.

### disallowDays

value: `string`

Days of the week that cannot be selected. This subtracts from `allowDays`, and intersects with the result of `allowDates` and `disallowDates`.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` has no effect on `allowDays`.

Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.

### disconnectedCallback

value: `() => void`


### formResetCallback

value: `() => void`


### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### setAttribute

value: `(name: string, value: string) => void`


### type

value: `"single" | "multiple" | "range"`


### value

value: `string`

Current selected value.

The default means no date is selected.

If the provided value is invalid, no date is selected.

Otherwise:

- If `type="single"`, this is a date in `YYYY-MM-DD` format.
- If `type="multiple"`, this is a comma-separated list of dates in `YYYY-MM-DD` format.
- If `type="range"`, this is a range in `YYYY-MM-DD--YYYY-MM-DD` format. The range is inclusive.

Events:

- `onInput` - Invoked when any date is selected. Will fire before `onChange`.
- `onChange` - Invoked when the `value` is changed. For `type="single"` and `type="multiple"`, this is the same as `onInput`.      For `type="range"`, this is only called when the range is completed by selecting the end date of the range.

### view

value: `string`

Displayed month in `YYYY-MM` format.

`onViewChange` is called when this value changes.

Defaults to `defaultView`.

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

### DatePickerEvents

### blur

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### change

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

### input

value: `CallbackEventListener<typeof tagName> | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

### viewchange

value: `CallbackEventListener<
    typeof tagName,
    HTMLElementEventMap['viewchange']
  > | null`

  - CallbackEventListener: (EventListener & {
      (event: CallbackEvent<TTagName, TEvent>): void;
    }) | null
  - CallbackEvent: TEvent & {
  currentTarget: HTMLElementTagNameMap[TTagName];
}

