import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { admin } = await shopify.authenticate.admin(request);
  
  const functionId = env.SHOPIFY_DISCOUNT_FUNCTION_ID || '';
  
  // Simple test query to see ALL discounts
  const testQuery = `
    query {
      discountNodes(first: 50) {
        edges {
          node {
            id
            discount {
              __typename
              ... on DiscountAutomaticApp {
                title
                appDiscountType {
                  functionId
                  app {
                    title
                  }
                }
              }
              ... on DiscountCodeApp {
                title
                appDiscountType {
                  functionId
                  app {
                    title
                  }
                }
              }
              ... on DiscountAutomaticBasic {
                title
              }
              ... on DiscountCodeBasic {
                title
              }
            }
          }
        }
      }
      app {
        id
        title
        handle
        developerName
      }
    }
  `;
  
  try {
    const response = await admin.graphql(testQuery);
    const data = await response.json();
    
    const discounts = data?.data?.discountNodes?.edges || [];
    const appDiscounts = discounts.filter((edge: any) => 
      edge.node.discount.__typename === 'DiscountAutomaticApp' || 
      edge.node.discount.__typename === 'DiscountCodeApp'
    );
    
    const appInfo = data?.data?.app || null;
    const ourAppDiscounts = appDiscounts.filter((edge: any) => 
      edge.node.discount.appDiscountType?.functionId === functionId
    );
    
    return json({
      functionId,
      totalDiscounts: discounts.length,
      appDiscounts: appDiscounts.length,
      ourAppDiscounts: ourAppDiscounts.length,
      appInfo: {
        id: appInfo?.id,
        title: appInfo?.title,
        handle: appInfo?.handle,
        developerName: appInfo?.developerName
      },
      discounts: discounts.map((edge: any) => ({
        id: edge.node.id,
        type: edge.node.discount.__typename,
        title: edge.node.discount.title,
        functionId: edge.node.discount.appDiscountType?.functionId,
        appTitle: edge.node.discount.appDiscountType?.app?.title,
      })),
      errors: data.errors,
    });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'Unknown error',
      functionId,
    }, { status: 500 });
  }
};