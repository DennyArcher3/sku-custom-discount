# Discount Function Settings API

This API is available to Discount Function Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/build/discounts/build-ui-extension) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Discount Function Settings extensions.

## applyMetafieldChange

Applies a change to the discount function settings.

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


### MetafieldChangeSuccess

### type

value: `'success'`


### MetafieldChangeResultError

### message

value: `string`


### type

value: `'error'`


## data

The object exposed to the extension that contains the discount function settings.

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


