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
  const [eligibility, setEligibility] = useState('all');
  const [defaultDiscountType, setDefaultDiscountType] = useState('percentage');

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
          if (config.eligibility) {
            setEligibility(config.eligibility);
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
      
      // Prepare configuration data
      const configuration = {
        products: products.map(p => ({
          id: p.id,
          title: p.title,
          sku: p.sku,
          discount: p.discount,
          discountType: p.discountType,
          variants: p.variants || []
        })),
        eligibility: eligibility
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
        setValidationErrors([]);
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
        discountType: defaultDiscountType,
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
              discountType: defaultDiscountType,
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
        <s-stack gap="large">
          {/* Header Section */}
          <s-box>
            <s-stack gap="base">
              <s-stack direction="inline" alignItems="center" gap="tight">
                <s-icon source="ProductsMinor" size="base" />
                <s-heading>SKU Discount Settings</s-heading>
              </s-stack>
              
              <s-heading size="large">Product SKU Discount Manager</s-heading>
              
              <s-badge tone="success">
                {products.length} products configured
              </s-badge>
            </s-stack>
          </s-box>

          {/* Action Buttons */}
          <s-box>
            <s-stack direction="inline" gap="base">
              <s-button 
                variant="secondary"
                onclick={handleProductSelection}
                disabled={saving}
                icon="SelectMinor"
              >
                Select Products
              </s-button>
              
              <s-button 
                variant="secondary"
                onclick={() => setShowBulkImport(!showBulkImport)}
                disabled={saving}
                icon="ImportMinor"
              >
                Bulk Import
              </s-button>

              <s-text variant="bodyMd">Default:</s-text>
              
              <s-button 
                variant={defaultDiscountType === 'percentage' ? 'primary' : 'secondary'}
                onclick={() => {
                  setDefaultDiscountType('percentage');
                  // Update all products to percentage
                  setProducts(prev => prev.map(p => ({ ...p, discountType: 'percentage' })));
                }}
                disabled={saving}
              >
                % off
              </s-button>
              
              <s-button 
                variant={defaultDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                onclick={() => {
                  setDefaultDiscountType('fixedAmount');
                  // Update all products to fixed amount
                  setProducts(prev => prev.map(p => ({ ...p, discountType: 'fixedAmount' })));
                }}
                disabled={saving}
              >
                $ off
              </s-button>
            </s-stack>
          </s-box>

          {/* Bulk Import Section */}
          {showBulkImport && (
            <s-box padding="base" background="subdued" borderRadius="base">
              <s-stack gap="base">
                <s-text>Paste SKUs and discounts (SKU,discount)</s-text>
                <s-text-area
                  name="bulkImport"
                  value={bulkImportText}
                  oninput={(e) => setBulkImportText(e.target.value)}
                  minRows="5"
                  placeholder="SKU123,35
SKU456,40"
                />
                <s-stack direction="inline" gap="base">
                  <s-button 
                    variant="primary"
                    onclick={handleBulkImport}
                    disabled={!bulkImportText.trim()}
                  >
                    Import
                  </s-button>
                  <s-button 
                    variant="plain"
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

          {/* Product List Header */}
          {products.length > 0 && (
            <s-box>
              <s-stack direction="inline" gap="base" alignItems="center">
                <s-text variant="headingMd">Product List</s-text>
                <s-button 
                  variant="plain"
                  tone="critical"
                  onclick={clearAll}
                  disabled={saving}
                  icon="CancelMinor"
                >
                  Clear All
                </s-button>
              </s-stack>
            </s-box>
          )}

          {/* Product List */}
          {products.length === 0 ? (
            <s-box padding="large" background="subdued" borderRadius="base">
              <s-text tone="subdued">
                No products configured. Use "Select Products" or "Bulk Import" to add products.
              </s-text>
            </s-box>
          ) : (
            <s-box>
              {products.map((product) => (
                <s-box 
                  key={product.id}
                  padding="base"
                  borderRadius="base"
                  style="border: 1px solid var(--p-color-border); margin-bottom: 12px;"
                >
                  <s-stack direction="inline" gap="base" alignItems="center">
                    {/* Product Image */}
                    {product.image && (
                      <s-thumbnail
                        source={product.image}
                        alt={product.title}
                        size="small"
                      />
                    )}
                    
                    {/* Product Info */}
                    <s-box style="flex: 1;">
                      <s-stack gap="extra-tight">
                        <s-text variant="bodyMd" fontWeight="semibold">
                          {product.title}
                        </s-text>
                        <s-text variant="bodySm" tone="subdued">
                          • SKU: {product.sku || 'N/A'}
                        </s-text>
                      </s-stack>
                    </s-box>
                    
                    {/* Price */}
                    <s-text variant="bodyMd">
                      ${product.price}
                    </s-text>
                    
                    {/* Discount Controls */}
                    <s-stack direction="inline" gap="tight" alignItems="center">
                      <s-select
                        name={`type-${product.id}`}
                        value={product.discountType}
                        onchange={(e) => updateProductType(product.id, e.target.value)}
                      >
                        <option value="percentage">%</option>
                        <option value="fixedAmount">$</option>
                      </s-select>
                      
                      <s-text-field
                        name={`discount-${product.id}`}
                        value={product.discount.toString()}
                        oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                        suffix={product.discountType === 'percentage' ? '%' : ''}
                        type="number"
                        min="0"
                        max={product.discountType === 'percentage' ? "100" : ""}
                        style="width: 120px;"
                      />
                      
                      <s-text variant="bodyMd" tone="critical">
                        -${product.discountType === 'percentage' 
                          ? (parseFloat(product.price) * (product.discount / 100)).toFixed(2)
                          : product.discount.toFixed(2)
                        }
                      </s-text>
                      
                      <s-text variant="bodyMd" fontWeight="semibold">
                        ${calculateFinalPrice(product)}
                      </s-text>
                      
                      <s-button 
                        variant="plain"
                        tone="critical"
                        onclick={() => removeProduct(product.id)}
                        icon="CancelMinor"
                      />
                    </s-stack>
                  </s-stack>
                </s-box>
              ))}
            </s-box>
          )}

          {/* Note */}
          <s-box padding="base" background="subdued" borderRadius="base">
            <s-text variant="bodySm">
              Note: Discounts are applied based on SKU when available, otherwise product title.
              For best experience on mobile devices, use the Shopify mobile app.
            </s-text>
          </s-box>

          {/* Eligibility Section */}
          <s-box>
            <s-stack gap="base">
              <s-heading size="medium">Eligibility</s-heading>
              <s-text variant="bodySm" tone="subdued">
                Available on all sales channels
              </s-text>
              
              <s-stack gap="tight">
                <s-choice-list
                  name="eligibility"
                  value={eligibility}
                  onchange={(e) => setEligibility(e.target.value)}
                >
                  <s-choice label="All customers" value="all" />
                  <s-choice label="Specific customer segments" value="segments" />
                  <s-choice label="Specific customers" value="customers" />
                </s-choice-list>
              </s-stack>
            </s-stack>
          </s-box>

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

          {/* Save Status */}
          {saving && (
            <s-box padding="base">
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