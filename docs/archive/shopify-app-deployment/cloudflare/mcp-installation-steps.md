# Cloudflare MCP Installation Steps for Claude Code

## Step 1: Check Your Current MCPs

```bash
# In Claude Code, type:
/mcp
```

You should see your current 7 MCPs:
- shopify-dev
- filesystem  
- sequential-thinking
- memory
- brave-search
- context7
- shadcn-ui

## Step 2: Find Your Claude Code Config File

On macOS:
```bash
open ~/Library/Application\ Support/Claude\ Code/claude_desktop_config.json
```

## Step 3: Add Cloudflare MCPs

Add these THREE MCPs to your `mcpServers` section:

```json
{
  "mcpServers": {
    // ... your existing 7 MCPs ...
    
    // 1. Documentation Server (for learning)
    "cloudflare-docs": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudflare/mcp-server-cloudflare-docs"
      ]
    },
    
    // 2. Workers Bindings (for creating D1, KV)
    "cloudflare-bindings": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudflare/mcp-server-cloudflare-bindings"
      ],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token-here",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id-here"
      }
    },
    
    // 3. Workers Observability (for debugging)
    "cloudflare-observability": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudflare/mcp-server-cloudflare-observability"
      ],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token-here",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id-here"
      }
    }
  }
}
```

## Step 4: Get Your Cloudflare Credentials

1. **Account ID**:
   - Login to https://dash.cloudflare.com
   - It's on the right sidebar of your dashboard
   - Looks like: `a1b2c3d4e5f6g7h8i9j0`

2. **API Token**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use template: "Edit Cloudflare Workers"
   - Add these permissions:
     - Account > Cloudflare Workers Scripts:Edit
     - Account > Workers KV Storage:Edit
     - Account > D1:Edit
     - Account > Workers Scripts:Edit

## Step 5: Save and Restart

1. Save the config file
2. Completely quit Claude Code (Cmd+Q)
3. Reopen Claude Code
4. Type `/mcp` to verify - you should see:
   ```
   cloudflare: connected ✓
   ```

## Step 6: Test Each MCP

Test each one works:

### 1. Documentation Server:
- "How do I create a D1 database in Cloudflare?"
- "What's the difference between Workers KV and Durable Objects?"
- "Show me Workers pricing"

### 2. Bindings Server:
- "Create a D1 database called sku-discount-db"
- "Create a KV namespace called shopify-sessions"
- "List all my D1 databases"

### 3. Observability Server:
- "Show me Worker logs for the last hour"
- "Check error rates for my Workers"
- "Display Worker analytics"

## What Each MCP Does

### 📚 Cloudflare Documentation
- Answer questions about Cloudflare services
- Provide code examples
- Explain best practices
- Real-time docs (not outdated training data!)

### 🔧 Workers Bindings
- Create/manage D1 databases
- Create/manage KV namespaces
- Handle R2 storage
- Manage secrets and environment variables

### 📊 Workers Observability
- View logs and errors
- Monitor performance
- Debug issues
- Track usage and costs

## Troubleshooting

If MCP doesn't connect:
1. Check API token has all permissions
2. Verify Account ID is correct (no extra spaces)
3. Make sure you have Node.js installed: `node --version`
4. Check logs: `tail -f ~/Library/Logs/Claude\ Code/main.log`

## Why We Need This

The Cloudflare MCP allows Claude to:
- Automatically handle deployment commands
- Create and manage infrastructure
- Monitor your app performance
- Update configurations

Without it, you'd have to manually run all `wrangler` commands yourself!