import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import { useLoaderData, useRouteError } from "@remix-run/react";
import type { Env } from "../../server";
import { boundary } from "@shopify/shopify-app-remix/server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { admin, session } = await shopify.authenticate.admin(request);
  
  // Track shop installation if not already tracked
  try {
    const existingShop = await env.DB.prepare(
      "SELECT id FROM shops WHERE shop = ?"
    ).bind(session.shop).first();

    if (!existingShop) {
      // New installation
      await env.DB.prepare(
        "INSERT INTO shops (shop) VALUES (?)"
      ).bind(session.shop).run();
      
      await env.DB.prepare(
        "INSERT INTO installation_logs (shop, event_type) VALUES (?, 'install')"
      ).bind(session.shop).run();
    } else {
      // Check if it's a reinstallation
      const shopData = await env.DB.prepare(
        "SELECT * FROM shops WHERE shop = ?"
      ).bind(session.shop).first();
      
      if (shopData && shopData.uninstalled_at) {
        // Reinstallation - update the shop record
        await env.DB.prepare(
          "UPDATE shops SET uninstalled_at = NULL, reinstalled_at = CURRENT_TIMESTAMP WHERE shop = ?"
        ).bind(session.shop).run();
        
        await env.DB.prepare(
          "INSERT INTO installation_logs (shop, event_type) VALUES (?, 'reinstall')"
        ).bind(session.shop).run();
      }
    }
  } catch (error) {
    console.error('Error tracking installation:', error);
  }
  
  // Extract shop handle from full shop domain
  const shopHandle = session.shop.replace('.myshopify.com', '');
  
  // Get function ID dynamically using shopifyFunctions query
  let functionId = '';
  
  try {
    // Query for available Shopify functions
    const functionsQuery = `
      query shopifyFunctions($first: Int!, $after: String) {
        shopifyFunctions(first: $first, after: $after) {
          nodes {
            id
            title
            apiType
            app {
              id
              title
            }
          }
        }
      }
    `;
    
    const response = await admin.graphql(functionsQuery, {
      variables: {
        first: 25
      }
    });
    const data = await response.json();
    
    if (data?.data?.shopifyFunctions?.nodes) {
      // Find our discount function by matching app title or function title
      const discountFunction = data.data.shopifyFunctions.nodes.find(
        (fn: any) => {
          // Match by function title or API type
          return fn.apiType === 'product_discounts' || 
                 fn.title?.toLowerCase().includes('sku') ||
                 fn.title?.toLowerCase().includes('discount');
        }
      );
      
      if (discountFunction) {
        functionId = discountFunction.id;
        console.log('Found discount function dynamically:', {
          id: functionId,
          title: discountFunction.title,
          apiType: discountFunction.apiType
        });
      } else {
        // Fallback to environment variable
        functionId = env.SHOPIFY_DISCOUNT_FUNCTION_ID || '';
        console.log('Using function ID from environment:', functionId);
      }
    }
  } catch (error) {
    console.error('Error fetching function ID:', error);
    // Fallback to environment variable
    functionId = env.SHOPIFY_DISCOUNT_FUNCTION_ID || '';
  }
  
  // Return data for the UI
  return {
    shop: session.shop,
    shopHandle,
    functionId
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const { shopHandle, functionId } = data;
  
  const handleCreateDiscount = () => {
    const discountUrl = `https://admin.shopify.com/store/${shopHandle}/discounts/new/app?functionId=${functionId}`;
    window.open(discountUrl, '_blank');
  };

  const features = [
    { title: "SKU-Based Targeting", description: "Apply discounts to specific products by entering their SKU codes" },
    { title: "Bulk Import", description: "Import multiple SKUs and discount percentages at once" },
    { title: "Real-time Preview", description: "See which products will be affected before saving" }
  ];

  const steps = [
    "Click 'Create Discount' to open Shopify's discount page",
    "Your app will be pre-selected in the discount type",
    "Enter SKUs and discount percentages",
    "Set date range and usage limits",
    "Save and your discount is live!"
  ];

  return (
    <s-page>
      {/* Hero Section with Banner */}
      <s-banner tone="info" heading="Create SKU-Based Discounts">
        Target specific products by their SKU codes and apply percentage discounts automatically
      </s-banner>
      
      <s-section>
        <s-stack gap="large">
          <s-box>
            <s-stack gap="base">
              <s-heading>Welcome to SKU Custom Discount</s-heading>
              <s-text>Create powerful, targeted discounts that apply only to specific products in your store. Simply enter SKU codes and discount percentages to get started.</s-text>
            </s-stack>
          </s-box>
          <s-box>
            <s-button variant="primary" onClick={handleCreateDiscount}>
              Create Your First Discount
            </s-button>
          </s-box>
        </s-stack>
      </s-section>

      {/* Features Section */}
      <s-section heading="Key Features">
        <s-grid>
          {features.map((feature, index) => (
            <s-box key={index} padding="large" background="subdued" borderRadius="base" border="base">
              <s-stack gap="base">
                <s-box>
                  <s-badge tone="success">{index + 1}</s-badge>
                </s-box>
                <s-stack gap="small">
                  <s-heading>{feature.title}</s-heading>
                  <s-text>{feature.description}</s-text>
                </s-stack>
              </s-stack>
            </s-box>
          ))}
        </s-grid>
      </s-section>

      {/* How it Works Section */}
      <s-section heading="How It Works">
        <s-stack gap="base">
          {steps.map((step, index) => (
            <s-box key={index}>
              <s-stack gap="small">
                <s-badge tone="info">{index + 1}</s-badge>
                <s-text>{step}</s-text>
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-section>

      {/* Quick Actions Section */}
      <s-section heading="Quick Actions">
        <s-grid>
          <s-section>
            <s-stack gap="base">
              <s-heading>Need Help?</s-heading>
              <s-text>View our documentation for detailed guides and examples</s-text>
              <s-box>
                <s-button variant="secondary" href="https://help.shopify.com/en/manual/discounts" target="_blank">
                  View Documentation
                </s-button>
              </s-box>
            </s-stack>
          </s-section>
          <s-section>
            <s-stack gap="base">
              <s-heading>Manage Discounts</s-heading>
              <s-text>View and edit your existing SKU-based discounts</s-text>
              <s-box>
                <s-button variant="secondary" href={`https://admin.shopify.com/store/${shopHandle}/discounts`} target="_blank">
                  View All Discounts
                </s-button>
              </s-box>
            </s-stack>
          </s-section>
        </s-grid>
      </s-section>
    </s-page>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  // Handle authentication responses
  if (error instanceof Response && error.status === 200) {
    // Don't render "200 OK" for successful authentication responses
    return null;
  }
  
  return boundary.error(error);
}