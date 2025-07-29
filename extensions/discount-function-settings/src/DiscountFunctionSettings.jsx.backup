import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import './polaris-web-components.d.ts';

const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

export default async () => {
  render(<App />, document.body);
};

function App() {
  // Access the global shopify object
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
    const metafields = data?.metafields || [];
    const metafield = metafields.find(
      (mf) => mf.key === METAFIELD_KEY
    );
    
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
            
            if (query && skusToSearch.length > 0) {
              fetchProductDetails(skusToSearch);
            }
          }
        }
      } catch (e) {
        console.error("Error loading configuration:", e);
      }
    }
  }, [data?.metafields, query]);

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
      <s-card>
        <s-box padding="large">
          <s-stack direction="block" gap="base" block-alignment="center" inline-alignment="center">
            <s-spinner />
            <s-text>{i18n?.translate("loading") || "Loading..."}</s-text>
          </s-stack>
        </s-box>
      </s-card>
    );
  }

  const hasShopifyPlatformError = validationErrors.some(error => 
    error.includes("Shopify Platform Issue")
  );

  return (
    <s-box padding="base">
      <s-form onsubmit={saveMetafieldChanges} onreset={resetForm}>
        <s-stack direction="block" gap="large">
          
          {/* Platform error banner */}
          {hasShopifyPlatformError && (
            <s-banner tone="critical">
              <s-stack direction="block" gap="base">
                <s-text variant="headingMd">Known Shopify Platform Issue</s-text>
                <s-text>Due to a Shopify bug with discount metafields, the configuration cannot be saved directly.</s-text>
                <s-text variant="headingSm">Workaround:</s-text>
                <s-stack direction="block" gap="small-100">
                  <s-text>1. Save this discount without any products</s-text>
                  <s-text>2. After saving, edit the discount again</s-text>
                  <s-text>3. Add your products and save (it usually works on the second attempt)</s-text>
                </s-stack>
              </s-stack>
            </s-banner>
          )}
          
          {/* Header Card */}
          <s-card>
            <s-box padding="large">
              <s-stack direction="inline" gap="base" inline-alignment="space-between" block-alignment="center">
                <s-stack direction="block" gap="small-100">
                  <s-text variant="headingLg">Product SKU Discount Manager</s-text>
                  {totalProducts > 0 && (
                    <s-badge tone="success">{totalProducts} products configured</s-badge>
                  )}
                </s-stack>
                {validationErrors.length > 0 && !hasShopifyPlatformError && (
                  <s-stack direction="inline" gap="small-100">
                    {validationErrors.map((error) => {
                      let tone = "info";
                      if (error.includes("not found")) tone = "warning";
                      else if (error.includes("Failed")) tone = "critical";
                      else if (error.includes("successfully")) tone = "success";
                      
                      return <s-badge tone={tone}>{error}</s-badge>;
                    })}
                  </s-stack>
                )}
              </s-stack>
            </s-box>
          </s-card>

          {/* Actions Card */}
          <s-card>
            <s-box padding="large">
              <s-stack direction="inline" gap="base" inline-alignment="space-between" block-alignment="center">
                <s-stack direction="inline" gap="base">
                  <s-button onclick={handleProductPicker} variant="primary" icon="ProductsMajor">
                    Select Products
                  </s-button>
                  <s-button onclick={() => setShowBulkImport(!showBulkImport)} variant="secondary" icon="ImportMinor">
                    Bulk Import
                  </s-button>
                </s-stack>
                
                <s-stack direction="inline" gap="base" block-alignment="center">
                  <s-text variant="bodyMd" tone="subdued">Default:</s-text>
                  <s-stack gap="small-100">
                    <s-button
                      variant={globalDiscountType === 'percentage' ? 'primary' : 'secondary'}
                      onclick={() => setGlobalDiscountType('percentage')}
                    >
                      % off
                    </s-button>
                    <s-button
                      variant={globalDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                      onclick={() => setGlobalDiscountType('fixedAmount')}
                    >
                      $ off
                    </s-button>
                  </s-stack>
                </s-stack>
              </s-stack>
            </s-box>
          </s-card>

          {/* Bulk Import Section */}
          {showBulkImport && (
            <s-card>
              <s-box padding="large">
                <s-stack direction="block" gap="base">
                  <s-text variant="headingSm">Bulk Import Products</s-text>
                  <s-text variant="bodyMd" tone="subdued">
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

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,35`
                        : `SKU123\t10.00
SKU456\t15.50
SKU789\t5.00

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,10.00`
                    }
                  />
                  <s-stack direction="inline" gap="base">
                    <s-button
                      variant="primary"
                      onclick={processBulkImport}
                      disabled={!bulkImportText.trim()}
                    >
                      Import
                    </s-button>
                    <s-button
                      variant="plain"
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
            </s-card>
          )}

          {/* Product List Card */}
          <s-card>
            <s-box padding="large">
              <s-stack direction="block" gap="base">
                <s-stack direction="inline" inline-alignment="space-between" block-alignment="center">
                  <s-text variant="headingSm">Product List</s-text>
                  {totalProducts > 0 && (
                    <s-button 
                      onclick={clearAll} 
                      variant="plain"
                      tone="critical"
                      icon="DeleteMinor"
                    >
                      Clear All
                    </s-button>
                  )}
                </s-stack>
                
                {productEntries.length === 0 ? (
                  <s-box padding="extra-large" background="subdued" border-radius="base">
                    <s-stack direction="block" gap="base" block-alignment="center" inline-alignment="center">
                      <s-icon source="ProductsMajor" size="large" tone="subdued" />
                      <s-text tone="subdued">No products added yet. Use "Select Products" or "Bulk Import" to add products.</s-text>
                    </s-stack>
                  </s-box>
                ) : (
                  <s-stack direction="block" gap="none">
                    {/* Table Header */}
                    <s-box 
                      padding="base" 
                      background="subdued"
                      border="divider"
                      border-width="1"
                      border-radius-end-start="base"
                      border-radius-end-end="base"
                    >
                      <s-grid 
                        columns="auto 1fr auto auto auto auto auto"
                        column-gap="base"
                        block-alignment="center"
                      >
                        <s-box min-inline-size="64">
                          <s-text variant="bodySm" font-weight="semibold">Image</s-text>
                        </s-box>
                        <s-text variant="bodySm" font-weight="semibold">Product / SKU</s-text>
                        <s-box min-inline-size="80">
                          <s-text variant="bodySm" font-weight="semibold">Price</s-text>
                        </s-box>
                        <s-box min-inline-size="80">
                          <s-text variant="bodySm" font-weight="semibold">Type</s-text>
                        </s-box>
                        <s-box min-inline-size="100">
                          <s-text variant="bodySm" font-weight="semibold">Discount</s-text>
                        </s-box>
                        <s-box min-inline-size="80">
                          <s-text variant="bodySm" font-weight="semibold">Amount</s-text>
                        </s-box>
                        <s-box min-inline-size="40"></s-box>
                      </s-grid>
                    </s-box>
                    
                    {/* Product Rows */}
                    <s-box 
                      border="divider" 
                      border-width="1" 
                      border-block-start="none"
                      border-radius-start-start="base"
                      border-radius-start-end="base"
                    >
                      {productEntries.map(([key, product], index) => (
                        <s-box
                          padding="base"
                          border-block-end={index < productEntries.length - 1 ? "divider" : "none"}
                        >
                          <s-grid 
                            columns="auto 1fr auto auto auto auto auto"
                            column-gap="base"
                            block-alignment="center"
                          >
                            {/* Product Image */}
                            <s-thumbnail 
                              size="medium"
                              source={product.image || ''}
                              alt={product.title}
                            />
                            
                            {/* Product Info */}
                            <s-stack direction="block" gap="extra-tight">
                              <s-text variant="bodyMd" font-weight="semibold">
                                {(() => {
                                  let displayTitle = product.title || '';
                                  return displayTitle
                                    .replace(/ - Default Title$/i, '')
                                    .replace(/ - Default$/i, '')
                                    .replace(/ - Title$/i, '');
                                })()}
                              </s-text>
                              {product.sku && (
                                <s-text variant="bodySm" tone="subdued">
                                  SKU: {product.sku}
                                </s-text>
                              )}
                            </s-stack>
                            
                            {/* Price */}
                            <s-box min-inline-size="80">
                              {product.price ? (
                                <s-badge tone="info">
                                  ${parseFloat(product.price).toFixed(2)}
                                </s-badge>
                              ) : (
                                <s-text variant="bodyMd" tone="subdued">—</s-text>
                              )}
                            </s-box>
                            
                            {/* Discount Type */}
                            <s-box min-inline-size="80">
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
                                <option value="percentage">% off</option>
                                <option value="fixedAmount">$ off</option>
                              </s-select>
                            </s-box>
                            
                            {/* Discount Value */}
                            <s-box min-inline-size="100">
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
                            
                            {/* Calculated Amount */}
                            <s-box min-inline-size="80">
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
                                <s-text variant="bodyMd" tone="subdued">—</s-text>
                              )}
                            </s-box>
                            
                            {/* Remove Button */}
                            <s-box min-inline-size="40">
                              <s-button
                                variant="plain"
                                tone="critical"
                                onclick={() => removeProduct(key)}
                                icon="CancelMinor"
                                accessibilityLabel={`Remove ${product.title}`}
                              />
                            </s-box>
                          </s-grid>
                        </s-box>
                      ))}
                    </s-box>
                  </s-stack>
                )}
              </s-stack>
            </s-box>
          </s-card>

          {/* Footer Notes */}
          <s-box padding-inline="large">
            <s-stack direction="block" gap="extra-tight">
              <s-text variant="bodySm" tone="subdued">
                Note: Discounts are applied based on SKU when available, otherwise product title.
              </s-text>
              <s-text variant="bodySm" tone="subdued">
                For best experience on mobile devices, use the Shopify mobile app.
              </s-text>
            </s-stack>
          </s-box>
          
          {/* Form Actions */}
          <s-box padding-inline="large" padding-block-end="large">
            <s-stack direction="inline" gap="base">
              <s-button type="submit" variant="primary">
                Save configuration
              </s-button>
              <s-button type="reset" variant="secondary">
                Reset changes
              </s-button>
            </s-stack>
          </s-box>
        </s-stack>
      </s-form>
    </s-box>
  );
}