import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  
  try {
    console.log("Auth.$ handling:", request.url);
    return await shopify.authenticate.admin(request);
  } catch (error) {
    console.error("Auth.$ error:", error);
    // If it's already a Response, return it instead of throwing
    if (error instanceof Response) {
      return error;
    }
    // Otherwise, return an error response
    return new Response("Authentication failed", { status: 500 });
  }
};

// Export default to prevent empty chunk warning
export default function AuthCatchAll() {
  return null;
}
