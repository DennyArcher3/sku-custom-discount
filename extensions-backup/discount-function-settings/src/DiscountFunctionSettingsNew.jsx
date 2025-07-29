import {
  reactExtension,
  useApi,
  FunctionSettings,
  Form,
  BlockStack,
  Box,
  InlineStack,
  Text,
  TextField,
  NumberField,
  Select,
  Button,
  Icon,
  Badge,
  Banner,
  TextArea,
  Divider,
  Heading,
  Section,
  Image,
} from "@shopify/ui-extensions-react/admin";
import { useState, useEffect } from "react";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// Helper functions remain the same
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
  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');

  // Load existing configuration
  useEffect(() => {
    const metafield = data?.metafields?.find(
      (metafield) => metafield.key === METAFIELD_KEY
    );
    
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
        console.error("Error loading config:", e);
      }
    }
  }, [data?.metafields]);

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
        
        selected.forEach(item => {
          if (item.variants && item.variants.length > 0) {
            item.variants.forEach(variant => {
              const key = `variant_${variant.id}`;
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
      console.error("Error picking products:", error);
    }
  };

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
          errors.push(`Line ${index + 1}: Percentage must be 0-100%`);
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
      if (query && validSkus.length > 0) {
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
            const chunkResult = await query(queryString, {
              variables: { query: searchQuery }
            });
            
            if (chunkResult?.data?.products?.nodes) {
              allProducts.push(...chunkResult.data.products.nodes);
            }
          } catch (chunkError) {
            console.error("Chunk error:", chunkError);
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
          }
        }
      }
    } catch (e) {
      console.error("Bulk import error:", e);
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
      const limitedValue = Math.min(Math.max(numValue, 0), products[key].discountType === 'percentage' ? 100 : 99999);
      setProducts(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: limitedValue
        }
      }));
    }
  };

  // Update product discount type
  const updateProductType = (key, type) => {
    setProducts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        discountType: type
      }
    }));
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
        type: "updateMetafield",
        namespace: METAFIELD_NAMESPACE,
        key: METAFIELD_KEY,
        value: JSON.stringify(newConfig),
        valueType: "json",
      });
      
      setInitialProducts(products);
    } catch (error) {
      console.error("Error saving metafield:", error);
      
      if (error?.message?.includes("Access to this namespace and key on Metafields")) {
        setValidationErrors([
          "⚠️ Shopify Platform Issue: Unable to save. Save discount first, then edit to add products."
        ]);
        setTimeout(() => setValidationErrors([]), 10000);
        setInitialProducts(products);
        return false;
      } else {
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

  const resetForm = () => {
    setProducts(initialProducts);
    setBulkImportText("");
    setShowBulkImport(false);
    setValidationErrors([]);
  };

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.price);
    const discount = parseFloat(product.value) || 0;
    
    if (product.discountType === 'percentage') {
      return (price * (1 - discount / 100)).toFixed(2);
    } else {
      return Math.max(0, price - discount).toFixed(2);
    }
  };

  // Create a clean, table-like structure using current components
  return (
    <FunctionSettings onSave={saveMetafieldChanges}>
      <Form onSubmit={saveMetafieldChanges} onReset={resetForm}>
        <BlockStack gap="large">
          {/* Header */}
          <Section>
            <BlockStack gap="base">
              <Heading>Product SKU Discount Manager (Enhanced)</Heading>
              <InlineStack gap="base" blockAlignment="center">
                {totalProducts > 0 && (
                  <Badge tone="success">{totalProducts} products configured</Badge>
                )}
                {validationErrors.length > 0 && validationErrors.map((error, index) => (
                  <Badge key={index} tone={error.includes("Platform Issue") ? "critical" : "warning"}>
                    {error}
                  </Badge>
                ))}
              </InlineStack>
            </BlockStack>
          </Section>

          <Divider />

          {/* Actions */}
          <Section>
            <BlockStack gap="base">
              <InlineStack gap="base" blockAlignment="center" inlineAlignment="spaceBetween">
                <InlineStack gap="base">
                  <Button onClick={handleProductPicker} variant="primary">
                    <InlineStack gap="tight" blockAlignment="center">
                      <Icon name="ProductsMajor" />
                      <Text>Select Products</Text>
                    </InlineStack>
                  </Button>
                  
                  <Button onClick={() => setShowBulkImport(!showBulkImport)} variant="secondary">
                    <InlineStack gap="tight" blockAlignment="center">
                      <Icon name="ImportMinor" />
                      <Text>Bulk Import</Text>
                    </InlineStack>
                  </Button>
                </InlineStack>
                
                <InlineStack gap="base" blockAlignment="center">
                  <Text variant="bodySm" tone="subdued">Default:</Text>
                  <Button
                    variant={globalDiscountType === 'percentage' ? 'primary' : 'secondary'}
                    size="slim"
                    onClick={() => setGlobalDiscountType('percentage')}
                  >
                    % off
                  </Button>
                  <Button
                    variant={globalDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                    size="slim"
                    onClick={() => setGlobalDiscountType('fixedAmount')}
                  >
                    $ off
                  </Button>
                </InlineStack>
              </InlineStack>

              {showBulkImport && (
                <Box padding="base" border="base" borderRadius="base">
                  <BlockStack gap="base">
                    <Text variant="bodySm">
                      Copy from Excel: SKU, discount value ({globalDiscountType === 'percentage' ? '%' : '$'})
                    </Text>
                    <TextArea
                      label=""
                      value={bulkImportText}
                      onChange={setBulkImportText}
                      minRows={6}
                      placeholder={`SKU123	35\nSKU456	40\nSKU789	50`}
                    />
                    <InlineStack gap="base">
                      <Button onClick={processBulkImport} variant="primary">Import</Button>
                      <Button onClick={() => setShowBulkImport(false)} variant="plain">Cancel</Button>
                    </InlineStack>
                  </BlockStack>
                </Box>
              )}
            </BlockStack>
          </Section>

          <Divider />

          {/* Product Table - Enhanced Structure */}
          <Section>
            <BlockStack gap="base">
              <InlineStack blockAlignment="center" inlineAlignment="spaceBetween">
                <Text fontWeight="semiBold">Product List</Text>
                {totalProducts > 0 && (
                  <Button onClick={clearAll} variant="plain" tone="critical">
                    <InlineStack gap="tight" blockAlignment="center">
                      <Icon name="DeleteMinor" />
                      <Text>Clear All</Text>
                    </InlineStack>
                  </Button>
                )}
              </InlineStack>
              
              {productEntries.length === 0 ? (
                <Banner>
                  <Text>No products added yet. Use "Select Products" or "Bulk Import" buttons.</Text>
                </Banner>
              ) : (
                <Box>
                  {/* Table Header */}
                  <Box padding="base" background="subdued" borderRadius="base base none none" border="base">
                    <InlineStack gap="base" blockAlignment="center">
                      <Box minInlineSize="200"><Text fontWeight="semiBold">Product</Text></Box>
                      <Box minInlineSize="100"><Text fontWeight="semiBold">SKU</Text></Box>
                      <Box minInlineSize="80"><Text fontWeight="semiBold">Price</Text></Box>
                      <Box minInlineSize="60"><Text fontWeight="semiBold">Type</Text></Box>
                      <Box minInlineSize="100"><Text fontWeight="semiBold">Discount</Text></Box>
                      <Box minInlineSize="80"><Text fontWeight="semiBold">Final</Text></Box>
                      <Box minInlineSize="60"><Text fontWeight="semiBold">Action</Text></Box>
                    </InlineStack>
                  </Box>
                  
                  {/* Table Body */}
                  <Box border="base" borderRadius="none none base base">
                    <BlockStack gap="none">
                      {productEntries.map(([key, product], index) => (
                        <Box
                          key={key}
                          padding="base"
                          borderBlockEnd={index < productEntries.length - 1 ? "base" : undefined}
                        >
                          <InlineStack gap="base" blockAlignment="center">
                            <Box minInlineSize="200">
                              <InlineStack gap="tight" blockAlignment="center">
                                {product.image && (
                                  <Box
                                    minInlineSize={32}
                                    minBlockSize={32}
                                    maxInlineSize={32}
                                    maxBlockSize={32}
                                    borderRadius="base"
                                    overflow="hidden"
                                  >
                                    <Image
                                      source={product.image}
                                      alt={product.title}
                                    />
                                  </Box>
                                )}
                                <Text variant="bodySm" truncate={1}>{product.title}</Text>
                              </InlineStack>
                            </Box>
                            <Box minInlineSize="100">
                              <Text variant="bodySm">{product.sku || '—'}</Text>
                            </Box>
                            <Box minInlineSize="80">
                              <Badge tone="info">${parseFloat(product.price || 0).toFixed(2)}</Badge>
                            </Box>
                            <Box minInlineSize="60">
                              <Select
                                label=""
                                value={product.discountType}
                                onChange={(value) => updateProductType(key, value)}
                                options={[
                                  { value: 'percentage', label: '%' },
                                  { value: 'fixedAmount', label: '$' }
                                ]}
                              />
                            </Box>
                            <Box minInlineSize="100">
                              <NumberField
                                label=""
                                value={product.value?.toString() || "0"}
                                onChange={(value) => updateProductValue(key, value)}
                                prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                                suffix={product.discountType === 'percentage' ? "%" : undefined}
                                min={0}
                                max={product.discountType === 'percentage' ? 100 : undefined}
                              />
                            </Box>
                            <Box minInlineSize="80">
                              <Badge tone="success">${calculateFinalPrice(product)}</Badge>
                            </Box>
                            <Box minInlineSize="60">
                              <Button
                                variant="plain"
                                tone="critical"
                                onClick={() => removeProduct(key)}
                              >
                                <Icon name="CancelMinor" />
                              </Button>
                            </Box>
                          </InlineStack>
                        </Box>
                      ))}
                    </BlockStack>
                  </Box>
                </Box>
              )}
            </BlockStack>
          </Section>

          <Box padding="base">
            <BlockStack gap="tight">
              <Text tone="subdued" variant="bodySm">
                Note: This version uses enhanced layout with current components.
              </Text>
              <Text tone="subdued" variant="bodySm">
                Table component will be available when 2025-10 is stable.
              </Text>
            </BlockStack>
          </Box>
        </BlockStack>
      </Form>
    </FunctionSettings>
  );
}