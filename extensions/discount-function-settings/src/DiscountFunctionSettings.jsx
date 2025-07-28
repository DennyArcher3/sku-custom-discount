import {
  reactExtension,
  useApi,
  BlockStack,
  FunctionSettings,
  Section,
  Text,
  TextField,
  Form,
  NumberField,
  Box,
  InlineStack,
  Heading,
  Button,
  Icon,
  Badge,
  Banner,
  TextArea,
  Divider,
  Image,
  Select,
  Option,
} from "@shopify/ui-extensions-react/admin";
import { useState, useEffect } from "react";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

async function getMetafieldDefinition(adminApiQuery) {
  const query = `#graphql
    query GetMetafieldDefinition {
      metafieldDefinitions(first: 1, ownerType: DISCOUNT, namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}") {
        nodes {
          id
        }
      }
    }
  `;

  const result = await adminApiQuery(query);
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

  const query = `#graphql
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
  const result = await adminApiQuery(query, { variables });
  
  if (result?.data?.metafieldDefinitionCreate?.userErrors?.length > 0) {
    console.error("Metafield creation errors:", result.data.metafieldDefinitionCreate.userErrors);
  }

  return result?.data?.metafieldDefinitionCreate?.createdDefinition;
}

export default reactExtension(TARGET, async (api) => {
  try {
    const existingDefinition = await getMetafieldDefinition(api.query);
    if (!existingDefinition) {
      const metafieldDefinition = await createMetafieldDefinition(api.query);
      if (!metafieldDefinition) {
        console.error("Failed to create metafield definition");
      }
    }
  } catch (error) {
    console.error("Error setting up metafield definition:", error);
  }
  return <App />;
});

function App() {
  const api = useApi(TARGET);
  const {
    applyMetafieldChange,
    i18n,
    data,
    loading,
    resourcePicker,
    query,
  } = api;

  const [products, setProducts] = useState({});
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [initialProducts, setInitialProducts] = useState({});
  const [globalDiscountType, setGlobalDiscountType] = useState('percentage'); // Global discount type setting

  // Load existing configuration and store settings
  useEffect(() => {
    const metafield = data?.metafields?.find(
      (metafield) => metafield.key === METAFIELD_KEY
    );
    
    if (metafield?.value) {
      try {
        const config = JSON.parse(metafield.value);
        if (config.sku_discounts) {
          // Check if we have product details saved
          if (config.product_details) {
            // Use saved product details
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
            
            query(queryString, { variables: { query: searchQuery } })
              .then(result => {
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
              })
              .catch(() => {});
            }
          }
        }
      } catch (e) {
      }
    }
  }, [data?.metafields, query]);

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
          // Check if this is a variant selection
          if (item.variants && item.variants.length > 0) {
            // User selected specific variants
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
            // User selected entire product (all variants)
            const key = `product_${item.id}`;
            if (!products[key]) {
              newProducts[key] = {
                id: item.id,
                productId: item.id,
                title: item.title,
                image: item.image?.url || null,
                sku: '', // Will be fetched
                price: item.priceRange?.minVariantPrice?.amount || null,
                value: 0,
                discountType: globalDiscountType,
              };
            } else {
              duplicateProducts.push(item.title);
            }
          }
        });
        
        if (duplicateProducts.length > 0) {
        }
        
        if (Object.keys(newProducts).length > 0) {
          setProducts(prev => {
            const updatedProducts = { ...prev, ...newProducts };
            
            // Trigger metafield update
            const formattedDiscounts = {};
            Object.entries(updatedProducts).forEach(([k, product]) => {
              const identifier = product.sku || product.title || k;
              formattedDiscounts[identifier] = parseFloat(product.value) || 0;
            });
            
            applyMetafieldChange({
              type: "updateMetafield",
              namespace: METAFIELD_NAMESPACE,
              key: METAFIELD_KEY,
              value: JSON.stringify({
                discount_code: data?.discount?.code || "DISCOUNT",
                sku_discounts: formattedDiscounts
              }),
              valueType: "json",
            });
            
            return updatedProducts;
          });
        }
        
        // Fetch additional details for variants
        if (query && variantIds.length > 0) {
          try {
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
            
            const result = await query(queryString, {
              variables: { ids: variantIds }
            });
            
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
          } catch (queryError) {
          }
        }
      }
    } catch (error) {
    }
  };

  // Process bulk import
  const processBulkImport = async () => {
    try {
      // Clear any existing validation errors first
      setValidationErrors([]);
      
      const lines = bulkImportText.trim().split('\n');
      const skuToValueMap = {};
      const validSkus = [];
      const errors = [];
      
      // Parse the input - expecting SKU and value columns (tab or comma separated)
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        // Support tab, comma, colon, and space separators
        const parts = trimmed.split(/[\t,:\s]+/).filter(p => p);
        
        if (parts.length < 2) {
          errors.push(`Line ${index + 1}: Invalid format. Expected: SKU, Discount%`);
          return;
        }
        
        const sku = parts[0];
        const value = parseFloat(parts[parts.length - 1]); // Take last part as value
        
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
      
      // Try to fetch product details for these SKUs
      if (query && validSkus.length > 0) {
        try {
          // Create a search query for products with these SKUs
          // Split into chunks if too many SKUs to avoid query length limits
          const chunkSize = 10;
          const skuChunks = [];
          for (let i = 0; i < validSkus.length; i += chunkSize) {
            skuChunks.push(validSkus.slice(i, i + chunkSize));
          }
          
          const allProducts = [];
          
          // Query each chunk separately
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
              const chunkResult = await query(queryString, {
                variables: { query: searchQuery }
              });
              
              if (chunkResult?.data?.products?.nodes) {
                allProducts.push(...chunkResult.data.products.nodes);
              }
            } catch (chunkError) {
              // Silently handle chunk errors
            }
          }
          
          // Process all found products
          if (allProducts.length > 0) {
            const newProducts = {};
            const foundSkus = new Set();
            
            allProducts.forEach(product => {
              product.variants?.nodes?.forEach(variant => {
                if (variant.sku) {
                  // Check if this SKU matches any of our validSkus (case-insensitive)
                  const matchingSku = validSkus.find(validSku => 
                    validSku.toLowerCase() === variant.sku.toLowerCase()
                  );
                  
                  if (matchingSku && skuToValueMap[matchingSku] !== undefined) {
                    // Check if this product already exists in the current products
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
            
            // Check which SKUs were not found or already exist
            const notFoundSkus = validSkus.filter(sku => !foundSkus.has(sku));
            const alreadyExistingSkus = validSkus.filter(sku => {
              return foundSkus.has(sku) && Object.values(products).some(p => 
                p.sku && p.sku.toLowerCase() === sku.toLowerCase()
              );
            });
            
            if (Object.keys(newProducts).length > 0) {
              setProducts(prev => {
                const updatedProducts = { ...prev, ...newProducts };
                
                // Trigger metafield update
                const formattedDiscounts = {};
                Object.entries(updatedProducts).forEach(([k, product]) => {
                  const identifier = product.sku || product.title || k;
                  formattedDiscounts[identifier] = parseFloat(product.value) || 0;
                });
                
                applyMetafieldChange({
                  type: "updateMetafield",
                  namespace: METAFIELD_NAMESPACE,
                  key: METAFIELD_KEY,
                  value: JSON.stringify({
                    discount_code: data?.discount?.code || "DISCOUNT",
                    sku_discounts: formattedDiscounts
                  }),
                  valueType: "json",
                });
                
                return updatedProducts;
              });
              
              setBulkImportText("");
              setShowBulkImport(false);
              
              // Show warnings for various cases
              const warnings = [];
              if (notFoundSkus.length > 0) {
                warnings.push(`SKUs not found: ${notFoundSkus.join(', ')}`);
              }
              if (alreadyExistingSkus.length > 0) {
                warnings.push(`SKUs already in list: ${alreadyExistingSkus.join(', ')}`);
              }
              
              if (warnings.length > 0) {
                setValidationErrors(warnings);
                // Clear the warning after 5 seconds
                setTimeout(() => setValidationErrors([]), 5000);
              }
            }
          } else if (notFoundSkus.length > 0) {
            // All SKUs were not found
            setValidationErrors([`None of the SKUs were found in your store: ${notFoundSkus.join(', ')}`]);
          } else if (alreadyExistingSkus.length === validSkus.length) {
            // All SKUs already exist
            setValidationErrors([`All SKUs are already in the product list`]);
            setTimeout(() => setValidationErrors([]), 3000);
          }
        } catch (queryError) {
          setValidationErrors(['Failed to search for products. Please try again or ensure the SKUs exist in your store.']);
        }
      } else {
        // No query API available
        setValidationErrors(['Unable to verify SKUs. Please ensure the products exist in your store.']);
      }
    } catch (e) {
    }
  };

  // Update product discount
  const updateProductValue = (key, value) => {
    // Clean the input value - remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Handle empty or invalid input
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
    
    // Enforce limits
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
  async function saveMetafieldChanges() {
    try {
      // Convert to the format expected by the Rust function
      const formattedDiscounts = {};
      const productDetails = {};
      
      Object.entries(products).forEach(([key, product]) => {
        // Use SKU if available, otherwise use title
        const identifier = product.sku || product.title || key;
        
        // Format discount based on type for Rust function
        formattedDiscounts[identifier] = {
          discount_type: product.discountType || 'percentage',
          value: parseFloat(product.value) || 0,
          applies_to_each_item: product.discountType === 'fixedAmount' ? true : undefined
        };
        
        // Save product details
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
        type: "updateMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(newConfig),
        valueType: "json",
      });
      
      // Update initial products for reset functionality
      setInitialProducts(products);
    } catch (error) {
      console.error("Error saving metafield:", error);
      
      // Check if this is the permission error
      if (error?.message?.includes("Access to this namespace and key on Metafields") || 
          error?.toString()?.includes("not allowed")) {
        // Show a user-friendly error message
        setValidationErrors([
          "⚠️ Shopify Platform Issue: Unable to save configuration due to metafield permissions. This is a known Shopify bug. Workaround: Save the discount without products first, then edit to add products."
        ]);
        
        // Keep the error visible longer
        setTimeout(() => setValidationErrors([]), 10000);
        
        // Still update the local state so the UI reflects the changes
        setInitialProducts(products);
        
        // Return false to indicate save failed
        return false;
      } else {
        // Other errors
        setValidationErrors(["Failed to save configuration. Please try again."]);
        setTimeout(() => setValidationErrors([]), 5000);
        throw error;
      }
    }
  }

  const productEntries = Object.entries(products);
  const totalProducts = productEntries.length;

  if (loading) {
    return <Text>{i18n.translate("loading")}</Text>;
  }

  // Reset form to initial state
  const resetForm = () => {
    setProducts(initialProducts);
    setBulkImportText("");
    setShowBulkImport(false);
    setValidationErrors([]);
  };

  // Create a serialized string of products for the hidden field
  const sortedEntries = Object.entries(products).sort(([a], [b]) => a.localeCompare(b));
  const serializedProducts = sortedEntries
    .map(([key, product]) => `${product.sku || key}:${product.value}`)
    .join('|');
    
  // Create initial serialized string for defaultValue
  const initialSortedEntries = Object.entries(initialProducts).sort(([a], [b]) => a.localeCompare(b));
  const initialSerializedProducts = initialSortedEntries
    .map(([key, product]) => `${product.sku || key}:${product.value}`)
    .join('|');

  // Check if we have the Shopify platform error
  const hasShopifyPlatformError = validationErrors.some(error => 
    error.includes("Shopify Platform Issue")
  );

  return (
    <FunctionSettings onSave={saveMetafieldChanges}>
      <Form onSubmit={saveMetafieldChanges} onReset={resetForm}>
        <BlockStack gap="large">
          {/* Hidden field for dirty state detection */}
          <Box display="none">
            <TextField
              label=""
              name="serializedProducts"
              value={serializedProducts}
              defaultValue={initialSerializedProducts}
              onChange={() => {}}
            />
          </Box>
          
          {/* Show detailed banner for Shopify platform error */}
          {hasShopifyPlatformError && (
            <Banner tone="critical">
              <BlockStack gap="base">
                <Text fontWeight="bold">Known Shopify Platform Issue</Text>
                <Text>Due to a Shopify bug with discount metafields, the configuration cannot be saved directly.</Text>
                <Text fontWeight="semiBold">Workaround:</Text>
                <BlockStack gap="extraTight">
                  <Text>1. Save this discount without any products</Text>
                  <Text>2. After saving, edit the discount again</Text>
                  <Text>3. Add your products and save (it usually works on the second attempt)</Text>
                </BlockStack>
                <Text variant="bodySm" tone="subdued">
                  This is a temporary Shopify platform limitation that affects all discount apps using the merchant configuration.
                </Text>
              </BlockStack>
            </Banner>
          )}
          
          {/* Header */}
          <Section>
            <BlockStack gap="base">
              <Heading size={3}>Product SKU Discount Manager</Heading>
              <InlineStack gap="base" blockAlignment="center">
                {totalProducts > 0 && (
                  <Badge tone="success">{totalProducts} products configured</Badge>
                )}
                {validationErrors.length > 0 && validationErrors.map((error, index) => {
                  // Determine badge tone based on message content
                  let tone = "warning";
                  if (error.includes("not found")) tone = "warning";
                  else if (error.includes("already in list") || error.includes("All SKUs are already")) tone = "info";
                  else if (error.includes("Failed") || error.includes("None of the SKUs") || error.includes("Shopify Platform Issue")) tone = "critical";
                  
                  return <Badge key={index} tone={tone}>{error}</Badge>;
                })}
              </InlineStack>
            </BlockStack>
          </Section>

          <Divider />

          {/* Discount Type Selector */}
          <Section>
            <BlockStack gap="base">
              <Text variant="headingMd" as="h2">
                Default Discount Type
              </Text>
              <Select
                label="Discount type for new products"
                value={globalDiscountType}
                onChange={(value) => setGlobalDiscountType(value)}
                helpText="Choose whether discounts are applied as a percentage off or a fixed amount off the price"
              >
                <Option value="percentage">Percentage off (%)</Option>
                <Option value="fixedAmount">Fixed amount off ($)</Option>
              </Select>
            </BlockStack>
          </Section>

          <Divider />

          {/* Add Products Section */}
          <Section>
            <BlockStack gap="large">
              <Box>
                <InlineStack gap="base">
                  <Button 
                    onClick={handleProductPicker} 
                    variant="primary"
                  >
                    <InlineStack gap="base" blockAlignment="center">
                      <Icon name="ProductsMajor" size="base" />
                      <Text>Select Products</Text>
                    </InlineStack>
                  </Button>
                  
                  <Button 
                    onClick={() => setShowBulkImport(!showBulkImport)} 
                    variant="secondary"
                  >
                    <InlineStack gap="base" blockAlignment="center">
                      <Icon name="ImportMinor" size="base" />
                      <Text>Bulk Import</Text>
                    </InlineStack>
                  </Button>
                  
                  {totalProducts > 0 && (
                    <Button 
                      onClick={clearAll} 
                      variant="plain"
                      tone="critical"
                    >
                      <InlineStack gap="base" blockAlignment="center">
                        <Icon name="DeleteMinor" size="base" />
                        <Text>Clear All</Text>
                      </InlineStack>
                    </Button>
                  )}
                </InlineStack>
              </Box>

              {/* Bulk Import */}
              {showBulkImport && (
                <Box padding="base" border="base" borderRadius="base">
                  <BlockStack gap="base">
                    <Text variant="bodySm">
                      Copy from Excel: First column SKU, second column discount value ({globalDiscountType === 'percentage' ? 'percentage' : 'dollar amount'})
                    </Text>
                    <TextArea
                      label=""
                      value={bulkImportText}
                      onChange={setBulkImportText}
                      minRows={6}
                      placeholder={globalDiscountType === 'percentage' ? `SKU123	35
SKU456	40
SKU789	50
ABC-001	25
XYZ-002	15

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,35` : `SKU123	10.00
SKU456	15.50
SKU789	5.00
ABC-001	20.00
XYZ-002	7.99

Note: Excel copy uses tab separator automatically. 
You can also use comma: SKU123,10.00`}
                    />
                    <InlineStack gap="base">
                      <Button 
                        onClick={processBulkImport} 
                        variant="primary"
                        disabled={!bulkImportText.trim()}
                      >
                        Import
                      </Button>
                      <Button 
                        onClick={() => {
                          setShowBulkImport(false);
                          setValidationErrors([]);
                        }} 
                        variant="plain"
                      >
                        Cancel
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Box>
              )}
            </BlockStack>
          </Section>

          <Divider />

          {/* Product List */}
          <Section>
            <BlockStack gap="base">
              <Text fontWeight="semiBold">Product List</Text>
              
              {productEntries.length === 0 ? (
                <Banner>
                  <Text>No products added yet. Use "Select Products" or "Bulk Import" buttons.</Text>
                </Banner>
              ) : (
                <Box border="base" borderRadius="base">
                  <BlockStack gap="none">
                    {productEntries.map(([key, product], index) => (
                      <Box
                        key={key}
                        padding="base"
                        borderBlockEnd={index < productEntries.length - 1 ? "base" : undefined}
                      >
                        <InlineStack gap="base" blockAlignment="center" wrap={false}>
                          {/* Product Image - Fixed 36px */}
                          <Box 
                            minInlineSize={36} 
                            maxInlineSize={36}
                            minBlockSize={36}
                            maxBlockSize={36}
                            background="subdued"
                            borderRadius="base"
                            inlineAlignment="center"
                            blockAlignment="center"
                            overflow="hidden"
                          >
                            {product.image ? (
                              <Image 
                                source={product.image} 
                                alt={product.title}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }}
                              />
                            ) : (
                              <Icon name="ProductsMajor" size="base" />
                            )}
                          </Box>

                          {/* Product Title - Flexible */}
                          <Box minInlineSize="fill">
                            <BlockStack gap="extraTight">
                              <Text fontWeight="semiBold" truncate={1}>
                                {product.title.split(' - ')[0]}
                              </Text>
                              {product.sku && (
                                <Text variant="bodySm" fontWeight="bold" tone="subdued">
                                  {product.sku}
                                </Text>
                              )}
                            </BlockStack>
                          </Box>

                          {/* Price - Fixed width */}
                          <Box minInlineSize={70} maxInlineSize={70} inlineAlignment="end">
                            {product.price ? (
                              <Badge tone="info">
                                <Text variant="bodyMd" fontWeight="bold">
                                  ${parseFloat(product.price).toFixed(0)}
                                </Text>
                              </Badge>
                            ) : (
                              <Text variant="bodySm" tone="subdued">—</Text>
                            )}
                          </Box>

                          {/* Discount Type Selector - Fixed width */}
                          <Box minInlineSize={110} maxInlineSize={110}>
                            <Select
                              label=""
                              value={product.discountType || 'percentage'}
                              onChange={(value) => {
                                setProducts(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], discountType: value }
                                }));
                              }}
                            >
                              <Option value="percentage">%</Option>
                              <Option value="fixedAmount">$</Option>
                            </Select>
                          </Box>

                          {/* Discount Input - Fixed width */}
                          <Box minInlineSize={100} maxInlineSize={100}>
                            <NumberField
                              label=""
                              value={product.value?.toString() || "0"}
                              onChange={(value) => updateProductValue(key, value)}
                              prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                              suffix={product.discountType === 'percentage' ? "%" : undefined}
                              min={0}
                              max={product.discountType === 'percentage' ? 100 : undefined}
                              placeholder="0"
                              step={product.discountType === 'fixedAmount' ? 0.01 : 1}
                            />
                          </Box>

                          {/* Savings - Fixed width */}
                          <Box minInlineSize={80} maxInlineSize={80} inlineAlignment="center" paddingInlineStart="base">
                            {product.price && product.value > 0 ? (
                              <Badge tone="critical">
                                -${(() => {
                                  const price = parseFloat(product.price);
                                  const value = parseFloat(product.value);
                                  if (product.discountType === 'percentage') {
                                    return ((price * value) / 100).toFixed(2);
                                  } else {
                                    // Fixed amount - show the actual discount
                                    return value.toFixed(2);
                                  }
                                })()}
                              </Badge>
                            ) : (
                              <Text variant="bodySm" tone="subdued" alignment="center">—</Text>
                            )}
                          </Box>

                          {/* Remove Button - Fixed */}
                          <Button
                            variant="plain"
                            tone="critical"
                            onClick={() => removeProduct(key)}
                            size="slim"
                          >
                            <Icon name="CancelMinor" />
                          </Button>
                        </InlineStack>
                      </Box>
                    ))}
                  </BlockStack>
                </Box>
              )}
            </BlockStack>
          </Section>

          <Box padding="base">
            <Text tone="subdued" variant="bodySm">
              Note: Discounts are applied based on SKU when available, otherwise product title.
            </Text>
          </Box>
        </BlockStack>
      </Form>
    </FunctionSettings>
  );
}