import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// Export as a regular function
export default function() {
  render(<DiscountFunctionSettings />, document.body);
}

function DiscountFunctionSettings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [defaultDiscountType, setDefaultDiscountType] = useState('percentage');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  // Load existing configuration from metafields
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // Sample product for demo
      setProducts([{
        id: '1',
        title: 'The Inventory Not Tracked Snowboard',
        sku: 'sku-untracked-1',
        image: '/placeholder-product.jpg',
        price: '950',
        discount: 100,
        discountType: 'percentage'
      }]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading configuration:', error);
      setLoading(false);
    }
  };

  const handleProductSelection = async () => {
    try {
      const selected = await window.shopify.resourcePicker({
        type: 'product',
        multiple: true,
        variants: false
      });

      if (selected && selected.length > 0) {
        const newProducts = selected.map(product => ({
          id: product.id,
          title: product.title,
          sku: product.variants?.[0]?.sku || 'N/A',
          image: product.images?.[0]?.originalSrc || '',
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

  const handleBulkImport = () => {
    // Toggle bulk import visibility
    setShowBulkImport(!showBulkImport);
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

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    
    if (product.discountType === 'percentage') {
      const discountAmount = price * (discount / 100);
      return (price - discountAmount).toFixed(2);
    } else {
      return Math.max(0, price - discount).toFixed(2);
    }
  };

  if (loading) {
    return (
      <s-box padding="tight">
        <s-text>Loading...</s-text>
      </s-box>
    );
  }

  return (
    <s-function-settings>
      <s-form onsubmit={(e) => e.preventDefault()}>
        <s-stack gap="none">
          {/* Collapsible Header */}
          <s-box 
            padding="tight" 
            background="subdued" 
            style="cursor: pointer; user-select: none;"
            onclick={() => setIsExpanded(!isExpanded)}
          >
            <s-stack direction="inline" gap="tight" alignItems="center">
              <s-box style="width: 24px; height: 24px; background: #008060; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                <s-text style="color: white; font-size: 12px; font-weight: bold;">%</s-text>
              </s-box>
              <s-text variant="headingSm" fontWeight="semibold">SKU Discount Settings</s-text>
              <s-box style="transform: rotate(${isExpanded ? '180deg' : '0deg'}); transition: transform 0.2s;">
                <s-icon name="ChevronDownMinor" size="small" />
              </s-box>
            </s-stack>
          </s-box>

          {/* Main Content - Collapsible */}
          {isExpanded && (
            <s-stack gap="tight" style="padding: 12px;">
              {/* Title */}
              <s-heading size="small">Product SKU Discount Manager</s-heading>
              
              {/* Product Count Badge */}
              <s-box>
                <s-badge size="small" tone="success">
                  {products.length} products configured
                </s-badge>
              </s-box>

              {/* Divider */}
              <s-box style="height: 1px; background: #e1e3e5; margin: 8px 0;"></s-box>

              {/* Action Buttons Row */}
              <s-stack direction="inline" gap="tight" alignItems="center">
                <s-button 
                  variant="primary" 
                  size="slim"
                  onclick={handleProductSelection}
                  icon="ProductsMajor"
                >
                  Select Products
                </s-button>
                
                <s-button 
                  variant="secondary"
                  size="slim"
                  onclick={handleBulkImport}
                  icon="ImportMinor"
                >
                  Bulk Import
                </s-button>

                {/* Default Type Toggle */}
                <s-stack direction="inline" gap="extra-tight" alignItems="center">
                  <s-text variant="bodySm">Default:</s-text>
                  <s-button-group variant="segmented">
                    <s-button
                      size="slim"
                      variant={defaultDiscountType === 'percentage' ? 'primary' : 'secondary'}
                      onclick={() => setDefaultDiscountType('percentage')}
                    >
                      % off
                    </s-button>
                    <s-button
                      size="slim"
                      variant={defaultDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                      onclick={() => setDefaultDiscountType('fixedAmount')}
                    >
                      $ off
                    </s-button>
                  </s-button-group>
                </s-stack>
              </s-stack>

              {/* Bulk Import Section */}
              {showBulkImport && (
                <s-box padding="tight" background="subdued" borderRadius="base" style="margin-top: 8px;">
                  <s-stack gap="tight">
                    <s-text variant="bodySm">Paste SKUs and discounts (SKU, discount)</s-text>
                    <s-text-area
                      name="bulkImport"
                      value={bulkImportText}
                      oninput={(e) => setBulkImportText(e.target.value)}
                      minRows="3"
                      size="slim"
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
              <s-stack direction="inline" gap="tight" alignItems="center" style="margin-top: 16px;">
                <s-text variant="headingSm">Product List</s-text>
                {products.length > 0 && (
                  <s-button 
                    variant="plain" 
                    size="slim"
                    tone="critical"
                    onclick={clearAll}
                    icon="DeleteMinor"
                  >
                    Clear All
                  </s-button>
                )}
              </s-stack>

              {/* Products */}
              {products.length === 0 ? (
                <s-box padding="base" background="subdued" borderRadius="base">
                  <s-text variant="bodySm" tone="subdued">
                    No products added yet. Use "Select Products" or "Bulk Import" to add products.
                  </s-text>
                </s-box>
              ) : (
                <s-stack gap="tight">
                  {products.map((product, index) => (
                    <s-box 
                      key={product.id}
                      padding="tight" 
                      background={index % 2 === 0 ? "default" : "subdued"}
                      borderRadius="base"
                      border="base"
                    >
                      <s-stack direction="inline" gap="tight" alignItems="center">
                        {/* Product Image */}
                        <s-thumbnail
                          source={product.image || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png'}
                          alt={product.title}
                          size="extraSmall"
                        />
                        
                        {/* Product Info */}
                        <s-box style="flex: 1;">
                          <s-stack gap="extra-tight">
                            <s-text variant="bodySm" fontWeight="medium">
                              {product.title} • SKU: {product.sku}
                            </s-text>
                            <s-text variant="bodySm" tone="info">
                              ${product.price}
                            </s-text>
                          </s-stack>
                        </s-box>
                        
                        {/* Discount Type Selector */}
                        <s-select
                          name={`type-${product.id}`}
                          value={product.discountType}
                          onchange={(e) => updateProductType(product.id, e.target.value)}
                          size="slim"
                          style="width: 80px;"
                        >
                          <option value="percentage">%</option>
                          <option value="fixedAmount">$</option>
                        </s-select>
                        
                        {/* Discount Input */}
                        <s-box style="width: 120px;">
                          <s-text-field
                            name={`discount-${product.id}`}
                            value={product.discount.toString()}
                            oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                            suffix={product.discountType === 'percentage' ? '%' : ''}
                            size="slim"
                            type="number"
                            min="0"
                            max={product.discountType === 'percentage' ? "100" : ""}
                          />
                        </s-box>
                        
                        {/* Final Price */}
                        <s-box style="text-align: right; min-width: 80px;">
                          <s-badge size="small" tone="critical">
                            -${(parseFloat(product.price) - parseFloat(calculateFinalPrice(product))).toFixed(2)}
                          </s-badge>
                        </s-box>
                        
                        {/* Delete Button */}
                        <s-button 
                          variant="plain" 
                          size="slim"
                          tone="critical"
                          onclick={() => removeProduct(product.id)}
                          icon="CancelMinor"
                        />
                      </s-stack>
                    </s-box>
                  ))}
                </s-stack>
              )}

              {/* Footer Notes */}
              <s-stack gap="extra-tight" style="margin-top: 16px;">
                <s-text variant="bodySm" tone="subdued">
                  Note: Discounts are applied based on SKU when available, otherwise product title.
                </s-text>
                <s-text variant="bodySm" tone="subdued">
                  For best experience on mobile devices, use the Shopify mobile app.
                </s-text>
              </s-stack>
            </s-stack>
          )}
        </s-stack>
      </s-form>
    </s-function-settings>
  );
}