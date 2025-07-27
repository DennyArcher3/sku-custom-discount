import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { topic, shop, payload } = await shopify.authenticate.webhook(request);

  if (topic !== "CUSTOMERS_DATA_REQUEST") {
    throw new Response("Unhandled webhook topic", { status: 400 });
  }

  // Log the data request
  console.log(`Customer data request received for shop ${shop}`, payload);

  // Since our app doesn't store any customer data, we can respond that we have no data
  // In a real scenario where you store customer data, you would:
  // 1. Look up any data associated with the customer
  // 2. Send an email to the shop owner with the data
  // 3. Or provide a URL where the data can be downloaded

  // For this app, we don't store customer data, so we acknowledge the request
  return json({
    success: true,
    message: "No customer data stored by this app"
  });
};

// Export default to prevent empty chunk warning
export default function WebhookCustomersDataRequest() {
  return null;
}