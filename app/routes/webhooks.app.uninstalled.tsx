import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  const { shop, topic } = await shopify.authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  try {
    // Update shop status in D1
    await env.DB.prepare(
      "UPDATE shops SET is_active = FALSE, uninstalled_at = CURRENT_TIMESTAMP WHERE shop = ?"
    ).bind(shop).run();

    // Log the uninstallation
    await env.DB.prepare(
      "INSERT INTO installation_logs (shop, event_type) VALUES (?, 'uninstall')"
    ).bind(shop).run();

    console.log(`App uninstalled for shop: ${shop}`);
  } catch (error) {
    console.error(`Error processing uninstall for ${shop}:`, error);
  }

  return new Response();
};

// Export default to prevent empty chunk warning
export default function WebhookAppUninstalled() {
  return null;
}
