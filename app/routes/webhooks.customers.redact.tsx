import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { topic, shop, payload } = await shopify.authenticate.webhook(request);

  if (topic !== "CUSTOMERS_REDACT") {
    throw new Response("Unhandled webhook topic", { status: 400 });
  }

  // Log the redaction request
  console.log(`Customer redaction request received for shop ${shop}`, payload);

  // Since our app doesn't store any customer data, there's nothing to redact
  // In a real scenario where you store customer data, you would:
  // 1. Delete or anonymize any data associated with the customer
  // 2. Ensure all backups are also updated
  // 3. Log the redaction for compliance

  // For this app, we don't store customer data, so we acknowledge the request
  return json({
    success: true,
    message: "No customer data to redact"
  });
};

// Export default to prevent empty chunk warning
export default function WebhookCustomersRedact() {
  return null;
}