# Validation Settings API

This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.

## applyMetafieldChange

Applies a change to the validation settings.

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

The object that exposes the validation with its settings.

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


