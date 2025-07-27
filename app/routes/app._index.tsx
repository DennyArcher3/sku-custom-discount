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
      <s-section>
        <s-stack gap="large">
          {/* Hero Card */}
          <s-card>
            <s-grid>
              <s-stack gap="small">
                <s-heading>SKU Custom Discount</s-heading>
                <s-text tone="neutral">Apply targeted percentage discounts to specific products using SKU codes</s-text>
              </s-stack>
              <s-button variant="primary" onClick={handleCreateDiscount}>
                Create Discount
              </s-button>
            </s-grid>
          </s-card>

          {/* Features Grid */}
          <s-grid>
            {features.map((feature, index) => (
              <s-card key={index}>
                <s-stack gap="small">
                  <s-heading>{feature.title}</s-heading>
                  <s-text tone="neutral">{feature.description}</s-text>
                </s-stack>
              </s-card>
            ))}
          </s-grid>

          {/* How it Works */}
          <s-card>
            <s-stack gap="base">
              <s-heading>How It Works</s-heading>
              <s-stack gap="small">
                {steps.map((step, index) => (
                  <s-inline-stack key={index} gap="small">
                    <s-badge tone="info">{index + 1}</s-badge>
                    <s-text>{step}</s-text>
                  </s-inline-stack>
                ))}
              </s-stack>
            </s-stack>
          </s-card>

          {/* Quick Actions */}
          <s-grid>
            <s-card>
              <s-stack gap="small">
                <s-heading>Need Help?</s-heading>
                <s-text tone="neutral">View our documentation for detailed guides and examples</s-text>
                <s-button variant="secondary" url="https://help.shopify.com/en/manual/discounts" external>
                  View Documentation
                </s-button>
              </s-stack>
            </s-card>
            <s-card>
              <s-stack gap="small">
                <s-heading>Manage Discounts</s-heading>
                <s-text tone="neutral">View and edit your existing SKU-based discounts</s-text>
                <s-button variant="secondary" url={`https://admin.shopify.com/store/${shopHandle}/discounts`} external>
                  View All Discounts
                </s-button>
              </s-stack>
            </s-card>
          </s-grid>
        </s-stack>
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