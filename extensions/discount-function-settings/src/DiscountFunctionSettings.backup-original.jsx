import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// The extension should export a default async function
export default async () => {
  render(<App />, document.body);
};

function App() {
  // Access the global shopify object for API methods
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

  // Check and create metafield definition on mount
  useEffect(() => {
    if (query) {
      checkAndCreateMetafieldDefinition();
    }
  }, [query]);

  async function checkAndCreateMetafieldDefinition() {
    try {
      const existingDefinition = await getMetafieldDefinition(query);
      if (!existingDefinition) {
        const metafieldDefinition = await createMetafieldDefinition(query);
        if (!metafieldDefinition) {
          console.error("Failed to create metafield definition");
        }
      }
    } catch (error) {
      console.error("Error setting up metafield definition:", error);
    }
  }

  async function getMetafieldDefinition(adminApiQuery) {
    const queryString = `#graphql
      query GetMetafieldDefinition {
        metafieldDefinitions(first: 1, ownerType: DISCOUNT, namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}") {
          nodes {
            id
          }
        }
      }
    `;

    const result = await adminApiQuery(queryString);
    return result?.data?.metafieldDefinitions?.nodes[0];
  }

  async function createMetafieldDefinition(adminApiQuery) {
    const definition = {
      access: {
        admin: "MERCHANT_READ_WRITE",
      },
      key: METAFIELD_KEY,
      name: "SKU Discount Configuration",
      namespace: METAFIELD_NAMESPACE,
      ownerType: "DISCOUNT",
      type: "json",
    };

    const queryString = `#graphql
      mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = { definition };
    const result = await adminApiQuery(queryString, { variables });
    
    if (result?.data?.metafieldDefinitionCreate?.userErrors?.length > 0) {
      console.error("Metafield creation errors:", result.data.metafieldDefinitionCreate.userErrors);
    }

    return result?.data?.metafieldDefinitionCreate?.createdDefinition;
  }

  // Load existing configuration
  useEffect(() => {
    const metafield = data?.metafield;
    
    if (metafield?.value) {
      try {
        const config = JSON.parse(metafield.value);
        if (config.sku_discounts) {
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
          } else {
            // Fallback to old format
            const convertedProducts = {};
            const skusToSearch = [];
            
            Object.entries(config.sku_discounts).forEach(([sku, value]) => {
              const key = `saved_${sku}`;
              convertedProducts[key] = {
                title: sku,
                sku: sku,
                value: typeof value === 'number' ? value : 0,
                discountType: 'percentage',
                image: null,
                price: null
              };
              skusToSearch.push(sku);
            });
            
            setProducts(convertedProducts);
            setInitialProducts(convertedProducts);
            
            // Try to fetch product details for saved SKUs
            if (query && skusToSearch.length > 0) {
              fetchProductDetails(skusToSearch);
            }
          }
        }
      } catch (e) {
        console.error("Error loading configuration:", e);
      }
    }
  }, [data?.metafield, query]);

  async function fetchProductDetails(skusToSearch) {
    const searchQuery = skusToSearch.map(sku => `sku:"${sku}"`).join(' OR ');
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
    
    try {
      const result = await query(queryString, { variables: { query: searchQuery } });
      if (result?.data?.products?.nodes) {
        setProducts(prev => {
          const updated = { ...prev };
          
          result.data.products.nodes.forEach(product => {
            product.variants?.nodes?.forEach(variant => {
              if (variant.sku) {
                const key = `saved_${variant.sku}`;
                if (updated[key]) {
                  updated[key] = {
                    ...updated[key],
                    id: product.id,
                    title: product.title,
                    image: product.featuredImage?.url || null,
                    price: variant.price,
                  };
                }
              }
            });
          });
          
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }

  // Product picker handler
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
        const duplicateProducts = [];
        const variantIds = [];
        
        selected.forEach(item => {
          if (item.variants && item.variants.length > 0) {
            item.variants.forEach(variant => {
              const key = `variant_${variant.id}`;
              variantIds.push(variant.id);
              
              if (!products[key]) {
                newProducts[key] = {
                  id: variant.id,
                  variantId: variant.id,
                  productId: item.id,
                  title: variant.displayName || variant.title || `${item.title} - Variant`,
                  image: variant.image?.url || item.image?.url || null,
                  sku: variant.sku || '',
                  price: variant.price,
                  value: 0,
                  discountType: globalDiscountType,
                };
              } else {
                duplicateProducts.push(`${item.title} - ${variant.displayName || variant.title}`);
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
            } else {
              duplicateProducts.push(item.title);
            }
          }
        });
        
        if (Object.keys(newProducts).length > 0) {
          setProducts(prev => ({ ...prev, ...newProducts }));
        }
        
        // Fetch additional details for variants
        if (query && variantIds.length > 0) {
          fetchVariantDetails(variantIds);
        }
      }
    } catch (error) {
      console.error("Error selecting products:", error);
    }
  };

  async function fetchVariantDetails(variantIds) {
    const queryString = `
      query getVariantDetails($ids: [ID!]!) {
        nodes(ids: $ids) {
          ... on ProductVariant {
            id
            sku
            price
            displayName
            title
            image {
              url
            }
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
    
    try {
      const result = await query(queryString, { variables: { ids: variantIds } });
      if (result?.data?.nodes) {
        setProducts(prev => {
          const updated = { ...prev };
          result.data.nodes.forEach(variant => {
            if (variant) {
              const key = `variant_${variant.id}`;
              if (updated[key]) {
                updated[key] = {
                  ...updated[key],
                  title: variant.displayName || variant.title || updated[key].title,
                  image: variant.image?.url || variant.product?.featuredImage?.url || updated[key].image,
                  sku: variant.sku || '',
                  price: variant.price || updated[key].price,
                };
              }
            }
          });
          return updated;
        });
      }
    } catch (error) {
      console.error("Error fetching variant details:", error);
    }
  }

  // Process bulk import
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
          errors.push(`Line ${index + 1}: Invalid format. Expected: SKU, Discount%`);
          return;
        }
        
        const sku = parts[0];
        const value = parseFloat(parts[parts.length - 1]);
        
        if (!sku) {
          errors.push(`Line ${index + 1}: Missing SKU`);
        } else if (isNaN(value)) {
          errors.push(`Line ${index + 1}: Invalid discount value`);
        } else if (value < 0) {
          errors.push(`Line ${index + 1}: Discount value cannot be negative`);
        } else if (globalDiscountType === 'percentage' && value > 100) {
          errors.push(`Line ${index + 1}: Percentage discount must be between 0-100%`);
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
      
      setValidationErrors([]);
      
      // Process SKUs in chunks
      const chunkSize = 10;
      const skuChunks = [];
      for (let i = 0; i < validSkus.length; i += chunkSize) {
        skuChunks.push(validSkus.slice(i, i + chunkSize));
      }
      
      const allProducts = [];
      
      for (const chunk of skuChunks) {
        const searchQuery = chunk.map(sku => `sku:"${sku}"`).join(' OR ');
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
        
        try {
          const chunkResult = await query(queryString, { variables: { query: searchQuery } });
          if (chunkResult?.data?.products?.nodes) {
            allProducts.push(...chunkResult.data.products.nodes);
          }
        } catch (chunkError) {
          console.error("Error fetching chunk:", chunkError);
        }
      }
      
      // Process found products
      if (allProducts.length > 0) {
        const newProducts = {};
        const foundSkus = new Set();
        
        allProducts.forEach(product => {
          product.variants?.nodes?.forEach(variant => {
            if (variant.sku) {
              const matchingSku = validSkus.find(validSku => 
                validSku.toLowerCase() === variant.sku.toLowerCase()
              );
              
              if (matchingSku && skuToValueMap[matchingSku] !== undefined) {
                const existingProduct = Object.values(products).find(p => 
                  p.sku && p.sku.toLowerCase() === variant.sku.toLowerCase()
                );
                
                if (!existingProduct) {
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
                }
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
          setValidationErrors([`None of the SKUs were found in your store: ${notFoundSkus.join(', ')}`]);
        }
      }
    } catch (e) {
      console.error("Error processing bulk import:", e);
      setValidationErrors(['Failed to process bulk import']);
    }
  };

  // Update product discount
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
      const limitedValue = Math.min(Math.max(numValue, 0), 100);
      setProducts(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: limitedValue
        }
      }));
    }
  };

  // Remove product
  const removeProduct = (key) => {
    setProducts(prev => {
      const newProducts = { ...prev };
      delete newProducts[key];
      return newProducts;
    });
  };

  // Clear all products
  const clearAll = () => {
    setProducts({});
  };

  // Save configuration
  async function saveMetafieldChanges(event) {
    if (event) {
      event.preventDefault();
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
      
      // Use waitUntil if available
      if (event && event.waitUntil) {
        await event.waitUntil(
          applyMetafieldChange({
            namespace: METAFIELD_NAMESPACE,
            key: METAFIELD_KEY,
            value: JSON.stringify(newConfig),
            type: "json",
          })
        );
      } else {
        await applyMetafieldChange({
          namespace: METAFIELD_NAMESPACE,
          key: METAFIELD_KEY,
          value: JSON.stringify(newConfig),
          type: "json",
        });
      }
      
      setInitialProducts(products);
      // Show success message using banner or other UI element
      setValidationErrors(['Configuration saved successfully']);
      setTimeout(() => setValidationErrors([]), 3000);
    } catch (error) {
      console.error("Error saving metafield:", error);
      
      if (error?.message?.includes("Access to this namespace and key on Metafields") || 
          error?.toString()?.includes("not allowed")) {
        setValidationErrors([
          "⚠️ Shopify Platform Issue: Unable to save configuration due to metafield permissions. This is a known Shopify bug. Workaround: Save the discount without products first, then edit to add products."
        ]);
        setTimeout(() => setValidationErrors([]), 10000);
      } else {
        setValidationErrors(["Failed to save configuration. Please try again."]);
        setTimeout(() => setValidationErrors([]), 5000);
      }
    }
  }

  // Reset form to initial state
  const resetForm = () => {
    setProducts(initialProducts);
    setBulkImportText("");
    setShowBulkImport(false);
    setValidationErrors([]);
  };

  const productEntries = Object.entries(products);
  const totalProducts = productEntries.length;

  if (loading) {
    return (
      <s-admin-block title="Loading...">
        <s-spinner />
        <s-text>{i18n?.translate("loading") || "Loading..."}</s-text>
      </s-admin-block>
    );
  }

  const hasShopifyPlatformError = validationErrors.some(error => 
    error.includes("Shopify Platform Issue")
  );

  return (
    <s-admin-block title="Product SKU Discount Manager">
      <s-form 
        onsubmit={saveMetafieldChanges}
        onreset={resetForm}
      >
        <s-stack  gap="large">
          {/* Platform error banner */}
          {hasShopifyPlatformError && (
            <s-banner tone="critical">
              <s-stack  gap="base">
                <s-text variant="bodyMd" font-weight="bold">Known Shopify Platform Issue</s-text>
                <s-text>Due to a Shopify bug with discount metafields, the configuration cannot be saved directly.</s-text>
                <s-text variant="bodyMd" font-weight="semibold">Workaround:</s-text>
                <s-stack  gap="small-100">
                  <s-text>1. Save this discount without any products</s-text>
                  <s-text>2. After saving, edit the discount again</s-text>
                  <s-text>3. Add your products and save (it usually works on the second attempt)</s-text>
                </s-stack>
              </s-stack>
            </s-banner>
          )}
          
          {/* Header */}
          <s-section>
            <s-stack  gap="base">
              <s-heading level={3}>Product SKU Discount Manager</s-heading>
              <s-stack  gap="base" align="center">
                {totalProducts > 0 && (
                  <s-badge tone="success">{totalProducts} products configured</s-badge>
                )}
                {validationErrors.length > 0 && validationErrors.map((error, index) => {
                  const getTone = () => {
                    if (error.includes("not found")) return "warning";
                    if (error.includes("already in list")) return "info";
                    if (error.includes("Failed") || error.includes("Shopify Platform Issue")) return "critical";
                    if (error.includes("saved successfully")) return "success";
                    return "warning";
                  };
                  
                  return (
                    <div key={index} style={{ display: 'inline-block' }}>
                      <s-badge tone={getTone()}>{error}</s-badge>
                    </div>
                  );
                })}
              </s-stack>
            </s-stack>
          </s-section>

          <s-divider />

          {/* Add Products Section */}
          <s-section>
            <s-stack  gap="large">
              <s-box>
                <s-stack  gap="base" align="center" inline-alignment="space-between">
                  <s-stack  gap="base">
                    <s-button onclick={handleProductPicker} variant="primary">
                      <s-stack  gap="small-100" align="center">
                        <s-icon source="ProductsMajor" />
                        <s-text>Select Products</s-text>
                      </s-stack>
                    </s-button>
                    
                    <s-button onclick={() => setShowBulkImport(!showBulkImport)} variant="secondary">
                      <s-stack  gap="small-100" align="center">
                        <s-icon source="ImportMinor" />
                        <s-text>Bulk Import</s-text>
                      </s-stack>
                    </s-button>
                  </s-stack>
                  
                  <s-stack  gap="large" align="center">
                    <s-stack  gap="base" align="center">
                      <s-text variant="bodySm" tone="subdued">Default:</s-text>
                      <s-stack  gap="base">
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
                    </s-stack>
                  </s-stack>
                </s-stack>
              </s-box>

              {/* Bulk Import */}
{showBulkImport && (
  <s-box padding="base" background="subdued" border="base" border-width="1" border-radius="base">
    <s-stack gap="base">
      <s-text variant="bodySm">
        Copy from Excel: First column SKU, second column discount value ({globalDiscountType === 'percentage' ? 'percentage' : 'dollar amount'})
      </s-text>
      <s-text-field
        label=""
        value={bulkImportText}
        onchange={(e) => setBulkImportText(e.target.value)}
        multiline={6}
        placeholder={
          globalDiscountType === 'percentage'
            ? `SKU123\t35
SKU456\t40
SKU789\t50
ABC-001\t25
XYZ-002\t15

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,35`
            : `SKU123\t10.00
SKU456\t15.50
SKU789\t5.00
ABC-001\t20.00
XYZ-002\t7.99

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,10.00`
        }
      />
      <s-stack gap="base" align="center" inline-alignment="start">
        <s-button
          variant="primary"
          onclick={processBulkImport}
          disabled={!bulkImportText.trim()}
        >
          Import
        </s-button>
        <s-button
          variant="secondary"
          onclick={() => {
            setShowBulkImport(false);
            setValidationErrors([]);
          }}
        >
          Cancel
        </s-button>
      </s-stack>
    </s-stack>
  </s-box>
)}
            </s-stack>
          </s-section>

          <s-divider />

          {/* Product List */}
          <s-section>
            <s-stack  gap="base">
              <s-box>
                <s-stack  align="center">
                  <s-box min-inline-size="fill">
                    <s-text variant="bodyMd" font-weight="semibold">Product List</s-text>
                  </s-box>
                  {totalProducts > 0 && (
                    <s-button 
                      onclick={clearAll} 
                      variant="plain"
                      tone="critical"
                    >
                      <s-stack  gap="small-100" align="center">
                        <s-icon source="DeleteMinor" />
                        <s-text>Clear All</s-text>
                      </s-stack>
                    </s-button>
                  )}
                </s-stack>
              </s-box>
              
              {productEntries.length === 0 ? (
                <s-banner>
                  <s-text>No products added yet. Use "Select Products" or "Bulk Import" buttons.</s-text>
                </s-banner>
              ) : (
                <s-box background="subdued" border="border" border-width="1" border-radius="base">
                  <s-stack  gap="small">
                    {productEntries.map(([key, product], index) => (
                      <div key={key}>
                        <s-box
                          padding="base"
                          border-block-end={index < productEntries.length - 1 ? "divider" : undefined}
                        >
                        <s-stack  gap="base" align="start">
                          {/* Product Image */}
                          <s-box 
                            min-inline-size="64" 
                            min-block-size="64"
                            max-inline-size="64"
                            max-block-size="64"
                            background="subdued"
                            border-radius="base"
                            inline-alignment="center"
                            block-alignment="center"
                            overflow="hidden"
                          >
                            {product.image ? (
                              <s-image 
                                source={product.image} 
                                alt={product.title}
                              />
                            ) : (
                              <s-icon source="ProductsMajor" size="large" />
                            )}
                          </s-box>
                          
                          {/* Product details and controls */}
                          <s-box min-inline-size="fill">
                            <s-stack  gap="small-100">
                              {/* Product title and SKU */}
                              <s-text variant="bodySm" font-weight="semibold">
                                {(() => {
                                  let displayTitle = product.title || '';
                                  displayTitle = displayTitle
                                    .replace(/ - Default Title$/i, '')
                                    .replace(/ - Default$/i, '')
                                    .replace(/ - Title$/i, '');
                                  
                                  if (product.sku) {
                                    return `${displayTitle} • SKU: ${product.sku}`;
                                  }
                                  return displayTitle;
                                })()}
                              </s-text>
                              
                              {/* Controls row */}
                              <s-stack  gap="small-100" align="center" inline-alignment="start">
                                {/* Price */}
                                <s-box min-inline-size="60">
                                  {product.price ? (
                                    <s-badge tone="info">
                                      ${parseFloat(product.price).toFixed(0)}
                                    </s-badge>
                                  ) : (
                                    <s-text variant="bodySm" tone="subdued">—</s-text>
                                  )}
                                </s-box>

                                {/* Type selector */}
                                <s-box min-inline-size="50">
                                  <s-select
                                    label=""
                                    value={product.discountType || 'percentage'}
                                    onchange={(e) => {
                                      setProducts(prev => ({
                                        ...prev,
                                        [key]: { ...prev[key], discountType: e.target.value }
                                      }));
                                    }}
                                  >
                                    <option value="percentage">%</option>
                                    <option value="fixedAmount">$</option>
                                  </s-select>
                                </s-box>

                                {/* Value input */}
                                <s-box min-inline-size="85">
                                  <s-text-field
                                    label=""
                                    type="number"
                                    value={product.value?.toString() || "0"}
                                    onchange={(e) => updateProductValue(key, e.target.value)}
                                    prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                                    suffix={product.discountType === 'percentage' ? "%" : undefined}
                                    min="0"
                                    max={product.discountType === 'percentage' ? "100" : undefined}
                                    step={product.discountType === 'fixedAmount' ? "0.01" : "1"}
                                  />
                                </s-box>

                                {/* Result */}
                                <s-box min-inline-size="70" inline-alignment="center">
                                  {product.price && product.value > 0 ? (
                                    product.discountType === 'percentage' ? (
                                      <s-badge tone="critical">
                                        -${((parseFloat(product.price) * parseFloat(product.value)) / 100).toFixed(2)}
                                      </s-badge>
                                    ) : (
                                      <s-badge tone="success">
                                        ${Math.max(0, parseFloat(product.price) - parseFloat(product.value)).toFixed(2)}
                                      </s-badge>
                                    )
                                  ) : (
                                    <s-text variant="bodySm" tone="subdued">—</s-text>
                                  )}
                                </s-box>

                                {/* Remove */}
                                <s-button
                                  variant="plain"
                                  tone="critical"
                                  onclick={() => removeProduct(key)}
                                  size="slim"
                                >
                                  <s-icon source="CancelMinor" />
                                </s-button>
                              </s-stack>
                            </s-stack>
                          </s-box>
                        </s-stack>
                      </s-box>
                      </div>
                    ))}
                  </s-stack>
                </s-box>
              )}
            </s-stack>
          </s-section>

          <s-box padding="base">
            <s-stack  gap="small-100">
              <s-text tone="subdued" variant="bodySm">
                Note: Discounts are applied based on SKU when available, otherwise product title.
              </s-text>
              <s-text tone="subdued" variant="bodySm">
                For best experience on mobile devices, use the Shopify mobile app.
              </s-text>
            </s-stack>
          </s-box>
          
          {/* Form Actions */}
          <s-stack  gap="base">
            <s-button type="submit" variant="primary">
              Save
            </s-button>
            <s-button type="reset" variant="secondary">
              Reset
            </s-button>
          </s-stack>
        </s-stack>
      </s-form>
    </s-admin-block>
  );
}
// The export default at the top of the file handles registration
