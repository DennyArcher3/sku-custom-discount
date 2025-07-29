# Block Extension API

This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.

## BlockExtensionApi

### BlockExtensionApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### navigation

value: `Navigation`

  - Navigation: export interface Navigation {
  /**
   * Navigate to a specific route.
   *
   * @example navigation.navigate('extension://my-admin-action-extension-handle')
   */
  navigate: (url: string | URL) => void;
}
Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported. For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### Auth

### idToken

value: `() => Promise<string>`

Retrieves a Shopify OpenID Connect ID token for the current user.

### Data

### selected

value: `{ id: string; }[]`

Information about the currently viewed or selected items.

### ExtensionTargets

### admin.abandoned-checkout-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.abandoned-checkout-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the abandoned checkout page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.abandoned-checkout-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.abandoned-checkout-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the abandoned checkout page. Open this extension from the "More Actions" menu.

### admin.abandoned-checkout-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.abandoned-checkout-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the abandoned checkout details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.catalog-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.catalog-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the catalog details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.catalog-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.catalog-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the catalog details page. Open this extension from the "More Actions" menu.

### admin.catalog-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.catalog-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the catalog details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.collection-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.collection-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the collection details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.collection-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.collection-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the collection details page. Open this extension from the "More Actions" menu.

### admin.collection-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.collection-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the collection details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.collection-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.collection-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the collection index page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.collection-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.collection-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the collection index page. Open this extension from the "More Actions" menu.

### admin.company-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.company-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the company details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.company-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.company-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the company details page. Open this extension from the "More Actions" menu.

### admin.company-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.company-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the company details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.company-location-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.company-location-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the company location details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.customer-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the customer details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.customer-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the customer details page. Open this extension from the "More Actions" menu.

### admin.customer-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.customer-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the customer details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.customer-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the customer index page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.customer-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the customer index page. Open this extension from the "More Actions" menu.

### admin.customer-index.selection-action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.customer-index.selection-action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the customer index page when multiple resources are selected. Open this extension from the "More Actions" menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-index.selection-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.customer-index.selection-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the customer index page when multiple resources are selected. Open this extension from the "More Actions" menu of the resource list. The resource ids are available to this extension at runtime.

### admin.customer-segment-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.customer-segment-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the customer segment details page. Open this extension from the "Use segment" button.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.customer-segment-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.customer-segment-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the customer segment details page. Open this extension from the "Use segment" button.

### admin.customers.segmentation-templates.render

value: `RenderExtension<
    CustomerSegmentTemplateApi<'admin.customers.segmentation-templates.render'>,
    StandardComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - StandardComponents: 'Avatar' | 'Badge' | 'Banner' | 'Box' | 'Button' | 'Checkbox' | 'Choice' | 'ChoiceList' | 'Clickable' | 'DatePicker' | 'Divider' | 'EmailField' | 'Grid' | 'GridItem' | 'Heading' | 'Icon' | 'Image' | 'Link' | 'ListItem' | 'MoneyField' | 'NumberField' | 'Option' | 'OptionGroup' | 'OrderedList' | 'Paragraph' | 'PasswordField' | 'QueryContainer' | 'Section' | 'Select' | 'Spinner' | 'Stack' | 'Table' | 'TableBody' | 'TableCell' | 'TableHeader' | 'TableHeaderRow' | 'TableRow' | 'Text' | 'TextArea' | 'TextField' | 'Thumbnail' | 'UnorderedList' | 'URLField'
  - CustomerSegmentTemplateApi: export interface CustomerSegmentTemplateApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /* Utilities for translating content according to the current `localization` of the admin. */
  i18n: I18n;
  /** @private */
  __enabledFeatures: string[];
}
Renders a [`CustomerSegmentTemplate`](https://shopify.dev/docs/api/admin-extensions/components/customersegmenttemplate) in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments).

### admin.discount-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.discount-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the discount details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.discount-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.discount-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the discount details page. Open this extension from the "More Actions" menu.

### admin.discount-details.function-settings.render

value: `RenderExtension<
    DiscountFunctionSettingsApi<'admin.discount-details.function-settings.render'>,
    BlockExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
  - DiscountFunctionSettingsApi: export interface DiscountFunctionSettingsApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends Omit<BlockExtensionApi<ExtensionTarget>, 'data'> {
  /**
   * Applies a change to the discount function settings.
   */
  applyMetafieldChange: ApplyMetafieldChange;
  data: DiscountFunctionSettingsData;
}
  - Discount: interface Discount {
  /**
   * the discount's gid
   */
  id: string;
}
Renders an admin block in the discount details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.discount-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.discount-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the discount index page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.discount-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.discount-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the discount index page. Open this extension from the "More Actions" menu.

### admin.draft-order-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.draft-order-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the draft order details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.draft-order-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.draft-order-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the draft order details page. Open this extension from the "More Actions" menu.

### admin.draft-order-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.draft-order-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the draft order details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.draft-order-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.draft-order-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the draft orders page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.draft-order-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.draft-order-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the draft orders page. Open this extension from the "More Actions" menu.

### admin.draft-order-index.selection-action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.draft-order-index.selection-action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the draft order page when multiple resources are selected. Open this extension from the "3-dot" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.draft-order-index.selection-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.draft-order-index.selection-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the draft order page when multiple resources are selected. Open this extension from the "3-dot" menu.

### admin.gift-card-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.gift-card-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the gift card details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.gift-card-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.gift-card-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the gift card details page. Open this extension from the "More Actions" menu.

### admin.gift-card-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.gift-card-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the gift card details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.order-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the order details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the order details page. Open this extension from the "More Actions" menu.

### admin.order-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.order-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the order details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-details.print-action.render

value: `RenderExtension<
    PrintActionExtensionApi<'admin.order-details.print-action.render'>,
    PrintActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - PrintActionExtensionApi: export interface PrintActionExtensionApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - PrintActionExtensionComponents: StandardComponents | 'AdminPrintAction'
Renders an admin print action extension in the order index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-details.print-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-details.print-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin print action extension in the order index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

### admin.order-fulfilled-card.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.order-fulfilled-card.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the order fulfilled card. Open this extension from the "3-dot" menu inside the order fulfilled card. Note: This extension will only be visible on orders which were fulfilled by your app.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-fulfilled-card.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-fulfilled-card.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the order fulfilled card. Open this extension from the "3-dot" menu inside the order fulfilled card. Note: This extension will only be visible on orders which were fulfilled by your app.

### admin.order-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.order-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the order index page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the order index page. Open this extension from the "More Actions" menu.

### admin.order-index.selection-action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.order-index.selection-action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the order index page when multiple resources are selected. Open this extension from the "More Actions"  menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-index.selection-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-index.selection-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the order index page when multiple resources are selected. Open this extension from the "More Actions"  menu of the resource list. The resource ids are available to this extension at runtime.

### admin.order-index.selection-print-action.render

value: `RenderExtension<
    PrintActionExtensionApi<'admin.order-index.selection-print-action.render'>,
    PrintActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - PrintActionExtensionApi: export interface PrintActionExtensionApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - PrintActionExtensionComponents: StandardComponents | 'AdminPrintAction'
Renders an admin print action extension in the order index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.order-index.selection-print-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.order-index.selection-print-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin print action extension in the order index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

### admin.product-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.product-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the product details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the product details page. Open this extension from the "More Actions" menu.

### admin.product-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.product-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the product details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-details.configuration.render

value: `RenderExtension<
    ProductDetailsConfigurationApi<'admin.product-details.configuration.render'>,
    BlockExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
  - ProductDetailsConfigurationApi: export interface ProductDetailsConfigurationApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends BlockExtensionApi<ExtensionTarget> {
  data: Data & {
    /*
      @deprecated 
      The product currently being viewed in the admin.
    */
    product: Product;
    app: {
      launchUrl: string;
      applicationUrl: string;
    };
  };
}
  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
Renders Product Configuration on product details and product variant details

See the [tutorial](https://shopify.dev/docs/apps/selling-strategies/bundles/product-config) for more information

### admin.product-details.print-action.render

value: `RenderExtension<
    PrintActionExtensionApi<'admin.product-details.print-action.render'>,
    PrintActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - PrintActionExtensionApi: export interface PrintActionExtensionApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - PrintActionExtensionComponents: StandardComponents | 'AdminPrintAction'
Renders an admin print action extension in the product index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-details.print-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-details.print-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin print action extension in the product index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

### admin.product-details.reorder.render

value: `RenderExtension<
    BlockExtensionApi<'admin.product-details.reorder.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the product details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-index.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.product-index.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the product index page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-index.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-index.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the product index page. Open this extension from the "More Actions" menu.

### admin.product-index.selection-action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.product-index.selection-action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the product index page when multiple resources are selected. Open this extension from the "More Actions"  menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-index.selection-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-index.selection-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the product index page when multiple resources are selected. Open this extension from the "More Actions"  menu of the resource list. The resource ids are available to this extension at runtime.

### admin.product-index.selection-print-action.render

value: `RenderExtension<
    PrintActionExtensionApi<'admin.product-index.selection-print-action.render'>,
    PrintActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - PrintActionExtensionApi: export interface PrintActionExtensionApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - PrintActionExtensionComponents: StandardComponents | 'AdminPrintAction'
Renders an admin print action extension in the product index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-index.selection-print-action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-index.selection-print-action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin print action extension in the product index page when multiple resources are selected. Open this extension from the "Print" menu of the resource list. The resource ids are available to this extension at runtime.

### admin.product-purchase-option.action.render

value: `RenderExtension<
    PurchaseOptionsCardConfigurationApi<'admin.product-purchase-option.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
  - PurchaseOptionsCardConfigurationApi: export interface PurchaseOptionsCardConfigurationApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends ActionExtensionApi<ExtensionTarget> {
  data: {
    selected: {id: string; sellingPlanId?: string}[];
  };
}
Renders an admin action extension in the product details page when a selling plan group is present. Open this extension from the "Purchase Options card".

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-variant-details.action.render

value: `RenderExtension<
    ActionExtensionApi<'admin.product-variant-details.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionApi: export interface ActionExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.
   */
  close: () => void;

  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
Renders an admin action extension in the product variant details page. Open this extension from the "More Actions" menu.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-variant-details.action.should-render

value: `RunnableExtension<
    ShouldRenderApi<'admin.product-variant-details.action.should-render'>,
    ShouldRenderOutput
  >`

  - RunnableExtension: export interface RunnableExtension<Api, Output> {
  api: Api;
  output: Output | Promise<Output>;
}
  - ShouldRenderApi: export interface ShouldRenderApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;
}
  - ShouldRenderOutput: export interface ShouldRenderOutput {
  display: boolean;
}
Controls the render state of an admin action extension in the product variant details page. Open this extension from the "More Actions" menu.

### admin.product-variant-details.block.render

value: `RenderExtension<
    BlockExtensionApi<'admin.product-variant-details.block.render'>,
    BlockExtensionComponents
  >`

  - BlockExtensionApi: export interface BlockExtensionApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  /**
   * Information about the currently viewed or selected items.
   */
  data: Data;

  /**
   * Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported.
   * For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).
   */
  navigation: Navigation;

  /**
   * Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.
   */
  resourcePicker: ResourcePickerApi;

  /**
   * Renders a custom [Picker](picker) dialog allowing users to select values from a list.
   */
  picker: PickerApi;
}
  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
Renders an admin block in the product variant details page.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.product-variant-details.configuration.render

value: `RenderExtension<
    ProductVariantDetailsConfigurationApi<'admin.product-variant-details.configuration.render'>,
    BlockExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - BlockExtensionComponents: StandardComponents | 'AdminBlock' | 'Form'
  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
  - ProductVariantDetailsConfigurationApi: export interface ProductVariantDetailsConfigurationApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends BlockExtensionApi<ExtensionTarget> {
  data: Data & {
    /*
      @deprecated
      The product variant currently being viewed in the admin.
    */
    variant: ProductVariant;
    app: {
      launchUrl: string;
      applicationUrl: string;
    };
  };
}
  - ProductVariant: interface ProductVariant {
  id: string;
  sku: string;
  barcode: string;
  title: string;
  displayName: string;
  price: string;
  compareAtPrice: string;
  taxable: boolean;
  taxCode: string;
  weight: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  productVariantComponents: ProductVariantComponent[];
}
Renders Product Configuration on product details and product variant details

See the [tutorial](https://shopify.dev/docs/apps/selling-strategies/bundles/product-config) for more information

### admin.product-variant-purchase-option.action.render

value: `RenderExtension<
    PurchaseOptionsCardConfigurationApi<'admin.product-variant-purchase-option.action.render'>,
    ActionExtensionComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - ActionExtensionComponents: StandardComponents | 'AdminAction'
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
  - PurchaseOptionsCardConfigurationApi: export interface PurchaseOptionsCardConfigurationApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends ActionExtensionApi<ExtensionTarget> {
  data: {
    selected: {id: string; sellingPlanId?: string}[];
  };
}
Renders an admin action extension in the product variant details page when a selling plan group is present. Open this extension from the "Purchase Options card".

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.settings.internal-order-routing-rule.render

value: `RenderExtension<
    OrderRoutingRuleApi<'admin.settings.internal-order-routing-rule.render'>,
    StandardComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - StandardComponents: 'Avatar' | 'Badge' | 'Banner' | 'Box' | 'Button' | 'Checkbox' | 'Choice' | 'ChoiceList' | 'Clickable' | 'DatePicker' | 'Divider' | 'EmailField' | 'Grid' | 'GridItem' | 'Heading' | 'Icon' | 'Image' | 'Link' | 'ListItem' | 'MoneyField' | 'NumberField' | 'Option' | 'OptionGroup' | 'OrderedList' | 'Paragraph' | 'PasswordField' | 'QueryContainer' | 'Section' | 'Select' | 'Spinner' | 'Stack' | 'Table' | 'TableBody' | 'TableCell' | 'TableHeader' | 'TableHeaderRow' | 'TableRow' | 'Text' | 'TextArea' | 'TextField' | 'Thumbnail' | 'UnorderedList' | 'URLField'
  - OrderRoutingRuleApi: export interface OrderRoutingRuleApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  applyMetafieldsChange: ApplyMetafieldsChange;
  data: Data;
}
Renders Order Routing Rule Configuration on order routing settings.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### admin.settings.order-routing-rule.render

value: `RenderExtension<
    OrderRoutingRuleApi<'admin.settings.order-routing-rule.render'>,
    StandardComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - StandardComponents: 'Avatar' | 'Badge' | 'Banner' | 'Box' | 'Button' | 'Checkbox' | 'Choice' | 'ChoiceList' | 'Clickable' | 'DatePicker' | 'Divider' | 'EmailField' | 'Grid' | 'GridItem' | 'Heading' | 'Icon' | 'Image' | 'Link' | 'ListItem' | 'MoneyField' | 'NumberField' | 'Option' | 'OptionGroup' | 'OrderedList' | 'Paragraph' | 'PasswordField' | 'QueryContainer' | 'Section' | 'Select' | 'Spinner' | 'Stack' | 'Table' | 'TableBody' | 'TableCell' | 'TableHeader' | 'TableHeaderRow' | 'TableRow' | 'Text' | 'TextArea' | 'TextField' | 'Thumbnail' | 'UnorderedList' | 'URLField'
  - OrderRoutingRuleApi: export interface OrderRoutingRuleApi<ExtensionTarget extends AnyExtensionTarget>
  extends StandardApi<ExtensionTarget> {
  applyMetafieldsChange: ApplyMetafieldsChange;
  data: Data;
}

### admin.settings.validation.render

value: `RenderExtension<
    ValidationSettingsApi<'admin.settings.validation.render'>,
    StandardComponents
  >`

  - RenderExtension: export interface RenderExtension<Api, ComponentsSet extends string> {
  api: Api;
  components: ComponentsSet;
  output: void | Promise<void>;
}
  - StandardComponents: 'Avatar' | 'Badge' | 'Banner' | 'Box' | 'Button' | 'Checkbox' | 'Choice' | 'ChoiceList' | 'Clickable' | 'DatePicker' | 'Divider' | 'EmailField' | 'Grid' | 'GridItem' | 'Heading' | 'Icon' | 'Image' | 'Link' | 'ListItem' | 'MoneyField' | 'NumberField' | 'Option' | 'OptionGroup' | 'OrderedList' | 'Paragraph' | 'PasswordField' | 'QueryContainer' | 'Section' | 'Select' | 'Spinner' | 'Stack' | 'Table' | 'TableBody' | 'TableCell' | 'TableHeader' | 'TableHeaderRow' | 'TableRow' | 'Text' | 'TextArea' | 'TextField' | 'Thumbnail' | 'UnorderedList' | 'URLField'
  - ValidationSettingsApi: export interface ValidationSettingsApi<
  ExtensionTarget extends AnyExtensionTarget,
> extends StandardApi<ExtensionTarget> {
  /**
   * Applies a change to the validation settings.
   */
  applyMetafieldChange: ApplyMetafieldChange;
  data: ValidationData;
}
  - Validation: interface Validation {
  /**
   * the validation's gid when active in a shop
   */
  id: string;
  /**
   * the metafields owned by the validation
   */
  metafields: Metafield[];
}
Renders Validation Settings within a given validation's add and edit views.

See the [list of available components](https://shopify.dev/docs/api/admin-extensions/components).

### RenderExtension

### api

value: `Api`


### components

value: `ComponentsSet`


### output

value: `void | Promise<void>`


### ActionExtensionApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### close

value: `() => void`

Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.

### data

value: `Data`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### I18n

### formatCurrency

value: `(number: number | bigint, options?: { inExtensionLocale?: boolean; } & NumberFormatOptions) => string`

  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
  - Form: declare class Form extends PreactCustomElement implements FormProps {
  constructor();
}
Returns a localized currency value.

This function behaves like the standard `Intl.NumberFormat()` with a style of `currency` applied. It uses the buyer's locale by default.

### formatDate

value: `(date: Date, options?: { inExtensionLocale?: boolean; } & DateTimeFormatOptions) => string`

  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
  - Form: declare class Form extends PreactCustomElement implements FormProps {
  constructor();
}
Returns a localized date value.

This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses the buyer's locale by default. Formatting options can be passed in as options.

### formatNumber

value: `(number: number | bigint, options?: { inExtensionLocale?: boolean; } & NumberFormatOptions) => string`

  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
  - Form: declare class Form extends PreactCustomElement implements FormProps {
  constructor();
}
Returns a localized number.

This function behaves like the standard `Intl.NumberFormat()` with a style of `decimal` applied. It uses the buyer's locale by default.

### translate

value: `I18nTranslate`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
  - I18nTranslate: export interface I18nTranslate {
  /**
   * This returns a translated string matching a key in a locale file.
   *
   * @example translate("banner.title")
   */
  <ReplacementType = string>(
    key: string,
    options?: Record<string, ReplacementType | string | number>,
  ): ReplacementType extends string | number
    ? string
    : (string | ReplacementType)[];
}
Returns translated content in the buyer's locale, as supported by the extension.

- `options.count` is a special numeric value used in pluralization.
- The other option keys and values are treated as replacements for interpolation.
- If the replacements are all primitives, then `translate()` returns a single string.
- If replacements contain UI components, then `translate()` returns an array of elements.

### Intents

### launchUrl

value: `string | URL`

The URL that was used to launch the intent.

### PickerApi

#### Returns: Promise<Picker>

#### Params:

- options: PickerOptions
(options: PickerOptions) => Promise<Picker>


### PickerOptions

### headers

value: `Header[]`

  - Header: interface Header {
  /**
   * The content to display in the table column header.
   */
  content?: string;
  /**
   * The type of data to display in the column. The type is used to format the data in the column.
   * If the type is 'number', the data in the column will be right-aligned, this should be used when referencing currency or numeric values.
   * If the type is 'string', the data in the column will be left-aligned.
   * @defaultValue 'string'
   */
  type?: 'string' | 'number';
}
The data headers for the picker. These are used to display the table headers in the picker modal.

### heading

value: `string`

The heading of the picker. This is displayed in the title of the picker modal.

### items

value: `Item[]`

  - Item: interface Item {
  /**
   * The unique identifier of the item. This will be returned by the picker if selected.
   */
  id: string;
  /**
   * The primary content to display in the first column of the row.
   */
  heading: string;
  /**
   * The additional content to display in the second and third columns of the row, if provided.
   */
  data?: DataPoint[];
  /**
   * Whether the item is disabled or not. If the item is disabled, it cannot be selected.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.
   */
  selected?: boolean;
  /**
   * The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.
   */
  badges?: PickerBadge[];
  /**
   * The thumbnail to display at the start of the row. This is used to display an image or icon for the item.
   */
  thumbnail?: {url: string};
}
The items to display in the picker. These are used to display the rows in the picker modal.

### multiple

value: `boolean | number`

The data headers for the picker. These are used to display the table headers in the picker modal.

### Header

### content

value: `string`

The content to display in the table column header.

### type

value: `'string' | 'number'`

The type of data to display in the column. The type is used to format the data in the column. If the type is 'number', the data in the column will be right-aligned, this should be used when referencing currency or numeric values. If the type is 'string', the data in the column will be left-aligned.

### Item

### badges

value: `PickerBadge[]`

  - PickerBadge: interface PickerBadge {
  content: string;
  tone?: Tone;
  progress?: Progress;
}
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - Badge: declare class Badge extends PreactCustomElement implements BadgeProps {
  accessor color: BadgeProps['color'];
  accessor icon: BadgeProps['icon'];
  accessor size: BadgeProps['size'];
  accessor tone: BadgeProps['tone'];
  constructor();
}
The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.

### data

value: `DataPoint[]`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - DataPoint: string | number | undefined
The additional content to display in the second and third columns of the row, if provided.

### disabled

value: `boolean`

Whether the item is disabled or not. If the item is disabled, it cannot be selected.

### heading

value: `string`

The primary content to display in the first column of the row.

### id

value: `string`

The unique identifier of the item. This will be returned by the picker if selected.

### selected

value: `boolean`

Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.

### thumbnail

value: `{ url: string; }`

The thumbnail to display at the start of the row. This is used to display an image or icon for the item.

### PickerBadge

### content

value: `string`


### progress

value: `Progress`

  - Progress: 'incomplete' | 'partiallyComplete' | 'complete'

### tone

value: `Tone`

  - Tone: 'info' | 'success' | 'warning' | 'critical'

### Picker

### selected

value: `Promise<string[] | undefined>`

A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.

### ResourcePickerApi

#### Returns: Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>

#### Params:

- options: ResourcePickerOptions
(
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>


### ResourcePickerOptions

### action

value: `'add' | 'select'`

The action verb appears in the title and as the primary action of the Resource Picker.

### filter

value: `Filters`

  - Filters: interface Filters {
  /**
   * Whether to show hidden resources, referring to products that are not published on any sales channels.
   * @defaultValue true
   */
  hidden?: boolean;
  /**
   * Whether to show product variants. Only applies to the Product resource type picker.
   * @defaultValue true
   */
  variants?: boolean;
  /**
   * Whether to show [draft products](https://help.shopify.com/en/manual/products/details?shpxid=70af7d87-E0F2-4973-8B09-B972AAF0ADFD#product-availability).
   * Only applies to the Product resource type picker.
   * Setting this to undefined will show a badge on draft products.
   * @defaultValue true
   */
  draft?: boolean | undefined;
  /**
   * Whether to show [archived products](https://help.shopify.com/en/manual/products/details?shpxid=70af7d87-E0F2-4973-8B09-B972AAF0ADFD#product-availability).
   * Only applies to the Product resource type picker.
   * Setting this to undefined will show a badge on draft products.
   * @defaultValue true
   */
  archived?: boolean | undefined;
  /**
   * GraphQL initial search query for filtering resources available in the picker.
   * See [search syntax](https://shopify.dev/docs/api/usage/search-syntax) for more information.
   * This is not displayed in the search bar when the picker is opened.
   */
  query?: string;
}
Filters for what resource to show.

### multiple

value: `boolean | number`

Whether to allow selecting multiple items of a specific type or not. If a number is provided, then limit the selections to a maximum of that number of items. When type is Product, the user may still select multiple variants of a single product, even if multiple is false.

### query

value: `string`

GraphQL initial search query for filtering resources available in the picker. See [search syntax](https://shopify.dev/docs/api/usage/search-syntax) for more information. This is displayed in the search bar when the picker is opened and can be edited by users. For most use cases, you should use the `filter.query` option instead which doesn't show the query in the UI.

### selectionIds

value: `BaseResource[]`

  - BaseResource: interface BaseResource extends Resource {
  variants?: Resource[];
}
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Resources that should be preselected when the picker is opened.

### type

value: `'product' | 'variant' | 'collection'`

The type of resource you want to pick.

### Filters

### archived

value: `boolean | undefined`

Whether to show [archived products](https://help.shopify.com/en/manual/products/details?shpxid=70af7d87-E0F2-4973-8B09-B972AAF0ADFD#product-availability). Only applies to the Product resource type picker. Setting this to undefined will show a badge on draft products.

### draft

value: `boolean | undefined`

Whether to show [draft products](https://help.shopify.com/en/manual/products/details?shpxid=70af7d87-E0F2-4973-8B09-B972AAF0ADFD#product-availability). Only applies to the Product resource type picker. Setting this to undefined will show a badge on draft products.

### hidden

value: `boolean`

Whether to show hidden resources, referring to products that are not published on any sales channels.

### query

value: `string`

GraphQL initial search query for filtering resources available in the picker. See [search syntax](https://shopify.dev/docs/api/usage/search-syntax) for more information. This is not displayed in the search bar when the picker is opened.

### variants

value: `boolean`

Whether to show product variants. Only applies to the Product resource type picker.

### BaseResource

### id

value: `string`

in GraphQL id format, ie 'gid://shopify/Product/1'

### variants

value: `Resource[]`

  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}

### Resource

### id

value: `string`

in GraphQL id format, ie 'gid://shopify/Product/1'

### Storage

### clear

value: `() => Promise<void>`

Clears the storage.

### delete

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>(key: Keys) => Promise<boolean>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Deletes a key from the storage.

### deleteMany

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>(keys: Keys[]) => Promise<Record<Keys, boolean>>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Deletes multiple keys from the storage at once.

### entries

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>() => Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Gets all the keys and values in the storage.

### get

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>(key: Keys) => Promise<StorageTypes[Keys]>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Gets the value of a key in the storage.

### getMany

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>(keys: Keys[]) => Promise<StorageTypes[Keys][]>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Gets the values of multiple keys in the storage at once.

### set

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes, Keys extends keyof StorageTypes = keyof StorageTypes>(key: Keys, value: StorageTypes[Keys]) => Promise<void>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Sets the value of a key in the storage.

### setMany

value: `<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(entries: Partial<StorageTypes>) => Promise<void>`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Sets multiple key-value pairs in the storage at once.

If the operation fails, no changes are made to storage.

### Avatar

### initials

value: `string`

Initials to display in the avatar.

### src

value: `string`

The URL or path to the image.

Initials will be rendered as a fallback if `src` is not provided, fails to load or does not load quickly

### size

value: `"small" | "small-200" | "base" | "large" | "large-200"`

Size of the avatar.

### alt

value: `string`

An alternative text that describes the avatar for the reader to understand what it is about or identify the user the avatar belongs to.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

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


### Badge

### color

value: `"base" | "strong"`

Modify the color to be more or less intense.

### icon

value: `"" | "replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x"`


### size

value: `"base" | "large" | "large-100"`

Adjusts the size.

### tone

value: `"info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution"`

Sets the tone of the Badge, based on the intention of the information being conveyed.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Banner

### heading

value: `string`

The title of the banner.

### tone

value: `"info" | "success" | "warning" | "critical" | "auto"`

Sets the tone of the Banner, based on the intention of the information being conveyed.

The banner is a live region and the type of status will be dictated by the Tone selected.

- `critical` creates an [assertive live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role) that is announced by screen readers immediately.
- `neutral`, `info`, `success`, `warning` and `caution` creates an [informative live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role) that is announced by screen readers after the current message.

### hidden

value: `boolean`

Determines whether the banner is hidden.

If this property is being set on each framework render (as in 'controlled' usage), and the banner is `dismissible`, ensure you update app state for this property when the `dismiss` event fires.

If the banner is not `dismissible`, it can still be hidden by setting this property.

### dismissible

value: `boolean`

Determines whether the close button of the banner is present.

When the close button is pressed, the `dismiss` event will fire, then `hidden` will be true, any animation will complete, and the `afterhide` event will fire.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Box

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Button

### disabled

value: `boolean`

Disables the button, meaning it cannot be clicked or receive focus.

### icon

value: `"" | "replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x"`


### loading

value: `boolean`

Replaces content with a loading indicator while a background action is being performed.

This also disables the button.

### variant

value: `"auto" | "primary" | "secondary" | "tertiary"`

Changes the visual appearance of the Button.

### tone

value: `"critical" | "auto" | "neutral"`

Sets the tone of the Button, based on the intention of the information being conveyed.

### target

value: `"auto" | AnyString | "_blank" | "_self" | "_parent" | "_top"`

  - AnyString: string & {}
Specifies where to display the linked URL.

### href

value: `string`

The URL to link to.

- If set, it will navigate to the location specified by `href` after executing the `click` event.
- If a `commandFor` is set, the `command` will be executed instead of the navigation.

### download

value: `string`

Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs, or the blob: and data: schemes.

### type

value: `"button" | "reset" | "submit"`

The behavior of the button.

- `submit`: Used to indicate the component acts as a submit button, meaning it submits the closest form.
- `button`: Used to indicate the component acts as a button, meaning it has no default action.
- `reset`: Used to indicate the component acts as a reset button, meaning it resets the closest form (returning fields to their default values).

This property is ignored if the component supports `href` or `commandFor`/`command` and one of them is set.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the Button. It will be read to users using assistive technologies such as screen readers.

Use this when using only an icon or the button text is not enough context for users using assistive technologies.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
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

### Checkbox

### indeterminate

value: `boolean`


### defaultIndeterminate

value: `boolean`


### checked

value: `boolean`

Whether the control is active.

### value

value: `string`

The value used in form data when the checkbox is checked.

### defaultChecked

value: `boolean`

Whether the control is active by default.

### accessibilityLabel

value: `string`

A label used for users using assistive technologies like screen readers. When set, any children or `label` supplied will not be announced. This can also be used to display a control without a visual label, while still providing context to users using screen readers.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Visual content to use as the control label.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### formResetCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Choice

### disabled

value: `boolean`

Disables the control, disallowing any interaction.

### details

value: `string`

Additional text to provide context or guidance for the input.

This text is displayed along with the input and its label to offer more information or instructions to the user.

### selected

value: `boolean`

Whether the control is active.

### value

value: `string`

The value used in form data when the control is checked.

### accessibilityLabel

value: `string`

A label used for users using assistive technologies like screen readers. When set, any children or `label` supplied will not be announced. This can also be used to display a control without a visual label, while still providing context to users using screen readers.

### label

value: `string`

Content to use as the choice label.

### defaultSelected

value: `boolean`

Whether the control is active by default.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### ChoiceList

### disabled

value: `boolean`

Disables the field, disallowing any interaction.

`disabled` on any child choices is ignored when this is true.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### multiple

value: `boolean`

Whether multiple choices can be selected.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### values

value: `string[]`

An array of the `value`s of the selected options.

This is a convenience prop for setting the `selected` prop on child options.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### __@internals$1@4834

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Clickable

### disabled

value: `boolean`

Disables the clickable, meaning it cannot be clicked or receive focus.

In this state, onClick will not fire. If the click event originates from a child element, the event will immediately stop propagating from this element.

However, items within the clickable can still receive focus and be interacted with.

This has no impact on the visual state by default, but developers are encouraged to style the clickable accordingly.

### loading

value: `boolean`

Disables the clickable, and indicates to assistive technology that the loading is in progress.

This also disables the clickable.

### target

value: `"auto" | AnyString | "_blank" | "_self" | "_parent" | "_top"`

  - AnyString: string & {}
Specifies where to display the linked URL.

### href

value: `string`

The URL to link to.

- If set, it will navigate to the location specified by `href` after executing the `click` event.
- If a `commandFor` is set, the `command` will be executed instead of the navigation.

### download

value: `string`

Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs, or the blob: and data: schemes.

### type

value: `"button" | "reset" | "submit"`

The behavior of the button.

- `submit`: Used to indicate the component acts as a submit button, meaning it submits the closest form.
- `button`: Used to indicate the component acts as a button, meaning it has no default action.
- `reset`: Used to indicate the component acts as a reset button, meaning it resets the closest form (returning fields to their default values).

This property is ignored if the component supports `href` or `commandFor`/`command` and one of them is set.

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
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

### DatePicker

### defaultView

value: `string`

Default month to display in `YYYY-MM` format.

This value is used until `view` is set, either directly or as a result of user interaction.

Defaults to the current month in the user's locale.

### view

value: `string`

Displayed month in `YYYY-MM` format.

`onViewChange` is called when this value changes.

Defaults to `defaultView`.

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

### allowDays

value: `string`

Days of the week that can be selected. These intersect with the result of `allowDates` and `disallowDates`.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` has no effect on the result of `allowDates` and `disallowDates`.

Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.

### disallowDays

value: `string`

Days of the week that cannot be selected. This subtracts from `allowDays`, and intersects with the result of `allowDates` and `disallowDates`.

A comma-separated list of dates, date ranges. Whitespace is allowed after commas.

The default `''` has no effect on `allowDays`.

Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.

### type

value: `"single" | "multiple" | "range"`


### defaultValue

value: `string`

Default selected value.

The default means no date is selected.

If the provided value is invalid, no date is selected.

- If `type="single"`, this is a date in `YYYY-MM-DD` format.
- If `type="multiple"`, this is a comma-separated list of dates in `YYYY-MM-DD` format.
- If `type="range"`, this is a range in `YYYY-MM-DD--YYYY-MM-DD` format. The range is inclusive.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

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

### formResetCallback

value: `() => void`


### __@dirtyStateSymbol@4880

value: `boolean`


### __@internals@4879

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Divider

### direction

value: `"inline" | "block"`

Specify the direction of the divider.

An 'inline' divider separates blocks of content. In a left-to-right or right-to-left writing mode, this would typically be a horizontal line.

A 'block' divider separates items within the current line of content. In a left-to-right or right-to-left writing mode, this would typically be a vertical line.

### color

value: `"base" | "strong"`

Modify the color to be more or less intense.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### EmailField

### autocomplete

value: `"on" | "off" | EmailAutocompleteField | `section-${string} email` | `section-${string} home email` | `section-${string} mobile email` | `section-${string} fax email` | `section-${string} pager email` | "shipping email" | "shipping home email" | "shipping mobile email" | "shipping fax email" | "shipping pager email" | "billing email" | "billing home email" | "billing mobile email" | "billing fax email" | "billing pager email" | `section-${string} shipping email` | `section-${string} shipping home email` | `section-${string} shipping mobile email` | `section-${string} shipping fax email` | `section-${string} shipping pager email` | `section-${string} billing email` | `section-${string} billing home email` | `section-${string} billing mobile email` | `section-${string} billing fax email` | `section-${string} billing pager email``

  - EmailAutocompleteField: 'url' | 'language' | 'organization' | 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'one-time-code' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'cc-type' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### value

value: `string`

The current value for the field. If omitted, the field will be empty.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Grid

### gridTemplateColumns

value: `string`

Define columns and specify their size.

### gridTemplateRows

value: `string`

Define rows and specify their size.

### justifyItems

value: `"" | JustifyItemsKeyword`

  - Item: interface Item {
  /**
   * The unique identifier of the item. This will be returned by the picker if selected.
   */
  id: string;
  /**
   * The primary content to display in the first column of the row.
   */
  heading: string;
  /**
   * The additional content to display in the second and third columns of the row, if provided.
   */
  data?: DataPoint[];
  /**
   * Whether the item is disabled or not. If the item is disabled, it cannot be selected.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.
   */
  selected?: boolean;
  /**
   * The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.
   */
  badges?: PickerBadge[];
  /**
   * The thumbnail to display at the start of the row. This is used to display an image or icon for the item.
   */
  thumbnail?: {url: string};
}
  - JustifyItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the grid items along the inline (row) axis.

This overrides the inline value of `placeItems`.

### alignItems

value: `"" | AlignItemsKeyword`

  - Item: interface Item {
  /**
   * The unique identifier of the item. This will be returned by the picker if selected.
   */
  id: string;
  /**
   * The primary content to display in the first column of the row.
   */
  heading: string;
  /**
   * The additional content to display in the second and third columns of the row, if provided.
   */
  data?: DataPoint[];
  /**
   * Whether the item is disabled or not. If the item is disabled, it cannot be selected.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.
   */
  selected?: boolean;
  /**
   * The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.
   */
  badges?: PickerBadge[];
  /**
   * The thumbnail to display at the start of the row. This is used to display an image or icon for the item.
   */
  thumbnail?: {url: string};
}
  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the grid items along the block (column) axis.

This overrides the block value of `placeItems`.

### placeItems

value: `AlignItemsKeyword | "normal normal" | "normal stretch" | "normal baseline" | "normal first baseline" | "normal last baseline" | "normal start" | "normal end" | "normal center" | "normal unsafe start" | "normal unsafe end" | "normal unsafe center" | "normal safe start" | "normal safe end" | "normal safe center" | "stretch normal" | "stretch stretch" | "stretch baseline" | "stretch first baseline" | "stretch last baseline" | "stretch start" | "stretch end" | "stretch center" | "stretch unsafe start" | "stretch unsafe end" | "stretch unsafe center" | "stretch safe start" | "stretch safe end" | "stretch safe center" | "baseline normal" | "baseline stretch" | "baseline baseline" | "baseline first baseline" | "baseline last baseline" | "baseline start" | "baseline end" | "baseline center" | "baseline unsafe start" | "baseline unsafe end" | "baseline unsafe center" | "baseline safe start" | "baseline safe end" | "baseline safe center" | "first baseline normal" | "first baseline stretch" | "first baseline baseline" | "first baseline first baseline" | "first baseline last baseline" | "first baseline start" | "first baseline end" | "first baseline center" | "first baseline unsafe start" | "first baseline unsafe end" | "first baseline unsafe center" | "first baseline safe start" | "first baseline safe end" | "first baseline safe center" | "last baseline normal" | "last baseline stretch" | "last baseline baseline" | "last baseline first baseline" | "last baseline last baseline" | "last baseline start" | "last baseline end" | "last baseline center" | "last baseline unsafe start" | "last baseline unsafe end" | "last baseline unsafe center" | "last baseline safe start" | "last baseline safe end" | "last baseline safe center" | "start normal" | "start stretch" | "start baseline" | "start first baseline" | "start last baseline" | "start start" | "start end" | "start center" | "start unsafe start" | "start unsafe end" | "start unsafe center" | "start safe start" | "start safe end" | "start safe center" | "end normal" | "end stretch" | "end baseline" | "end first baseline" | "end last baseline" | "end start" | "end end" | "end center" | "end unsafe start" | "end unsafe end" | "end unsafe center" | "end safe start" | "end safe end" | "end safe center" | "center normal" | "center stretch" | "center baseline" | "center first baseline" | "center last baseline" | "center start" | "center end" | "center center" | "center unsafe start" | "center unsafe end" | "center unsafe center" | "center safe start" | "center safe end" | "center safe center" | "unsafe start normal" | "unsafe start stretch" | "unsafe start baseline" | "unsafe start first baseline" | "unsafe start last baseline" | "unsafe start start" | "unsafe start end" | "unsafe start center" | "unsafe start unsafe start" | "unsafe start unsafe end" | "unsafe start unsafe center" | "unsafe start safe start" | "unsafe start safe end" | "unsafe start safe center" | "unsafe end normal" | "unsafe end stretch" | "unsafe end baseline" | "unsafe end first baseline" | "unsafe end last baseline" | "unsafe end start" | "unsafe end end" | "unsafe end center" | "unsafe end unsafe start" | "unsafe end unsafe end" | "unsafe end unsafe center" | "unsafe end safe start" | "unsafe end safe end" | "unsafe end safe center" | "unsafe center normal" | "unsafe center stretch" | "unsafe center baseline" | "unsafe center first baseline" | "unsafe center last baseline" | "unsafe center start" | "unsafe center end" | "unsafe center center" | "unsafe center unsafe start" | "unsafe center unsafe end" | "unsafe center unsafe center" | "unsafe center safe start" | "unsafe center safe end" | "unsafe center safe center" | "safe start normal" | "safe start stretch" | "safe start baseline" | "safe start first baseline" | "safe start last baseline" | "safe start start" | "safe start end" | "safe start center" | "safe start unsafe start" | "safe start unsafe end" | "safe start unsafe center" | "safe start safe start" | "safe start safe end" | "safe start safe center" | "safe end normal" | "safe end stretch" | "safe end baseline" | "safe end first baseline" | "safe end last baseline" | "safe end start" | "safe end end" | "safe end center" | "safe end unsafe start" | "safe end unsafe end" | "safe end unsafe center" | "safe end safe start" | "safe end safe end" | "safe end safe center" | "safe center normal" | "safe center stretch" | "safe center baseline" | "safe center first baseline" | "safe center last baseline" | "safe center start" | "safe center end" | "safe center center" | "safe center unsafe start" | "safe center unsafe end" | "safe center unsafe center" | "safe center safe start" | "safe center safe end" | "safe center safe center"`

  - Item: interface Item {
  /**
   * The unique identifier of the item. This will be returned by the picker if selected.
   */
  id: string;
  /**
   * The primary content to display in the first column of the row.
   */
  heading: string;
  /**
   * The additional content to display in the second and third columns of the row, if provided.
   */
  data?: DataPoint[];
  /**
   * Whether the item is disabled or not. If the item is disabled, it cannot be selected.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.
   */
  selected?: boolean;
  /**
   * The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.
   */
  badges?: PickerBadge[];
  /**
   * The thumbnail to display at the start of the row. This is used to display an image or icon for the item.
   */
  thumbnail?: {url: string};
}
  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
A shorthand property for `justify-items` and `align-items`.

### justifyContent

value: `"" | JustifyContentKeyword`

  - JustifyContentKeyword: 'normal' | ContentDistribution | OverflowPosition | ContentPosition
Aligns the grid along the inline (row) axis.

This overrides the inline value of `placeContent`.

### alignContent

value: `"" | AlignContentKeyword`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
Aligns the grid along the block (column) axis.

This overrides the block value of `placeContent`.

### placeContent

value: `"normal normal" | "normal stretch" | "normal start" | "normal end" | "normal center" | "normal unsafe start" | "normal unsafe end" | "normal unsafe center" | "normal safe start" | "normal safe end" | "normal safe center" | "stretch normal" | "stretch stretch" | "stretch start" | "stretch end" | "stretch center" | "stretch unsafe start" | "stretch unsafe end" | "stretch unsafe center" | "stretch safe start" | "stretch safe end" | "stretch safe center" | "baseline normal" | "baseline stretch" | "baseline start" | "baseline end" | "baseline center" | "baseline unsafe start" | "baseline unsafe end" | "baseline unsafe center" | "baseline safe start" | "baseline safe end" | "baseline safe center" | "first baseline normal" | "first baseline stretch" | "first baseline start" | "first baseline end" | "first baseline center" | "first baseline unsafe start" | "first baseline unsafe end" | "first baseline unsafe center" | "first baseline safe start" | "first baseline safe end" | "first baseline safe center" | "last baseline normal" | "last baseline stretch" | "last baseline start" | "last baseline end" | "last baseline center" | "last baseline unsafe start" | "last baseline unsafe end" | "last baseline unsafe center" | "last baseline safe start" | "last baseline safe end" | "last baseline safe center" | "start normal" | "start stretch" | "start start" | "start end" | "start center" | "start unsafe start" | "start unsafe end" | "start unsafe center" | "start safe start" | "start safe end" | "start safe center" | "end normal" | "end stretch" | "end start" | "end end" | "end center" | "end unsafe start" | "end unsafe end" | "end unsafe center" | "end safe start" | "end safe end" | "end safe center" | "center normal" | "center stretch" | "center start" | "center end" | "center center" | "center unsafe start" | "center unsafe end" | "center unsafe center" | "center safe start" | "center safe end" | "center safe center" | "unsafe start normal" | "unsafe start stretch" | "unsafe start start" | "unsafe start end" | "unsafe start center" | "unsafe start unsafe start" | "unsafe start unsafe end" | "unsafe start unsafe center" | "unsafe start safe start" | "unsafe start safe end" | "unsafe start safe center" | "unsafe end normal" | "unsafe end stretch" | "unsafe end start" | "unsafe end end" | "unsafe end center" | "unsafe end unsafe start" | "unsafe end unsafe end" | "unsafe end unsafe center" | "unsafe end safe start" | "unsafe end safe end" | "unsafe end safe center" | "unsafe center normal" | "unsafe center stretch" | "unsafe center start" | "unsafe center end" | "unsafe center center" | "unsafe center unsafe start" | "unsafe center unsafe end" | "unsafe center unsafe center" | "unsafe center safe start" | "unsafe center safe end" | "unsafe center safe center" | "safe start normal" | "safe start stretch" | "safe start start" | "safe start end" | "safe start center" | "safe start unsafe start" | "safe start unsafe end" | "safe start unsafe center" | "safe start safe start" | "safe start safe end" | "safe start safe center" | "safe end normal" | "safe end stretch" | "safe end start" | "safe end end" | "safe end center" | "safe end unsafe start" | "safe end unsafe end" | "safe end unsafe center" | "safe end safe start" | "safe end safe end" | "safe end safe center" | "safe center normal" | "safe center stretch" | "safe center start" | "safe center end" | "safe center center" | "safe center unsafe start" | "safe center unsafe end" | "safe center unsafe center" | "safe center safe start" | "safe center safe end" | "safe center safe center" | AlignContentKeyword | "normal space-between" | "normal space-around" | "normal space-evenly" | "baseline space-between" | "baseline space-around" | "baseline space-evenly" | "first baseline space-between" | "first baseline space-around" | "first baseline space-evenly" | "last baseline space-between" | "last baseline space-around" | "last baseline space-evenly" | "start space-between" | "start space-around" | "start space-evenly" | "end space-between" | "end space-around" | "end space-evenly" | "center space-between" | "center space-around" | "center space-evenly" | "unsafe start space-between" | "unsafe start space-around" | "unsafe start space-evenly" | "unsafe end space-between" | "unsafe end space-around" | "unsafe end space-evenly" | "unsafe center space-between" | "unsafe center space-around" | "unsafe center space-evenly" | "safe start space-between" | "safe start space-around" | "safe start space-evenly" | "safe end space-between" | "safe end space-around" | "safe end space-evenly" | "safe center space-between" | "safe center space-around" | "safe center space-evenly" | "stretch space-between" | "stretch space-around" | "stretch space-evenly" | "space-between normal" | "space-between start" | "space-between end" | "space-between center" | "space-between unsafe start" | "space-between unsafe end" | "space-between unsafe center" | "space-between safe start" | "space-between safe end" | "space-between safe center" | "space-between stretch" | "space-between space-between" | "space-between space-around" | "space-between space-evenly" | "space-around normal" | "space-around start" | "space-around end" | "space-around center" | "space-around unsafe start" | "space-around unsafe end" | "space-around unsafe center" | "space-around safe start" | "space-around safe end" | "space-around safe center" | "space-around stretch" | "space-around space-between" | "space-around space-around" | "space-around space-evenly" | "space-evenly normal" | "space-evenly start" | "space-evenly end" | "space-evenly center" | "space-evenly unsafe start" | "space-evenly unsafe end" | "space-evenly unsafe center" | "space-evenly safe start" | "space-evenly safe end" | "space-evenly safe center" | "space-evenly stretch" | "space-evenly space-between" | "space-evenly space-around" | "space-evenly space-evenly"`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
A shorthand property for `justify-content` and `align-content`.

### gap

value: `MakeResponsive<MaybeTwoValuesShorthandProperty<SpacingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements.

`gap` can either accept: * a single SpacingKeyword value applied to both axes (e.g. `large-100`). *OR a pair of values (eg `large-100 large-500`) can be used to set the inline and block axes respectively. OR a container query string with supported SpacingKeyword values as query values (e.g.@container (inline-size > 500px) large-300, small-300)

### rowGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the block axis.

This overrides the row value of `gap`. `rowGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) *OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### columnGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the inline axis.

This overrides the column value of `gap`. `columnGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) * OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### GridItem

### gridColumn

value: `"auto" | `span ${number}``

Number of columns the item will span across

### gridRow

value: `"auto" | `span ${number}``

Number of rows the item will span across

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Heading

### accessibilityRole

value: `"none" | "presentation" | "heading"`

Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

- `heading`: defines the element as a heading to a page or section.
- `presentation`: the heading level will be stripped, and will prevent the element’s implicit ARIA semantics from being exposed to the accessibility tree.
- `none`: a synonym for the `presentation` role.

### lineClamp

value: `number`

Truncates the text content to the specified number of lines.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Icon

### color

value: `"base" | "subdued"`

Modify the color to be more or less intense.

### tone

value: `"info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution"`

Sets the tone of the icon, based on the intention of the information being conveyed.

### type

value: `"" | "replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x"`

Specifies the type of icon that will be displayed.

### size

value: `"small" | "base"`

Adjusts the size of the icon.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Image

### src

value: `string`

The image source (either a remote URL or a local file resource).

When the image is loading or no `src` is provided, a placeholder will be rendered.

### srcSet

value: `string`

A set of image sources and their width or pixel density descriptors.

This overrides the `src` property.

### sizes

value: `string`

A set of media conditions and their corresponding sizes.

### alt

value: `string`

An alternative text description that describe the image for the reader to understand what it is about. It is extremely useful for both users using assistive technology and sighted users. A well written description provides people with visual impairments the ability to participate in consuming non-text content. When a screen readers encounters an `s-image`, the description is read and announced aloud. If an image fails to load, potentially due to a poor connection, the `alt` is displayed on screen instead. This has the benefit of letting a sighted buyer know an image was meant to load here, but as an alternative, they’re still able to consume the text content. Read [considerations when writing alternative text](https://www.shopify.com/ca/blog/image-alt-text#4) to learn more.

### aspectRatio

value: ``${number}` | `${number}/${number}` | `${number}/ ${number}` | `${number} /${number}` | `${number} / ${number}``

The aspect ratio of the image.

The rendering of the image will depend on the `inlineSize` value:

- `inlineSize="fill"`: the aspect ratio will be respected and the image will take the necessary space.
- `inlineSize="auto"`: the image will not render until it has loaded and the aspect ratio will be ignored.

For example, if the value is set as `50 / 100`, the getter returns `50 / 100`. If the value is set as `0.5`, the getter returns `0.5 / 1`.

### objectFit

value: `"contain" | "cover"`

Determines how the content of the image is resized to fit its container. The image is positioned in the center of the container.

### loading

value: `"eager" | "lazy"`

Determines the loading behavior of the image:
- `eager`: Immediately loads the image, irrespective of its position within the visible viewport.
- `lazy`: Delays loading the image until it approaches a specified distance from the viewport.

### accessibilityRole

value: `"none" | "presentation" | "img"`

Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### inlineSize

value: `"auto" | "fill"`

The displayed inline width of the image.

- `fill`: the image will takes up 100% of the available inline size.
- `auto`: the image will be displayed at its natural size.

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Link

### tone

value: `"critical" | "auto" | "neutral"`

Sets the tone of the Link, based on the intention of the information being conveyed.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the Link. It will be read to users using assistive technologies such as screen readers.

Use this when using only an icon or the content of the link is not enough context for users using assistive technologies.

### href

value: `string`

The URL to link to.

- If set, it will navigate to the location specified by `href` after executing the `click` event.
- If a `commandFor` is set, the `command` will be executed instead of the navigation.

### target

value: `"auto" | AnyString | "_blank" | "_self" | "_parent" | "_top"`

  - AnyString: string & {}
Specifies where to display the linked URL.

### download

value: `string`

Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs, or the blob: and data: schemes.

### lang

value: `string`

Indicate the text language. Useful when the text is in a different language than the rest of the page. It will allow assistive technologies such as screen readers to invoke the correct pronunciation. [Reference of values](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry) ("subtag" label)

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
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

### ListItem

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### MoneyField

### max

value: `number`

The highest decimal or integer to be accepted for the field. When used with `step` the value will round down to the max number.

Note: a user will still be able to use the keyboard to input a number higher than the max. It is up to the developer to add appropriate validation.

### min

value: `number`

The lowest decimal or integer to be accepted for the field. When used with `step` the value will round up to the min number.

Note: a user will still be able to use the keyboard to input a number lower than the min. It is up to the developer to add appropriate validation.

### step

value: `number`

The amount the value can increase or decrease by. This can be an integer or decimal. If a `max` or `min` is specified with `step` when increasing/decreasing the value via the buttons, the final value will always round to the `max` or `min` rather than the closest valid amount.

### currencyCode

value: `AnyString | CurrencyCode`

  - AnyString: string & {}
  - CurrencyCode: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AFN' | 'ALL' | 'DZD' | 'AOA' | 'ARS' | 'AMD' | 'AWG' | 'AUD' | 'BBD' | 'AZN' | 'BDT' | 'BSD' | 'BHD' | 'BIF' | 'BZD' | 'BMD' | 'BTN' | 'BAM' | 'BRL' | 'BOB' | 'BWP' | 'BND' | 'BGN' | 'MMK' | 'KHR' | 'CVE' | 'KYD' | 'XAF' | 'CLP' | 'CNY' | 'COP' | 'KMF' | 'CDF' | 'CRC' | 'HRK' | 'CZK' | 'DKK' | 'DOP' | 'XCD' | 'EGP' | 'ETB' | 'XPF' | 'FJD' | 'GMD' | 'GHS' | 'GTQ' | 'GYD' | 'GEL' | 'HTG' | 'HNL' | 'HKD' | 'HUF' | 'ISK' | 'INR' | 'IDR' | 'ILS' | 'IQD' | 'JMD' | 'JPY' | 'JEP' | 'JOD' | 'KZT' | 'KES' | 'KWD' | 'KGS' | 'LAK' | 'LVL' | 'LBP' | 'LSL' | 'LRD' | 'LTL' | 'MGA' | 'MKD' | 'MOP' | 'MWK' | 'MVR' | 'MXN' | 'MYR' | 'MUR' | 'MDL' | 'MAD' | 'MNT' | 'MZN' | 'NAD' | 'NPR' | 'ANG' | 'NZD' | 'NIO' | 'NGN' | 'NOK' | 'OMR' | 'PAB' | 'PKR' | 'PGK' | 'PYG' | 'PEN' | 'PHP' | 'PLN' | 'QAR' | 'RON' | 'RUB' | 'RWF' | 'WST' | 'SAR' | 'RSD' | 'SCR' | 'SGD' | 'SDG' | 'SYP' | 'ZAR' | 'KRW' | 'SSP' | 'SBD' | 'LKR' | 'SRD' | 'SZL' | 'SEK' | 'CHF' | 'TWD' | 'THB' | 'TZS' | 'TTD' | 'TND' | 'TRY' | 'TMT' | 'UGX' | 'UAH' | 'AED' | 'UYU' | 'UZS' | 'VUV' | 'VND' | 'XOF' | 'YER' | 'ZMW' | 'BYN' | 'BYR' | 'DJF' | 'ERN' | 'FKP' | 'GIP' | 'GNF' | 'IRR' | 'KID' | 'LYD' | 'MRU' | 'SLL' | 'SHP' | 'SOS' | 'STD' | 'STN' | 'TJS' | 'TOP' | 'VED' | 'VEF' | 'VES' | 'XXX'
Specifies the currency code that will be displayed.

### value

value: `string`


The current value for the field. If omitted, the field will be empty.

### autocomplete

value: `string`

A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### NumberField

### value

value: `string`


The current value for the field. If omitted, the field will be empty.

### inputMode

value: `"decimal" | "numeric"`

Sets the virtual keyboard.

### step

value: `number`

The amount the value can increase or decrease by. This can be an integer or decimal. If a `max` or `min` is specified with `step` when increasing/decreasing the value via the buttons, the final value will always round to the `max` or `min` rather than the closest valid amount.

### max

value: `number`

The highest decimal or integer to be accepted for the field. When used with `step` the value will round down to the max number.

Note: a user will still be able to use the keyboard to input a number higher than the max. It is up to the developer to add appropriate validation.

### min

value: `number`

The lowest decimal or integer to be accepted for the field. When used with `step` the value will round up to the min number.

Note: a user will still be able to use the keyboard to input a number lower than the min. It is up to the developer to add appropriate validation.

### prefix

value: `string`

A value to be displayed immediately before the editable portion of the field.

This is useful for displaying an implied part of the value, such as "https://" or "+353".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the prefix until the user focuses the input.

### suffix

value: `string`

A value to be displayed immediately after the editable portion of the field.

This is useful for displaying an implied part of the value, such as "@shopify.com", or "%".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the suffix until the user focuses the input.

### autocomplete

value: `"on" | "off" | NumberAutocompleteField | `section-${string} one-time-code` | `section-${string} cc-number` | `section-${string} cc-csc` | "shipping one-time-code" | "shipping cc-number" | "shipping cc-csc" | "billing one-time-code" | "billing cc-number" | "billing cc-csc" | `section-${string} shipping one-time-code` | `section-${string} shipping cc-number` | `section-${string} shipping cc-csc` | `section-${string} billing one-time-code` | `section-${string} billing cc-number` | `section-${string} billing cc-csc``

  - NumberAutocompleteField: 'url' | 'email' | 'language' | 'organization' | 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-type' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Option

### selected

value: `boolean`

Whether the control is active.

### defaultSelected

value: `boolean`

Whether the control is active by default.

### value

value: `string`

The value used in form data when the control is checked.

### disabled

value: `boolean`

Disables the control, disallowing any interaction.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### OptionGroup

### disabled

value: `boolean`

Whether the options within this group can be selected or not.

### label

value: `string`

The user-facing label for this group of options.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### OrderedList

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Paragraph

### fontVariantNumeric

value: `"auto" | "normal" | "tabular-nums"`

Set the numeric properties of the font.

### lineClamp

value: `number`

Truncates the text content to the specified number of lines.

### tone

value: `"info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution"`

Sets the tone of the component, based on the intention of the information being conveyed.

### color

value: `"base" | "subdued"`

Modify the color to be more or less intense.

### dir

value: `"" | "auto" | "ltr" | "rtl"`

Indicates the directionality of the element’s text.

- `ltr`: languages written from left to right (e.g. English)
- `rtl`: languages written from right to left (e.g. Arabic)
- `auto`: the user agent determines the direction based on the content
- `''`: direction is inherited from parent elements (equivalent to not setting the attribute)

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### PasswordField

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### autocomplete

value: `"on" | "off" | PasswordAutocompleteField | `section-${string} current-password` | `section-${string} new-password` | "shipping current-password" | "shipping new-password" | "billing current-password" | "billing new-password" | `section-${string} shipping current-password` | `section-${string} shipping new-password` | `section-${string} billing current-password` | `section-${string} billing new-password``

  - PasswordAutocompleteField: 'url' | 'email' | 'language' | 'organization' | 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'country-name' | 'country' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'nickname' | 'one-time-code' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'cc-type' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### value

value: `string`

The current value for the field. If omitted, the field will be empty.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### QueryContainer

### containerName

value: `string`

The name of the container, which can be used in your container queries to target this container specifically.

We place the container name of `s-default` on every container. Because of this, it is not required to add a `containerName` identifier in your queries. For example, a `@container (inline-size <= 300px) none, auto` query is equivalent to `@container s-default (inline-size <= 300px) none, auto`.

Any value set in `containerName` will be set alongside alongside `s-default`. For example, `containerName="my-container-name"` will result in a value of `s-default my-container-name` set on the `container-name` CSS property of the rendered HTML.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Section

### connectedCallback

value: `() => void`


### accessibilityLabel

value: `string`

A label used to describe the section that will be announced by assistive technologies.

When no `heading` property is provided or included as a children of the Section, you **must** provide an `accessibilityLabel` to describe the Section. This is important as it allows assistive technologies to provide the right context to users.

### heading

value: `string`

A title that describes the content of the section.

### padding

value: `"base" | "none"`

Adjust the padding of all edges.

- `base`: applies padding that is appropriate for the element. Note that it may result in no padding if this is the right design decision in a particular context.
- `none`: removes all padding from the element. This can be useful when elements inside the Section need to span to the edge of the Section. For example, a full-width image. In this case, rely on `s-box` with a padding of 'base' to bring back the desired padding for the rest of the content.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Select

### icon

value: `"replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x" | AnyString`

  - AnyString: string & {}
The type of icon to be displayed in the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### value

value: `string`


The current value for the field. If omitted, the field will be empty.

### formResetCallback

value: `() => void`


### __@usedFirstOptionSymbol@5151

value: `boolean`

used to determine if no value or defaultValue was set, in which case the first non-disabled option was used

this is important because we need to use the placeholder in these situations, even though the first value will be submitted as part of the form

### __@hasInitialValueSymbol@5152

value: `boolean`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Spinner

### accessibilityLabel

value: `string`

A label that describes the purpose of the progress. When set, it will be announced to users using assistive technologies and will provide them with more context. Providing an `accessibilityLabel` is recommended if there is no accompanying text describing that something is loading.

### size

value: `"base" | "large" | "large-100"`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Stack

### direction

value: `MakeResponsive<"inline" | "block">`

  - MakeResponsive: T | `@container${string}`
Sets how the Stack's children are placed within the Stack.

`direction` either accepts: * a single value either `inline` or `block` *OR a container query string with either of these values as a query value (e.g. `@container (inline-size > 500px) inline, block`)

### justifyContent

value: `JustifyContentKeyword`

  - JustifyContentKeyword: 'normal' | ContentDistribution | OverflowPosition | ContentPosition
Aligns the Stack along the main axis.

### alignItems

value: `AlignItemsKeyword`

  - Item: interface Item {
  /**
   * The unique identifier of the item. This will be returned by the picker if selected.
   */
  id: string;
  /**
   * The primary content to display in the first column of the row.
   */
  heading: string;
  /**
   * The additional content to display in the second and third columns of the row, if provided.
   */
  data?: DataPoint[];
  /**
   * Whether the item is disabled or not. If the item is disabled, it cannot be selected.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the item is selected or not when the picker is opened. The user may deselect the item if it is preselected.
   */
  selected?: boolean;
  /**
   * The badges to display in the first column of the row. These are used to display additional information about the item, such as progress of an action or tone indicating the status of that item.
   */
  badges?: PickerBadge[];
  /**
   * The thumbnail to display at the start of the row. This is used to display an image or icon for the item.
   */
  thumbnail?: {url: string};
}
  - AlignItemsKeyword: 'normal' | 'stretch' | BaselinePosition | OverflowPosition | ContentPosition
Aligns the Stack's children along the cross axis.

### alignContent

value: `AlignContentKeyword`

  - AlignContentKeyword: 'normal' | BaselinePosition | ContentDistribution | OverflowPosition | ContentPosition
Aligns the Stack along the cross axis.

### gap

value: `MakeResponsive<MaybeTwoValuesShorthandProperty<SpacingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements.

`gap` can either accept: * a single SpacingKeyword value applied to both axes (e.g. `large-100`). * OR a pair of values (eg `large-100 large-500`) can be used to set the inline and block axes respectively. * OR a container query string with supported SpacingKeyword values as query values (e.g.@container (inline-size > 500px) large-300, small-300)

### rowGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the block axis.

This overrides the row value of `gap`. `rowGap` either accepts a single SpacingKeyword value (e.g. `large-100`) OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### columnGap

value: `MakeResponsive<"" | SpacingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - SpacingKeyword: SizeKeyword | 'none'
Adjust spacing between elements in the inline axis.

This overrides the column value of `gap`. `columnGap` either accepts: * a single SpacingKeyword value (e.g. `large-100`) OR a container query string with supported SpacingKeyword values as query values (e.g. @container (inline-size > 500px) large-300, small-300)

### accessibilityRole

value: `AccessibilityRole`

  - AccessibilityRole: 'main' | 'header' | 'footer' | 'section' | 'aside' | 'navigation' | 'ordered-list' | 'list-item' | 'list-item-separator' | 'unordered-list' | 'separator' | 'status' | 'alert' | 'generic' | 'presentation' | 'none'
Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.

### background

value: `BackgroundColorKeyword`

  - BackgroundColorKeyword: 'transparent' | ColorKeyword
  - ColorKeyword: 'subdued' | 'base' | 'strong'
Adjust the background of the element.

### blockSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the block size.

### minBlockSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum block size.

### maxBlockSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum block size.

### inlineSize

value: `SizeUnitsOrAuto`

  - SizeUnitsOrAuto: SizeUnits | 'auto'
  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the inline size.

### minInlineSize

value: `SizeUnits`

  - SizeUnits: `${number}px` | `${number}%` | `0`
Adjust the minimum inline size.

### maxInlineSize

value: `SizeUnitsOrNone`

  - SizeUnits: `${number}px` | `${number}%` | `0`
  - SizeUnitsOrNone: SizeUnits | 'none'
Adjust the maximum inline size.

### overflow

value: `"visible" | "hidden"`

Sets the overflow behavior of the element.

- `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse.
- `visible`: the content that extends beyond the element’s container is visible.

### padding

value: `MakeResponsive<MaybeAllValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the padding of all edges.

1-to-4-value syntax (@see https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `block-start inline-end block-end inline-start`
- 3 values: `block-start inline block-end`
- 2 values: `block inline`

For example:
- `large` means block-start, inline-end, block-end and inline-start paddings are `large`.
- `large none` means block-start and block-end paddings are `large`, inline-start and inline-end paddings are `none`.
- `large none large` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `none`.
- `large none large small` means block-start padding is `large`, inline-end padding is `none`, block-end padding is `large` and inline-start padding is `small`.

A padding value of `auto` will use the default padding for the closest container that has had its usual padding removed.

`padding` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 4 values (e.g. `@container (inline-size > 500px) large-300 small-300 large-100 small-100, small-200`)

### paddingBlock

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the block-padding.

- `large none` means block-start padding is `large`, block-end padding is `none`.

This overrides the block value of `padding`.

`paddingBlock` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingBlockStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-start padding.

This overrides the block-start value of `paddingBlock`.

`paddingBlockStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingBlockEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the block-end padding.

This overrides the block-end value of `paddingBlock`.

`paddingBlockEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This only accepts up to 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInline

value: `MakeResponsive<"" | MaybeTwoValuesShorthandProperty<PaddingKeyword>>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
  - MaybeTwoValuesShorthandProperty: T | `${T} ${T}`
Adjust the inline padding.

- `large none` means inline-start padding is `large`, inline-end padding is `none`.

This overrides the inline value of `padding`.

`paddingInline` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`)

This also accepts up to 2 values (e.g. `@container (inline-size > 500px) large-300 small-300, small-200`)

### paddingInlineStart

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-start padding.

This overrides the inline-start value of `paddingInline`.

`paddingInlineStart` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### paddingInlineEnd

value: `MakeResponsive<"" | PaddingKeyword>`

  - MakeResponsive: T | `@container${string}`
  - PaddingKeyword: SizeKeyword | 'none'
Adjust the inline-end padding.

This overrides the inline-end value of `paddingInline`.

`paddingInlineEnd` also accepts a container query string with the supported PaddingKeyword as a query value e.g. (`@container (inline-size > 500px) large-300, small-300`) This only accepts 1 value per predicate (e.g. `@container (inline-size > 500px) large-300, small-200`)

### border

value: `BorderShorthand`

  - BorderShorthand: BorderSizeKeyword | `${BorderSizeKeyword} ${ColorKeyword}` | `${BorderSizeKeyword} ${ColorKeyword} ${BorderStyleKeyword}`
Set the border via the shorthand property.

This can be a size, optionally followed by a color, optionally followed by a style.

If the color is not specified, it will be `base`.

If the style is not specified, it will be `auto`.

Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.

### borderWidth

value: `"" | MaybeAllValuesShorthandProperty<"small" | "small-100" | "base" | "large" | "large-100" | "none">`

  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
Set the width of the border.

If set, it takes precedence over the `border` property's width.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderStyle

value: `"" | MaybeAllValuesShorthandProperty<BoxBorderStyles>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderStyles: 'auto' | 'none' | 'solid' | 'dashed'
Set the style of the border.

If set, it takes precedence over the `border` property's style.

Like CSS, up to 4 values can be specified.

If one value is specified, it applies to all sides.

If two values are specified, they apply to the block sides and inline sides respectively.

If three values are specified, they apply to the block-start, both inline sides, and block-end respectively.

If four values are specified, they apply to the block-start, block-end, inline-start, and inline-end sides respectively.

### borderColor

value: `"" | ColorKeyword`

  - ColorKeyword: 'subdued' | 'base' | 'strong'
Set the color of the border.

If set, it takes precedence over the `border` property's color.

### borderRadius

value: `MaybeAllValuesShorthandProperty<BoxBorderRadii>`

  - Box: declare class Box extends BoxElement implements BoxProps {
  constructor();
}
  - MaybeAllValuesShorthandProperty: T | `${T} ${T}` | `${T} ${T} ${T}` | `${T} ${T} ${T} ${T}`
  - BoxBorderRadii: 'small' | 'small-200' | 'small-100' | 'base' | 'large' | 'large-100' | 'large-200' | 'none'
Set the radius of the border.

[1-to-4-value syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#edges_of_a_box) is supported. Note that, contrary to the CSS, it uses flow-relative values and the order is:

- 4 values: `start-start start-end end-end end-start`
- 3 values: `start-start (start-end & end-start) start-end`
- 2 values: `(start-start & end-end) (start-end & end-start)`

For example:
- `small-100` means start-start, start-end, end-end and end-start border radii are `small-100`.
- `small-100 none` means start-start and end-end border radii are `small-100`, start-end and end-start border radii are `none`.
- `small-100 none large-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `none`.
- `small-100 none large-100 small-100` means start-start border radius is `small-100`, start-end border radius is `none`, end-end border radius is `large-100` and end-start border radius is `small-100`.

### accessibilityLabel

value: `string`

A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context.

Only use this when the element's content is not enough context for users using assistive technologies.

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### display

value: `MakeResponsive<"auto" | "none">`

  - MakeResponsive: T | `@container${string}`
Sets the outer display type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout).

- `auto` the component's initial value. The actual value depends on the component and context.
- `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Table

### variant

value: `"auto" | "list"`

Sets the layout of the Table.

- `list`: The Table is always displayed as a list.
- `table`: The Table is always displayed as a table.
- `auto`: The Table is displayed as a table on wide devices and as a list on narrow devices.

### loading

value: `boolean`

Whether the table is in a loading state, such as initial page load or loading the next page in a paginated table. When true, the table could be in an inert state, which prevents user interaction.

### paginate

value: `boolean`

Whether to use pagination controls.

### hasPreviousPage

value: `boolean`

Whether there's a previous page of data.

### hasNextPage

value: `boolean`

Whether there's an additional page of data.

### __@actualTableVariantSymbol@5235

value: `AddedContext<ActualTableVariant>`

  - Table: declare class Table extends PreactCustomElement implements TableProps {
  accessor variant: TableProps['variant'];
  accessor loading: TableProps['loading'];
  accessor paginate: TableProps['paginate'];
  accessor hasPreviousPage: TableProps['hasPreviousPage'];
  accessor hasNextPage: TableProps['hasNextPage'];
  /**
   * @private
   * The actual table variant, which is either 'table' or 'list'.
   */
  [actualTableVariantSymbol]: AddedContext<ActualTableVariant>;
  /** @private */
  [tableHeadersSharedDataSymbol]: AddedContext<
    {
      listSlot: TableHeaderProps['listSlot'];
      textContent: string;
    }[]
  >;

  constructor();
}
  - AddedContext: declare class AddedContext<T> extends EventTarget {
  constructor(defaultValue: T);
  get value(): T;
  set value(value: T);
}
  - ActualTableVariant: 'table' | 'list'

### __@tableHeadersSharedDataSymbol@5236

value: `AddedContext<{ listSlot: ListSlotType; textContent: string; }[]>`

  - AddedContext: declare class AddedContext<T> extends EventTarget {
  constructor(defaultValue: T);
  get value(): T;
  set value(value: T);
}
  - ListSlotType: 'primary' | 'secondary' | 'kicker' | 'inline' | 'labeled'

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### AddedContext

### value

value: `T`


### addEventListener

value: `(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => void`

  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Appends an event listener for events whose type attribute value is type. The callback argument sets the callback that will be invoked when the event is dispatched.

The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the method behaves exactly as if the value was specified as options's capture.

When set to true, options's capture prevents callback from being invoked when the event's eventPhase attribute value is BUBBLING_PHASE. When false (or not present), callback will not be invoked when event's eventPhase attribute value is CAPTURING_PHASE. Either way, callback will be invoked if event's eventPhase attribute value is AT_TARGET.

When set to true, options's passive indicates that the callback will not cancel the event by invoking preventDefault(). This is used to enable performance optimizations described in § 2.8 Observing event listeners.

When set to true, options's once indicates that the callback will only be invoked once after which the event listener will be removed.

If an AbortSignal is passed for options's signal, then the event listener will be removed when signal is aborted.

The event listener is appended to target's event listener list and is not appended if it has the same type, callback, and capture.

### dispatchEvent

value: `(event: Event) => boolean`

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

### removeEventListener

value: `(type: string, callback: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => void`

  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Removes the event listener in target's event listener list with the same type, callback, and options.

### TableBody

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TableCell

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TableHeader

### listSlot

value: `ListSlotType`

  - ListSlotType: 'primary' | 'secondary' | 'kicker' | 'inline' | 'labeled'
Content designation for the table's `list` variant.

- `primary'`: The most important content. Only one column can have this designation.
- `secondary`: The secondary content. Only one column can have this designation.
- `kicker`: Content that is displayed before primary and secondary content, but with less visual prominence. Only one column can have this designation.
- `inline`: Content that is displayed inline.
- `labeled`: Each column with this designation displays as a heading-content pair.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TableHeaderRow

### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TableRow

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Text

### fontVariantNumeric

value: `"auto" | "normal" | "tabular-nums"`

Set the numeric properties of the font.

### color

value: `"base" | "subdued"`

Modify the color to be more or less intense.

### tone

value: `"info" | "success" | "warning" | "critical" | "auto" | "neutral" | "caution"`

Sets the tone of the component, based on the intention of the information being conveyed.

### type

value: `"strong" | "generic" | "address" | "redundant"`

Provide semantic meaning and default styling to the text.

Other presentation properties on `<s-text>` override the default styling.

### dir

value: `"" | "auto" | "ltr" | "rtl"`

Indicates the directionality of the element’s text.

- `ltr`: languages written from left to right (e.g. English)
- `rtl`: languages written from right to left (e.g. Arabic)
- `auto`: the user agent determines the direction based on the content
- `''`: direction is inherited from parent elements (equivalent to not setting the attribute)

### accessibilityVisibility

value: `"visible" | "hidden" | "exclusive"`

Changes the visibility of the element.

- `visible`: the element is visible to all users.
- `hidden`: the element is removed from the accessibility tree but remains visible.
- `exclusive`: the element is visually hidden but remains in the accessibility tree.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TextArea

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### rows

value: `number`

A number of visible text lines.

### autocomplete

value: `"on" | "off" | TextAutocompleteField | `section-${string} one-time-code` | "shipping one-time-code" | "billing one-time-code" | `section-${string} shipping one-time-code` | `section-${string} billing one-time-code` | `section-${string} language` | `section-${string} organization` | `section-${string} additional-name` | `section-${string} address-level1` | `section-${string} address-level2` | `section-${string} address-level3` | `section-${string} address-level4` | `section-${string} address-line1` | `section-${string} address-line2` | `section-${string} address-line3` | `section-${string} country-name` | `section-${string} country` | `section-${string} family-name` | `section-${string} given-name` | `section-${string} honorific-prefix` | `section-${string} honorific-suffix` | `section-${string} name` | `section-${string} nickname` | `section-${string} organization-title` | `section-${string} postal-code` | `section-${string} sex` | `section-${string} street-address` | `section-${string} transaction-currency` | `section-${string} username` | `section-${string} cc-additional-name` | `section-${string} cc-family-name` | `section-${string} cc-given-name` | `section-${string} cc-name` | `section-${string} cc-type` | "shipping language" | "shipping organization" | "shipping additional-name" | "shipping address-level1" | "shipping address-level2" | "shipping address-level3" | "shipping address-level4" | "shipping address-line1" | "shipping address-line2" | "shipping address-line3" | "shipping country-name" | "shipping country" | "shipping family-name" | "shipping given-name" | "shipping honorific-prefix" | "shipping honorific-suffix" | "shipping name" | "shipping nickname" | "shipping organization-title" | "shipping postal-code" | "shipping sex" | "shipping street-address" | "shipping transaction-currency" | "shipping username" | "shipping cc-additional-name" | "shipping cc-family-name" | "shipping cc-given-name" | "shipping cc-name" | "shipping cc-type" | "billing language" | "billing organization" | "billing additional-name" | "billing address-level1" | "billing address-level2" | "billing address-level3" | "billing address-level4" | "billing address-line1" | "billing address-line2" | "billing address-line3" | "billing country-name" | "billing country" | "billing family-name" | "billing given-name" | "billing honorific-prefix" | "billing honorific-suffix" | "billing name" | "billing nickname" | "billing organization-title" | "billing postal-code" | "billing sex" | "billing street-address" | "billing transaction-currency" | "billing username" | "billing cc-additional-name" | "billing cc-family-name" | "billing cc-given-name" | "billing cc-name" | "billing cc-type" | `section-${string} shipping language` | `section-${string} shipping organization` | `section-${string} shipping additional-name` | `section-${string} shipping address-level1` | `section-${string} shipping address-level2` | `section-${string} shipping address-level3` | `section-${string} shipping address-level4` | `section-${string} shipping address-line1` | `section-${string} shipping address-line2` | `section-${string} shipping address-line3` | `section-${string} shipping country-name` | `section-${string} shipping country` | `section-${string} shipping family-name` | `section-${string} shipping given-name` | `section-${string} shipping honorific-prefix` | `section-${string} shipping honorific-suffix` | `section-${string} shipping name` | `section-${string} shipping nickname` | `section-${string} shipping organization-title` | `section-${string} shipping postal-code` | `section-${string} shipping sex` | `section-${string} shipping street-address` | `section-${string} shipping transaction-currency` | `section-${string} shipping username` | `section-${string} shipping cc-additional-name` | `section-${string} shipping cc-family-name` | `section-${string} shipping cc-given-name` | `section-${string} shipping cc-name` | `section-${string} shipping cc-type` | `section-${string} billing language` | `section-${string} billing organization` | `section-${string} billing additional-name` | `section-${string} billing address-level1` | `section-${string} billing address-level2` | `section-${string} billing address-level3` | `section-${string} billing address-level4` | `section-${string} billing address-line1` | `section-${string} billing address-line2` | `section-${string} billing address-line3` | `section-${string} billing country-name` | `section-${string} billing country` | `section-${string} billing family-name` | `section-${string} billing given-name` | `section-${string} billing honorific-prefix` | `section-${string} billing honorific-suffix` | `section-${string} billing name` | `section-${string} billing nickname` | `section-${string} billing organization-title` | `section-${string} billing postal-code` | `section-${string} billing sex` | `section-${string} billing street-address` | `section-${string} billing transaction-currency` | `section-${string} billing username` | `section-${string} billing cc-additional-name` | `section-${string} billing cc-family-name` | `section-${string} billing cc-given-name` | `section-${string} billing cc-name` | `section-${string} billing cc-type``

  - Text: declare class Text extends PreactCustomElement implements TextProps {
  accessor fontVariantNumeric: TextProps['fontVariantNumeric'];
  accessor color: TextProps['color'];
  accessor tone: TextProps['tone'];
  accessor type: TextProps['type'];
  accessor dir: TextProps['dir'];
  accessor accessibilityVisibility: TextProps['accessibilityVisibility'];
  constructor();
}
  - TextAutocompleteField: 'url' | 'email' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'one-time-code' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### value

value: `string`

The current value for the field. If omitted, the field will be empty.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### TextField

### icon

value: `"replace" | "search" | "link" | "product" | "variant" | "collection" | "select" | "info" | "incomplete" | "complete" | "color" | "money" | "adjust" | "affiliate" | "airplane" | "alert-bubble" | "alert-circle" | "alert-diamond" | "alert-location" | "alert-octagon-filled" | "alert-octagon" | "alert-triangle" | "alert-triangle-filled" | "app-extension" | "apps" | "archive" | "arrow-down-circle" | "arrow-down-right" | "arrow-down" | "arrow-left-circle" | "arrow-left" | "arrow-right-circle" | "arrow-right" | "arrow-up-circle" | "arrow-up-right" | "arrow-up" | "arrows-in-horizontal" | "arrows-out-horizontal" | "attachment" | "automation" | "backspace" | "bag" | "bank" | "barcode" | "bill" | "blank" | "blog" | "bolt-filled" | "bolt" | "book-open" | "book" | "bug" | "bullet" | "business-entity" | "button-press" | "button" | "calculator" | "calendar-check" | "calendar-compare" | "calendar-list" | "calendar-time" | "calendar" | "camera-flip" | "camera" | "caret-down" | "caret-up" | "caret-left" | "caret-right" | "cart-abandoned" | "cart-discount" | "cart-down" | "cart-sale" | "cart-up" | "cart" | "cash-dollar" | "cash-euro" | "cash-pound" | "cash-rupee" | "cash-yen" | "catalog-product" | "categories" | "channels" | "chart-cohort" | "chart-donut" | "chart-funnel" | "chart-histogram-first-last" | "chart-histogram-first" | "chart-histogram-flat" | "chart-histogram-full" | "chart-histogram-growth" | "chart-histogram-last" | "chart-histogram-second-last" | "chart-horizontal" | "chart-line" | "chart-popular" | "chart-stacked" | "chart-vertical" | "chat-new" | "chat-referral" | "chat" | "check-circle-filled" | "check-circle" | "check" | "checkbox" | "chevron-down-circle" | "chevron-down" | "chevron-left-circle" | "chevron-left" | "chevron-right-circle" | "chevron-right" | "chevron-up-circle" | "chevron-up" | "circle-dashed" | "circle" | "clipboard-check" | "clipboard-checklist" | "clipboard" | "clock-revert" | "clock" | "code-add" | "code" | "collection-featured" | "collection-list" | "collection-reference" | "color-none" | "compass" | "compose" | "confetti" | "connect" | "content" | "contract" | "corner-pill" | "corner-round" | "corner-square" | "credit-card-cancel" | "credit-card-percent" | "credit-card-reader-chip" | "credit-card-reader-tap" | "credit-card-reader" | "credit-card-secure" | "credit-card-tap-chip" | "credit-card" | "crop" | "currency-convert" | "cursor-banner" | "cursor-option" | "cursor" | "data-presentation" | "data-table" | "database-add" | "database-connect" | "database" | "delete" | "delivered" | "delivery" | "desktop" | "disabled" | "discount-add" | "discount-code" | "discount" | "dns-settings" | "dock-floating" | "dock-side" | "domain-landing-page" | "domain-new" | "domain-redirect" | "domain" | "download" | "drag-drop" | "drag-handle" | "duplicate" | "edit" | "email-follow-up" | "email-newsletter" | "email" | "empty" | "enabled" | "enter" | "envelope-soft-pack" | "envelope" | "eraser" | "exchange" | "exit" | "export" | "external" | "eye-check-mark" | "eye-dropper-list" | "eye-dropper" | "eye-first" | "eyeglasses" | "fav" | "favicon" | "file-list" | "file" | "filter" | "flag" | "flip-horizontal" | "flip-vertical" | "flower" | "folder-add" | "folder-down" | "folder-remove" | "folder-up" | "folder" | "food" | "foreground" | "forklift" | "forms" | "games" | "gauge" | "geolocation" | "gift-card" | "gift" | "git-branch" | "git-commit" | "git-repository" | "globe-asia" | "globe-europe" | "globe-lines" | "globe-list" | "globe" | "grid" | "hashtag-decimal" | "hashtag-list" | "hashtag" | "heart" | "hide-filled" | "hide" | "home" | "icons" | "identity-card" | "image-add" | "image-alt" | "image-explore" | "image-magic" | "image-none" | "image-with-text-overlay" | "image" | "images" | "import" | "in-progress" | "incentive" | "incoming" | "info-filled" | "inventory-updated" | "inventory" | "iq" | "key" | "keyboard-filled" | "keyboard-hide" | "keyboard" | "label-printer" | "language-translate" | "language" | "layout-block" | "layout-buy-button-horizontal" | "layout-buy-button-vertical" | "layout-buy-button" | "layout-column-1" | "layout-columns-2" | "layout-columns-3" | "layout-footer" | "layout-header" | "layout-logo-block" | "layout-popup" | "layout-rows-2" | "layout-section" | "layout-sidebar-left" | "layout-sidebar-right" | "lightbulb" | "link-list" | "list-bulleted" | "list-numbered" | "live" | "location-none" | "location" | "lock" | "map" | "markets-euro" | "markets-rupee" | "markets-yen" | "markets" | "maximize" | "measurement-size-list" | "measurement-size" | "measurement-volume-list" | "measurement-volume" | "measurement-weight-list" | "measurement-weight" | "media-receiver" | "megaphone" | "mention" | "menu-horizontal" | "menu-vertical" | "menu" | "merge" | "metafields" | "metaobject-list" | "metaobject-reference" | "metaobject" | "microphone" | "minimize" | "minus-circle" | "minus" | "mobile" | "money-none" | "moon" | "nature" | "note-add" | "note" | "notification" | "order-batches" | "order-draft" | "order-first" | "order-fulfilled" | "order-repeat" | "order-unfulfilled" | "order" | "orders-status" | "organization" | "outdent" | "outgoing" | "package-fulfilled" | "package-on-hold" | "package-returned" | "package" | "page-add" | "page-attachment" | "page-clock" | "page-down" | "page-heart" | "page-list" | "page-reference" | "page-remove" | "page-report" | "page-up" | "page" | "pagination-end" | "pagination-start" | "paint-brush-flat" | "paint-brush-round" | "paper-check" | "partially-complete" | "passkey" | "paste" | "pause-circle" | "payment-capture" | "payment" | "payout-dollar" | "payout-euro" | "payout-pound" | "payout-rupee" | "payout-yen" | "payout" | "person-add" | "person-exit" | "person-list" | "person-lock" | "person-remove" | "person-segment" | "person" | "personalized-text" | "phone-in" | "phone-out" | "phone" | "pin" | "pin-remove" | "plan" | "play-circle" | "play" | "plus-circle" | "plus-circle-down" | "plus-circle-up" | "plus" | "point-of-sale" | "price-list" | "print" | "product-add" | "product-cost" | "product-list" | "product-reference" | "product-remove" | "product-return" | "product-unavailable" | "profile-filled" | "profile" | "question-circle-filled" | "question-circle" | "receipt-dollar" | "receipt-euro" | "receipt-folded" | "receipt-paid" | "receipt-pound" | "receipt-refund" | "receipt-rupee" | "receipt-yen" | "receipt" | "receivables" | "redo" | "referral-code" | "refresh" | "remove-background" | "reorder" | "replay" | "reset" | "return" | "reward" | "rocket" | "rotate-left" | "rotate-right" | "sandbox" | "save" | "savings" | "search-list" | "search-recent" | "search-resource" | "send" | "settings" | "share" | "shield-check-mark" | "shield-none" | "shield-pending" | "shield-person" | "shipping-label" | "shopcodes" | "slideshow" | "smiley-happy" | "smiley-joy" | "smiley-neutral" | "smiley-sad" | "social-ad" | "social-post" | "sort-ascending" | "sort-descending" | "sort" | "sound" | "sports" | "star-filled" | "star-half" | "star-list" | "star" | "status-active" | "status" | "stop-circle" | "store-import" | "store-managed" | "store-online" | "store" | "sun" | "table-masonry" | "table" | "tablet" | "target" | "tax" | "team" | "text-align-center" | "text-align-left" | "text-align-right" | "text-block" | "text-bold" | "text-color" | "text-font-list" | "text-font" | "text-grammar" | "text-in-columns" | "text-in-rows" | "text-indent-remove" | "text-indent" | "text-italic" | "text-quote" | "text-title" | "text-underline" | "text-with-image" | "text" | "theme-edit" | "theme-store" | "theme-template" | "theme" | "three-d-environment" | "thumbs-down" | "thumbs-up" | "tip-jar" | "toggle-off" | "toggle-on" | "transaction-fee-dollar" | "transaction-fee-euro" | "transaction-fee-pound" | "transaction-fee-rupee" | "transaction-fee-yen" | "transaction" | "transfer-in" | "transfer-internal" | "transfer-out" | "transfer" | "truck" | "undo" | "unknown-device" | "unlock" | "upload" | "view" | "viewport-narrow" | "viewport-short" | "viewport-tall" | "viewport-wide" | "wallet" | "wand" | "watch" | "wifi" | "work-list" | "work" | "wrench" | "x-circle-filled" | "x-circle" | "x" | AnyString`

  - AnyString: string & {}
The type of icon to be displayed in the field.

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### prefix

value: `string`

A value to be displayed immediately before the editable portion of the field.

This is useful for displaying an implied part of the value, such as "https://" or "+353".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the prefix until the user focuses the input.

### suffix

value: `string`

A value to be displayed immediately after the editable portion of the field.

This is useful for displaying an implied part of the value, such as "@shopify.com", or "%".

This cannot be edited by the user, and it isn't included in the value of the field.

It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the suffix until the user focuses the input.

### autocomplete

value: `"on" | "off" | TextAutocompleteField | `section-${string} one-time-code` | "shipping one-time-code" | "billing one-time-code" | `section-${string} shipping one-time-code` | `section-${string} billing one-time-code` | `section-${string} language` | `section-${string} organization` | `section-${string} additional-name` | `section-${string} address-level1` | `section-${string} address-level2` | `section-${string} address-level3` | `section-${string} address-level4` | `section-${string} address-line1` | `section-${string} address-line2` | `section-${string} address-line3` | `section-${string} country-name` | `section-${string} country` | `section-${string} family-name` | `section-${string} given-name` | `section-${string} honorific-prefix` | `section-${string} honorific-suffix` | `section-${string} name` | `section-${string} nickname` | `section-${string} organization-title` | `section-${string} postal-code` | `section-${string} sex` | `section-${string} street-address` | `section-${string} transaction-currency` | `section-${string} username` | `section-${string} cc-additional-name` | `section-${string} cc-family-name` | `section-${string} cc-given-name` | `section-${string} cc-name` | `section-${string} cc-type` | "shipping language" | "shipping organization" | "shipping additional-name" | "shipping address-level1" | "shipping address-level2" | "shipping address-level3" | "shipping address-level4" | "shipping address-line1" | "shipping address-line2" | "shipping address-line3" | "shipping country-name" | "shipping country" | "shipping family-name" | "shipping given-name" | "shipping honorific-prefix" | "shipping honorific-suffix" | "shipping name" | "shipping nickname" | "shipping organization-title" | "shipping postal-code" | "shipping sex" | "shipping street-address" | "shipping transaction-currency" | "shipping username" | "shipping cc-additional-name" | "shipping cc-family-name" | "shipping cc-given-name" | "shipping cc-name" | "shipping cc-type" | "billing language" | "billing organization" | "billing additional-name" | "billing address-level1" | "billing address-level2" | "billing address-level3" | "billing address-level4" | "billing address-line1" | "billing address-line2" | "billing address-line3" | "billing country-name" | "billing country" | "billing family-name" | "billing given-name" | "billing honorific-prefix" | "billing honorific-suffix" | "billing name" | "billing nickname" | "billing organization-title" | "billing postal-code" | "billing sex" | "billing street-address" | "billing transaction-currency" | "billing username" | "billing cc-additional-name" | "billing cc-family-name" | "billing cc-given-name" | "billing cc-name" | "billing cc-type" | `section-${string} shipping language` | `section-${string} shipping organization` | `section-${string} shipping additional-name` | `section-${string} shipping address-level1` | `section-${string} shipping address-level2` | `section-${string} shipping address-level3` | `section-${string} shipping address-level4` | `section-${string} shipping address-line1` | `section-${string} shipping address-line2` | `section-${string} shipping address-line3` | `section-${string} shipping country-name` | `section-${string} shipping country` | `section-${string} shipping family-name` | `section-${string} shipping given-name` | `section-${string} shipping honorific-prefix` | `section-${string} shipping honorific-suffix` | `section-${string} shipping name` | `section-${string} shipping nickname` | `section-${string} shipping organization-title` | `section-${string} shipping postal-code` | `section-${string} shipping sex` | `section-${string} shipping street-address` | `section-${string} shipping transaction-currency` | `section-${string} shipping username` | `section-${string} shipping cc-additional-name` | `section-${string} shipping cc-family-name` | `section-${string} shipping cc-given-name` | `section-${string} shipping cc-name` | `section-${string} shipping cc-type` | `section-${string} billing language` | `section-${string} billing organization` | `section-${string} billing additional-name` | `section-${string} billing address-level1` | `section-${string} billing address-level2` | `section-${string} billing address-level3` | `section-${string} billing address-level4` | `section-${string} billing address-line1` | `section-${string} billing address-line2` | `section-${string} billing address-line3` | `section-${string} billing country-name` | `section-${string} billing country` | `section-${string} billing family-name` | `section-${string} billing given-name` | `section-${string} billing honorific-prefix` | `section-${string} billing honorific-suffix` | `section-${string} billing name` | `section-${string} billing nickname` | `section-${string} billing organization-title` | `section-${string} billing postal-code` | `section-${string} billing sex` | `section-${string} billing street-address` | `section-${string} billing transaction-currency` | `section-${string} billing username` | `section-${string} billing cc-additional-name` | `section-${string} billing cc-family-name` | `section-${string} billing cc-given-name` | `section-${string} billing cc-name` | `section-${string} billing cc-type``

  - Text: declare class Text extends PreactCustomElement implements TextProps {
  accessor fontVariantNumeric: TextProps['fontVariantNumeric'];
  accessor color: TextProps['color'];
  accessor tone: TextProps['tone'];
  accessor type: TextProps['type'];
  accessor dir: TextProps['dir'];
  accessor accessibilityVisibility: TextProps['accessibilityVisibility'];
  constructor();
}
  - TextAutocompleteField: 'url' | 'email' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'one-time-code' | 'organization-title' | 'photo' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'impp' | 'home impp' | 'mobile impp' | 'fax impp' | 'pager impp' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### value

value: `string`

The current value for the field. If omitted, the field will be empty.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Thumbnail

### src

value: `string`

The image source (either a remote URL or a local file resource).

When the image is loading or no `src` is provided, a placeholder will be rendered.

### alt

value: `string`

An alternative text description that describe the image for the reader to understand what it is about. It is extremely useful for both users using assistive technology and sighted users. A well written description provides people with visual impairments the ability to participate in consuming non-text content. When a screen readers encounters an `s-image`, the description is read and announced aloud. If an image fails to load, potentially due to a poor connection, the `alt` is displayed on screen instead. This has the benefit of letting a sighted buyer know an image was meant to load here, but as an alternative, they’re still able to consume the text content. Read [considerations when writing alternative text](https://www.shopify.com/ca/blog/image-alt-text#4) to learn more.

### size

value: `"small" | "small-200" | "small-100" | "base" | "large" | "large-100"`

Adjusts the size the product thumbnail image.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### UnorderedList

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### URLField

### autocomplete

value: `"on" | "off" | `section-${string} url` | `section-${string} photo` | `section-${string} impp` | `section-${string} home impp` | `section-${string} mobile impp` | `section-${string} fax impp` | `section-${string} pager impp` | "shipping url" | "shipping photo" | "shipping impp" | "shipping home impp" | "shipping mobile impp" | "shipping fax impp" | "shipping pager impp" | "billing url" | "billing photo" | "billing impp" | "billing home impp" | "billing mobile impp" | "billing fax impp" | "billing pager impp" | `section-${string} shipping url` | `section-${string} shipping photo` | `section-${string} shipping impp` | `section-${string} shipping home impp` | `section-${string} shipping mobile impp` | `section-${string} shipping fax impp` | `section-${string} shipping pager impp` | `section-${string} billing url` | `section-${string} billing photo` | `section-${string} billing impp` | `section-${string} billing home impp` | `section-${string} billing mobile impp` | `section-${string} billing fax impp` | `section-${string} billing pager impp` | URLAutocompleteField`

  - URLAutocompleteField: 'email' | 'language' | 'organization' | 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'country-name' | 'country' | 'current-password' | 'family-name' | 'given-name' | 'honorific-prefix' | 'honorific-suffix' | 'name' | 'new-password' | 'nickname' | 'one-time-code' | 'organization-title' | 'postal-code' | 'sex' | 'street-address' | 'transaction-amount' | 'transaction-currency' | 'username' | 'bday-day' | 'bday-month' | 'bday-year' | 'bday' | 'cc-additional-name' | 'cc-expiry-month' | 'cc-expiry-year' | 'cc-expiry' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-csc' | 'cc-type' | 'home email' | 'mobile email' | 'fax email' | 'pager email' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-local' | 'tel-national' | 'home tel' | 'mobile tel' | 'fax tel' | 'pager tel' | 'home tel-area-code' | 'mobile tel-area-code' | 'fax tel-area-code' | 'pager tel-area-code' | 'home tel-country-code' | 'mobile tel-country-code' | 'fax tel-country-code' | 'pager tel-country-code' | 'home tel-extension' | 'mobile tel-extension' | 'fax tel-extension' | 'pager tel-extension' | 'home tel-local-prefix' | 'mobile tel-local-prefix' | 'fax tel-local-prefix' | 'pager tel-local-prefix' | 'home tel-local-suffix' | 'mobile tel-local-suffix' | 'fax tel-local-suffix' | 'pager tel-local-suffix' | 'home tel-local' | 'mobile tel-local' | 'fax tel-local' | 'pager tel-local' | 'home tel-national' | 'mobile tel-national' | 'fax tel-national' | 'pager tel-national'
A hint as to the intended content of the field.

When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents.

When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes.

Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.

### maxLength

value: `number`

Specifies the maximum number of characters allowed.

### minLength

value: `number`

Specifies the min number of characters allowed.

### defaultValue

value: `string`

The default value for the field.

### details

value: `string`

Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user.

This will also be exposed to screen reader users.

### error

value: `string`

Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.

### label

value: `string`

Content to use as the field label.

### labelAccessibilityVisibility

value: `"visible" | "exclusive"`

Changes the visibility of the component's label.

- `visible`: the label is visible to all users.
- `exclusive`: the label is visually hidden but remains in the accessibility tree.

### placeholder

value: `string`

A short hint that describes the expected value of the field.

### readOnly

value: `boolean`

The field cannot be edited by the user. It is focusable will be announced by screen readers.

### required

value: `boolean`

Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.

### getAttribute

value: `(qualifiedName: string) => string`

Global keyboard event handlers for things like key bindings typically ignore keystrokes originating from within input elements. Unfortunately, these never account for a Custom Element being the input element.

To fix this, we spoof getAttribute & hasAttribute to make a PreactFieldElement appear as a contentEditable "input" when it contains a focused input element.

### hasAttribute

value: `(qualifiedName: string) => boolean`


### isContentEditable

value: `boolean`

Checks if the shadow tree contains a focused input (input, textarea, select, <x contentEditable>). Note: this does _not_ return true for focussed non-field form elements like buttons.

### formResetCallback

value: `() => void`


### connectedCallback

value: `() => void`


### disabled

value: `boolean`

Disables the field, disallowing any interaction.

### id

value: `string`

A unique identifier for the element.

### name

value: `string`

An identifier for the field that is unique within the nearest containing form.

### value

value: `string`

The current value for the field. If omitted, the field will be empty.

### __@internals$2@4791

value: `ElementInternals`


### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### AdminAction

### heading

value: `string`

The text to use as the Action modal’s title. If not provided, the name of the extension will be used.

### loading

value: `boolean`

Whether the action is in a loading state, such as initial page load or action opening. When true, the action could be in an inert state, which prevents user interaction.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### RunnableExtension

### api

value: `Api`


### output

value: `Output | Promise<Output>`


### ShouldRenderApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ShouldRenderOutput

### display

value: `boolean`


### AdminBlock

### heading

value: `string`

The text to use as the Block title in the block header. If not provided, the name of the extension will be used.

### collapsedSummary

value: `string`

The summary to display when the app block is collapsed. Summary longer than 30 characters will be truncated.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### Form

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### CustomerSegmentTemplateApi

### __enabledFeatures

value: `string[]`


### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### DiscountFunctionSettingsApi

### applyMetafieldChange

value: `ApplyMetafieldChange`

  - ApplyMetafieldChange: (
  change: MetafieldChange,
) => Promise<MetafieldChangeResult>
  - MetafieldChange: MetafieldUpdateChange | MetafieldRemoveChange
  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}
Applies a change to the discount function settings.

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `DiscountFunctionSettingsData`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - DiscountFunctionSettingsData: export interface DiscountFunctionSettingsData {
  id: Discount;
  metafields: Metafield[];
}
  - Discount: interface Discount {
  /**
   * the discount's gid
   */
  id: string;
}

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### navigation

value: `Navigation`

  - Navigation: export interface Navigation {
  /**
   * Navigate to a specific route.
   *
   * @example navigation.navigate('extension://my-admin-action-extension-handle')
   */
  navigate: (url: string | URL) => void;
}
Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported. For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ApplyMetafieldChange

#### Returns: Promise<MetafieldChangeResult>

#### Params:

- change: MetafieldChange
(
  change: MetafieldChange,
) => Promise<MetafieldChangeResult>


### MetafieldUpdateChange

### key

value: `string`


### namespace

value: `string`


### type

value: `'updateMetafield'`

  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

### value

value: `string | number`


### valueType

value: `SupportedDefinitionType`

  - SupportedDefinitionType: 'boolean' | 'collection_reference' | 'color' | 'date' | 'date_time' | 'dimension' | 'file_reference' | 'json' | 'metaobject_reference' | 'mixed_reference' | 'money' | 'multi_line_text_field' | 'number_decimal' | 'number_integer' | 'page_reference' | 'product_reference' | 'rating' | 'rich_text_field' | 'single_line_text_field' | 'product_taxonomy_value_reference' | 'url' | 'variant_reference' | 'volume' | 'weight' | 'list.collection_reference' | 'list.color' | 'list.date' | 'list.date_time' | 'list.dimension' | 'list.file_reference' | 'list.metaobject_reference' | 'list.mixed_reference' | 'list.number_decimal' | 'list.number_integer' | 'list.page_reference' | 'list.product_reference' | 'list.rating' | 'list.single_line_text_field' | 'list.url' | 'list.variant_reference' | 'list.volume' | 'list.weight'

### MetafieldRemoveChange

### key

value: `string`


### namespace

value: `string`


### type

value: `'removeMetafield'`

  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

### MetafieldChangeSuccess

### type

value: `'success'`


### MetafieldChangeResultError

### message

value: `string`


### type

value: `'error'`


### DiscountFunctionSettingsData

The object that exposes the validation with its settings.

### id

value: `Discount`

  - Discount: interface Discount {
  /**
   * the discount's gid
   */
  id: string;
}

### metafields

value: `Metafield[]`

  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}

### Discount

### id

value: `string`

the discount's gid

### Metafield

### description

value: `string`


### id

value: `string`


### key

value: `string`


### namespace

value: `string`


### type

value: `string`


### value

value: `string`


### Navigation

### navigate

value: `(url: string | URL) => void`

Navigate to a specific route.

### PrintActionExtensionApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### AdminPrintAction

### src

value: `string`

Sets the src URL of the preview and the document to print. If not provided, the preview will show an empty state and the print button will be disabled. HTML, PDFs and images are supported.

### setAttribute

value: `(name: string, value: string) => void`


### attributeChangedCallback

value: `(name: string) => void`


### connectedCallback

value: `() => void`


### disconnectedCallback

value: `() => void`


### adoptedCallback

value: `() => void`


### queueRender

value: `() => void`

Queue a run of the render function. You shouldn't need to call this manually - it should be handled by changes to @property values.

### click

value: `({ sourceEvent }?: ClickOptions) => void`

  - ClickOptions: export interface ClickOptions {
  /**
   * The event you want to influence the synthetic click.
   */
  sourceEvent?: ActivationEventEsque;
}
  - Option: declare class Option extends PreactCustomElement implements OptionProps {
  accessor selected: OptionProps['selected'];
  accessor defaultSelected: OptionProps['defaultSelected'];
  accessor value: OptionProps['value'];
  accessor disabled: OptionProps['disabled'];
  constructor();
}
Like the standard `element.click()`, but you can influence the behavior with a `sourceEvent`.

For example, if the `sourceEvent` was a middle click, or has particular keys held down, components will attempt to produce the desired behavior on links, such as opening the page in the background tab.

### ProductDetailsConfigurationApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data & { product: Product; app: { launchUrl: string; applicationUrl: string; }; }`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### navigation

value: `Navigation`

  - Navigation: export interface Navigation {
  /**
   * Navigate to a specific route.
   *
   * @example navigation.navigate('extension://my-admin-action-extension-handle')
   */
  navigate: (url: string | URL) => void;
}
Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported. For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### Product

### handle

value: `string`


### hasOnlyDefaultVariant

value: `boolean`


### id

value: `string`


### onlineStoreUrl

value: `string`


### options

value: `{ id: string; name: string; position: number; values: string[]; }[]`


### productCategory

value: `string`


### productComponents

value: `ProductComponent[]`

  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
  - ProductComponent: export interface ProductComponent {
  id: string;
  title: string;
  featuredImage?: {
    id?: string | null;
    url?: string | null;
    altText?: string | null;
  } | null;
  totalVariants: number;
  productUrl: string;
  componentVariantsCount: number;
  nonComponentVariantsCount: number;
}

### productType

value: `string`


### status

value: `'ACTIVE' | 'ARCHIVED' | 'DRAFT'`


### title

value: `string`


### totalInventory

value: `number`


### totalVariants

value: `number`


### ProductComponent

### componentVariantsCount

value: `number`


### featuredImage

value: `{
    id?: string | null;
    url?: string | null;
    altText?: string | null;
  } | null`

  - Text: declare class Text extends PreactCustomElement implements TextProps {
  accessor fontVariantNumeric: TextProps['fontVariantNumeric'];
  accessor color: TextProps['color'];
  accessor tone: TextProps['tone'];
  accessor type: TextProps['type'];
  accessor dir: TextProps['dir'];
  accessor accessibilityVisibility: TextProps['accessibilityVisibility'];
  constructor();
}

### id

value: `string`


### nonComponentVariantsCount

value: `number`


### productUrl

value: `string`


### title

value: `string`


### totalVariants

value: `number`


### PurchaseOptionsCardConfigurationApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### close

value: `() => void`

Closes the extension. Calling this method is equivalent to the merchant clicking the "x" in the corner of the overlay.

### data

value: `{ selected: { id: string; sellingPlanId?: string; }[]; }`

Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ProductVariantDetailsConfigurationApi

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data & { variant: ProductVariant; app: { launchUrl: string; applicationUrl: string; }; }`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
  - ProductVariant: interface ProductVariant {
  id: string;
  sku: string;
  barcode: string;
  title: string;
  displayName: string;
  price: string;
  compareAtPrice: string;
  taxable: boolean;
  taxCode: string;
  weight: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  productVariantComponents: ProductVariantComponent[];
}
Information about the currently viewed or selected items.

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### navigation

value: `Navigation`

  - Navigation: export interface Navigation {
  /**
   * Navigate to a specific route.
   *
   * @example navigation.navigate('extension://my-admin-action-extension-handle')
   */
  navigate: (url: string | URL) => void;
}
Provides methods to navigate to other features in the Admin. Currently, only navigation from an admin block to an admin action extension *on the same resource page* is supported. For example, you can navigate from an admin block on the product details page (`admin.product-details.block.render`) to an admin action on the product details page (`admin.product-details.action.render`).

### picker

value: `PickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
Renders a custom [Picker](picker) dialog allowing users to select values from a list.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### resourcePicker

value: `ResourcePickerApi`

  - PickerApi: (options: PickerOptions) => Promise<Picker>
  - Picker: interface Picker {
  /**
   * A Promise that resolves with the selected item IDs when the user presses the "Select" button in the picker.
   */
  selected: Promise<string[] | undefined>;
}
  - ResourcePickerApi: (
  options: ResourcePickerOptions,
) => Promise<SelectPayload<ResourcePickerOptions['type']> | undefined>
  - Resource: interface Resource {
  /** in GraphQL id format, ie 'gid://shopify/Product/1' */
  id: string;
}
Renders the [Resource Picker](resource-picker), allowing users to select a resource for the extension to use as part of its flow.

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ProductVariant

### barcode

value: `string`


### compareAtPrice

value: `string`


### displayName

value: `string`


### id

value: `string`


### price

value: `string`


### productVariantComponents

value: `ProductVariantComponent[]`

  - Product: interface Product {
  id: string;
  title: string;
  handle: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  totalVariants: number;
  totalInventory: number;
  hasOnlyDefaultVariant: boolean;
  onlineStoreUrl?: string;
  options: {
    id: string;
    name: string;
    position: number;
    values: string[];
  }[];
  productType: string;
  productCategory?: string;
  productComponents: ProductComponent[];
}
  - ProductVariant: interface ProductVariant {
  id: string;
  sku: string;
  barcode: string;
  title: string;
  displayName: string;
  price: string;
  compareAtPrice: string;
  taxable: boolean;
  taxCode: string;
  weight: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  productVariantComponents: ProductVariantComponent[];
}
  - ProductVariantComponent: export interface ProductVariantComponent {
  id: string;
  displayName: string;
  title: string;
  sku?: string;
  image?: {
    id?: string | null;
    url?: string | null;
    altText?: string | null;
  } | null;
  productVariantUrl: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

### selectedOptions

value: `{ name: string; value: string; }[]`


### sku

value: `string`


### taxable

value: `boolean`


### taxCode

value: `string`


### title

value: `string`


### weight

value: `number`


### ProductVariantComponent

### displayName

value: `string`


### id

value: `string`


### image

value: `{
    id?: string | null;
    url?: string | null;
    altText?: string | null;
  } | null`

  - Text: declare class Text extends PreactCustomElement implements TextProps {
  accessor fontVariantNumeric: TextProps['fontVariantNumeric'];
  accessor color: TextProps['color'];
  accessor tone: TextProps['tone'];
  accessor type: TextProps['type'];
  accessor dir: TextProps['dir'];
  accessor accessibilityVisibility: TextProps['accessibilityVisibility'];
  constructor();
}

### productVariantUrl

value: `string`


### selectedOptions

value: `{ name: string; value: string; }[]`


### sku

value: `string`


### title

value: `string`


### OrderRoutingRuleApi

### applyMetafieldsChange

value: `ApplyMetafieldsChange`

  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}
  - ApplyMetafieldsChange: (changes: MetafieldsChange[]) => void
  - MetafieldsChange: MetafieldUpdateChange | MetafieldRemoveChange | MetafieldUpdateChange[] | MetafieldRemoveChange[]

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `Data`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ApplyMetafieldsChange

#### Returns: void

#### Params:

- changes: MetafieldsChange[]
(changes: MetafieldsChange[]) => void


### ValidationSettingsApi

### applyMetafieldChange

value: `ApplyMetafieldChange`

  - ApplyMetafieldChange: (
  change: MetafieldChange,
) => Promise<MetafieldChangeResult>
  - MetafieldChange: MetafieldUpdateChange | MetafieldRemoveChange
  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}
Applies a change to the validation settings.

### auth

value: `Auth`

  - Auth: interface Auth {
  /**
   * Retrieves a Shopify OpenID Connect ID token for the current user.
   */
  idToken: () => Promise<string | null>;
}
Provides methods for authenticating calls to an app backend.

### data

value: `ValidationData`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ValidationData: export interface ValidationData {
  validation?: Validation;
  shopifyFunction: ShopifyFunction;
}
  - Validation: interface Validation {
  /**
   * the validation's gid when active in a shop
   */
  id: string;
  /**
   * the metafields owned by the validation
   */
  metafields: Metafield[];
}

### extension

value: `{ target: ExtensionTarget; }`

  - ExtensionTarget: keyof ExtensionTargets
The identifier of the running extension target.

### i18n

value: `I18n`

  - I18n: export interface I18n {
  /**
   * Returns a localized number.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `decimal` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatNumber: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized currency value.
   *
   * This function behaves like the standard `Intl.NumberFormat()`
   * with a style of `currency` applied. It uses the buyer's locale by default.
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatCurrency: (
    number: number | bigint,
    options?: {inExtensionLocale?: boolean} & Intl.NumberFormatOptions,
  ) => string;

  /**
   * Returns a localized date value.
   *
   * This function behaves like the standard `Intl.DateTimeFormatOptions()` and uses
   * the buyer's locale by default. Formatting options can be passed in as
   * options.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat0
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @param options.inExtensionLocale - if true, use the extension's locale
   */
  formatDate: (
    date: Date,
    options?: {inExtensionLocale?: boolean} & Intl.DateTimeFormatOptions,
  ) => string;

  /**
   * Returns translated content in the buyer's locale,
   * as supported by the extension.
   *
   * - `options.count` is a special numeric value used in pluralization.
   * - The other option keys and values are treated as replacements for interpolation.
   * - If the replacements are all primitives, then `translate()` returns a single string.
   * - If replacements contain UI components, then `translate()` returns an array of elements.
   */
  translate: I18nTranslate;
}
Utilities for translating content according to the current localization of the admin. More info - /docs/apps/checkout/best-practices/localizing-ui-extensions

### intents

value: `Intents`

  - Intents: export interface Intents {
  /**
   * The URL that was used to launch the intent.
   */
  launchUrl?: string | URL;
}
Provides information to the receiver the of an intent.

### query

value: `<Data = unknown, Variables = { [key: string]: unknown; }>(query: string, options?: { variables?: Variables; version?: Omit<ApiVersion, "2023-04">; }) => Promise<{ data?: Data; errors?: GraphQLError[]; }>`

  - Data: export interface Data {
  /**
   * Information about the currently viewed or selected items.
   */
  selected: {id: string}[];
}
  - ApiVersion: '2023-04' | '2023-07' | '2023-10' | '2024-01' | '2024-04' | '2024-07' | '2024-10' | '2025-01' | '2025-04' | 'unstable' | '2025-07' | '2025-10'
Used to query the Admin GraphQL API

### storage

value: `Storage`

  - Storage: export interface Storage<
  BaseStorageTypes extends Record<string, any> = Record<string, unknown>,
> {
  /**
   * Sets the value of a key in the storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set for the key.
   * Can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  set<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
    value: StorageTypes[Keys],
  ): Promise<void>;

  /**
   * Sets multiple key-value pairs in the storage at once.
   *
   * If the operation fails, no changes are made to storage.
   *
   * @param entries - An object containing key-value pairs to store.
   * Values can be any primitive type supported by `JSON.stringify`.
   *
   * Rejects with a `StorageExceededError` if the extension exceeds its allotted storage limit.
   */
  setMany<StorageTypes extends BaseStorageTypes = BaseStorageTypes>(
    entries: Partial<StorageTypes>,
  ): Promise<void>;

  /**
   * Gets the value of a key in the storage.
   *
   * @param key - The key to get the value for.
   * @returns The value of the key.
   *
   * If no value for the key exists, the resolved value is undefined.
   */
  get<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<StorageTypes[Keys] | undefined>;

  /**
   * Gets the values of multiple keys in the storage at once.
   *
   * @param keys - An array of keys to get the values for.
   * @returns An object containing key-value pairs for the requested keys.
   *
   * The returned array is in the same order as `keys`, with `undefined` values for keys that do not exist.
   */
  getMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<(StorageTypes[Keys] | undefined)[]>;

  /**
   * Clears the storage.
   */
  clear(): Promise<void>;

  /**
   * Deletes a key from the storage.
   *
   * @param key - The key to delete.
   * @returns A promise that resolves to `true` if the key was deleted, or `false` if the key did not exist.
   */
  delete<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    key: Keys,
  ): Promise<boolean>;

  /**
   * Deletes multiple keys from the storage at once.
   *
   * @param keys - An array of keys to delete.
   * @returns A promise that resolves to an object with `keys` keys, and boolean values,
   * which are `true` if the key was deleted, or `false` if the key did not exist.
   */
  deleteMany<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(
    keys: Keys[],
  ): Promise<Record<Keys, boolean>>;

  /**
   * Gets all the keys and values in the storage.
   *
   * @returns An iterator containing all the keys and values in the storage.
   */
  entries<
    StorageTypes extends BaseStorageTypes = BaseStorageTypes,
    Keys extends keyof StorageTypes = keyof StorageTypes,
  >(): Promise<IterableIterator<[Keys, StorageTypes[Keys]]>>;
}
Provides methods for setting, getting, and clearing browser data from the extension

### ValidationData

The object that exposes the validation with its settings.

### shopifyFunction

value: `ShopifyFunction`

  - ShopifyFunction: interface ShopifyFunction {
  /**
   * the validation function's unique identifier
   */
  id: string;
}

### validation

value: `Validation`

  - Validation: interface Validation {
  /**
   * the validation's gid when active in a shop
   */
  id: string;
  /**
   * the metafields owned by the validation
   */
  metafields: Metafield[];
}

### ShopifyFunction

### id

value: `string`

the validation function's unique identifier

### Validation

### id

value: `string`

the validation's gid when active in a shop

### metafields

value: `Metafield[]`

  - Metafield: interface Metafield {
  description?: string;
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
}
the metafields owned by the validation

