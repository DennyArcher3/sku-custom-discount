import {
  reactExtension,
  useApi,
  FunctionSettings,
  Form,
  BlockStack,
  Text,
  TextField,
  NumberField,
  Box,
  InlineStack,
  Heading,
  Button,
  Icon,
  Badge,
  Banner,
  Select,
  Divider,
  // When 2025.10 React support is available, these will be imported:
  // Table,
  // TableBody,
  // TableRow,
  // TableCell,
  // TableHeader,
  // TableHeaderRow,
  // Grid,
  // GridItem,
  // Stack,
  // QueryContainer,
  // OrderedList,
} from "@shopify/ui-extensions-react/admin";
import { useState } from "react";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// This is a preview of how your discount settings could look with the new Table component
export default reactExtension(TARGET, () => {
  return <DiscountSettingsWithTable />;
});

function DiscountSettingsWithTable() {
  const api = useApi(TARGET);
  const { applyMetafieldChange, i18n, data, loading } = api;
  
  const [products, setProducts] = useState([
    { id: "1", title: "Sample Product 1", sku: "SKU-001", price: "29.99", discount: 10, discountType: "percentage" },
    { id: "2", title: "Sample Product 2", sku: "SKU-002", price: "49.99", discount: 5, discountType: "fixedAmount" },
  ]);

  const updateProductDiscount = (id, value) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, discount: parseFloat(value) || 0 } : p
    ));
  };

  const removeProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return <Text>{i18n.translate("loading")}</Text>;
  }

  return (
    <FunctionSettings>
      <Form>
        <BlockStack gap="large">
          <Section>
            <BlockStack gap="base">
              <Heading>Product Discount Manager - Table Version</Heading>
              <Badge tone="info">Using new 2025-10 Table Component (Preview)</Badge>
            </BlockStack>
          </Section>

          <Divider />

          {/* 
            When Table component is available in React, replace this section with:
            
            <Table 
              loading={loading}
              paginate={products.length > 10}
              variant="auto"
            >
              <TableHeaderRow>
                <TableHeader>Product</TableHeader>
                <TableHeader>SKU</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Discount</TableHeader>
                <TableHeader>Final Price</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableHeaderRow>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>
                      <Select
                        label=""
                        value={product.discountType}
                        onChange={(value) => updateProductType(product.id, value)}
                        options={[
                          { value: 'percentage', label: 'Percentage' },
                          { value: 'fixedAmount', label: 'Fixed Amount' }
                        ]}
                      />
                    </TableCell>
                    <TableCell>
                      <NumberField
                        label=""
                        value={product.discount.toString()}
                        onChange={(value) => updateProductDiscount(product.id, value)}
                        prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                        suffix={product.discountType === 'percentage' ? "%" : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      ${calculateFinalPrice(product)}
                    </TableCell>
                    <TableCell>
                      <Button variant="plain" tone="critical" onClick={() => removeProduct(product.id)}>
                        <Icon name="CancelMinor" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          */}

          {/* Temporary fallback using current components */}
          <Section>
            <BlockStack gap="base">
              <Text fontWeight="semiBold">Product Discounts (Table component coming in 2025.10)</Text>
              
              {/* Simulating table with current components */}
              <Box border="base" borderRadius="base">
                {/* Header */}
                <Box padding="base" background="subdued" borderBlockEnd="base">
                  <InlineStack gap="base" blockAlignment="center">
                    <Box minInlineSize={200}><Text fontWeight="semiBold">Product</Text></Box>
                    <Box minInlineSize={100}><Text fontWeight="semiBold">SKU</Text></Box>
                    <Box minInlineSize={80}><Text fontWeight="semiBold">Price</Text></Box>
                    <Box minInlineSize={100}><Text fontWeight="semiBold">Type</Text></Box>
                    <Box minInlineSize={100}><Text fontWeight="semiBold">Discount</Text></Box>
                    <Box minInlineSize={100}><Text fontWeight="semiBold">Final</Text></Box>
                    <Box minInlineSize={60}><Text fontWeight="semiBold">Action</Text></Box>
                  </InlineStack>
                </Box>
                
                {/* Rows */}
                {products.map((product, index) => (
                  <Box 
                    key={product.id} 
                    padding="base" 
                    borderBlockEnd={index < products.length - 1 ? "base" : undefined}
                  >
                    <InlineStack gap="base" blockAlignment="center">
                      <Box minInlineSize={200}><Text truncate={1}>{product.title}</Text></Box>
                      <Box minInlineSize={100}><Text>{product.sku}</Text></Box>
                      <Box minInlineSize={80}><Badge>${product.price}</Badge></Box>
                      <Box minInlineSize={100}>
                        <Select
                          label=""
                          value={product.discountType}
                          onChange={(value) => {
                            setProducts(prev => prev.map(p => 
                              p.id === product.id ? { ...p, discountType: value } : p
                            ));
                          }}
                          options={[
                            { value: 'percentage', label: '%' },
                            { value: 'fixedAmount', label: '$' }
                          ]}
                        />
                      </Box>
                      <Box minInlineSize={100}>
                        <NumberField
                          label=""
                          value={product.discount.toString()}
                          onChange={(value) => updateProductDiscount(product.id, value)}
                          prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                          suffix={product.discountType === 'percentage' ? "%" : undefined}
                          min={0}
                          max={product.discountType === 'percentage' ? 100 : undefined}
                        />
                      </Box>
                      <Box minInlineSize={100}>
                        <Badge tone="success">
                          ${calculateFinalPrice(product)}
                        </Badge>
                      </Box>
                      <Box minInlineSize={60}>
                        <Button
                          variant="plain"
                          tone="critical"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Icon name="CancelMinor" />
                        </Button>
                      </Box>
                    </InlineStack>
                  </Box>
                ))}
              </Box>
            </BlockStack>
          </Section>

          {/* Grid Layout Example (coming in 2025.10) */}
          <Section>
            <BlockStack gap="base">
              <Heading size="small">Grid Layout Example (2025.10)</Heading>
              <Text tone="subdued">
                With the new Grid component, you'll be able to create responsive layouts:
              </Text>
              {/* 
                <Grid gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="base">
                  <GridItem>
                    <Box padding="base" border="base" borderRadius="base">
                      <Text>Grid Item 1</Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box padding="base" border="base" borderRadius="base">
                      <Text>Grid Item 2</Text>
                    </Box>
                  </GridItem>
                  <GridItem gridColumn="span 2">
                    <Box padding="base" border="base" borderRadius="base">
                      <Text>Wide Grid Item</Text>
                    </Box>
                  </GridItem>
                </Grid>
              */}
            </BlockStack>
          </Section>

          {/* Stack with new responsive features (2025.10) */}
          <Section>
            <BlockStack gap="base">
              <Heading size="small">Responsive Stack (2025.10)</Heading>
              <Text tone="subdued">
                Stack will support container queries for responsive design:
              </Text>
              {/* 
                <QueryContainer>
                  <Stack 
                    direction="@container (inline-size > 500px) inline, block"
                    gap="base"
                  >
                    <Badge>Item 1</Badge>
                    <Badge>Item 2</Badge>
                    <Badge>Item 3</Badge>
                  </Stack>
                </QueryContainer>
              */}
            </BlockStack>
          </Section>
        </BlockStack>
      </Form>
    </FunctionSettings>
  );
}

function calculateFinalPrice(product) {
  const price = parseFloat(product.price);
  const discount = parseFloat(product.discount) || 0;
  
  if (product.discountType === 'percentage') {
    return (price * (1 - discount / 100)).toFixed(2);
  } else {
    return Math.max(0, price - discount).toFixed(2);
  }
}

// Add this to your imports when available
function Section({ children }) {
  return (
    <Box>
      <BlockStack gap="base">
        {children}
      </BlockStack>
    </Box>
  );
}