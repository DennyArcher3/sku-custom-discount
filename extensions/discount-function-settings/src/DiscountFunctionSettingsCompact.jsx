import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

export default async () => {
  render(<App />, document.body);
};

function App() {
  const shopify = window.shopify || {};
  const {
    applyMetafieldChange,
    i18n,
    data,
    loading,
    resourcePicker,
    query,
  } = shopify;

  const [products, setProducts] = useState({});
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [initialProducts, setInitialProducts] = useState({});
  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  const [expandedProductId, setExpandedProductId] = useState(null);

  // Load existing configuration
  useEffect(() => {
    const metafields = data?.metafields || [];
    const metafield = metafields.find(mf => mf.key === METAFIELD_KEY);
    
    if (metafield?.value) {
      try {
        const config = JSON.parse(metafield.value);
        if (config.product_details) {
          const convertedProducts = {};
          Object.entries(config.product_details).forEach(([identifier, details]) => {
            const key = `saved_${identifier}`;
            convertedProducts[key] = {
              ...details,
              value: typeof details.value === 'number' ? details.value : 0,
              discountType: details.discountType || 'percentage'
            };
          });
          setProducts(convertedProducts);
          setInitialProducts(convertedProducts);
        }
      } catch (e) {
        console.error("Error loading configuration:", e);
      }
    }
  }, [data?.metafields]);

  const handleProductPicker = async () => {
    try {
      const selected = await resourcePicker({
        type: 'product',
        multiple: true,
        action: 'select',
        selectionIds: [],
        options: {
          selectMultipleVariants: true,
          showVariants: true
        }
      });
      
      if (selected && selected.length > 0) {
        const newProducts = {};
        
        selected.forEach(item => {
          if (item.variants && item.variants.length > 0) {
            item.variants.forEach(variant => {
              const key = `variant_${variant.id}`;
              
              if (!products[key]) {
                newProducts[key] = {
                  id: variant.id,
                  variantId: variant.id,
                  productId: item.id,
                  title: variant.displayName || variant.title || `${item.title}`,
                  image: variant.image?.url || item.image?.url || null,
                  sku: variant.sku || '',
                  price: variant.price,
                  value: 0,
                  discountType: globalDiscountType,
                };
              }
            });
          } else {
            const key = `product_${item.id}`;
            if (!products[key]) {
              newProducts[key] = {
                id: item.id,
                productId: item.id,
                title: item.title,
                image: item.image?.url || null,
                sku: '',
                price: item.priceRange?.minVariantPrice?.amount || null,
                value: 0,
                discountType: globalDiscountType,
              };
            }
          }
        });
        
        if (Object.keys(newProducts).length > 0) {
          setProducts(prev => ({ ...prev, ...newProducts }));
        }
      }
    } catch (error) {
      console.error("Error selecting products:", error);
    }
  };

  const processBulkImport = async () => {
    try {
      setValidationErrors([]);
      
      const lines = bulkImportText.trim().split('\n');
      const skuToValueMap = {};
      const validSkus = [];
      const errors = [];
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        const parts = trimmed.split(/[\t,:\s]+/).filter(p => p);
        
        if (parts.length < 2) {
          errors.push(`Line ${index + 1}: Invalid format`);
          return;
        }
        
        const sku = parts[0];
        const value = parseFloat(parts[parts.length - 1]);
        
        if (!sku) {
          errors.push(`Line ${index + 1}: Missing SKU`);
        } else if (isNaN(value)) {
          errors.push(`Line ${index + 1}: Invalid discount value`);
        } else if (value < 0) {
          errors.push(`Line ${index + 1}: Discount cannot be negative`);
        } else if (globalDiscountType === 'percentage' && value > 100) {
          errors.push(`Line ${index + 1}: Percentage must be 0-100`);
        } else {
          skuToValueMap[sku] = value;
          validSkus.push(sku);
        }
      });
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }
      
      if (validSkus.length === 0) {
        setValidationErrors(['No valid SKU-value pairs found']);
        return;
      }
      
      // Search for products by SKU
      const searchQuery = validSkus.map(sku => `sku:"${sku}"`).join(' OR ');
      const queryString = `
        query searchProductsBySku($query: String!) {
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
                }
              }
            }
          }
        }
      `;
      
      const result = await query(queryString, { variables: { query: searchQuery } });
      
      if (result?.data?.products?.nodes) {
        const newProducts = {};
        const foundSkus = new Set();
        
        result.data.products.nodes.forEach(product => {
          product.variants?.nodes?.forEach(variant => {
            if (variant.sku) {
              const matchingSku = validSkus.find(validSku => 
                validSku.toLowerCase() === variant.sku.toLowerCase()
              );
              
              if (matchingSku && skuToValueMap[matchingSku] !== undefined) {
                const key = `sku_${matchingSku}`;
                newProducts[key] = {
                  id: product.id,
                  title: product.title,
                  image: product.featuredImage?.url || null,
                  sku: variant.sku,
                  price: variant.price,
                  value: skuToValueMap[matchingSku],
                  discountType: globalDiscountType,
                };
                foundSkus.add(matchingSku);
              }
            }
          });
        });
        
        const notFoundSkus = validSkus.filter(sku => !foundSkus.has(sku));
        
        if (Object.keys(newProducts).length > 0) {
          setProducts(prev => ({ ...prev, ...newProducts }));
          setBulkImportText("");
          setShowBulkImport(false);
          
          if (notFoundSkus.length > 0) {
            setValidationErrors([`SKUs not found: ${notFoundSkus.join(', ')}`]);
            setTimeout(() => setValidationErrors([]), 5000);
          }
        } else if (notFoundSkus.length > 0) {
          setValidationErrors([`No SKUs found: ${notFoundSkus.join(', ')}`]);
        }
      }
    } catch (e) {
      console.error("Error processing bulk import:", e);
      setValidationErrors(['Failed to process bulk import']);
    }
  };

  const updateProductValue = (key, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    if (cleanValue === '' || cleanValue === '.') {
      setProducts(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: 0
        }
      }));
      return;
    }
    
    const numValue = parseFloat(cleanValue);
    
    if (!isNaN(numValue)) {
      const limitedValue = products[key].discountType === 'percentage' 
        ? Math.min(Math.max(numValue, 0), 100)
        : Math.max(numValue, 0);
      setProducts(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: limitedValue
        }
      }));
    }
  };

  const removeProduct = (key) => {
    setProducts(prev => {
      const newProducts = { ...prev };
      delete newProducts[key];
      return newProducts;
    });
  };

  const clearAll = () => {
    setProducts({});
  };

  async function saveMetafieldChanges(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      const formattedDiscounts = {};
      const productDetails = {};
      
      Object.entries(products).forEach(([key, product]) => {
        const identifier = product.sku || product.title || key;
        
        formattedDiscounts[identifier] = {
          discount_type: product.discountType || 'percentage',
          value: parseFloat(product.value) || 0,
          applies_to_each_item: product.discountType === 'fixedAmount' ? true : undefined
        };
        
        productDetails[identifier] = {
          title: product.title,
          sku: product.sku,
          image: product.image,
          price: product.price,
          value: parseFloat(product.value) || 0,
          discountType: product.discountType || 'percentage',
          id: product.id,
          variantId: product.variantId,
          productId: product.productId
        };
      });
      
      const newConfig = {
        discount_code: data?.discount?.code || "DISCOUNT",
        sku_discounts: formattedDiscounts,
        product_details: productDetails
      };
      
      await applyMetafieldChange({
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(newConfig),
        type: "json",
      });
      
      setInitialProducts(products);
    } catch (error) {
      console.error("Error saving metafield:", error);
      setValidationErrors(["Failed to save. Please try again."]);
      setTimeout(() => setValidationErrors([]), 5000);
    }
  }

  const resetForm = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setProducts(initialProducts);
    setBulkImportText("");
    setShowBulkImport(false);
    setValidationErrors([]);
  };

  const productEntries = Object.entries(products);
  const totalProducts = productEntries.length;

  // Auto-save when products change
  useEffect(() => {
    const hasChanges = JSON.stringify(products) !== JSON.stringify(initialProducts);
    if (hasChanges && Object.keys(products).length > 0) {
      const saveTimer = setTimeout(() => {
        saveMetafieldChanges();
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(saveTimer);
    }
  }, [products]);

  if (loading) {
    return (
      <s-box padding="base">
        <s-stack direction="block" gap="base" block-alignment="center" inline-alignment="center">
          <s-spinner />
          <s-text>{i18n?.translate("loading") || "Loading..."}</s-text>
        </s-stack>
      </s-box>
    );
  }

  return (
    <s-function-settings>
      <s-form onsubmit={(e) => { e.preventDefault(); saveMetafieldChanges(e); }} onreset={resetForm}>
        <s-stack direction="block" gap="none">
        
        {/* Compact Header */}
        <s-box padding="base" background="subdued">
          <s-stack direction="inline" gap="base" inline-alignment="space-between" block-alignment="center">
            <s-stack direction="block" gap="extra-tight">
              <s-text variant="headingMd" font-weight="semibold">Product SKU Discount Manager</s-text>
              {totalProducts > 0 && (
                <s-badge tone="success">{totalProducts} products configured</s-badge>
              )}
            </s-stack>
          </s-stack>
        </s-box>

        {/* Error Messages */}
        {validationErrors.length > 0 && (
          <s-box padding="base" background="critical-subdued">
            <s-stack direction="block" gap="extra-tight">
              {validationErrors.map((error, index) => (
                <s-text key={index} variant="bodySm" tone="critical">{error}</s-text>
              ))}
            </s-stack>
          </s-box>
        )}

        {/* Action Bar */}
        <s-box padding="base" border-block-end="divider">
          <s-stack direction="inline" gap="base" inline-alignment="space-between" block-alignment="center">
            <s-stack direction="inline" gap="tight">
              <s-button onclick={handleProductPicker} variant="primary" size="slim">
                <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                  <s-icon source="ProductsMajor" size="small" />
                  <s-text>Select Products</s-text>
                </s-stack>
              </s-button>
              <s-button onclick={() => setShowBulkImport(!showBulkImport)} variant="secondary" size="slim">
                <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                  <s-icon source="ImportMinor" size="small" />
                  <s-text>Bulk Import</s-text>
                </s-stack>
              </s-button>
            </s-stack>
            
            <s-stack direction="inline" gap="tight" block-alignment="center">
              <s-text variant="bodySm" tone="subdued">Default:</s-text>
              <s-button-group variant="segmented">
                <s-button
                  size="slim"
                  variant={globalDiscountType === 'percentage' ? 'primary' : 'secondary'}
                  onclick={() => setGlobalDiscountType('percentage')}
                >
                  % off
                </s-button>
                <s-button
                  size="slim"
                  variant={globalDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                  onclick={() => setGlobalDiscountType('fixedAmount')}
                >
                  $ off
                </s-button>
              </s-button-group>
            </s-stack>
          </s-stack>
        </s-box>

        {/* Bulk Import Section */}
        {showBulkImport && (
          <s-box padding="base" background="subdued" border-block-end="divider">
            <s-stack direction="block" gap="tight">
              <s-text variant="bodySm" font-weight="semibold">Paste SKUs and discounts (SKU, {globalDiscountType === 'percentage' ? '%' : '$'})</s-text>
              <s-text-field
                label=""
                value={bulkImportText}
                onchange={(e) => setBulkImportText(e.target.value)}
                multiline={3}
                placeholder={globalDiscountType === 'percentage' ? "SKU123, 35\nSKU456, 40" : "SKU123, 10.00\nSKU456, 15.50"}
              />
              <s-stack direction="inline" gap="tight">
                <s-button
                  size="slim"
                  variant="primary"
                  onclick={processBulkImport}
                  disabled={!bulkImportText.trim()}
                >
                  Import
                </s-button>
                <s-button
                  size="slim"
                  variant="plain"
                  onclick={() => {
                    setShowBulkImport(false);
                    setBulkImportText("");
                    setValidationErrors([]);
                  }}
                >
                  Cancel
                </s-button>
              </s-stack>
            </s-stack>
          </s-box>
        )}

        {/* Product List Header */}
        <s-box padding="base" padding-block-end="extra-tight">
          <s-stack direction="inline" inline-alignment="space-between" block-alignment="center">
            <s-text variant="bodySm" font-weight="semibold">Product List</s-text>
            {totalProducts > 0 && (
              <s-button 
                size="slim"
                onclick={clearAll} 
                variant="plain"
                tone="critical"
              >
                <s-stack direction="inline" gap="extra-tight" block-alignment="center">
                  <s-icon source="DeleteMinor" size="small" />
                  <s-text>Clear All</s-text>
                </s-stack>
              </s-button>
            )}
          </s-stack>
        </s-box>

        {/* Product List */}
        <s-box padding-inline="base" padding-block-end="base">
          {productEntries.length === 0 ? (
            <s-box padding="large" background="subdued" border-radius="base">
              <s-stack direction="block" gap="tight" block-alignment="center" inline-alignment="center">
                <s-icon source="ProductsMajor" size="large" tone="subdued" />
                <s-text variant="bodySm" tone="subdued" alignment="center">
                  No products added yet. Use "Select Products" or "Bulk Import" to add products.
                </s-text>
              </s-stack>
            </s-box>
          ) : (
            <s-stack direction="block" gap="extra-tight">
              {productEntries.map(([key, product], index) => (
                <s-box
                  key={key}
                  padding="tight"
                  background={index % 2 === 0 ? "transparent" : "subdued"}
                  border-radius="base"
                >
                  <s-stack direction="inline" gap="tight" block-alignment="center">
                    {/* Product Image */}
                    <s-box min-inline-size="48px" max-inline-size="48px">
                      <s-thumbnail 
                        size="small"
                        source={product.image || ''}
                        alt={product.title}
                      />
                    </s-box>
                    
                    {/* Product Info - Expandable */}
                    <s-box min-inline-size="0" style="flex: 1">
                      <s-stack direction="block" gap="extra-tight">
                        <s-text variant="bodySm" font-weight="semibold" truncate>
                          {product.title?.replace(/ - Default Title$/i, '')}
                        </s-text>
                        {product.sku && (
                          <s-text variant="bodySm" tone="subdued">
                            SKU: {product.sku}
                          </s-text>
                        )}
                      </s-stack>
                    </s-box>
                    
                    {/* Price */}
                    {product.price && (
                      <s-badge tone="info" size="small">
                        ${parseFloat(product.price).toFixed(2)}
                      </s-badge>
                    )}
                    
                    {/* Discount Type Selector */}
                    <s-select
                      label=""
                      value={product.discountType || 'percentage'}
                      onchange={(e) => {
                        setProducts(prev => ({
                          ...prev,
                          [key]: { ...prev[key], discountType: e.target.value }
                        }));
                      }}
                      size="slim"
                    >
                      <option value="percentage">%</option>
                      <option value="fixedAmount">$</option>
                    </s-select>
                    
                    {/* Discount Value Input */}
                    <s-box min-inline-size="100px" max-inline-size="100px">
                      <s-text-field
                        label=""
                        type="number"
                        value={product.value?.toString() || "0"}
                        onchange={(e) => updateProductValue(key, e.target.value)}
                        suffix={product.discountType === 'percentage' ? "%" : undefined}
                        min="0"
                        max={product.discountType === 'percentage' ? "100" : undefined}
                        step={product.discountType === 'fixedAmount' ? "0.01" : "1"}
                        size="slim"
                      />
                    </s-box>
                    
                    {/* Calculated Discount */}
                    {product.price && product.value > 0 && (
                      <s-badge 
                        tone="critical" 
                        size="small"
                      >
                        -{product.discountType === 'percentage' 
                          ? `$${((parseFloat(product.price) * parseFloat(product.value)) / 100).toFixed(2)}`
                          : `$${parseFloat(product.value).toFixed(2)}`}
                      </s-badge>
                    )}
                    
                    {/* Remove Button */}
                    <s-button
                      size="slim"
                      variant="plain"
                      tone="critical"
                      onclick={() => removeProduct(key)}
                      accessibilityLabel={`Remove ${product.title}`}
                    >
                      <s-icon source="CancelMinor" size="small" />
                    </s-button>
                  </s-stack>
                </s-box>
              ))}
            </s-stack>
          )}
        </s-box>

        {/* Footer Note */}
        <s-box padding="base" padding-block-start="extra-tight" padding-block-end="extra-tight">
          <s-text variant="bodySm" tone="subdued">
            Note: Discounts are applied based on SKU when available, otherwise product title.
          </s-text>
          <s-text variant="bodySm" tone="subdued">
            For best experience on mobile devices, use the Shopify mobile app.
          </s-text>
        </s-box>
        </s-stack>
      </s-form>
    </s-function-settings>
  );
}