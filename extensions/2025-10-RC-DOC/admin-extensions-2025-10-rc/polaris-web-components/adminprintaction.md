# AdminPrintAction

`s-admin-print-action` is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.

```jsx
import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default async () => {
  render(
    <s-admin-print-action src="https://example.com"></s-admin-print-action>,
    document.body,
  );
}

```

## Properties

### AdminPrintActionProps

### src

value: `string`

Sets the src URL of the preview and the document to print. If not provided, the preview will show an empty state and the print button will be disabled. HTML, PDFs and images are supported.

