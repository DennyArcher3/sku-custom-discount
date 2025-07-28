import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { session } = await shopify.authenticate.admin(request);
  
  // Get the functionId from the URL
  const url = new URL(request.url);
  const functionId = url.searchParams.get("functionId");
  
  if (functionId) {
    // Redirect to Shopify's discount creation page with the functionId
    return Response.redirect(
      `https://${session.shop}/admin/discounts/new?functionId=${functionId}`,
      301
    );
  }
  
  // Default redirect to discounts page
  return Response.redirect(`https://${session.shop}/admin/discounts`);
};

// Export default to prevent empty chunk warning
export default function AppNew() {
  return null;
}