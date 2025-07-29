import {
  reactExtension,
  useApi,
  // Note: In 2025-10, we use a different approach
  // Components are now web components that can be used directly in JSX
} from "@shopify/ui-extensions-react/admin";
import { useState, useEffect } from "react";

const TARGET = "admin.discount-details.function-settings.render";
const METAFIELD_NAMESPACE = "$app:sku-custom-discount";
const METAFIELD_KEY = "function-configuration";

// With 2025-10, you'll use web components directly in your JSX
// They work seamlessly with React but are actually native web components
export default reactExtension(TARGET, () => {
  return <App />;
});

function App() {
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
    return <s-text>{i18n.translate("loading")}</s-text>;
  }

  return (
    <s-function-settings>
      <s-form>
        <s-stack gap="large">
          <s-section>
            <s-stack gap="base">
              <s-heading>Product Discount Manager - Web Components</s-heading>
              <s-badge tone="info">Using Polaris Web Components (2025-10)</s-badge>
            </s-stack>
          </s-section>

          <s-divider />

          {/* Using the new Table component */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Product Discounts</s-heading>
              
              <s-table variant="auto">
                <s-table-header-row>
                  <s-table-header>Product</s-table-header>
                  <s-table-header>SKU</s-table-header>
                  <s-table-header>Price</s-table-header>
                  <s-table-header>Type</s-table-header>
                  <s-table-header>Discount</s-table-header>
                  <s-table-header>Final Price</s-table-header>
                  <s-table-header>Actions</s-table-header>
                </s-table-header-row>
                <s-table-body>
                  {products.map(product => (
                    <s-table-row key={product.id}>
                      <s-table-cell>{product.title}</s-table-cell>
                      <s-table-cell>{product.sku}</s-table-cell>
                      <s-table-cell>
                        <s-badge tone="info">${product.price}</s-badge>
                      </s-table-cell>
                      <s-table-cell>
                        <s-select
                          value={product.discountType}
                          onchange={(e) => {
                            const value = e.target.value;
                            setProducts(prev => prev.map(p => 
                              p.id === product.id ? { ...p, discountType: value } : p
                            ));
                          }}
                        >
                          <option value="percentage">%</option>
                          <option value="fixedAmount">$</option>
                        </s-select>
                      </s-table-cell>
                      <s-table-cell>
                        <s-number-field
                          value={product.discount.toString()}
                          onchange={(e) => updateProductDiscount(product.id, e.target.value)}
                          prefix={product.discountType === 'fixedAmount' ? "$" : undefined}
                          suffix={product.discountType === 'percentage' ? "%" : undefined}
                          min="0"
                          max={product.discountType === 'percentage' ? "100" : undefined}
                        />
                      </s-table-cell>
                      <s-table-cell>
                        <s-badge tone="success">
                          ${calculateFinalPrice(product)}
                        </s-badge>
                      </s-table-cell>
                      <s-table-cell>
                        <s-button 
                          variant="plain" 
                          tone="critical"
                          onclick={() => removeProduct(product.id)}
                        >
                          <s-icon name="CancelMinor" />
                        </s-button>
                      </s-table-cell>
                    </s-table-row>
                  ))}
                </s-table-body>
              </s-table>
            </s-stack>
          </s-section>

          {/* Grid Layout Example */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Grid Layout</s-heading>
              <s-grid gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="base">
                <s-grid-item>
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-text>Total Products: {products.length}</s-text>
                  </s-box>
                </s-grid-item>
                <s-grid-item>
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-text>Average Discount: {calculateAverageDiscount(products)}%</s-text>
                  </s-box>
                </s-grid-item>
                <s-grid-item gridColumn="span 2">
                  <s-box padding="base" border="base" borderRadius="base">
                    <s-text>Status: Active</s-text>
                  </s-box>
                </s-grid-item>
              </s-grid>
            </s-stack>
          </s-section>

          {/* Responsive Stack Example */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Responsive Stack</s-heading>
              <s-query-container>
                <s-stack 
                  direction="@container (inline-size > 500px) inline, block"
                  gap="base"
                >
                  <s-badge>Responsive Item 1</s-badge>
                  <s-badge>Responsive Item 2</s-badge>
                  <s-badge>Responsive Item 3</s-badge>
                </s-stack>
              </s-query-container>
            </s-stack>
          </s-section>

          {/* Ordered List Example */}
          <s-section>
            <s-stack gap="base">
              <s-heading size="small">Setup Instructions</s-heading>
              <s-ordered-list>
                <s-text>Select products using the product picker</s-text>
                <s-text>Set discount type (percentage or fixed amount)</s-text>
                <s-text>Enter discount value</s-text>
                <s-text>Save the configuration</s-text>
              </s-ordered-list>
            </s-stack>
          </s-section>
        </s-stack>
      </s-form>
    </s-function-settings>
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

function calculateAverageDiscount(products) {
  if (products.length === 0) return 0;
  
  const total = products.reduce((sum, product) => {
    if (product.discountType === 'percentage') {
      return sum + product.discount;
    } else {
      // Convert fixed amount to percentage for averaging
      const price = parseFloat(product.price);
      const percentage = (product.discount / price) * 100;
      return sum + percentage;
    }
  }, 0);
  
  return (total / products.length).toFixed(1);
}

// Note: With web components, event handling works differently
// - Use lowercase event names (onclick instead of onClick)
// - Events are native DOM events, not React synthetic events
// - You can still use React state and hooks normally