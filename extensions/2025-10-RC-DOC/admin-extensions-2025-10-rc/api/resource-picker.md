# Resource Picker

The Resource Picker API provides a search-based interface to help users find and select one or more products, collections, or product variants, and then returns the selected resources to your app. Both the app and the user must have the necessary permissions to access the resources selected.

> Tip:
> If you are picking app resources such as product reviews, email templates, or subscription options, you should use the [Picker](picker) API instead.


```js
const {resourcePicker} = useApi(TARGET);

const selected = await resourcePicker({type: 'product'});

```

## Resource Picker Options

The `Resource Picker` accepts a variety of options to customize the picker's behavior.

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

## Related

- [Picker](picker)

## Examples

The Resource Picker API provides a search-based interface to help users find and select one or more products, collections, or product variants, and then returns the selected resources to your app. Both the app and the user must have the necessary permissions to access the resources selected.

> Tip:
> If you are picking app resources such as product reviews, email templates, or subscription options, you should use the [Picker](picker) API instead.



Alternate resources

```js
const selected = await resourcePicker({type: 'collection'});

```

```js
const selected = await resourcePicker({type: 'variant'});

```


Preselected resources

```js
const selected = await resourcePicker({
  type: 'product',
  selectionIds: [
    {
      id: 'gid://shopify/Product/12345',
      variants: [
        {
          id: 'gid://shopify/ProductVariant/1',
        },
      ],
    },
    {
      id: 'gid://shopify/Product/67890',
    },
  ],
});

```


Action verb

```js
const selected = await resourcePicker({
  type: 'product',
  action: 'select',
});

```


Multiple selection

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: true,
});

```

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: 5,
});

```


Filters

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    hidden: true,
    variants: false,
    draft: false,
    archived: false,
  },
});

```


Filter query

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    query: 'Sweater',
  },
});

```


Selection

```js
const selected = await resourcePicker({type: 'product'});

if (selected) {
  console.log(selected);
} else {
  console.log('Picker was cancelled by the user');
}

```


Initial query

```js
const selected = await resourcePicker({
  type: 'product',
  query: 'Sweater',
});

```

## Resource Picker Return Payload

The `Resource Picker` returns a Promise with an array of the selected resources. The object type in the array varies based on the provided `type` option.

If the picker is cancelled, the Promise resolves to `undefined`

## Related

- [Picker](picker)

## Examples

The Resource Picker API provides a search-based interface to help users find and select one or more products, collections, or product variants, and then returns the selected resources to your app. Both the app and the user must have the necessary permissions to access the resources selected.

> Tip:
> If you are picking app resources such as product reviews, email templates, or subscription options, you should use the [Picker](picker) API instead.



Alternate resources

```js
const selected = await resourcePicker({type: 'collection'});

```

```js
const selected = await resourcePicker({type: 'variant'});

```


Preselected resources

```js
const selected = await resourcePicker({
  type: 'product',
  selectionIds: [
    {
      id: 'gid://shopify/Product/12345',
      variants: [
        {
          id: 'gid://shopify/ProductVariant/1',
        },
      ],
    },
    {
      id: 'gid://shopify/Product/67890',
    },
  ],
});

```


Action verb

```js
const selected = await resourcePicker({
  type: 'product',
  action: 'select',
});

```


Multiple selection

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: true,
});

```

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: 5,
});

```


Filters

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    hidden: true,
    variants: false,
    draft: false,
    archived: false,
  },
});

```


Filter query

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    query: 'Sweater',
  },
});

```


Selection

```js
const selected = await resourcePicker({type: 'product'});

if (selected) {
  console.log(selected);
} else {
  console.log('Picker was cancelled by the user');
}

```


Initial query

```js
const selected = await resourcePicker({
  type: 'product',
  query: 'Sweater',
});

```

## Examples

The Resource Picker API provides a search-based interface to help users find and select one or more products, collections, or product variants, and then returns the selected resources to your app. Both the app and the user must have the necessary permissions to access the resources selected.

> Tip:
> If you are picking app resources such as product reviews, email templates, or subscription options, you should use the [Picker](picker) API instead.



Alternate resources

```js
const selected = await resourcePicker({type: 'collection'});

```

```js
const selected = await resourcePicker({type: 'variant'});

```


Preselected resources

```js
const selected = await resourcePicker({
  type: 'product',
  selectionIds: [
    {
      id: 'gid://shopify/Product/12345',
      variants: [
        {
          id: 'gid://shopify/ProductVariant/1',
        },
      ],
    },
    {
      id: 'gid://shopify/Product/67890',
    },
  ],
});

```


Action verb

```js
const selected = await resourcePicker({
  type: 'product',
  action: 'select',
});

```


Multiple selection

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: true,
});

```

```js
const selected = await resourcePicker({
  type: 'product',
  multiple: 5,
});

```


Filters

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    hidden: true,
    variants: false,
    draft: false,
    archived: false,
  },
});

```


Filter query

```js
const selected = await resourcePicker({
  type: 'product',
  filter: {
    query: 'Sweater',
  },
});

```


Selection

```js
const selected = await resourcePicker({type: 'product'});

if (selected) {
  console.log(selected);
} else {
  console.log('Picker was cancelled by the user');
}

```


Initial query

```js
const selected = await resourcePicker({
  type: 'product',
  query: 'Sweater',
});

```

