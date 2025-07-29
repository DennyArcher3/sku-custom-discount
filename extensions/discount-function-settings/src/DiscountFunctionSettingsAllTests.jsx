import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

export default async () => {
  render(<AllTests />, document.body);
}

function AllTests() {
  const [activeTest, setActiveTest] = useState('status');
  const [logs, setLogs] = useState([]);
  
  // Log helper that doesn't use alert
  const log = (message, data = null) => {
    console.log(message, data);
    setLogs(prev => [...prev, { 
      time: new Date().toLocaleTimeString(), 
      message, 
      data: data ? JSON.stringify(data, null, 2) : null 
    }]);
  };

  return (
    <s-stack gap="base">
      <s-heading>Discount Function Settings - All Tests</s-heading>
      
      {/* Test selector */}
      <s-box padding="tight" background="subdued">
        <s-stack direction="inline" gap="tight">
          <s-button 
            variant={activeTest === 'status' ? 'primary' : 'secondary'}
            onclick={() => setActiveTest('status')}
          >
            API Status
          </s-button>
          <s-button 
            variant={activeTest === 'simple' ? 'primary' : 'secondary'}
            onclick={() => setActiveTest('simple')}
          >
            Simple Save
          </s-button>
          <s-button 
            variant={activeTest === 'full' ? 'primary' : 'secondary'}
            onclick={() => setActiveTest('full')}
          >
            Full Test
          </s-button>
        </s-stack>
      </s-box>
      
      {/* Test content */}
      <s-box padding="base">
        {activeTest === 'status' && <StatusTest log={log} />}
        {activeTest === 'simple' && <SimpleTest log={log} />}
        {activeTest === 'full' && <FullTest log={log} />}
      </s-box>
      
      {/* Log display */}
      <s-box padding="base" background="subdued" borderRadius="base">
        <s-stack gap="tight">
          <s-text fontWeight="bold">Console Log</s-text>
          <s-button variant="plain" onclick={() => setLogs([])}>Clear</s-button>
          <s-box maxHeight="200px" overflow="auto">
            {logs.map((entry, i) => (
              <s-box key={i} padding="extra-tight" borderBottom="base">
                <s-text variant="bodySm" tone="subdued">{entry.time}</s-text>
                <s-text variant="bodySm">{entry.message}</s-text>
                {entry.data && (
                  <s-text variant="bodySm" fontFamily="monospace">{entry.data}</s-text>
                )}
              </s-box>
            ))}
          </s-box>
        </s-stack>
      </s-box>
    </s-stack>
  );
}

// Test 1: API Status Check
function StatusTest({ log }) {
  const [apiInfo, setApiInfo] = useState({});
  
  useEffect(() => {
    checkApi();
  }, []);
  
  const checkApi = () => {
    log('Checking API availability...');
    
    // Check global shopify
    if (typeof shopify !== 'undefined') {
      log('Found global shopify object');
      const info = {
        hasData: !!shopify.data,
        hasApplyMetafieldChange: !!shopify.applyMetafieldChange,
        hasResourcePicker: !!shopify.resourcePicker,
        hasQuery: !!shopify.query,
        dataKeys: shopify.data ? Object.keys(shopify.data) : [],
        allKeys: Object.keys(shopify)
      };
      setApiInfo(info);
      log('Shopify API info:', info);
      
      if (shopify.data) {
        log('Data object:', shopify.data);
      }
    } else {
      log('No global shopify object found');
      
      // Check window.shopify
      if (window?.shopify) {
        log('Found window.shopify');
        setApiInfo({ location: 'window.shopify' });
      } else {
        log('No shopify API found anywhere');
        setApiInfo({ error: 'No API found' });
      }
    }
  };
  
  return (
    <s-stack gap="base">
      <s-heading size="small">API Status Check</s-heading>
      
      <s-box padding="base" background="subdued">
        <s-stack gap="tight">
          {Object.entries(apiInfo).map(([key, value]) => (
            <s-text key={key} variant="bodySm">
              {key}: {typeof value === 'boolean' ? (value ? '✅' : '❌') : JSON.stringify(value)}
            </s-text>
          ))}
        </s-stack>
      </s-box>
      
      <s-button variant="primary" onclick={checkApi}>
        Re-check API
      </s-button>
    </s-stack>
  );
}

// Test 2: Simple Save Test
function SimpleTest({ log }) {
  const [testValue, setTestValue] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      log('Loading saved data...');
      
      if (!shopify?.data) {
        log('No shopify.data available');
        return;
      }
      
      const metafield = shopify.data?.discount?.metafield;
      log('Metafield from discount:', metafield);
      
      if (metafield?.value) {
        const parsed = JSON.parse(metafield.value);
        setSavedValue(parsed.test_value || '');
        log('Loaded value:', parsed.test_value);
      }
    } catch (error) {
      log('Load error:', error.message);
    }
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      log('Attempting to save...');
      
      if (!shopify?.applyMetafieldChange) {
        log('ERROR: applyMetafieldChange not available');
        return;
      }
      
      const saveData = {
        test_value: testValue,
        timestamp: new Date().toISOString()
      };
      
      const result = await shopify.applyMetafieldChange({
        type: 'updateMetafield',
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(saveData),
        valueType: 'json'
      });
      
      log('Save result:', result);
      
      if (result?.type === 'success') {
        setSavedValue(testValue);
        log('Save successful!');
      } else {
        log('Save failed:', result?.message || 'Unknown error');
      }
    } catch (error) {
      log('Save error:', error.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <s-stack gap="base">
      <s-heading size="small">Simple Save Test</s-heading>
      
      <s-text variant="bodySm">
        Current saved value: "{savedValue}"
      </s-text>
      
      <s-text-field
        label="Test Value"
        value={testValue}
        oninput={(e) => setTestValue(e.target.value)}
        placeholder="Enter test value"
      />
      
      <s-button 
        variant="primary" 
        onclick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Test Value'}
      </s-button>
    </s-stack>
  );
}

// Test 3: Full Product Test
function FullTest({ log }) {
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      log('Loading products...');
      
      const metafield = shopify?.data?.discount?.metafield;
      if (metafield?.value) {
        const parsed = JSON.parse(metafield.value);
        if (parsed.products) {
          setProducts(parsed.products);
          log('Loaded products:', parsed.products.length);
        }
      }
    } catch (error) {
      log('Load error:', error.message);
    }
  };
  
  const addProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      title: `Product ${products.length + 1}`,
      sku: `SKU-${products.length + 1}`,
      discount: 10,
      discountType: 'percentage'
    };
    setProducts([...products, newProduct]);
    log('Added product:', newProduct);
  };
  
  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    log('Removed product:', id);
  };
  
  const saveProducts = async () => {
    try {
      setSaving(true);
      log('Saving products...');
      
      const config = {
        products: products,
        sku_discounts: {},
        timestamp: new Date().toISOString()
      };
      
      // Build sku_discounts for the function
      products.forEach(p => {
        if (p.sku) {
          config.sku_discounts[p.sku] = {
            discount_type: p.discountType,
            value: p.discount
          };
        }
      });
      
      const result = await shopify.applyMetafieldChange({
        type: 'updateMetafield',
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(config),
        valueType: 'json'
      });
      
      log('Save result:', result);
    } catch (error) {
      log('Save error:', error.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <s-stack gap="base">
      <s-heading size="small">Full Product Test</s-heading>
      
      <s-box padding="base" background="subdued">
        <s-stack gap="tight">
          <s-text fontWeight="bold">Products ({products.length})</s-text>
          
          {products.map(product => (
            <s-box key={product.id} padding="tight" background="default" borderRadius="base">
              <s-stack direction="inline" gap="tight" alignItems="center">
                <s-text variant="bodySm">
                  {product.title} | SKU: {product.sku} | {product.discount}%
                </s-text>
                <s-button 
                  variant="plain" 
                  tone="critical"
                  onclick={() => removeProduct(product.id)}
                >
                  Remove
                </s-button>
              </s-stack>
            </s-box>
          ))}
          
          <s-button variant="secondary" onclick={addProduct}>
            Add Product
          </s-button>
        </s-stack>
      </s-box>
      
      <s-button 
        variant="primary" 
        onclick={saveProducts}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save All Products'}
      </s-button>
    </s-stack>
  );
}