import { renderToReadableStream } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/cloudflare";
import { isbot } from "isbot";
import { getShopifyApi } from "./shopify.server";

export const streamTimeout = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: any
) {
  const shopifyApi = getShopifyApi(loadContext);
  shopifyApi.addDocumentResponseHeaders(request, responseHeaders);
  
  const userAgent = request.headers.get("user-agent");
  const isBot = isbot(userAgent ?? '');

  const stream = await renderToReadableStream(
    <RemixServer
      context={remixContext}
      url={request.url}
    />,
    {
      signal: AbortSignal.timeout(streamTimeout),
      onError(error: unknown) {
        responseStatusCode = 500;
        console.error(error);
      },
    }
  );

  if (isBot) {
    await stream.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  return new Response(stream, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
