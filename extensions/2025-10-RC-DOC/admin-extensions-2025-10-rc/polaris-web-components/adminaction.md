# AdminAction

Use `s-admin-action` to configure a primary and secondary action and title. Use of this component is required in order to use Admin action extensions.

```jsx
<s-admin-action title="My App Action">
  Modal content
  <s-button
    slot="primary-action"
    onClick={() => console.log('pressed primary action')}
  >
    Primary
  </s-button>
  <s-button
    slot="secondary-actions"
    onClick={() => console.log('pressed secondary action')}
  >
    Secondary
  </s-button>
</s-admin-action>;

```

## Properties

### AdminActionProps

### heading

value: `string`

The text to use as the Action modal’s title. If not provided, the name of the extension will be used.

### loading

value: `boolean`

Whether the action is in a loading state, such as initial page load or action opening. When true, the action could be in an inert state, which prevents user interaction.

## Slots

### AdminActionSlots

### primary-action

value: `HTMLElement`

The primary action to display in the admin action.

### secondary-actions

value: `HTMLElement`

The secondary actions to display in the admin action.

