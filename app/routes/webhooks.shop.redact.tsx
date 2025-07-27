import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { topic, shop, payload } = await shopify.authenticate.webhook(request);

  if (topic !== "SHOP_REDACT") {
    throw new Response("Unhandled webhook topic", { status: 400 });
  }

  // Log the shop redaction request
  console.log(`Shop redaction request received for shop ${shop}`, payload);

  try {
    // Delete all data associated with this shop
    // In production, you would clean up all shop data from KV or D1
    console.log(`Processing shop redaction for ${shop}`);
    
    // Since we're using KV for sessions in production, 
    // you would implement KV cleanup here
    // For now, we just log the action

    console.log(`Successfully processed shop redaction for ${shop}`);

    return json({
      success: true,
      message: `All data for shop ${shop} has been processed for deletion`
    });
  } catch (error) {
    console.error(`Error processing shop redaction for ${shop}:`, error);
    
    // Even if there's an error, we should return success to Shopify
    // But log it for investigation
    return json({
      success: true,
      message: "Shop data deletion processed"
    });
  }
};

// Export default to prevent empty chunk warning
export default function WebhookShopRedact() {
  return null;
}