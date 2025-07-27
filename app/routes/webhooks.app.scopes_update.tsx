import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
    const { env } = context as { env: Env };
    const shopify = createShopifyApp(env);
    const { payload, session, topic, shop } = await shopify.authenticate.webhook(request);
    console.log(`Received ${topic} webhook for ${shop}`);

    const current = payload.current as string[];
    if (session) {
        // In production, you would update session scope in KV or D1
        console.log(`Updated scopes for shop ${shop}: ${current.toString()}`);
    }
    return new Response();
};

// Export default to prevent empty chunk warning
export default function WebhookScopesUpdate() {
    return null;
}
