// Example of using Polaris web components in your App Home (main Remix app)
// These components are available because we added the script tag in root.tsx

export function PolarisTableExample() {
  const products = [
    { id: '1', name: 'Product A', sku: 'SKU-001', price: '$29.99', discount: '10%' },
    { id: '2', name: 'Product B', sku: 'SKU-002', price: '$49.99', discount: '15%' },
    { id: '3', name: 'Product C', sku: 'SKU-003', price: '$99.99', discount: '20%' },
  ];

  return (
    <s-page title="Discount Products">
      <s-section>
        <s-stack gap="large">
          <s-heading>Products with Discounts</s-heading>
          
          {/* The new Table component from Polaris web components */}
          <s-table variant="auto">
            <s-table-header-row>
              <s-table-header>Product Name</s-table-header>
              <s-table-header>SKU</s-table-header>
              <s-table-header>Price</s-table-header>
              <s-table-header>Discount</s-table-header>
              <s-table-header>Final Price</s-table-header>
            </s-table-header-row>
            <s-table-body>
              {products.map(product => (
                <s-table-row key={product.id}>
                  <s-table-cell>{product.name}</s-table-cell>
                  <s-table-cell>
                    <s-badge>{product.sku}</s-badge>
                  </s-table-cell>
                  <s-table-cell>{product.price}</s-table-cell>
                  <s-table-cell>
                    <s-badge tone="success">{product.discount}</s-badge>
                  </s-table-cell>
                  <s-table-cell>
                    {calculateFinalPrice(product.price, product.discount)}
                  </s-table-cell>
                </s-table-row>
              ))}
            </s-table-body>
          </s-table>

          {/* Grid Layout Example */}
          <s-heading size="small">Summary</s-heading>
          <s-grid gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="base">
            <s-grid-item>
              <s-box padding="base" border="base" borderRadius="base">
                <s-stack gap="tight">
                  <s-text variant="bodySm" tone="subdued">Total Products</s-text>
                  <s-text variant="headingMd">{products.length}</s-text>
                </s-stack>
              </s-box>
            </s-grid-item>
            <s-grid-item>
              <s-box padding="base" border="base" borderRadius="base">
                <s-stack gap="tight">
                  <s-text variant="bodySm" tone="subdued">Average Discount</s-text>
                  <s-text variant="headingMd">15%</s-text>
                </s-stack>
              </s-box>
            </s-grid-item>
          </s-grid>

          {/* Responsive Stack Example */}
          <s-query-container>
            <s-stack 
              direction="@container (inline-size > 500px) inline, block"
              gap="base"
            >
              <s-button variant="primary">Add Product</s-button>
              <s-button variant="secondary">Export Data</s-button>
              <s-button variant="plain">View Settings</s-button>
            </s-stack>
          </s-query-container>

          {/* Ordered List Example */}
          <s-heading size="small">Setup Instructions</s-heading>
          <s-ordered-list>
            <s-text>Select products to apply discounts</s-text>
            <s-text>Set discount percentage or fixed amount</s-text>
            <s-text>Configure discount conditions</s-text>
            <s-text>Save and activate the discount</s-text>
          </s-ordered-list>
        </s-stack>
      </s-section>
    </s-page>
  );
}

function calculateFinalPrice(price: string, discount: string): string {
  const priceNum = parseFloat(price.replace('$', ''));
  const discountNum = parseFloat(discount.replace('%', ''));
  const finalPrice = priceNum * (1 - discountNum / 100);
  return `$${finalPrice.toFixed(2)}`;
}