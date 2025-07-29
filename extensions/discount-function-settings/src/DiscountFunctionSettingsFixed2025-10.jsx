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
  const [successMessage, setSuccessMessage] = useState('');
  const [initialProducts, setInitialProducts] = useState([]);

  // Load existing configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  // Create serialized string for dirty state tracking
  const createSerializedProducts = (productsObj) => {
    return productsObj
      .map(p => `${p.sku || p.id}:${p.discount}:${p.discountType}`)
      .sort()
      .join('|');
  };

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // Access the current discount data and metafields
      const discountData = window.shopify?.data;
      console.log('Loading discount data:', discountData);
      
      // Look for metafield in the metafields array
      const metafield = discountData?.metafields?.find(
        mf => mf.namespace === METAFIELD_NAMESPACE && mf.key === METAFIELD_KEY
      );
      
      const metafieldValue = metafield?.value;
      console.log('Found metafield:', metafield);
      
      if (metafieldValue) {
        try {
          const config = JSON.parse(metafieldValue);
          console.log('Loaded config:', config);
          
          // Handle new format with product_details
          if (config.product_details) {
            const loadedProducts = [];
            Object.entries(config.product_details).forEach(([identifier, details]) => {
              loadedProducts.push({
                id: details.id || `saved-${identifier}`,
                title: details.title || identifier,
                sku: details.sku || identifier,
                discount: details.value || 0,
                discountType: details.discountType || 'percentage',
                price: details.price || '0.00',
                image: details.image || null,
                variantId: details.variantId,
                productId: details.productId
              });
            });
            setProducts(loadedProducts);
            setInitialProducts(loadedProducts);
          }
          // Handle format with sku_discounts
          else if (config.sku_discounts) {
            const loadedProducts = [];
            Object.entries(config.sku_discounts).forEach(([sku, discountInfo]) => {
              // Handle both old format (number) and new format (object)
              if (typeof discountInfo === 'object') {
                loadedProducts.push({
                  id: `saved-${sku}`,
                  title: `Product: ${sku}`,
                  sku: sku,
                  discount: discountInfo.value || 0,
                  discountType: discountInfo.discount_type || 'percentage',
                  price: '0.00',
                  image: null
                });
              } else {
                // Old format where discountInfo is just a number
                loadedProducts.push({
                  id: `saved-${sku}`,
                  title: `Product: ${sku}`,
                  sku: sku,
                  discount: discountInfo || 0,
                  discountType: 'percentage',
                  price: '0.00',
                  image: null
                });
              }
            });
            setProducts(loadedProducts);
            setInitialProducts(loadedProducts);
          }
          // Handle old format
          else if (config.products && Array.isArray(config.products)) {
            setProducts(config.products);
            setInitialProducts(config.products);
          }
        } catch (e) {
          console.error('Error parsing metafield value:', e);
        }
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (!validateProducts()) {
      return;
    }

    const saveConfiguration = async () => {
      try {
        setSaving(true);
        setSuccessMessage('');
        
        // Prepare configuration data in the format expected by the discount function
        const sku_discounts = {};
        const product_details = {};
        
        products.forEach(product => {
          const identifier = product.sku || product.title || product.id;
          
          // Format for discount function
          sku_discounts[identifier] = {
            discount_type: product.discountType,
            value: product.discount,
            applies_to_each_item: product.discountType === 'fixedAmount' ? true : undefined
          };
          
          // Save full product details for UI
          product_details[identifier] = {
            id: product.id,
            title: product.title,
            sku: product.sku,
            image: product.image,
            price: product.price,
            value: product.discount,
            discountType: product.discountType,
            variantId: product.variantId,
            productId: product.productId
          };
        });
        
        const configuration = {
          discount_code: window.shopify?.data?.discount?.code || "SKU_DISCOUNT",
          sku_discounts: sku_discounts,
          product_details: product_details
        };

        console.log('Saving configuration:', configuration);
        
        // Save to metafields
        const result = await window.shopify.applyMetafieldChange({
          type: 'updateMetafield',
          namespace: METAFIELD_NAMESPACE,
          key: METAFIELD_KEY,
          value: JSON.stringify(configuration),
          valueType: 'json'
        });

        console.log('Save result:', result);

        // Update initial products for dirty state tracking
        setInitialProducts([...products]);
        
        setSuccessMessage('Configuration saved successfully!');
        setValidationErrors([]);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error saving configuration:', error);
        setValidationErrors(['Failed to save configuration. Please try again.']);
      } finally {
        setSaving(false);
      }
    };

    // Use waitUntil to handle async save operation
    e.waitUntil(saveConfiguration());
  };

  const handleReset = () => {
    setProducts([...initialProducts]);
    setValidationErrors([]);
    setSuccessMessage('');
  };

  const handleProductSelection = async () => {
    try {
      console.log('Opening product picker...');
      const selected = await window.shopify.resourcePicker({
        type: 'product',
        multiple: true,
        variants: false
      });

      console.log('Selected products:', selected);

      if (selected && selected.length > 0) {
        // Fetch full product details with variants
        const productIds = selected.map(p => p.id);
        const productsWithDetails = await fetchProductDetails(productIds);
        
        setProducts(prev => {
          const existingSkus = new Set(prev.map(p => p.sku).filter(Boolean));
          const newProducts = productsWithDetails.filter(p => !existingSkus.has(p.sku));
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

      const result = await window.shopify.query(query, {
        variables: { ids: productIds }
      });

      console.log('GraphQL query result:', result);

      if (!result || !result.data || !result.data.nodes) {
        console.error('Invalid query result:', result);
        return [];
      }

      const mappedProducts = result.data.nodes.map(product => ({
        id: product.id,
        productId: product.id,
        title: product.title,
        image: product.featuredImage?.url,
        sku: product.variants.nodes[0]?.sku || '',
        price: product.variants.nodes[0]?.price || '0.00',
        discount: 0,
        discountType: 'percentage',
        variantId: product.variants.nodes[0]?.id
      }));

      return mappedProducts;
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

      const searchQuery = skus.map(sku => `sku:"${sku}"`).join(' OR ');
      
      const result = await window.shopify.query(query, {
        variables: { query: searchQuery }
      });

      const matchingProducts = [];
      
      result.data.products.nodes.forEach(product => {
        product.variants.nodes.forEach(variant => {
          if (variant.sku && skuDiscountMap.has(variant.sku)) {
            matchingProducts.push({
              id: `${product.id}-${variant.id}`,
              productId: product.id,
              variantId: variant.id,
              title: product.title,
              image: product.featuredImage?.url,
              sku: variant.sku,
              price: variant.price,
              discount: skuDiscountMap.get(variant.sku),
              discountType: 'percentage'
            });
          }
        });
      });

      if (matchingProducts.length > 0) {
        setProducts(prev => {
          const existingSkus = new Set(prev.map(p => p.sku).filter(Boolean));
          const newProducts = matchingProducts.filter(p => !existingSkus.has(p.sku));
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

  // Check if form is dirty
  const isDirty = createSerializedProducts(products) !== createSerializedProducts(initialProducts);

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
          {/* Hidden field for dirty state detection */}
          <input 
            type="hidden" 
            name="products_state" 
            value={createSerializedProducts(products)}
            defaultValue={createSerializedProducts(initialProducts)}
          />

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

          {/* Product List - Clean Table Layout */}
          {products.length === 0 ? (
            <s-box padding="base" background="subdued" borderRadius="base">
              <s-text variant="bodySm" tone="subdued">
                No products configured. Use "Select Products" or "Bulk Import" to add products.
              </s-text>
            </s-box>
          ) : (
            <s-box>
              {/* Table Header */}
              <s-box padding="tight" background="subdued" borderRadius="base">
                <s-grid columns="40px 1fr 120px 80px 120px 100px 40px" gap="tight">
                  <s-text variant="bodySm" fontWeight="medium">Image</s-text>
                  <s-text variant="bodySm" fontWeight="medium">Product / SKU</s-text>
                  <s-text variant="bodySm" fontWeight="medium">Original Price</s-text>
                  <s-text variant="bodySm" fontWeight="medium">Type</s-text>
                  <s-text variant="bodySm" fontWeight="medium">Discount</s-text>
                  <s-text variant="bodySm" fontWeight="medium">Final Price</s-text>
                  <s-text variant="bodySm" fontWeight="medium"></s-text>
                </s-grid>
              </s-box>
              
              {/* Table Rows */}
              <s-stack gap="extra-tight">
                {products.map((product, index) => (
                  <s-box 
                    key={product.id}
                    padding="tight" 
                    background={index % 2 === 0 ? "default" : "subdued"}
                    borderRadius="base"
                  >
                    <s-grid columns="40px 1fr 120px 80px 120px 100px 40px" gap="tight" alignItems="center">
                      {/* Product Image */}
                      <s-box>
                        {product.image ? (
                          <s-thumbnail
                            source={product.image}
                            alt={product.title}
                            size="extraSmall"
                          />
                        ) : (
                          <s-box width="32px" height="32px" background="subdued" borderRadius="base" />
                        )}
                      </s-box>
                      
                      {/* Product Info */}
                      <s-box minWidth="0">
                        <s-stack gap="extra-tight">
                          <s-text variant="bodySm" fontWeight="medium" truncate>
                            {product.title}
                          </s-text>
                          <s-text variant="bodySm" tone="subdued">
                            SKU: {product.sku || 'N/A'}
                          </s-text>
                        </s-stack>
                      </s-box>
                      
                      {/* Original Price */}
                      <s-text variant="bodySm" fontWeight="medium">
                        ${product.price}
                      </s-text>
                      
                      {/* Discount Type */}
                      <s-select
                        name={`type-${product.id}`}
                        value={product.discountType}
                        onchange={(e) => updateProductType(product.id, e.target.value)}
                        size="slim"
                      >
                        <option value="percentage">%</option>
                        <option value="fixedAmount">$</option>
                      </s-select>
                      
                      {/* Discount Value */}
                      <s-text-field
                        name={`discount-${product.id}`}
                        value={product.discount.toString()}
                        oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                        suffix={product.discountType === 'percentage' ? '%' : '$'}
                        size="slim"
                        type="number"
                        min="0"
                        max={product.discountType === 'percentage' ? "100" : ""}
                      />
                      
                      {/* Final Price */}
                      <s-badge size="small" tone="success">
                        ${calculateFinalPrice(product)}
                      </s-badge>
                      
                      {/* Remove Button */}
                      <s-button 
                        variant="plain" 
                        size="slim"
                        tone="critical"
                        onclick={() => removeProduct(product.id)}
                        icon="CancelMinor"
                      />
                    </s-grid>
                  </s-box>
                ))}
              </s-stack>
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