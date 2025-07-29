import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Use the actual namespace from your app
const METAFIELD_NAMESPACE = "app--269949796353--sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

export default async () => {
  render(<DebugReload />, document.body);
}

function DebugReload() {
  const [debugInfo, setDebugInfo] = useState({});
  const [testValue, setTestValue] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Access Shopify API from global object
  const { data, applyMetafieldChange } = shopify;

  useEffect(() => {
    checkData();
  }, []);

  const checkData = () => {
    console.log('[DEBUG] Checking data...');
    const info = {
      hasData: !!data,
      dataKeys: data ? Object.keys(data) : [],
      metafieldsCount: data?.metafields?.length || 0,
      discountId: data?.id,
      timestamp: new Date().toISOString()
    };
    
    // Check for metafield
    const metafield = data?.metafields?.find(
      mf => mf.namespace === METAFIELD_NAMESPACE && mf.key === METAFIELD_KEY
    );
    
    if (metafield) {
      info.metafieldFound = true;
      info.metafieldValue = metafield.value;
      try {
        info.parsedValue = JSON.parse(metafield.value);
      } catch (e) {
        info.parseError = e.message;
      }
    } else {
      info.metafieldFound = false;
    }
    
    setDebugInfo(info);
    console.log('[DEBUG] Info:', info);
  };

  const handleSave = async () => {
    setSaving(true);
    console.log('[DEBUG] Saving test value:', testValue);
    
    try {
      const configuration = {
        test_value: testValue,
        timestamp: new Date().toISOString(),
        discount_code: data?.discount?.code || "TEST",
        sku_discounts: {},
        product_details: {}
      };
      
      const result = await applyMetafieldChange({
        type: 'updateMetafield',
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(configuration),
        valueType: 'json'
      });
      
      console.log('[DEBUG] Save result:', result);
      
      // Wait a bit then reload
      setTimeout(() => {
        checkData();
      }, 2000);
    } catch (error) {
      console.error('[DEBUG] Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <s-stack gap="base">
      <s-heading>Debug Reload Test</s-heading>
      
      <s-box padding="base" background="subdued">
        <s-stack gap="tight">
          <s-text fontWeight="bold">Current Data:</s-text>
          {Object.entries(debugInfo).map(([key, value]) => (
            <s-text key={key} variant="bodySm">
              {key}: {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </s-text>
          ))}
        </s-stack>
      </s-box>
      
      <s-text-field
        label="Test Value"
        value={testValue}
        oninput={(e) => setTestValue(e.target.value)}
        placeholder="Enter test value"
      />
      
      <s-stack direction="inline" gap="tight">
        <s-button variant="primary" onclick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Test'}
        </s-button>
        
        <s-button variant="secondary" onclick={checkData}>
          Reload Data
        </s-button>
      </s-stack>
      
      <s-text variant="bodySm" tone="subdued">
        Namespace: {METAFIELD_NAMESPACE}
      </s-text>
    </s-stack>
  );
}