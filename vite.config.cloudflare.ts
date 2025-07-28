import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: false,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      // Ensure we're using the Cloudflare runtime imports
      "@remix-run/node": "@remix-run/cloudflare",
    },
  },
  build: {
    target: "esnext",
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    target: "webworker",
    noExternal: true,
    resolve: {
      conditions: ["workerd", "worker", "browser"],
      externalConditions: ["workerd", "worker"],
    },
  },
  optimizeDeps: {
    include: ["@shopify/polaris", "@shopify/app-bridge-react"],
    esbuildOptions: {
      target: "esnext",
      platform: "browser",
    },
  },
});