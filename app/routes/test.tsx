import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ 
    message: "Worker is functioning correctly",
    url: request.url,
    timestamp: new Date().toISOString()
  });
};