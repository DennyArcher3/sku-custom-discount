# AdminBlock

`s-admin-block` provides a deeper integration with the container your UI is rendered into. This component should only be used in Block Extensions, which render inline on a resource page.

```jsx
<s-admin-block title="My App Block">5 items active</s-admin-block>;

```

## Properties

### AdminBlockProps

### collapsedSummary

value: `string`

The summary to display when the app block is collapsed. Summary longer than 30 characters will be truncated.

### heading

value: `string`

The text to use as the Block title in the block header. If not provided, the name of the extension will be used.

