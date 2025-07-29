import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

// Use the actual namespace from your app
const METAFIELD_NAMESPACE = "app--269949796353--sku-custom-discount";
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
  const [initialData, setInitialData] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  
  // Access Shopify API from global object
  const { data, applyMetafieldChange, resourcePicker, query } = shopify;

  // Load existing configuration on mount
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // In 2025-10 API, metafields come in an array
      // But on first load, there might be no metafields yet
      let metafield = null;
      
      // Search in metafields array
      if (data?.metafields && data.metafields.length > 0) {
        metafield = data.metafields.find(
          mf => mf.namespace === METAFIELD_NAMESPACE && mf.key === METAFIELD_KEY
        );
      }
      
      if (metafield && metafield.value) {
        try {
          const config = JSON.parse(metafield.value);
          
          // Handle new format with product_details
          if (config.product_details) {
            const loadedProducts = [];
            const variantIdsToRefresh = [];
            
            Object.entries(config.product_details).forEach(([identifier, details]) => {
              // Use variantId as stable ID
              const uniqueId = details.variantId || details.id || `${identifier}_${Date.now()}`;
              const product = {
                id: uniqueId,
                title: details.title || identifier,
                sku: details.sku || '',
                discount: details.value || 0,
                discountType: details.discountType || 'percentage',
                price: details.price || '0.00',
                image: details.image || null,
                variantId: details.variantId,
                productId: details.productId
              };
              
              loadedProducts.push(product);
              
              // Collect variant IDs to refresh SKU data
              if (details.variantId) {
                variantIdsToRefresh.push(details.variantId);
              }
            });
            
            // Refresh product details to get latest SKUs
            if (variantIdsToRefresh.length > 0) {
              const refreshedDetails = await fetchVariantDetails(variantIdsToRefresh);
              
              // Update products with fresh SKU data
              loadedProducts.forEach(product => {
                const freshData = refreshedDetails.find(v => v.id === product.variantId);
                if (freshData) {
                  product.sku = freshData.sku || '';
                  product.price = freshData.price || product.price;
                  product.title = freshData.title === 'Default Title' ? 
                    freshData.product.title : 
                    `${freshData.product.title} - ${freshData.title}`;
                  product.image = freshData.product.featuredImage?.url || product.image;
                }
              });
            }
            
            setProducts(loadedProducts);
            setInitialData(JSON.stringify(loadedProducts));
          }
          // Handle format with sku_discounts
          else if (config.sku_discounts) {
            const loadedProducts = [];
            Object.entries(config.sku_discounts).forEach(([sku, discountInfo]) => {
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
              }
            });
            setProducts(loadedProducts);
            setInitialData(JSON.stringify(loadedProducts));
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

  const handleSubmit = async () => {
    
    if (!validateProducts()) {
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    
    try {
      // Prepare configuration data in the format expected by the discount function
      const sku_discounts = {};
      const product_details = {};
      
      products.forEach((product, index) => {
        // Use variantId as primary stable identifier, fallback to SKU or title
        const identifier = product.variantId || product.sku || product.title || `product_${index}`;
        
        // Format for discount function - use SKU if available for merchant clarity
        const discountKey = product.sku || identifier;
        sku_discounts[discountKey] = {
          discount_type: product.discountType,
          value: parseFloat(product.discount) || 0,
          applies_to_each_item: product.discountType === 'fixedAmount' ? true : undefined
        };
        
        // Save full product details for UI using stable identifier
        product_details[identifier] = {
          id: product.id,
          title: product.title,
          sku: product.sku,
          image: product.image,
          price: product.price,
          value: parseFloat(product.discount) || 0,
          discountType: product.discountType,
          variantId: product.variantId,
          productId: product.productId
        };
      });
      
      const configuration = {
        discount_code: data?.discount?.code || "SKU_DISCOUNT",
        sku_discounts: sku_discounts,
        product_details: product_details
      };



      // Metafield check removed - not needed for updateMetafield

      // Save to metafields - always use updateMetafield for 2025-10 API
      const metafieldChange = {
        type: 'updateMetafield',
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(configuration),
        valueType: 'json'
      };
      
      const result = await applyMetafieldChange(metafieldChange);

      if (result && result.type === 'success') {
        // Update initial data to match current state
        setInitialData(JSON.stringify(products));
        setSuccessMessage('Configuration saved!');
        setValidationErrors([]);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else if (result && result.type === 'error') {
        setValidationErrors([result.message || 'Failed to save configuration']);
      } else {
        setValidationErrors(['Failed to save configuration']);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setValidationErrors(['Failed to save configuration. Please try again.']);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reset products to initial state
    if (initialData) {
      try {
        setProducts(JSON.parse(initialData));
      } catch (e) {
        setProducts([]);
      }
    } else {
      setProducts([]);
    }
    
    // Reset ALL UI states to initial values
    setShowBulkImport(false);
    setBulkImportText('');
    setValidationErrors([]);
    setSuccessMessage('');
    setShowClearConfirm(false);
    // Note: We keep globalDiscountType as is - it's a user preference
  };


  const handleProductSelection = async () => {
    try {
      const selected = await resourcePicker({
        type: 'product',
        multiple: true
      });

      if (selected && selected.length > 0) {
        // Process selected products and their variants
        const newProducts = [];
        
        for (const product of selected) {
          if (product.variants && product.variants.length > 0) {
            // Multiple variants selected - need to fetch full variant details
            const variantIds = product.variants.map(v => v.id);
            const variantDetails = await fetchVariantDetails(variantIds);
            
            // Add each variant with its details
            for (let i = 0; i < variantDetails.length; i++) {
              const variant = variantDetails[i];
              // Price is a scalar string in current API
              const variantPrice = variant.price || '0.00';
              newProducts.push({
                id: variant.id,
                productId: variant.product.id,
                title: variant.title === 'Default Title' ? variant.product.title : `${variant.product.title} - ${variant.title}`,
                image: variant.product.featuredImage?.url,
                sku: variant.sku || '',
                price: variantPrice,
                discount: 0,
                discountType: globalDiscountType,
                variantId: variant.id
              });
            }
          } else {
            // No specific variants, add first variant
            const productIds = [product.id];
            const productDetails = await fetchProductDetails(productIds);
            if (productDetails.length > 0) {
              newProducts.push(...productDetails);
            }
          }
        }
        
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const filtered = newProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...filtered];
        });
      }
    } catch (error) {
      console.error('Error selecting products:', error);
      setValidationErrors(['Failed to select products. Please try again.']);
    }
  };

  const fetchVariantDetails = async (variantIds) => {
    try {
      const graphqlQuery = `
        query GetVariants($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on ProductVariant {
              id
              title
              sku
              price
              product {
                id
                title
                featuredImage {
                  url
                }
              }
            }
          }
        }
      `;

      const result = await query(graphqlQuery, {
        variables: { ids: variantIds }
      });

      if (!result || !result.data || !result.data.nodes) {
        console.error('Invalid variant query result:', result);
        return [];
      }

      // Filter out null nodes
      const validNodes = result.data.nodes.filter(node => node !== null);
      return validNodes;
    } catch (error) {
      console.error('Error fetching variant details:', error);
      return [];
    }
  };

  const fetchProductDetails = async (productIds) => {
    try {
      const graphqlQuery = `
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

      const result = await query(graphqlQuery, {
        variables: { ids: productIds }
      });


      if (!result || !result.data || !result.data.nodes) {
        console.error('Invalid query result:', result);
        return [];
      }

      const mappedProducts = result.data.nodes.map((product, idx) => {
        const firstVariant = product.variants.nodes[0];
        const uniqueId = firstVariant?.id || `${product.id}_${Date.now()}_${idx}`;
        return {
          id: uniqueId,
          productId: product.id,
          title: product.title,
          image: product.featuredImage?.url,
          sku: firstVariant?.sku || '',
          price: firstVariant?.price || '0.00',
          discount: 0,
          discountType: globalDiscountType,
          variantId: firstVariant?.id
        };
      });

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
      // Split by comma, tab, or multiple spaces
      const parts = line.trim().split(/[,\t]|\s{2,}|\s+/);
      if (parts.length >= 2) {
        const sku = parts[0].trim();
        const discountStr = parts[parts.length - 1].trim(); // Take the last part as discount
        
        if (sku && discountStr) {
          const discount = parseFloat(discountStr);
          if (!isNaN(discount)) {
            skuDiscountMap.set(sku, discount);
          }
        }
      }
    });

    if (skuDiscountMap.size > 0) {
      await searchProductsBySKU(Array.from(skuDiscountMap.keys()), skuDiscountMap);
    } else {
      setValidationErrors(['Please enter SKUs in format: SKU discount (e.g., ABC123 10 or ABC123,10)']);
    }

    setShowBulkImport(false);
    setBulkImportText('');
  };

  const searchProductsBySKU = async (skus, skuDiscountMap) => {
    try {
      const graphqlQuery = `
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
      
      const result = await query(graphqlQuery, {
        variables: { query: searchQuery }
      });

      if (!result || !result.data || !result.data.products) {
        setValidationErrors(['Failed to search products. Please try again.']);
        return;
      }

      const matchingProducts = [];
      
      result.data.products.nodes.forEach((product) => {
        product.variants.nodes.forEach((variant, vIdx) => {
          if (variant.sku && skuDiscountMap.has(variant.sku)) {
            // Ensure unique ID using variant ID or fallback
            const uniqueId = variant.id || `${product.id}_v${vIdx}_${Date.now()}`;
            matchingProducts.push({
              id: uniqueId,
              productId: product.id,
              variantId: variant.id,
              title: product.title,
              image: product.featuredImage?.url,
              sku: variant.sku,
              price: variant.price || '0.00',
              discount: skuDiscountMap.get(variant.sku),
              discountType: globalDiscountType
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
        setSuccessMessage(`Imported ${matchingProducts.length} products successfully`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setValidationErrors([`No products found with SKUs: ${skus.join(', ')}`]);
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
    setProducts([]);
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

  const truncateTitle = (title, maxLength = 40) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  };


  if (loading) {
    return (
      <s-box padding="base">
        <s-stack gap="base" alignItems="center">
          <s-spinner size="large" />
          <s-text>Loading configuration...</s-text>
        </s-stack>
      </s-box>
    );
  }

  
  return (
    <s-function-settings onsave={handleSubmit} onreset={handleReset}>
      <s-form>
        <s-stack gap="base">
        
        {/* Compact Header */}
        <s-box padding="tight">
          <s-grid gridTemplateColumns="1fr auto" gap="base" alignItems="center">
            <s-heading size="small">SKU Discount Configuration</s-heading>
            
            {/* Product count on the right - single text field with bold styling */}
            <s-text-field
              name="productCount"
              value={`Total Products: ${products.length}`}
              label="Product tracker"
              labelAccessibilityVisibility="exclusive"
              readOnly
              size="slim"
              style="font-weight: 700; text-align: center; width: 140px;"
            />
          </s-grid>
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
          <s-stack direction="inline" gap="base" alignItems="center">
            <s-button 
              variant="primary" 
              onclick={handleProductSelection}
              disabled={saving}
            >
              Select Products
            </s-button>
            
            <s-button 
              variant="secondary"
              onclick={() => setShowBulkImport(!showBulkImport)}
              disabled={saving}
            >
              Bulk Import
            </s-button>

            {products.length > 0 && (
              <s-button 
                variant="plain"
                tone="critical"
                onclick={clearAll}
                disabled={saving}
              >
                Clear All
              </s-button>
            )}
            
            {/* Spacer */}
            <s-box style="flex-grow: 1;"></s-box>
            
            {/* Default Type Selector */}
            <s-text variant="bodySm" tone="subdued">Default:</s-text>
            <s-button
              variant={globalDiscountType === 'percentage' ? 'primary' : 'secondary'}
              size="slim"
              onclick={() => setGlobalDiscountType('percentage')}
            >
              % off
            </s-button>
            <s-button
              variant={globalDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
              size="slim"
              onclick={() => setGlobalDiscountType('fixedAmount')}
            >
              $ off
            </s-button>
          </s-stack>
        </s-box>

        {/* Clear All Confirmation */}
        {false && showClearConfirm && (
          <s-box padding="tight" background="subdued" borderRadius="base">
            <s-stack gap="tight">
              <s-text variant="bodySm" tone="critical">
                Are you sure you want to remove all products? This cannot be undone.
              </s-text>
              <s-stack direction="inline" gap="tight">
                <s-button 
                  variant="primary" 
                  tone="critical"
                  onclick={confirmClear}
                  size="slim"
                >
                  Yes, Clear All
                </s-button>
                <s-button 
                  variant="secondary"
                  onclick={cancelClear}
                  size="slim"
                >
                  Cancel
                </s-button>
              </s-stack>
            </s-stack>
          </s-box>
        )}

        {/* Bulk Import Section */}
        {showBulkImport && (
          <s-box padding="tight" background="subdued" borderRadius="base">
            <s-stack gap="base">
              <s-text-area
                name="bulkImport"
                label="Bulk Import"
                labelAccessibilityVisibility="exclusive"
                value={bulkImportText}
                oninput={(e) => setBulkImportText(e.target.value)}
                rows="6"
                placeholder={globalDiscountType === 'percentage' ? 
`Paste your data in one of these formats:

Format 1: SKU rate          Format 2: SKU,rate
ABC123 25                   ABC123,25
XYZ789 30                   XYZ789,30
PROD-001 15                 PROD-001,15

✓ Copy directly from Excel, Google Sheets, or CSV files` : 
`Paste your data in one of these formats:

Format 1: SKU amount        Format 2: SKU,amount
ABC123 10.00                ABC123,10.00
XYZ789 15.50                XYZ789,15.50
PROD-001 20.00              PROD-001,20.00

✓ Copy directly from Excel, Google Sheets, or CSV files`}
              />
              <s-box padding-block-start="tight">
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
                      setValidationErrors([]);
                    }}
                  >
                    Cancel
                  </s-button>
                </s-stack>
              </s-box>
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
          <s-stack gap="base">
            {/* Table Header */}
            <s-box padding="large tight" background="strong" borderRadius="base">
              <s-grid gridTemplateColumns="48px 1fr 65px 55px 4px 70px 4px 65px 36px" gap="tight">
                <s-text variant="bodySm" type="strong"></s-text>
                <s-text variant="bodySm" type="strong">Product / SKU</s-text>
                <s-text variant="bodySm" type="strong">Price</s-text>
                <s-text variant="bodySm" type="strong">Type</s-text>
                <s-text variant="bodySm" type="strong"></s-text>
                <s-text variant="bodySm" type="strong">Discount</s-text>
                <s-text variant="bodySm" type="strong"></s-text>
                <s-text variant="bodySm" type="strong">Final</s-text>
                <s-text variant="bodySm" type="strong"></s-text>
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
                  <s-grid gridTemplateColumns="48px 1fr 65px 55px 4px 70px 4px 65px 36px" gap="tight" alignItems="center">
                    {/* Product Thumbnail */}
                    <s-box>
                      {product.image ? (
                        <s-thumbnail
                          alt={product.title}
                          src={product.image}
                          size="small"
                        />
                      ) : (
                        <s-box width="32px" height="32px" background="subdued" border-radius="base" />
                      )}
                    </s-box>
                    
                    {/* Product Info */}
                    <s-box minWidth="0" style="margin-left: 8px;">
                      <s-stack gap="none">
                        <s-text variant="bodySm" fontWeight="medium" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          {truncateTitle(product.title.replace(' - Default Title', ''), 50)}
                        </s-text>
                        {product.sku && (
                          <s-text variant="bodySm" tone="subdued" style="font-size: 11px;">
                            SKU: {product.sku}
                          </s-text>
                        )}
                      </s-stack>
                    </s-box>
                    
                    {/* Original Price */}
                    <s-text variant="bodySm" fontWeight="medium">
                      ${Math.floor(parseFloat(product.price))}
                    </s-text>
                    
                    {/* Discount Type */}
                    <s-select
                      name={`type-${product.id}`}
                      value={product.discountType}
                      onchange={(e) => updateProductType(product.id, e.target.value)}
                      label="Discount type"
                      labelAccessibilityVisibility="exclusive"
                      size="slim"
                    >
                      <s-option value="percentage">%</s-option>
                      <s-option value="fixedAmount">$</s-option>
                    </s-select>
                    
                    {/* Gap */}
                    <s-box></s-box>
                    
                    {/* Discount Value */}
                    <s-text-field
                      name={`discount-${product.id}`}
                      value={product.discount.toString()}
                      oninput={(e) => updateProductDiscount(product.id, e.target.value)}
                      suffix={product.discountType === 'percentage' ? '%' : '$'}
                      type="number"
                      min="0"
                      max={product.discountType === 'percentage' ? "100" : ""}
                      label="Discount value"
                      labelAccessibilityVisibility="exclusive"
                      size="slim"
                    />
                    
                    {/* Gap */}
                    <s-box></s-box>
                    
                    {/* Final Price */}
                    <s-badge size="small" tone="success">
                      ${Math.floor(parseFloat(calculateFinalPrice(product)))}
                    </s-badge>
                    
                    {/* Remove Button */}
                    <s-button 
                      variant="plain" 
                      tone="critical"
                      onclick={() => removeProduct(product.id)}
                      icon="x"
                      accessibilityLabel="Remove product"
                    />
                  </s-grid>
                </s-box>
              ))}
            </s-stack>
          </s-stack>
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