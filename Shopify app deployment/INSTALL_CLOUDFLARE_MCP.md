# Installing Cloudflare MCP Server

## Option 1: Official MCP Servers List

Check if there's a Cloudflare MCP in the official list:
```bash
# Check available MCP servers
npm search @modelcontextprotocol cloudflare
```

## Option 2: Install Community Cloudflare MCP

The most relevant Cloudflare MCP servers are:

### 1. **MCP Cloudflare** (if available)
```bash
# Install globally
npm install -g @mcp/cloudflare

# Or install locally
npm install @mcp/cloudflare
```

### 2. **Alternative: Wrangler MCP**
If there's no official Cloudflare MCP, you might find a Wrangler-based MCP:
```bash
npm install -g @mcp/wrangler
```

## Configure Claude Code

After installation, you need to add it to your Claude Code settings:

1. Open Claude Code settings (⌘+, on Mac)
2. Go to "MCP Servers"
3. Add the Cloudflare MCP configuration

Example configuration:
```json
{
  "mcp": {
    "servers": {
      "cloudflare": {
        "command": "npx",
        "args": ["@mcp/cloudflare"],
        "env": {
          "CLOUDFLARE_API_TOKEN": "your-api-token",
          "CLOUDFLARE_ACCOUNT_ID": "62252afa704e6b9df2a13c01fa5b2690"
        }
      }
    }
  }
}
```

## Get Your Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create a token with these permissions:
   - Account: Cloudflare Workers Scripts:Edit
   - Account: Cloudflare Workers KV Storage:Edit
   - Account: D1:Edit
   - Zone: Zone Settings:Read

## After Installation

1. Save the configuration
2. Restart Claude Code
3. The Cloudflare MCP should appear in available tools

Let me know once you've installed it and restarted the IDE!