import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import { useLoaderData, useRouteError } from "@remix-run/react";
import type { Env } from "../../server";
import { boundary } from "@shopify/shopify-app-remix/server";
import {
  Page,
  Layout,
  Card,
  Button,
  Text,
  Banner,
  Badge,
  InlineStack,
  BlockStack,
  Box,
  Divider,
} from "@shopify/polaris";
import {
  DiscountIcon,
  ImportIcon,
  ViewIcon,
} from "@shopify/polaris-icons";

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

  return (
    <Page>
      <BlockStack gap="800">
        {/* Welcome Banner */}
        <Banner
          title="Create targeted discounts by SKU"
          tone="info"
        >
          <p>Apply percentage discounts to specific products using their SKU codes. Perfect for clearance sales, vendor-specific promotions, or targeted campaigns.</p>
        </Banner>

        {/* Main Actions */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingLg" as="h2">
                  Get Started with SKU Discounts
                </Text>
                <Text variant="bodyMd" as="p" tone="subdued">
                  Create powerful, targeted discounts that apply only to products with specific SKU codes.
                </Text>
                <Box paddingBlockStart="400">
                  <Button
                    variant="primary"
                    size="large"
                    icon={DiscountIcon}
                    onClick={handleCreateDiscount}
                  >
                    Create New Discount
                  </Button>
                </Box>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="400">
                <InlineStack align="space-between">
                  <Text variant="headingMd" as="h3">
                    Quick Links
                  </Text>
                </InlineStack>
                <BlockStack gap="200">
                  <Button
                    variant="plain"
                    icon={ViewIcon}
                    onClick={() => window.open(`https://admin.shopify.com/store/${shopHandle}/discounts`, '_blank')}
                  >
                    View All Discounts
                  </Button>
                  <Button
                    variant="plain"
                    icon={ImportIcon}
                    onClick={() => window.open('https://help.shopify.com/en/manual/discounts', '_blank')}
                  >
                    Documentation
                  </Button>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Features */}
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">
            Key Features
          </Text>
          <Layout>
            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="400">
                  <Box>
                    <Badge tone="success">SKU Targeting</Badge>
                  </Box>
                  <Text variant="headingMd" as="h3">
                    Precise SKU Targeting
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Apply discounts to specific products by entering their exact SKU codes. No more broad category discounts when you need precision.
                  </Text>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="400">
                  <Box>
                    <Badge tone="success">Bulk Import</Badge>
                  </Box>
                  <Text variant="headingMd" as="h3">
                    Bulk SKU Import
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Import multiple SKUs at once with their corresponding discount percentages. Save time when creating large-scale promotions.
                  </Text>
                </BlockStack>
              </Card>
            </Layout.Section>

            <Layout.Section variant="oneThird">
              <Card>
                <BlockStack gap="400">
                  <Box>
                    <Badge tone="success">Live Preview</Badge>
                  </Box>
                  <Text variant="headingMd" as="h3">
                    Real-time Preview
                  </Text>
                  <Text variant="bodyMd" as="p">
                    See exactly which products will be affected by your discount before saving. Avoid mistakes with instant visual feedback.
                  </Text>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        </BlockStack>

        {/* How It Works */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingLg" as="h2">
              How It Works
            </Text>
            <Divider />
            <BlockStack gap="400">
              {[
                { step: 1, title: "Create Discount", description: "Click 'Create New Discount' to open Shopify's discount creation page" },
                { step: 2, title: "Configure SKUs", description: "Enter SKU codes and set discount percentages for each" },
                { step: 3, title: "Set Parameters", description: "Choose date range, usage limits, and other discount settings" },
                { step: 4, title: "Preview & Save", description: "Review affected products and save your discount" },
                { step: 5, title: "Go Live", description: "Your SKU-based discount is now active in your store!" }
              ].map((item) => (
                <InlineStack key={item.step} gap="400" blockAlign="start">
                  <Box minWidth="40px">
                    <Badge tone="info">{item.step.toString()}</Badge>
                  </Box>
                  <BlockStack gap="200">
                    <Text variant="headingSm" as="h4">
                      {item.title}
                    </Text>
                    <Text variant="bodyMd" as="p" tone="subdued">
                      {item.description}
                    </Text>
                  </BlockStack>
                </InlineStack>
              ))}
            </BlockStack>
          </BlockStack>
        </Card>

        {/* Support Section */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h3">
                  Need Help?
                </Text>
                <Text variant="bodyMd" as="p">
                  Check out our documentation for detailed guides and best practices for creating SKU-based discounts.
                </Text>
                <InlineStack gap="400">
                  <Button
                    variant="secondary"
                    onClick={() => window.open('https://help.shopify.com/en/manual/discounts', '_blank')}
                  >
                    View Documentation
                  </Button>
                  <Button
                    variant="plain"
                    onClick={() => window.open('mailto:support@example.com', '_blank')}
                  >
                    Contact Support
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
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