// Cloudflare adapter is loaded automatically by Remix
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { KVSessionStorage } from "@shopify/shopify-app-session-storage-kv";
import type { Env } from "../server";

// Cloudflare Workers environment

// Create a function to get Shopify app instance
export function createShopifyApp(env: Env) {
  // Session storage - use KV in production
  const sessionStorage = new KVSessionStorage(env.SESSIONS);

  return shopifyApp({
    apiKey: env.SHOPIFY_API_KEY,
    apiSecretKey: env.SHOPIFY_API_SECRET || "",
    apiVersion: ApiVersion.January25,
    scopes: env.SCOPES?.split(","),
    appUrl: env.SHOPIFY_APP_URL || "",
    authPathPrefix: "/auth",
    sessionStorage,
    distribution: AppDistribution.AppStore,
    isEmbeddedApp: true,
    future: {
      v3_webhookAdminContext: true,
      v3_authenticatePublic: true,
      v3_lineItemBilling: true,
      unstable_newEmbeddedAuthStrategy: true,
    },
    ...(env.SHOP_CUSTOM_DOMAIN
      ? { customShopDomains: [env.SHOP_CUSTOM_DOMAIN] }
      : {}),
  });
}

export const apiVersion = ApiVersion.January25;

// Export functions that work with context
export function getShopifyApi(context: { env: Env }) {
  const shopifyInstance = createShopifyApp(context.env);
  return {
    addDocumentResponseHeaders: shopifyInstance.addDocumentResponseHeaders,
    authenticate: shopifyInstance.authenticate,
    unauthenticated: shopifyInstance.unauthenticated,
    login: shopifyInstance.login,
    registerWebhooks: shopifyInstance.registerWebhooks,
    sessionStorage: shopifyInstance.sessionStorage,
  };
}