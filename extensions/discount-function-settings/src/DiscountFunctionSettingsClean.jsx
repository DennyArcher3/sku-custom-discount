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
  const [saving, setSaving] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load existing configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  // Track changes
  useEffect(() => {
    if (!loading && products.length > 0) {
      setIsDirty(true);
    }
  }, [products]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // Access the current discount data and metafields
      const discountData = window.shopify?.data;
      const metafieldValue = discountData?.metafield?.value;
      
      if (metafieldValue) {
        try {
          const config = JSON.parse(metafieldValue);
          if (config.products && Array.isArray(config.products)) {
            setProducts(config.products);
          }
        } catch (e) {
          console.error('Error parsing metafield value:', e);
        }
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
      setIsDirty(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProducts()) {
      return;
    }

    try {
      setSaving(true);
      setSuccessMessage('');
      
      // Prepare configuration data
      const configuration = {
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          sku: p.sku,
          discount: p.discount,
          discountType: p.discountType,
          variants: p.variants || []
        }))
      };

      // Save to metafields
      const result = await window.shopify.applyMetafieldChange({
        type: 'updateMetafield',
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(configuration)
      });

      if (result) {
        setIsDirty(false);
        setSuccessMessage('Configuration saved successfully!');
        setValidationErrors([]);
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setValidationErrors(['Failed to save configuration. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    loadConfiguration();
    setIsDirty(false);
    setValidationErrors([]);
    setSuccessMessage('');
  };

  const handleProductSelection = async () => {
    try {
      const selected = await window.shopify.resourcePicker({
        type: 'product',
        multiple: true,
        variants: false
      });

      if (selected && selected.length > 0) {
        // Fetch full product details with variants
        const productIds = selected.map(p => p.id);
        const productsWithDetails = await fetchProductDetails(productIds);
        
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = productsWithDetails.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
    } catch (error) {
      console.error('Error selecting products:', error);
      setValidationErrors(['Failed to select products. Please try again.']);
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const query = `
        query GetProducts($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              title
              featuredImage {
                url
              }
              variants(first: 100) {
                nodes {
                  id
                  sku
                  price
                  title
                }
              }
            }
          }
        }
      `;

      const result = await window.shopify.query({
        query,
        variables: { ids: productIds }
      });

      return result.data.nodes.map(product => ({
        id: product.id,
        title: product.title,
        image: product.featuredImage?.url,
        sku: product.variants.nodes[0]?.sku || '',
        price: product.variants.nodes[0]?.price || '0.00',
        discount: 0,
        discountType: 'percentage',
        variants: product.variants.nodes
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
      return [];
    }
  };

  const handleBulkImport = async () => {
    const lines = bulkImportText.trim().split('\n');
    const skuDiscountMap = new Map();

    lines.forEach(line => {
      const [sku, discountStr] = line.split(/[,\t]/).map(s => s.trim());
      if (sku && discountStr) {
        const discount = parseFloat(discountStr);
        if (!isNaN(discount)) {
          skuDiscountMap.set(sku, discount);
        }
      }
    });

    if (skuDiscountMap.size > 0) {
      // Search for products by SKU
      await searchProductsBySKU(Array.from(skuDiscountMap.keys()), skuDiscountMap);
    }

    setShowBulkImport(false);
    setBulkImportText('');
  };

  const searchProductsBySKU = async (skus, skuDiscountMap) => {
    try {
      const query = `
        query SearchProductsBySKU($query: String!) {
          products(first: 250, query: $query) {
            nodes {
              id
              title
              featuredImage {
                url
              }
              variants(first: 100) {
                nodes {
                  id
                  sku
                  price
                  title
                }
              }
            }
          }
        }
      `;

      // Create search query for SKUs
      const searchQuery = skus.map(sku => `sku:"${sku}"`).join(' OR ');
      
      const result = await window.shopify.query({
        query,
        variables: { query: searchQuery }
      });

      const matchingProducts = [];
      
      result.data.products.nodes.forEach(product => {
        product.variants.nodes.forEach(variant => {
          if (variant.sku && skuDiscountMap.has(variant.sku)) {
            matchingProducts.push({
              id: product.id,
              title: product.title,
              image: product.featuredImage?.url,
              sku: variant.sku,
              price: variant.price,
              discount: skuDiscountMap.get(variant.sku),
              discountType: 'percentage',
              variantId: variant.id,
              variants: product.variants.nodes
            });
          }
        });
      });

      if (matchingProducts.length > 0) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newProducts = matchingProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...newProducts];
        });
      }
    } catch (error) {
      console.error('Error searching products by SKU:', error);
      setValidationErrors(['Failed to import products. Please check SKUs and try again.']);
    }
  };

  const validateProducts = () => {
    const errors = [];
    
    products.forEach(product => {
      if (product.discount < 0) {
        errors.push(`Invalid discount for ${product.title}`);
      }
      if (product.discountType === 'percentage' && product.discount > 100) {
        errors.push(`Percentage discount cannot exceed 100% for ${product.title}`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
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
    if (confirm('Are you sure you want to remove all products?')) {
      setProducts([]);
    }
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
    return (
      <s-function-settings>
        <s-box padding="base">
          <s-stack gap="base" alignItems="center">
            <s-spinner size="large" />
            <s-text>Loading configuration...</s-text>
          </s-stack>
        </s-box>
      </s-function-settings>
    );
  }

  return (
    <s-function-settings>
      <s-form onsubmit={handleSubmit} onreset={handleReset}>
        <s-stack gap="base">
          {/* Compact Header */}
          <s-box padding="tight">
            <s-stack gap="tight">
              <s-heading size="small">SKU Discount Configuration</s-heading>
              <s-stack direction="inline" gap="tight">
                <s-badge size="small" tone="success">{products.length} products</s-badge>
                {isDirty && <s-badge size="small" tone="warning">Unsaved changes</s-badge>}
                {validationErrors.length > 0 && (
                  <s-badge size="small" tone="critical">{validationErrors.length} errors</s-badge>
                )}
              </s-stack>
            </s-stack>
          </s-box>

          {/* Success Message */}
          {successMessage && (
            <s-banner tone="success">
              {successMessage}
            </s-banner>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <s-banner tone="critical">
              <s-stack gap="tight">
                {validationErrors.map((error, index) => (
                  <s-text key={index} variant="bodySm">{error}</s-text>
                ))}
              </s-stack>
            </s-banner>
          )}

          {/* Action Buttons */}
          <s-box padding="tight">
            <s-stack direction="inline" gap="tight">
              <s-button 
                variant="primary" 
                size="slim"
                onclick={handleProductSelection}
                disabled={saving}
              >
                Select Products
              </s-button>
              
              <s-button 
                variant="secondary"
                size="slim"
                onclick={() => setShowBulkImport(!showBulkImport)}
                disabled={saving}
              >
                Bulk Import
              </s-button>

              {products.length > 0 && (
                <s-button 
                  variant="plain"
                  size="slim"
                  tone="critical"
                  onclick={clearAll}
                  disabled={saving}
                >
                  Clear All
                </s-button>
              )}
            </s-stack>
          </s-box>

          {/* Bulk Import Section */}
          {showBulkImport && (
            <s-box padding="tight" background="subdued" borderRadius="base">
              <s-stack gap="tight">
                <s-text variant="bodySm">Paste SKUs and discounts (SKU,discount)</s-text>
                <s-text-area
                  name="bulkImport"
                  value={bulkImportText}
                  oninput={(e) => setBulkImportText(e.target.value)}
                  minRows="3"
                  size="slim"
                  placeholder="SKU123,35
SKU456,40"
                />
                <s-stack direction="inline" gap="tight">
                  <s-button 
                    variant="primary" 
                    size="slim"
                    onclick={handleBulkImport}
                    disabled={!bulkImportText.trim()}
                  >
                    Import
                  </s-button>
                  <s-button 
                    variant="plain"
                    size="slim"
                    onclick={() => {
                      setShowBulkImport(false);
                      setBulkImportText('');
                    }}
                  >
                    Cancel
                  </s-button>
                </s-stack>
              </s-stack>
            </s-box>
          )}

          {/* Product List */}
          {products.length === 0 ? (
            <s-box padding="base" background="subdued" borderRadius="base">
              <s-text variant="bodySm" tone="subdued">
                No products configured. Use "Select Products" or "Bulk Import" to add products.
              </s-text>
            </s-box>
          ) : (
            <s-box>
              <s-table>
                <s-table-header-row>
                  <s-table-header>Product</s-table-header>
                  <s-table-header>SKU</s-table-header>
                  <s-table-header>Price</s-table-header>
                  <s-table-header>Discount</s-table-header>
                  <s-table-header>Final Price</s-table-header>
                  <s-table-header></s-table-header>
                </s-table-header-row>
                <s-table-body>
                  {products.map((product) => (
                    <s-table-row key={product.id}>
                      <s-table-cell>
                        <s-stack direction="inline" gap="tight" alignItems="center">
                          {product.image && (
                            <s-thumbnail
                              source={product.image}
                              alt={product.title}
                              size="extraSmall"
                            />
                          )}
                          <s-text variant="bodySm" fontWeight="medium" truncate>
                            {product.title}
                          </s-text>
                        </s-stack>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text variant="bodySm" tone="subdued">
                          {product.sku || 'N/A'}
                        </s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-text variant="bodySm">
                          ${product.price}
                        </s-text>
                      </s-table-cell>
                      <s-table-cell>
                        <s-stack direction="inline" gap="tight" alignItems="center">
                          <s-select
                            name={`type-${product.id}`}
                            value={product.discountType}
                            onchange={(e) => updateProductType(product.id, e.target.value)}
                            size="slim"
                            style="width: 60px;"
                          >
                            <option value="percentage">%</option>
                            <option value="fixedAmount">$</option>
                          </s-select>
                          
                          <s-text-field
                            name={`discount-${product.id}`}
                            value={product.discount.toString()}
                            oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                            suffix={product.discountType === 'percentage' ? '%' : ''}
                            size="slim"
                            type="number"
                            min="0"
                            max={product.discountType === 'percentage' ? "100" : ""}
                            style="width: 80px;"
                          />
                        </s-stack>
                      </s-table-cell>
                      <s-table-cell>
                        <s-badge size="small" tone="success">
                          ${calculateFinalPrice(product)}
                        </s-badge>
                      </s-table-cell>
                      <s-table-cell>
                        <s-button 
                          variant="plain" 
                          size="slim"
                          tone="critical"
                          onclick={() => removeProduct(product.id)}
                          icon="CancelMinor"
                        />
                      </s-table-cell>
                    </s-table-row>
                  ))}
                </s-table-body>
              </s-table>
            </s-box>
          )}

          {/* Save Status */}
          {saving && (
            <s-box padding="tight">
              <s-stack direction="inline" gap="tight" alignItems="center">
                <s-spinner size="small" />
                <s-text variant="bodySm">Saving configuration...</s-text>
              </s-stack>
            </s-box>
          )}
        </s-stack>
      </s-form>
    </s-function-settings>
  );
}