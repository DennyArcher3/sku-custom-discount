import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { createShopifyApp } from "../shopify.server";
import type { Env } from "../../server";

export const links = () => {
  // In production with Cloudflare Workers, use CDN directly
  if (typeof polarisStyles === 'string' && polarisStyles.startsWith('/')) {
    return [
      { rel: "stylesheet", href: polarisStyles },
      // Fallback to CDN if local import fails
      { rel: "stylesheet", href: "https://unpkg.com/@shopify/polaris@13.9.0/build/esm/styles.css" }
    ];
  }
  
  // Use CDN as primary source for Cloudflare Workers
  return [
    { rel: "stylesheet", href: "https://unpkg.com/@shopify/polaris@13.9.0/build/esm/styles.css" }
  ];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { env } = context as { env: Env };
  const shopify = createShopifyApp(env);
  
  console.log("App loader - authenticating request:", request.url);
  
  try {
    const authResult = await shopify.authenticate.admin(request);
    console.log("Authentication successful, session:", authResult.session);
    
    // Make sure we have a valid session
    if (!authResult.session?.shop) {
      console.error("No shop in session");
      // Return a redirect to auth instead of throwing
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/auth?shop=${new URL(request.url).searchParams.get("shop") || ""}`
        }
      });
    }
    
    return json({ 
      apiKey: env.SHOPIFY_API_KEY || "",
      shop: authResult.session.shop
    });
  } catch (error) {
    console.error("Authentication error in app.tsx:", error);
    
    // If it's a Response, check if it's a redirect
    if (error instanceof Response) {
      console.log("Error is a Response with status:", error.status);
      // Only throw redirects and client errors
      if ((error.status >= 300 && error.status < 400) || error.status >= 400) {
        throw error;
      }
      // For other responses, return them
      return error;
    }
    
    throw error;
  }
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  const error = useRouteError();
  
  console.log("Error boundary triggered:", error);
  
  // Check if this is a Response error
  if (error instanceof Response) {
    console.log("Response error status:", error.status);
    console.log("Response headers:", Object.fromEntries(error.headers.entries()));
    
    // For any successful response, don't treat it as an error
    if (error.status >= 200 && error.status < 300) {
      return null;
    }
  }
  
  return boundary.error(error);
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
