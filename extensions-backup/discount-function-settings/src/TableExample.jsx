import {
  reactExtension,
  useApi,
  FunctionSettings,
  Form,
  BlockStack,
  Text,
  Heading,
  // Note: In 2025-10, Table components might be available as:
  // Table, TableBody, TableRow, TableCell, TableHeader, TableHeaderRow
  // Grid, GridItem, Stack, QueryContainer, OrderedList
} from "@shopify/ui-extensions-react/admin";
import { useState } from "react";

// Example of how the new Table component might be used in 2025-10
// Note: This is based on the web component documentation, React API might differ slightly

export function TableExample() {
  const [products, setProducts] = useState([
    { id: 1, name: "Product A", sku: "SKU-001", discount: 10 },
    { id: 2, name: "Product B", sku: "SKU-002", discount: 15 },
    { id: 3, name: "Product C", sku: "SKU-003", discount: 20 },
  ]);

  return (
    <BlockStack gap="large">
      <Heading>Product Discounts Table</Heading>
      
      {/* 
        Based on 2025-10 documentation, the Table component structure would be:
        
        <Table>
          <TableHeaderRow>
            <TableHeader>Product Name</TableHeader>
            <TableHeader>SKU</TableHeader>
            <TableHeader>Discount %</TableHeader>
          </TableHeaderRow>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.discount}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      */}
      
      {/* For now, using existing components to simulate table layout */}
      <Text>Table component will be available in 2025-10 stable release</Text>
    </BlockStack>
  );
}

// Example with Grid component (2025-10)
export function GridExample() {
  return (
    <BlockStack gap="large">
      <Heading>Grid Layout Example</Heading>
      
      {/*
        Based on documentation, Grid usage would be:
        
        <Grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
          <GridItem>Item 1</GridItem>
          <GridItem>Item 2</GridItem>
          <GridItem>Item 3</GridItem>
          <GridItem gridColumn="span 2">Wide Item</GridItem>
          <GridItem>Item 5</GridItem>
        </Grid>
      */}
    </BlockStack>
  );
}

// Example with Stack component (improved in 2025-10)
export function StackExample() {
  return (
    <BlockStack gap="large">
      <Heading>Stack Layout Example</Heading>
      
      {/*
        Stack component with new properties:
        
        <Stack direction="inline" gap="base" alignItems="center">
          <Text>Item 1</Text>
          <Text>Item 2</Text>
          <Text>Item 3</Text>
        </Stack>
      */}
    </BlockStack>
  );
}

// Example with QueryContainer (2025-10)
export function QueryContainerExample() {
  return (
    <BlockStack gap="large">
      <Heading>Query Container Example</Heading>
      
      {/*
        QueryContainer for responsive design:
        
        <QueryContainer>
          <Stack 
            direction="@container (inline-size > 500px) inline, block"
            gap="base"
          >
            <Text>Responsive Item 1</Text>
            <Text>Responsive Item 2</Text>
          </Stack>
        </QueryContainer>
      */}
    </BlockStack>
  );
}

// Example with OrderedList (2025-10)
export function OrderedListExample() {
  return (
    <BlockStack gap="large">
      <Heading>Ordered List Example</Heading>
      
      {/*
        OrderedList for numbered items:
        
        <OrderedList>
          <Text>First step in the process</Text>
          <Text>Second step in the process</Text>
          <Text>Third step in the process</Text>
        </OrderedList>
      */}
    </BlockStack>
  );
}