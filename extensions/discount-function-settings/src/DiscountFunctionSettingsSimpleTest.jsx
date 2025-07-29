import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Main entry point - minimal test
export default async () => {
  render(<SimpleTest />, document.body);
}

function SimpleTest() {
  const [status, setStatus] = useState('Checking API...');
  const [testData, setTestData] = useState('');
  
  useEffect(() => {
    // Check if shopify is available
    if (typeof shopify !== 'undefined') {
      setStatus('Shopify API found!');
      console.log('Shopify object:', shopify);
      
      // Try to load data
      if (shopify.data) {
        console.log('Data:', shopify.data);
        setTestData(JSON.stringify(shopify.data, null, 2));
      }
    } else {
      setStatus('Shopify API not found - trying window.shopify...');
      if (window?.shopify) {
        setStatus('Found window.shopify!');
        console.log('Window.shopify:', window.shopify);
      } else {
        setStatus('No Shopify API available');
      }
    }
  }, []);
  
  const handleTestSave = async () => {
    try {
      const api = shopify || window?.shopify;
      if (!api?.applyMetafieldChange) {
        alert('No save API available');
        return;
      }
      
      const result = await api.applyMetafieldChange({
        type: 'updateMetafield',
        namespace: '$app:sku-custom-discount',
        key: 'function-configuration',
        value: JSON.stringify({ test: true, time: new Date().toISOString() }),
        valueType: 'json'
      });
      
      console.log('Save result:', result);
      alert('Save result: ' + JSON.stringify(result));
    } catch (error) {
      console.error('Save error:', error);
      alert('Save error: ' + error.message);
    }
  };
  
  return (
    <s-box padding="base">
      <s-stack gap="base">
        <s-heading>Simple API Test</s-heading>
        <s-text>{status}</s-text>
        
        <s-button variant="primary" onclick={handleTestSave}>
          Test Save
        </s-button>
        
        {testData && (
          <s-box padding="base" background="subdued">
            <s-text fontFamily="monospace" variant="bodySm">
              {testData}
            </s-text>
          </s-box>
        )}
      </s-stack>
    </s-box>
  );
}