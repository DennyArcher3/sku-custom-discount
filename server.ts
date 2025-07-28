import { createRequestHandler } from "@remix-run/cloudflare";
// @ts-ignore
import * as build from "./build/server";

export interface Env {
  SESSIONS: KVNamespace;
  DB: D1Database;
  SHOPIFY_API_KEY: string;
  SHOPIFY_API_SECRET: string;
  SHOPIFY_APP_URL: string;
  SCOPES: string;
  SHOPIFY_DISCOUNT_FUNCTION_ID?: string;
  SHOP_CUSTOM_DOMAIN?: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    try {
      // Log incoming requests
      console.log(`Incoming request: ${request.method} ${request.url}`);
      
      const handler = createRequestHandler(build as any, "production");
      const loadContext = { env };
      const response = await handler(request, loadContext);
      
      console.log(`Response status: ${response.status}`);
      
      // Debug: Log response details
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      
      // Check if this is a problematic response
      const contentType = response.headers.get("content-type");
      if (response.status === 200 && (!contentType || contentType.includes("text/plain"))) {
        // Clone the response so we can read it without consuming
        const clonedResponse = response.clone();
        const text = await clonedResponse.text();
        
        console.log("Response body preview:", text.substring(0, 100));
        
        // If it's just "200 OK" or similar plain text, it's likely an auth issue
        if (text.trim() === "200 OK" || text.trim() === "OK") {
          console.error("Detected problematic plain text response:", text);
          
          // Check if this is an authentication path
          const url = new URL(request.url);
          if (url.pathname.startsWith("/auth") || url.pathname === "/app") {
            console.log("Auth-related path detected, allowing response through");
            return response;
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error("Server error:", error);
      return new Response(`Unexpected Server Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};