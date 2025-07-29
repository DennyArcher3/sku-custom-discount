#!/bin/bash

# Run Shopify app with Polaris Unified web components for Cloudflare Workers
echo "Starting app with Polaris Unified web components..."

# For development with Cloudflare Workers
POLARIS_UNIFIED=true wrangler dev --port 8788

# If you need to generate extensions with Polaris Unified:
# POLARIS_UNIFIED=true shopify app generate extension

# For deployment:
# POLARIS_UNIFIED=true npm run deploy:staging