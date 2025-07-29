import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// Main entry point for the extension
export default async () => {
  render(<DiscountFunctionSettings />, document.body);
}

function DiscountFunctionSettings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Load existing configuration on mount
  useEffect(() => {
    // In a real implementation, you would load data from the API
    // For now, using sample data
    setProducts([
      { id: '1', title: 'Sample Product 1', sku: 'SKU-001', price: '29.99', discount: 10, discountType: 'percentage' },
      { id: '2', title: 'Sample Product 2', sku: 'SKU-002', price: '49.99', discount: 5, discountType: 'fixedAmount' },
    ]);
    setLoading(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving configuration:', products);
    // Implement save logic here
  };

  const handleReset = (e) => {
    e.preventDefault();
    console.log('Resetting form');
    // Reset to initial state
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

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.price);
    const discount = parseFloat(product.discount) || 0;
    
    if (product.discountType === 'percentage') {
      return (price * (1 - discount / 100)).toFixed(2);
    } else {
      return Math.max(0, price - discount).toFixed(2);
    }
  };

  if (loading) {
    return <s-text>Loading...</s-text>;
  }

  return (
    <s-function-settings>
      <s-form onsubmit={handleSubmit} onreset={handleReset}>
        <s-stack gap="large">
          {/* Header */}
          <s-section>
            <s-stack gap="base">
              <s-heading>Product SKU Discount Manager</s-heading>
              <s-stack direction="inline" gap="base">
                <s-badge tone="success">{products.length} products configured</s-badge>
                {validationErrors.length > 0 && (
                  <s-badge tone="critical">
                    {validationErrors[0]}
                  </s-badge>
                )}
              </s-stack>
            </s-stack>
          </s-section>

          <s-divider />

          {/* Action Buttons */}
          <s-section>
            <s-stack gap="base">
              <s-stack direction="inline" gap="base">
                <s-button variant="primary">
                  <s-icon name="ProductsMajor" />
                  Select Products
                </s-button>
                
                <s-button 
                  variant="secondary"
                  onclick={() => setShowBulkImport(!showBulkImport)}
                >
                  <s-icon name="ImportMinor" />
                  Bulk Import
                </s-button>
              </s-stack>

              {/* Bulk Import Section */}
              {showBulkImport && (
                <s-box padding="base" border="base" borderRadius="base">
                  <s-stack gap="base">
                    <s-text variant="bodySm">
                      Copy from Excel: First column SKU, second column discount value
                    </s-text>
                    <s-text-area
                      name="bulkImport"
                      value={bulkImportText}
                      oninput={(e) => setBulkImportText(e.target.value)}
                      minRows="6"
                      placeholder="SKU123	35&#10;SKU456	40&#10;SKU789	50"
                    />
                    <s-stack direction="inline" gap="base">
                      <s-button variant="primary">Import</s-button>
                      <s-button variant="plain" onclick={() => setShowBulkImport(false)}>
                        Cancel
                      </s-button>
                    </s-stack>
                  </s-stack>
                </s-box>
              )}
            </s-stack>
          </s-section>

          <s-divider />

          {/* Product Table */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Product List</s-heading>
              
              {products.length === 0 ? (
                <s-banner>
                  <s-text>No products added yet. Use "Select Products" or "Bulk Import" buttons.</s-text>
                </s-banner>
              ) : (
                <s-table variant="auto">
                  <s-table-header-row>
                    <s-table-header listSlot="primary">Product</s-table-header>
                    <s-table-header listSlot="labeled">SKU</s-table-header>
                    <s-table-header listSlot="labeled">Price</s-table-header>
                    <s-table-header listSlot="labeled">Type</s-table-header>
                    <s-table-header listSlot="labeled">Discount</s-table-header>
                    <s-table-header listSlot="secondary">Final Price</s-table-header>
                    <s-table-header>Actions</s-table-header>
                  </s-table-header-row>
                  <s-table-body>
                    {products.map(product => (
                      <s-table-row key={product.id}>
                        <s-table-cell>{product.title}</s-table-cell>
                        <s-table-cell>{product.sku}</s-table-cell>
                        <s-table-cell>
                          <s-badge tone="info">${product.price}</s-badge>
                        </s-table-cell>
                        <s-table-cell>
                          <s-select
                            name={`type-${product.id}`}
                            value={product.discountType}
                            onchange={(e) => updateProductType(product.id, e.target.value)}
                          >
                            <option value="percentage">%</option>
                            <option value="fixedAmount">$</option>
                          </s-select>
                        </s-table-cell>
                        <s-table-cell>
                          <s-number-field
                            name={`discount-${product.id}`}
                            value={product.discount.toString()}
                            defaultValue="0"
                            oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                            prefix={product.discountType === 'fixedAmount' ? '$' : ''}
                            suffix={product.discountType === 'percentage' ? '%' : ''}
                            min="0"
                            max={product.discountType === 'percentage' ? "100" : ""}
                          />
                        </s-table-cell>
                        <s-table-cell>
                          <s-badge tone="success">
                            ${calculateFinalPrice(product)}
                          </s-badge>
                        </s-table-cell>
                        <s-table-cell>
                          <s-button 
                            variant="plain" 
                            tone="critical"
                            onclick={() => removeProduct(product.id)}
                          >
                            <s-icon name="CancelMinor" />
                          </s-button>
                        </s-table-cell>
                      </s-table-row>
                    ))}
                  </s-table-body>
                </s-table>
              )}
            </s-stack>
          </s-section>

          {/* Grid Layout Example */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Summary</s-heading>
              <s-grid gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="base">
                <s-grid-item>
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-stack gap="tight">
                      <s-text variant="bodySm" tone="subdued">Total Products</s-text>
                      <s-text variant="headingMd">{products.length}</s-text>
                    </s-stack>
                  </s-box>
                </s-grid-item>
                <s-grid-item>
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-stack gap="tight">
                      <s-text variant="bodySm" tone="subdued">Average Discount</s-text>
                      <s-text variant="headingMd">
                        {products.length > 0 
                          ? (products.reduce((sum, p) => sum + p.discount, 0) / products.length).toFixed(1) 
                          : 0}%
                      </s-text>
                    </s-stack>
                  </s-box>
                </s-grid-item>
                <s-grid-item gridColumn="span 2">
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-stack gap="tight">
                      <s-text variant="bodySm" tone="subdued">Status</s-text>
                      <s-badge tone="success">Active</s-badge>
                    </s-stack>
                  </s-box>
                </s-grid-item>
              </s-grid>
            </s-stack>
          </s-section>

          {/* Responsive Stack Example */}
          <s-section>
            <s-query-container>
              <s-stack 
                direction="@container (inline-size > 500px) inline, block"
                gap="base"
                alignItems="center"
              >
                <s-text variant="bodySm" tone="subdued">
                  Note: Discounts are applied based on SKU when available.
                </s-text>
                <s-text variant="bodySm" tone="subdued">
                  For best mobile experience, use the Shopify mobile app.
                </s-text>
              </s-stack>
            </s-query-container>
          </s-section>
        </s-stack>
      </s-form>
    </s-function-settings>
  );
}