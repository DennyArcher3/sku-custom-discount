# Admin UI extensions

Admin UI extensions make it possible to surface contextual app functionality within the Shopify Admin interface.

## Overview

Extend the Shopify Admin with UI Extensions.
- [Tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action): Get started building your first admin extension
- [Component APIs](https://shopify.dev/docs/api/admin-extensions/components): See all available components
- [Reference](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/extension-targets): View a list of available extension targets
- [Network Features](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/network-features): Learn about the network features available to admin extensions
- [Using Forms](#using-forms): Use the Form component to integrate with the contextual save bar of the resource page
- [Picking resources](#picking-resources): Prompt the user to select resources

## Getting Started

Use the [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) to [generate a new extension](/apps/tools/cli/commands#generate-extension) within your app.

If you already have a Shopify app, you can skip right to the last command shown here.

Make sure you’re using Shopify CLI `v3.80.0` or higher. You can check your version by running `shopify version`.
```bash
# create an app if you don't already have one:
POLARIS_UNIFIED=true shopify app init --name my-app

# navigate to your app's root directory:
cd my-app

# generate a new extension:
POLARIS_UNIFIED=true shopify app generate extension
# follow the steps to create a new
# extension in ./extensions.

```


## Scaffolded with Preact

UI Extensions are scaffolded with [Preact](https://preactjs.com/) by default.
      
This means that you can use Preact patterns and principles within your extension. Since Preact is included as a standard dependency, you have access to all of its features including [hooks](https://preactjs.com/guide/v10/hooks/) like `useState` and `useEffect` for managing component state and side effects.
      
You can also use [Preact Signals](https://preactjs.com/guide/v10/signals) for reactive state management, and take advantage of standard web APIs just like you would in a regular Preact application.
```jsx
import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
}

function Extension() {
  const [count, setCount] = useState(0);

  return (
    <>
      <s-text>Count: {count}</s-text>
      <s-button onClick={() => setCount(count + 1)}>
        Increment
      </s-button>
    </>
  );
}

```


## Handling events

Handling events in UI extensions are the same as you would handle them in a web app. You can use the `addEventListener` method to listen for events on the components or use the `on[event]` property to listen for events from the components.
        

When using Preact, event handlers can be registered by passing props beginning with `on`, and the event handler name is case-insensitive. For example, the JSX `<s-button onClick={fn}>` registers `fn` as a "click" event listener on the button.
```jsx
export default function HandlingEvents() {
  const handleClick = () => {
    console.log('s-button clicked');
  };

  return <s-button onClick={handleClick}>Click me</s-button>;
}

// or

export default function HandlingEvents() {
  const handleClick = () => {
    console.log('s-button clicked');
  };

  const button = document.createElement('s-button');
  button.addEventListener('click', handleClick);
  document.body.appendChild(button);
}


```


## Using Forms

When building a Block extension you may use the [Form component](https://shopify.dev/docs/api/admin-extensions/latest/components/forms/form) to integrate with the contextual save bar of the resource page. The Form component provides a way to manage form state and submit data to your app's backend or directly to Shopify using Direct API access.

Whenever an input field is changed, the Form component will automatically update the dirty state of the resource page. When the form is submitted or reset the relevant callback in the form component will get triggered.

Using this, you can control what defines a component to be dirty by utilizing the Input's defaultValue property.

Rules:

- When the defaultValue is set, the component will be considered dirty if the value of the input is different from the defaultValue.You may update the defaultValue when the form is submitted to reset the dirty state of the form.

- When the defaultValue is not set, the component will be considered dirty if the value of the input is different from the initial value or from the last dynamic update to the input's value that wasn't triggered by user input.

        Note: In order to trigger the dirty state, each input must have a name attribute.
        
```tsx
import { render } from 'preact';
import { useState } from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
}

const defaultValues = {
  text: 'default value',
  number: 50,
};

function Extension() {
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('');

  return (
    <s-admin-block title="My Block Extension">
      <s-form
        onSubmit={(event) => {
          event.waitUntil(fetch('app:save/data'));
          console.log('submit', {textValue, numberValue});
        }
        onReset={() => console.log('automatically reset values')}
      >
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Default Value"
            name="my-text"
            defaultValue={defaultValues.text}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <s-number-field
            label="Percentage field"
            name="my-number"
            defaultValue={defaultValues.number}
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
          />
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}

```

```tsx
import { render } from 'preact';
import { useState } from 'preact/hooks';

export default async () => {
  render(<Extension />, document.body);
}

async function Extension() {
  const data = await fetch('/data.json');
  const {text, number} = await data.json();
  return <App text={text} number={number} />;
}

function App({text, number}) {
  // The initial values set in the form fields will be the default values
  const [textValue, setTextValue] = useState(text);
  const [numberValue, setNumberValue] = useState(number);

  return (
    <s-admin-block title="My Block Extension">
      <s-form
        onSubmit={(event) => {
          event.waitUntil(fetch('app:data/save'));
          console.log('submit', {textValue, numberValue});
        }
        onReset={() => console.log('automatically reset values')}
      >
        <s-stack direction="block" gap="base">
          <s-text-field
            label="Default Value"
            name="my-text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
          />
          <s-number-field
            label="Percentage field"
            name="my-number"
            value={numberValue}
            onChange={(e) => setNumberValue(e.target.value)}
          />
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}

```


## Picking Resources

Use the Resource Picker and Picker API's to allow users to select resources for your extension to use.

### Resource Picker

Use the `resourcePicker` API to display a search-based interface to help users find and select one or more products, collections, or product variants, and then return the selected resources to your extension. Both the app and the user must have the necessary permissions to access the resources selected.

```tsx
import { render } from 'preact';

export default async () => {
  render(<Extension />, document.body);
}


function Extension() {
  const handleSelectProduct = async () => {
    const selected = await shopify.resourcePicker({ type: 'product' });
    console.log(selected);
  };

  return <s-button onClick={handleSelectProduct}>Select product</s-button>;
}

```


### Picker

Use the `picker` API to display a search-based interface to help users find and select one or more custom data types that you provide, such as product reviews, email templates, or subscription options.

```tsx
import { render } from 'preact';

export default async () => {
  render(<Extension />, document.body);
}

function Extension() {
  const handleSelectEmailTemplate = async () => {
    const pickerInstance = await shopify.picker({
      heading: 'Select a template',
      multiple: false,
      headers: [
        { content: 'Templates' },
        { content: 'Created by' },
        { content: 'Times used', type: 'number' },
      ],
      items: [
        {
          id: '1',
          heading: 'Full width, 1 column',
          data: ['Karine Ruby', '0'],
          badges: [{ content: 'Draft', tone: 'info' }, { content: 'Marketing' }],
        },
        {
          id: '2',
          heading: 'Large graphic, 3 column',
          data: ['Charlie Mitchell', '5'],
          badges: [
            { content: 'Published', tone: 'success' },
            { content: 'New feature' },
          ],
          selected: true,
        },
        {
          id: '3',
          heading: 'Promo header, 2 column',
          data: ['Russell Winfield', '10'],
          badges: [{ content: 'Published', tone: 'success' }],
        },
      ],
    });

    const selected = await pickerInstance.selected;
    console.log(selected);
  };

  return (
    <s-button onClick={handleSelectEmailTemplate}>Select email template</s-button>
  );
}

```


## Deploying

Use the Shopify CLI to [deploy your app and its extensions](https://shopify.dev/docs/apps/deployment/extension).
```bash
# navigate to your app's root directory:
cd my-app

# deploy your app and its extensions:
shopify app deploy

# follow the steps to deploy

```


## References

- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2023-10/api/action-extension-api): This API is available to all action extension types.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2023-10/api/block-extension-api): This API is available to all block extension types.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2023-10/api/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Extension Targets](https://shopify.dev/docs/api/admin-extensions/2023-10/api/extension-targets): This is a list of all the available extension targets for Admin App Extensions.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2023-10/api/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2023-10/components/other/adminaction): AdminAction is a component used by Admin Action extensions to configure a primary and secondary action and title.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2023-10/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2023-10/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2023-10/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2023-10/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2023-10/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2023-10/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2023-10/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2023-10/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2023-10/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2023-10/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2023-10/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2023-10/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2023-10/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [Select](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2023-10/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2023-10/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-01/api/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2024-01/api/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2024-01/api/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Extension Targets](https://shopify.dev/docs/api/admin-extensions/2024-01/api/extension-targets): This is a list of all the available extension targets for Admin App Extensions.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2024-01/api/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2024-01/components/other/adminaction): AdminAction is a component used by Admin Action extensions to configure a primary and secondary action and title.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2024-01/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2024-01/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2024-01/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2024-01/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2024-01/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2024-01/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2024-01/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2024-01/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2024-01/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2024-01/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2024-01/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2024-01/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Select](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2024-01/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2024-01/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-04/api/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2024-04/api/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2024-04/api/validation-settings-api): This API is available Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2024-04/api/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Extension Targets](https://shopify.dev/docs/api/admin-extensions/2024-04/api/extension-targets): This is a list of all the available extension targets for Admin App Extensions.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2024-04/api/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2024-04/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2024-04/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2024-04/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2024-04/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2024-04/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2024-04/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2024-04/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2024-04/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2024-04/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2024-04/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2024-04/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2024-04/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2024-04/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2024-04/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2024-04/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2024-04/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminprintaction) component is required to build admin print action extensions.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2024-07/api/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2024-07/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2024-07/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2024-07/components/other/adminprintaction): AdminPrintAction is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2024-07/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2024-07/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2024-07/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2024-07/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2024-07/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2024-07/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2024-07/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2024-07/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2024-07/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2024-07/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2024-07/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2024-07/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2024-07/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2024-07/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminprintaction) component is required to build admin print action extensions.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2024-10/api/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2024-10/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2024-10/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2024-10/components/other/adminprintaction): AdminPrintAction is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2024-10/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2024-10/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2024-10/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2024-10/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2024-10/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2024-10/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2024-10/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2024-10/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2024-10/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2024-10/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2024-10/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2024-10/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2024-10/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2024-10/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Discount Function Settings API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/discount-function-settings-api): This API is available to Discount Function Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/build/discounts/build-ui-extension) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Discount Function Settings extensions.
- [Picker](https://shopify.dev/docs/api/admin-extensions/2025-01/api/picker): Opens a Picker in your app
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminprintaction) component is required to build admin print action extensions.
- [Resource Picker](https://shopify.dev/docs/api/admin-extensions/2025-01/api/resource-picker): Opens a Resource Picker in your app
- [ShouldRender API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/shouldrender-api): This API is available to all shouldRender extension types.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2025-01/api/target-apis/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2025-01/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2025-01/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2025-01/components/other/adminprintaction): AdminPrintAction is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2025-01/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2025-01/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2025-01/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2025-01/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2025-01/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2025-01/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2025-01/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2025-01/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2025-01/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2025-01/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2025-01/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2025-01/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2025-01/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2025-01/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Discount Function Settings API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/discount-function-settings-api): This API is available to Discount Function Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/build/discounts/build-ui-extension) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Discount Function Settings extensions.
- [Picker](https://shopify.dev/docs/api/admin-extensions/2025-04/api/picker): Opens a Picker in your app
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminprintaction) component is required to build admin print action extensions.
- [Resource Picker](https://shopify.dev/docs/api/admin-extensions/2025-04/api/resource-picker): Opens a Resource Picker in your app
- [ShouldRender API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/shouldrender-api): This API is available to all shouldRender extension types.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2025-04/api/target-apis/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2025-04/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2025-04/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2025-04/components/other/adminprintaction): AdminPrintAction is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2025-04/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2025-04/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2025-04/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2025-04/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2025-04/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2025-04/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2025-04/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2025-04/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2025-04/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2025-04/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2025-04/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2025-04/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2025-04/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2025-04/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Discount Function Settings API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/discount-function-settings-api): This API is available to Discount Function Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/build/discounts/build-ui-extension) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Discount Function Settings extensions.
- [Picker](https://shopify.dev/docs/api/admin-extensions/2025-07/api/picker): Opens a Picker in your app
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/components/other/adminprintaction) component is required to build admin print action extensions.
- [Resource Picker](https://shopify.dev/docs/api/admin-extensions/2025-07/api/resource-picker): Opens a Resource Picker in your app
- [ShouldRender API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/shouldrender-api): This API controls the render state of an admin action extension. Learn more in the <a href="/docs/apps/build/admin/actions-blocks/hide-extensions?extension=react#hide-an-admin-action">admin extensions tutorial</a>.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2025-07/api/target-apis/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2025-07/components/other/adminaction): AdminAction is a component used by Admin action extensions to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2025-07/components/other/adminblock): This component is similar to the AdminBlock, providing a deeper integration with the container your UI is rendered into. However, this only applies to Block Extensions which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2025-07/components/other/adminprintaction): AdminPrintAction is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/badge): Use this component to inform merchants of the status of an object or of an action that’s been taken.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/banner): Use this component if you need to communicate to merchants in a prominent way.
- [BlockStack](https://shopify.dev/docs/api/admin-extensions/2025-07/components/structure/blockstack): This structures layout elements along the vertical axis of the page. It's useful for vertical alignment.
- [Box](https://shopify.dev/docs/api/admin-extensions/2025-07/components/structure/box): This is your foundational structural element for composing UI. It can be styled using predefined tokens. Use it to build your layout.
- [Button](https://shopify.dev/docs/api/admin-extensions/2025-07/components/actions/button): Use this component when you want to provide users the ability to perform specific actions, like saving data.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/checkbox): Use this component when you want to provide users with a clear selection option, such as for agreeing to terms and conditions or selecting multiple options from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/choicelist): Use this component if you need to group together a related list of interactive choices as radio buttons or checkboxes.
- [ColorPicker](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/colorpicker): Use this component if you need to select a color.
- [CustomerSegmentTemplate](https://shopify.dev/docs/api/admin-extensions/2025-07/components/other/customersegmenttemplate): CustomerSegmentTemplate is used to configure a template rendered in the **Customers** section of the Shopify admin. Templates can be applied in the [customer segment editor](https://help.shopify.com/en/manual/customers/customer-segmentation/customer-segments) and used to create segments.
- [DateField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/datefield): This is a form field that lets users select a date using the DatePicker component.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/datepicker): Date pickers let merchants choose dates from a visual calendar that’s consistently applied wherever dates need to be selected across Shopify.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2025-07/components/structure/divider): Use this to create a clear visual separation between different elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/emailfield): Use this when you need users to provide their email addresses.
- [Form](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/form): Use this component when you want to collect input from users. It provides a structure for various input fields and controls, such as text fields, checkboxes, and buttons. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [FunctionSettings](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/functionsettings): FunctionSettings should be used when configuring the metafield configuration of a Shopify Function. It provides a structure for various input fields and controls, such as text fields, checkboxes, and selections. It also integrates with the native Contextual Save Bar to handle form submission and reset actions.
- [Heading](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/heading): Use this to display a title. It's similar to the h1-h6 tags in HTML
- [HeadingGroup](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/headinggroup): This groups headings together, much like the hgroup element in HTML.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2025-07/components/media/icon): This component renders an icon from a predefined list. Choose the one that suits your needs.
- [Image](https://shopify.dev/docs/api/admin-extensions/2025-07/components/media/image): Use this when you want to display an image.
- [InlineStack](https://shopify.dev/docs/api/admin-extensions/2025-07/components/structure/inlinestack): Use this to organize layout elements along the horizontal axis of the page. It's great for horizontal alignment.
- [Link](https://shopify.dev/docs/api/admin-extensions/2025-07/components/actions/link): This is an interactive component that directs users to a specified URL. It even supports custom protocols.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/moneyfield): This is the right component for letting users enter Money digits.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/numberfield): This component is specifically designed for numeric data entry.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/paragraph): Use this to display a block of text similar to the `<p>` tag in HTML.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/passwordfield): This component is for secure input, it obfuscates any text that users enter.
- [Pressable](https://shopify.dev/docs/api/admin-extensions/2025-07/components/actions/pressable): Use this component when you need to capture click or press events on its child elements without adding any additional visual styling. It subtly enhances user interaction by changing the cursor when hovering over the child elements, providing a clear indication of interactivity.
- [ProgressIndicator](https://shopify.dev/docs/api/admin-extensions/2025-07/components/media/progressindicator): Use this component to notify merchants that their action is being processed or loaded.
- [Section](https://shopify.dev/docs/api/admin-extensions/2025-07/components/structure/section): `Section` is a structural component that allows thematic grouping of content. Its visual style is contextual and controlled by Shopify, so a `Section` may look different depending on the component it is nested inside.

`Section` also automatically increases the heading level for its content to ensure a semantically correct heading structure in the document. To further increase the heading level inside the `Section`, consider nesting new `Section`s.
- [Select](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/select): Use this when you want to give users a predefined list of options to choose from.
- [Text](https://shopify.dev/docs/api/admin-extensions/2025-07/components/titles-and-text/text): This component renders text. Remember, you can also add your own styling.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/textarea): This component is perfect when you need to allow users to input larger amounts of text, such as for comments, feedback, or any other multi-line input.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/textfield): This is your go-to component when you need to let users input textual information.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2025-07/components/forms/urlfield): This is the right component for letting users enter a URL.
- [Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/action-extension-api): This API is available to all action extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-action) for more information. Note that the [`AdminAction`](https://shopify.dev/docs/api/admin-extensions/polaris-web-components/other/adminaction) component is required to build Admin action extensions.
- [Block Extension API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/block-extension-api): This API is available to all block extension types. Refer to the [tutorial](https://shopify.dev/docs/apps/admin/admin-actions-and-blocks/build-an-admin-block) for more information.
- [Validation Settings API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/validation-settings-api): This API is available to Validation Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/checkout/validation/create-complex-validation-rules) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Validation Settings extensions.
- [CustomerSegmentTemplate Extension API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/customersegmenttemplate-extension-api): This API is available to all customer segment template extension types.
- [Discount Function Settings API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/discount-function-settings-api): This API is available to Discount Function Settings extensions. Refer to the [tutorial](https://shopify.dev/docs/apps/build/discounts/build-ui-extension) for more information. Note that the [`FunctionSettings`](https://shopify.dev/docs/api/admin-extensions/components/forms/functionsettings) component is required to build Discount Function Settings extensions.
- [Picker](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/picker): Opens a Picker in your app
- [Print Action Extension API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/print-action-extension-api): This API is available to all print action extension types. Note that the [`AdminPrintAction`](https://shopify.dev/docs/api/admin-extensions/polaris-web-components/other/adminprintaction) component is required to build admin print action extensions.
- [Resource Picker](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/resource-picker): Opens a Resource Picker in your app
- [ShouldRender API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/shouldrender-api): This API controls the render state of an admin action extension. Learn more in the <a href="/docs/apps/build/admin/actions-blocks/hide-extensions?extension=react#hide-an-admin-action">admin extensions tutorial</a>.
- [Standard API](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/api/target-apis/standard-api): This API is available to all extension types.
- [AdminAction](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/other/adminaction): Use `s-admin-action` to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.
- [AdminBlock](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/other/adminblock): `s-admin-block` provides a deeper integration with the container your UI is rendered into. This component should only be used in Block Extensions, which render inline on a resource page.
- [AdminPrintAction](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/other/adminprintaction): `s-admin-print-action` is a component used by admin print action extensions to denote a URL to print. Admin print action extensions require the use of this component.
- [Avatar](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/media/avatar): Show a user’s profile image or initials in a compact, visual element.
- [Badge](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/titles-and-text/badge): Inform users about the status of an object or indicate that an action has been completed.
- [Banner](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/feedback/banner): Highlights important information or required actions prominently within the interface. Use to communicate statuses, provide feedback, or draw attention to critical updates.
- [Box](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/box): A generic container that provides a flexible alternative for custom designs not achievable with existing components. Use it to apply styling such as backgrounds, padding, or borders, or to nest and group other components. The contents of Box always maintain their natural size, making it especially useful within layout components that would otherwise stretch their children.
- [Button](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/actions/button): Triggers actions or events, such as submitting forms, opening dialogs, or navigating to other pages. Use Button to let users perform specific tasks or initiate interactions throughout the interface. Buttons can also function as links, guiding users to internal or external destinations.
- [Checkbox](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/checkbox): Give users a clear way to make selections, such as agreeing to terms or choosing multiple items from a list.
- [ChoiceList](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/choicelist): Present multiple options to users, allowing either single selections with radio buttons or multiple selections with checkboxes.
- [Clickable](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/actions/clickable): A generic interactive container component that provides a flexible alternative for custom interactive elements not achievable with existing components like Button or Link. Use it to apply specific styling such as backgrounds, padding, or borders.
- [DatePicker](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/datepicker): Allow users to select a specific date or date range.
- [Divider](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/divider): Create clear visual separation between elements in your user interface.
- [EmailField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/emailfield): Let users enter email addresses with built-in validation and optimized keyboard settings.
- [Form](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/form): Wraps one or more form controls and enables implicit submission, letting users submit the form from any input by pressing “Enter.” Unlike the HTML form element, this component doesn’t automatically submit data via HTTP. You must register a `submit` event to handle form submission in JavaScript.
- [Grid](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/grid): Use `s-grid` to organize your content in a matrix of rows and columns and make responsive layouts for pages. Grid follows the same pattern as the [CSS grid layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout).
- [Heading](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/titles-and-text/heading): Renders hierarchical titles to communicate the structure and organization of page content. Heading levels adjust automatically based on nesting within parent Section components, ensuring a meaningful and accessible page outline.
- [Icon](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/media/icon): Renders a graphic symbol to visually communicate core parts of the product and available actions. Icons can act as wayfinding tools to help users quickly understand their location within the interface and common interaction patterns.
- [Image](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/media/image): Embeds an image within the interface and controls its presentation. Use to visually illustrate concepts, showcase products, or support user tasks and interactions.
- [Link](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/actions/link): Makes text interactive, allowing users to navigate to other pages or perform specific actions. Supports standard URLs, custom protocols, and navigation within Shopify or app pages.
- [MoneyField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/moneyfield): Collect monetary values from users with built-in currency formatting and validation.
- [NumberField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/numberfield): Collect numerical values from users with optimized keyboard settings and built-in validation.
- [OrderedList](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/orderedlist): Displays a numbered list of related items in a specific sequence. Use to present step-by-step instructions, ranked items, or procedures where order matters.
- [Paragraph](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/titles-and-text/paragraph): Displays a block of text, and can contain inline elements such as buttons, links, or emphasized text. Use to present standalone blocks of content, as opposed to inline text.
- [PasswordField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/passwordfield): Securely collect sensitive information from users.
- [QueryContainer](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/querycontainer): Establishes a query container for responsive design. Use `s-query-container` to define an element as a containment context, enabling child components or styles to adapt based on the container’s size.
- [SearchField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/searchfield): Let users enter search terms or find specific items using a single-line input field.
- [Section](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/section): Groups related content into clearly-defined thematic areas. Sections have contextual styling that automatically adapts based on nesting depth. They also adjust heading levels to maintain a meaningful and accessible page structure.
- [Select](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/select): Allow users to pick one option from a menu. Ideal when presenting four or more choices to keep interfaces uncluttered.
- [Spinner](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/feedback/spinner): Displays an animated indicator showing users that content or actions are loading. Use to communicate ongoing processes, such as fetching data from a server. For loading states on buttons, use the “loading” property on the Button component instead.
- [Stack](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/stack): Organizes elements horizontally or vertically along the block or inline axis. Use to structure layouts, group related components, or control spacing between elements.
- [Switch](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/switch): Give users a clear way to toggle options on or off.
- [Table](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/table): Display data clearly in rows and columns, helping users view, analyze, and compare information. Automatically renders as a list on small screens and a table on large ones.
- [Text](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/titles-and-text/text): Displays inline text with specific visual styles or tones. Use to emphasize or differentiate words or phrases within a Paragraph or other block-level components.
- [TextArea](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/textarea): Collect longer text content from users with a multi-line input that expands automatically.
- [TextField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/textfield): Lets users enter or edit text within a single-line input. Use to collect short, free-form information from users.
- [Thumbnail](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/media/thumbnail): Display a small preview image representing content, products, or media.
- [URLField](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/forms/urlfield): Collect URLs from users with built-in formatting and validation.
- [UnorderedList](https://shopify.dev/docs/api/admin-extensions/2025-10-rc/polaris-web-components/structure/unorderedlist): Displays a bulleted list of related items. Use to present collections of items or options where the sequence isn’t critical.


