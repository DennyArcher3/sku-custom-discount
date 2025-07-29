import {
  reactExtension,
  useApi,
  FunctionSettings,
  Form,
  Section,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Badge,
  Banner,
  Select,
  TextField,
  NumberField,
  TextArea,
  Box,
  Divider,
  Image,
  Heading,
  Pressable,
  Icon
} from "@shopify/ui-extensions-react/admin";
import { useState, useEffect } from "react";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// Register and export the extension
export default reactExtension(TARGET, () => <DiscountFunctionSettings />);

function DiscountFunctionSettings() {
  const { applyMetafieldChange, data } = useApi();
  const [products, setProducts] = useState({});
  const [bulkImportText, setBulkImportText] = useState("");
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [initialProducts, setInitialProducts] = useState({});
  const [globalDiscountType, setGlobalDiscountType] = useState('percentage');
  const [loading, setLoading] = useState(false);

  // Load existing configuration from metafield
  useEffect(() => {
    if (data?.metafield?.value) {
      try {
        const config = JSON.parse(data.metafield.value);
        if (config.products) {
          setProducts(config.products);
          setInitialProducts(config.products);
        }
      } catch (error) {
        console.error("Error parsing metafield:", error);
      }
    }
  }, [data]);

  // Product picker handler
  const handleProductPicker = async () => {
    try {
      // Note: resourcePicker is not available in discount function settings
      // This would need to be implemented differently, perhaps with a modal
      console.log("Product picker would open here");
      
      // For demo purposes, add a sample product
      const sampleProduct = {
        id: `product_${Date.now()}`,
        title: "Sample Product",
        sku: "SKU-" + Math.random().toString(36).substr(2, 9),
        price: 100,
        value: 0,
        discountType: globalDiscountType,
      };
      
      setProducts(prev => ({
        ...prev,
        [sampleProduct.id]: sampleProduct
      }));
    } catch (error) {
      console.error("Product picker error:", error);
    }
  };

  // Process bulk import
  const processBulkImport = () => {
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
      
      // Add products from bulk import
      const newProducts = {};
      validSkus.forEach(sku => {
        const key = `sku_${sku}`;
        newProducts[key] = {
          id: key,
          title: `Product ${sku}`,
          sku: sku,
          price: 0,
          value: skuToValueMap[sku],
          discountType: globalDiscountType,
        };
      });
      
      setProducts(prev => ({ ...prev, ...newProducts }));
      setBulkImportText("");
      setShowBulkImport(false);
      
    } catch (e) {
      console.error("Bulk import error:", e);
    }
  };

  // Update product value
  const updateProductValue = (key, value) => {
    const numValue = parseFloat(value) || 0;
    const limitedValue = Math.min(Math.max(numValue, 0), products[key].discountType === 'percentage' ? 100 : 99999);
    
    setProducts(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: limitedValue
      }
    }));
  };

  // Update product type
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
  const saveMetafieldChanges = () => {
    console.log('Saving configuration:', products);
    
    applyMetafieldChange({
      namespace: METAFIELD_NAMESPACE,
      key: METAFIELD_KEY,
      value: JSON.stringify({ products }),
      type: 'json'
    });
  };

  const productEntries = Object.entries(products);
  const totalProducts = productEntries.length;

  const resetForm = () => {
    setProducts(initialProducts);
    setBulkImportText("");
    setShowBulkImport(false);
    setValidationErrors([]);
  };

  const calculateFinalPrice = (product) => {
    const price = parseFloat(product.price) || 100;
    const discount = parseFloat(product.value) || 0;
    
    if (product.discountType === 'percentage') {
      return (price * (1 - discount / 100)).toFixed(2);
    } else {
      return Math.max(0, price - discount).toFixed(2);
    }
  };

  return (
    <FunctionSettings>
      <Form onSubmit={saveMetafieldChanges} onReset={resetForm}>
        <BlockStack gap="large">
          {/* Header */}
          <Section>
            <BlockStack gap="base">
              <Heading>Product SKU Discount Manager</Heading>
              <InlineStack gap="base" align="center">
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
              <InlineStack gap="base" align="space-between">
                <InlineStack gap="base">
                  <Button variant="primary" onPress={handleProductPicker}>
                    Select Products
                  </Button>
                  
                  <Button variant="secondary" onPress={() => setShowBulkImport(!showBulkImport)}>
                    Bulk Import
                  </Button>
                </InlineStack>
                
                <InlineStack gap="base" align="center">
                  <Text variant="bodySm" tone="subdued">Default:</Text>
                  <Button
                    variant={globalDiscountType === 'percentage' ? 'primary' : 'secondary'}
                    size="slim"
                    onPress={() => setGlobalDiscountType('percentage')}
                  >
                    % off
                  </Button>
                  <Button
                    variant={globalDiscountType === 'fixedAmount' ? 'primary' : 'secondary'}
                    size="slim"
                    onPress={() => setGlobalDiscountType('fixedAmount')}
                  >
                    $ off
                  </Button>
                </InlineStack>
              </InlineStack>

              {showBulkImport && (
                <Box padding="base">
                  <BlockStack gap="base">
                    <Text variant="bodySm">
                      Copy from Excel: SKU, discount value ({globalDiscountType === 'percentage' ? '%' : '$'})
                    </Text>
                    <TextArea
                      name="bulkImport"
                      value={bulkImportText}
                      onChange={(value) => setBulkImportText(value)}
                      rows={6}
                      placeholder={`SKU123\t35\nSKU456\t40\nSKU789\t50`}
                    />
                    <InlineStack gap="base">
                      <Button variant="primary" onPress={processBulkImport}>Import</Button>
                      <Button variant="plain" onPress={() => setShowBulkImport(false)}>Cancel</Button>
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
              <InlineStack align="space-between">
                <Text fontWeight="semiBold">Product List</Text>
                {totalProducts > 0 && (
                  <Button variant="plain" tone="critical" onPress={clearAll}>
                    Clear All
                  </Button>
                )}
              </InlineStack>
              
              {productEntries.length === 0 ? (
                <Banner>
                  <Text>No products added yet. Use "Select Products" or "Bulk Import" buttons.</Text>
                </Banner>
              ) : (
                <BlockStack gap="tight">
                  {/* Table Header */}
                  <Box padding="base" background="bg-subdued">
                    <InlineStack gap="base" align="space-between">
                      <Box minWidth="200px">
                        <Text fontWeight="semiBold">Product</Text>
                      </Box>
                      <Box minWidth="100px">
                        <Text fontWeight="semiBold">SKU</Text>
                      </Box>
                      <Box minWidth="80px">
                        <Text fontWeight="semiBold">Price</Text>
                      </Box>
                      <Box minWidth="80px">
                        <Text fontWeight="semiBold">Type</Text>
                      </Box>
                      <Box minWidth="120px">
                        <Text fontWeight="semiBold">Discount</Text>
                      </Box>
                      <Box minWidth="100px">
                        <Text fontWeight="semiBold">Final Price</Text>
                      </Box>
                      <Box minWidth="80px">
                        <Text fontWeight="semiBold">Actions</Text>
                      </Box>
                    </InlineStack>
                  </Box>
                  
                  {/* Table Rows */}
                  {productEntries.map(([key, product]) => (
                    <Box key={key} padding="base" border="base">
                      <InlineStack gap="base" align="space-between">
                        <Box minWidth="200px">
                          <InlineStack gap="tight" align="center">
                            {product.image && (
                              <Image source={product.image} alt={product.title} />
                            )}
                            <Text variant="bodySm">{product.title}</Text>
                          </InlineStack>
                        </Box>
                        <Box minWidth="100px">
                          <Text>{product.sku || '—'}</Text>
                        </Box>
                        <Box minWidth="80px">
                          <Badge tone="info">${parseFloat(product.price || 100).toFixed(2)}</Badge>
                        </Box>
                        <Box minWidth="80px">
                          <Select
                            name={`type-${key}`}
                            value={product.discountType}
                            onChange={(value) => updateProductType(key, value)}
                            options={[
                              { label: '%', value: 'percentage' },
                              { label: '$', value: 'fixedAmount' }
                            ]}
                          />
                        </Box>
                        <Box minWidth="120px">
                          <NumberField
                            name={`discount-${key}`}
                            value={product.value?.toString() || "0"}
                            onChange={(value) => updateProductValue(key, value)}
                            prefix={product.discountType === 'fixedAmount' ? '$' : ''}
                            suffix={product.discountType === 'percentage' ? '%' : ''}
                            min={0}
                            max={product.discountType === 'percentage' ? 100 : undefined}
                          />
                        </Box>
                        <Box minWidth="100px">
                          <Badge tone="success">${calculateFinalPrice(product)}</Badge>
                        </Box>
                        <Box minWidth="80px">
                          <Button variant="plain" tone="critical" onPress={() => removeProduct(key)}>
                            <Icon name="CancelMinor" />
                          </Button>
                        </Box>
                      </InlineStack>
                    </Box>
                  ))}
                </BlockStack>
              )}
            </BlockStack>
          </Section>

          {/* Summary */}
          <Section>
            <BlockStack gap="base">
              <Heading size="small">Summary</Heading>
              <InlineStack gap="base">
                <Box padding="base" border="base" minWidth="200px">
                  <BlockStack gap="tight">
                    <Text variant="bodySm" tone="subdued">Total Products</Text>
                    <Text variant="headingMd">{totalProducts}</Text>
                  </BlockStack>
                </Box>
                <Box padding="base" border="base" minWidth="200px">
                  <BlockStack gap="tight">
                    <Text variant="bodySm" tone="subdued">Average Discount</Text>
                    <Text variant="headingMd">
                      {totalProducts > 0 
                        ? (productEntries.reduce((sum, [_, p]) => sum + parseFloat(p.value || 0), 0) / totalProducts).toFixed(1) 
                        : 0}%
                    </Text>
                  </BlockStack>
                </Box>
              </InlineStack>
              <Box padding="base" border="base">
                <InlineStack gap="base" align="center">
                  <Text variant="bodySm" tone="subdued">
                    Discounts applied based on SKU when available
                  </Text>
                  <Badge tone="success">Active</Badge>
                </InlineStack>
              </Box>
            </BlockStack>
          </Section>
        </BlockStack>
      </Form>
    </FunctionSettings>
  );
}