import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// Export as a regular function without the problematic import
export default function() {
  render(<App />, document.body);
}

function App() {
  const shopify = window.shopify || {};
  const { applyMetafieldChange, data, loading, resourcePicker } = shopify;
  
  const [products, setProducts] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [defaultDiscountType, setDefaultDiscountType] = useState('percentage');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  // Load existing configuration from metafields
  useEffect(() => {
    if (data?.metafields) {
      const metafield = data.metafields.find(mf => mf.key === METAFIELD_KEY);
      if (metafield?.value) {
        try {
          const config = JSON.parse(metafield.value);
          if (config.products) {
            setProducts(config.products);
          }
        } catch (e) {
          console.error("Error loading configuration:", e);
        }
      }
    }
    
    // Sample product for demo
    if (products.length === 0) {
      setProducts([{
        id: '1',
        title: 'The Inventory Not Tracked Snowboard',
        sku: 'sku-untracked-1',
        image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png',
        price: '950',
        discount: 100,
        discountType: 'percentage'
      }]);
    }
  }, [data?.metafields]);

  const handleProductSelection = async () => {
    try {
      const selected = await resourcePicker({
        type: 'product',
        multiple: true,
        action: 'select'
      });

      if (selected && selected.length > 0) {
        const newProducts = selected.map(product => ({
          id: product.id,
          title: product.title,
          sku: product.variants?.[0]?.sku || 'N/A',
          image: product.images?.[0]?.url || '',
          price: product.variants?.[0]?.price || '0.00',
          discount: 0,
          discountType: defaultDiscountType
        }));

        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const filtered = newProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
      }
    } catch (error) {
      console.error('Error selecting products:', error);
    }
  };

  const updateProductDiscount = (id, value) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, discount: parseFloat(value) || 0 } : p
    ));
  };

  const updateProductType = (id, type) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, discountType: type } : p
    ));
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const clearAll = () => {
    setProducts([]);
  };

  const calculateDiscountAmount = (product) => {
    const price = parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    
    if (product.discountType === 'percentage') {
      return (price * discount / 100).toFixed(2);
    } else {
      return discount.toFixed(2);
    }
  };

  const saveConfiguration = async () => {
    try {
      const configuration = {
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          sku: p.sku,
          discount: p.discount,
          discountType: p.discountType
        }))
      };

      await applyMetafieldChange({
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(configuration),
        type: 'json'
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  if (loading) {
    return (
      <s-box padding="base">
        <s-text>Loading...</s-text>
      </s-box>
    );
  }

  return (
    <s-function-settings>
      <s-form onsubmit={(e) => { e.preventDefault(); saveConfiguration(); }}>
        <s-stack gap="none">
          {/* Collapsible Header */}
          <s-box 
            padding="tight" 
            background="subdued" 
            style="cursor: pointer; user-select: none;"
            onclick={() => setIsExpanded(!isExpanded)}
          >
            <s-stack direction="inline" gap="tight" block-alignment="center">
              <s-box style="width: 24px; height: 24px; background: #008060; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 12px; font-weight: bold;">%</span>
              </s-box>
              <s-text variant="headingSm" font-weight="semibold">SKU Discount Settings</s-text>
              <s-icon 
                source="ChevronDownMinor" 
                style={`transform: rotate(${isExpanded ? '180deg' : '0deg'}); transition: transform 0.2s;`}
              />
            </s-stack>
          </s-box>

          {/* Main Content */}
          {isExpanded && (
            <s-stack gap="base" style="padding: 16px;">
              {/* Title and Badge */}
              <s-stack gap="tight">
                <s-heading size="small">Product SKU Discount Manager</s-heading>
                <s-badge tone="success">
                  {products.length} products configured
                </s-badge>
              </s-stack>

              {/* Divider */}
              <s-box style="height: 1px; background: #e1e3e5; margin: 12px 0;"></s-box>

              {/* Action Buttons Row */}
              <s-stack direction="inline" gap="base" block-alignment="center">
                <s-button 
                  variant="primary" 
                  size="slim"
                  onclick={handleProductSelection}
                >
                  <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                    <s-icon source="ProductsMajor" />
                    <s-text>Select Products</s-text>
                  </s-stack>
                </s-button>
                
                <s-button 
                  variant="secondary"
                  size="slim"
                  onclick={() => setShowBulkImport(!showBulkImport)}
                >
                  <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                    <s-icon source="ImportMinor" />
                    <s-text>Bulk Import</s-text>
                  </s-stack>
                </s-button>

                {/* Default Type Toggle */}
                <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                  <s-text variant="bodySm">Default:</s-text>
                  <s-button-group variant="segmented">
                    <s-button
                      size="slim"
                      pressed={defaultDiscountType === 'percentage'}
                      onclick={() => setDefaultDiscountType('percentage')}
                    >
                      % off
                    </s-button>
                    <s-button
                      size="slim"
                      pressed={defaultDiscountType === 'fixedAmount'}
                      onclick={() => setDefaultDiscountType('fixedAmount')}
                    >
                      $ off
                    </s-button>
                  </s-button-group>
                </s-stack>
              </s-stack>

              {/* Bulk Import Section */}
              {showBulkImport && (
                <s-box padding="tight" background="subdued" border-radius="base" style="margin-top: 8px;">
                  <s-stack gap="tight">
                    <s-text variant="bodySm">Paste SKUs and discounts (SKU, discount)</s-text>
                    <s-text-field
                      label=""
                      value={bulkImportText}
                      onchange={(e) => setBulkImportText(e.target.value)}
                      multiline={3}
                      placeholder="SKU123,35
SKU456,40"
                    />
                    <s-button 
                      variant="primary" 
                      size="slim"
                      disabled={!bulkImportText.trim()}
                    >
                      Import
                    </s-button>
                  </s-stack>
                </s-box>
              )}

              {/* Product List Header */}
              <s-box style="margin-top: 20px;">
                <s-stack direction="inline" gap="tight" block-alignment="center" inline-alignment="space-between">
                  <s-text variant="bodySm" font-weight="semibold">Product List</s-text>
                  {products.length > 0 && (
                    <s-button 
                      variant="plain" 
                      size="slim"
                      tone="critical"
                      onclick={clearAll}
                    >
                      <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                        <s-icon source="DeleteMinor" />
                        <s-text>Clear All</s-text>
                      </s-stack>
                    </s-button>
                  )}
                </s-stack>
              </s-box>

              {/* Products */}
              {products.length === 0 ? (
                <s-box padding="large" background="subdued" border-radius="base" style="margin-top: 12px;">
                  <s-text variant="bodySm" tone="subdued">
                    No products added yet. Use "Select Products" or "Bulk Import" to add products.
                  </s-text>
                </s-box>
              ) : (
                <s-stack gap="base" style="margin-top: 12px;">
                  {products.map((product) => (
                    <s-box 
                      key={product.id}
                      padding="base" 
                      background="subdued"
                      border-radius="base"
                      border="divider"
                    >
                      <s-stack direction="inline" gap="base" block-alignment="center">
                        {/* Product Image */}
                        <s-thumbnail
                          source={product.image}
                          alt={product.title}
                          size="small"
                        />
                        
                        {/* Product Info - Takes most space */}
                        <s-box style="flex: 1; min-width: 200px;">
                          <s-stack gap="extra-tight">
                            <s-text variant="bodySm" font-weight="medium">{product.title}</s-text>
                            <s-stack direction="inline" gap="tight">
                              <s-text variant="bodySm" tone="subdued">SKU: {product.sku}</s-text>
                              <s-badge tone="info">${product.price}</s-badge>
                            </s-stack>
                          </s-stack>
                        </s-box>
                        
                        {/* Discount Controls */}
                        <s-stack direction="inline" gap="tight" block-alignment="center">
                          {/* Compact Discount Type Selector */}
                          <s-select
                            label=""
                            value={product.discountType}
                            onchange={(e) => updateProductType(product.id, e.target.value)}
                            size="slim"
                            style="width: 60px;"
                          >
                            <option value="percentage">%</option>
                            <option value="fixedAmount">$</option>
                          </s-select>
                          
                          {/* Discount Input */}
                          <s-text-field
                            label=""
                            value={product.discount.toString()}
                            onchange={(e) => updateProductDiscount(product.id, e.target.value)}
                            suffix={product.discountType === 'percentage' ? '%' : ''}
                            size="slim"
                            type="number"
                            min="0"
                            max={product.discountType === 'percentage' ? "100" : ""}
                            style="width: 80px;"
                          />
                          
                          {/* Discount Amount */}
                          <s-badge tone="critical" style="min-width: 70px; text-align: center;">
                            -${calculateDiscountAmount(product)}
                          </s-badge>
                          
                          {/* Delete Button */}
                          <s-button 
                            variant="plain" 
                            size="slim"
                            tone="critical"
                            onclick={() => removeProduct(product.id)}
                          >
                            <s-icon source="CancelMinor" />
                          </s-button>
                        </s-stack>
                      </s-stack>
                    </s-box>
                  ))}
                </s-stack>
              )}

              {/* Footer Notes */}
              <s-box style="margin-top: 24px;">
                <s-stack gap="tight">
                  <s-text variant="bodySm" tone="subdued">
                    Note: Discounts are applied based on SKU when available, otherwise product title.
                  </s-text>
                  <s-text variant="bodySm" tone="subdued">
                    For best experience on mobile devices, use the Shopify mobile app.
                  </s-text>
                </s-stack>
              </s-box>
            </s-stack>
          )}
        </s-stack>
      </s-form>
    </s-function-settings>
  );
}