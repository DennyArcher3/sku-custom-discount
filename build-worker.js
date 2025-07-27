// Simple build script for Cloudflare Workers
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Building for Cloudflare Workers...');

// Run the Remix build first with Cloudflare config
try {
  execSync('npm run build:remix:cf', { stdio: 'inherit' });
} catch (error) {
  console.error('Remix build failed:', error);
  process.exit(1);
}

// Create JavaScript worker entry point
try {
  // Ensure build directory exists
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
  }
  
  // Create a JavaScript worker entry point
  const workerContent = `import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./server/index.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Log incoming requests
      console.log(\`Incoming request: \${request.method} \${request.url}\`);
      
      const handler = createRequestHandler(build, "production");
      const loadContext = { env };
      const response = await handler(request, loadContext);
      
      console.log(\`Response status: \${response.status}\`);
      return response;
    } catch (error) {
      console.error("Server error:", error);
      return new Response(\`Unexpected Server Error: \${error instanceof Error ? error.message : 'Unknown error'}\`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};`;
  
  // Write the worker entry point
  fs.writeFileSync('build/index.js', workerContent);
  
  console.log('Worker entry point created at build/index.js');
} catch (error) {
  console.error('Failed to create worker entry point:', error);
  process.exit(1);
}

// Copy necessary files
if (fs.existsSync('build/server')) {
  console.log('Server build found, deployment ready!');
} else {
  console.error('Server build not found at build/server');
  process.exit(1);
}