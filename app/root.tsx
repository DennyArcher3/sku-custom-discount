import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        {/* Add Polaris Web Components script */}
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge-ui-experimental.js"></script>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  // Log to understand what's happening
  console.error("Root ErrorBoundary caught:", error);
  
  // If it's a Response object, check if it's the problematic 200 OK
  if (error instanceof Response) {
    console.error("Response in root error boundary:", {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    });
    
    // Don't render "200 OK" for authentication responses
    if (error.status === 200) {
      return (
        <html>
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <Meta />
            <Links />
          </head>
          <body>
            <div style={{ padding: "20px", fontFamily: "system-ui" }}>
              <h1>Loading...</h1>
              <p>Redirecting to Shopify authentication...</p>
            </div>
            <Scripts />
          </body>
        </html>
      );
    }
  }
  
  // For other errors, show error details
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ padding: "20px", fontFamily: "system-ui" }}>
          <h1>Unexpected Error</h1>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
