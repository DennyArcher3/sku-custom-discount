import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Following the exact pattern from the example
export default async () => {
  render(<Extension />, document.body);
}

function Extension() {
  // Access shopify exactly like the example
  const {applyMetafieldChange, data} = shopify;
  console.log({data});
  
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    // Load existing configuration
    loadConfiguration();
  }, []);
  
  const loadConfiguration = () => {
    console.log('Loading configuration...');
    console.log('Data from shopify:', data);
    
    // Check for metafield
    if (data?.discount?.metafield?.value) {
      try {
        const config = JSON.parse(data.discount.metafield.value);
        console.log('Loaded config:', config);
        
        if (config.products) {
          setProducts(config.products);
        }
      } catch (e) {
        console.error('Error parsing metafield:', e);
      }
    }
  };
  
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now().toString(),
      title: `Test Product ${products.length + 1}`,
      sku: `SKU${products.length + 1}`,
      discount: 10,
      discountType: 'percentage'
    };
    
    setProducts([...products, newProduct]);
  };
  
  const handleSave = async () => {
    console.log('Saving configuration...');
    setSaving(true);
    setMessage('');
    
    try {
      const configuration = {
        products: products,
        timestamp: new Date().toISOString()
      };
      
      console.log('Saving:', configuration);
      
      const result = await applyMetafieldChange({
        type: 'updateMetafield',
        namespace: '$app:sku-custom-discount',
        key: 'function-configuration',
        value: JSON.stringify(configuration),
        valueType: 'json'
      });
      
      console.log('Save result:', result);
      
      if (result?.type === 'success') {
        setMessage('Saved successfully!');
      } else {
        setMessage('Save failed: ' + (result?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <s-admin-action>
      <s-stack gap="base">
        <s-heading>SKU Discount Settings (Example Pattern)</s-heading>
        
        {message && (
          <s-banner tone={message.includes('success') ? 'success' : 'critical'}>
            {message}
          </s-banner>
        )}
        
        <s-box padding="base" background="subdued">
          <s-stack gap="tight">
            <s-text fontWeight="bold">Products ({products.length})</s-text>
            
            {products.map((product, index) => (
              <s-box key={product.id} padding="tight" background="default" borderRadius="base">
                <s-text>{product.title} - SKU: {product.sku} - {product.discount}%</s-text>
              </s-box>
            ))}
            
            <s-button variant="secondary" onclick={handleAddProduct}>
              Add Test Product
            </s-button>
          </s-stack>
        </s-box>
        
        <s-button 
          slot="primary-action" 
          onclick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </s-button>
      </s-stack>
    </s-admin-action>
  );
}