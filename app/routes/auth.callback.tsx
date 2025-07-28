import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  
  const { session } = await shopify.authenticate.admin(request);
  
  // Redirect to the app's main page after successful authentication
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/app?shop=${session.shop}`,
    },
  });
};

// Add default export to prevent empty chunk warning
export default function AuthCallback() {
  return null;
}