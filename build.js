import { createRequestHandler } from "@remix-run/cloudflare";
// @ts-ignore
import * as build from "./build/server/index.js";

export default {
  async fetch(request, env, ctx) {
    const handler = createRequestHandler(build, env);
    return handler(request, env, ctx);
  },
};