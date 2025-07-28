import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  
  try {
    console.log("Session token auth request:", request.url);
    return await shopify.authenticate.admin(request);
  } catch (error) {
    console.error("Session token auth error:", error);
    // Always return Response objects, never throw
    if (error instanceof Response) {
      return error;
    }
    return new Response("Session token authentication failed", { status: 500 });
  }
};

// Add default export to prevent empty chunk warning
export default function AuthSessionToken() {
  return null;
}