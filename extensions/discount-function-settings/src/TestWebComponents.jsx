/* eslint-disable react/self-closing-comp */
import '@shopify/ui-extensions/preact';
import { render } from 'preact';

export default function extension() {
  render(<TestExtension />, document.body);
}

function TestExtension() {
  return (
    <s-admin-block title="Web Components Test">
      <s-stack gap="large">
        <s-section>
          <s-heading>Testing Web Components</s-heading>
          <s-text>If you can see this text, basic web components are working!</s-text>
        </s-section>
        
        <s-section>
          <s-heading>Table Test</s-heading>
          <s-table>
            <s-table-header-row>
              <s-table-header>Column 1</s-table-header>
              <s-table-header>Column 2</s-table-header>
            </s-table-header-row>
            <s-table-body>
              <s-table-row>
                <s-table-cell>Cell 1</s-table-cell>
                <s-table-cell>Cell 2</s-table-cell>
              </s-table-row>
            </s-table-body>
          </s-table>
        </s-section>

        <s-section>
          <s-heading>Form Elements</s-heading>
          <s-stack gap="base">
            <s-text-field label="Test Input"></s-text-field>
            <s-button variant="primary">Test Button</s-button>
          </s-stack>
        </s-section>
      </s-stack>
    </s-admin-block>
  );
}