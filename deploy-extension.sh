#!/bin/bash

# Deploy extension with Polaris Unified components
echo "Deploying extension with Polaris Unified (2025-10RC)..."

# Deploy just the extensions (not the app)
shopify app deploy --only-extensions

# For staging:
# shopify app deploy --only-extensions --config shopify.app.staging.toml

# For production:
# shopify app deploy --only-extensions --config shopify.app.production.toml