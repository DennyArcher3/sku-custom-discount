# Cloudflare MCP (Model Context Protocol) Setup Guide

## What is MCP?

Model Context Protocol (MCP) is like a "USB-C port for AI" - it provides a standardized way for AI assistants like Claude to connect with external services and tools. With Cloudflare MCPs, Claude can directly manage your Cloudflare infrastructure using natural language.

## Required MCPs for Cloudflare Shopify App Deployment

### 1. **mcp-server-cloudflare** (Primary)
The official Cloudflare MCP server that provides access to all Cloudflare services.

**Capabilities:**
- Deploy and manage Workers
- Configure D1 databases
- Manage KV namespaces
- Handle R2 storage
- Update DNS records
- Configure security settings

**GitHub:** https://github.com/cloudflare/mcp-server-cloudflare

### 2. **workers-mcp** (Alternative/Supplementary)
Specialized MCP for Cloudflare Workers operations.

**GitHub:** https://github.com/cloudflare/workers-mcp

## Installation Guide for Claude Code

### Prerequisites

1. **Cloudflare Account**
   - Sign up at https://cloudflare.com
   - Note your Account ID (found in dashboard)

2. **API Token**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create token with permissions:
     - Account: Cloudflare Workers Scripts:Edit
     - Account: Cloudflare Workers KV Storage:Edit
     - Account: D1:Edit
     - Account: Worker Scripts:Edit
     - Zone: DNS:Edit (if needed)

### Step-by-Step Installation

#### 1. Check Current MCPs
First, let's see what MCPs you currently have installed:

```bash
# In Claude Code, type:
/mcp
```

This will show your current MCP connections.

#### 2. Locate Claude Code Configuration

**On macOS:**
```bash
~/Library/Application Support/Claude Code/claude_desktop_config.json
```

**On Windows:**
```
%APPDATA%\Claude Code\claude_desktop_config.json
```

**On Linux:**
```
~/.config/Claude Code/claude_desktop_config.json
```

#### 3. Add Cloudflare MCP Configuration

Edit the configuration file to add the Cloudflare MCP server:

```json
{
  "mcpServers": {
    // ... your existing MCPs ...
    "cloudflare": {
      "command": "npx",
      "args": [
        "-y",
        "@cloudflare/mcp-server-cloudflare"
      ],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-api-token-here",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id-here"
      }
    }
  }
}
```

#### 4. Alternative: Using Remote MCP Server

If you prefer using the remote MCP server (no local installation needed):

```json
{
  "mcpServers": {
    "cloudflare-remote": {
      "url": "https://mcp.cloudflare.com/sse",
      "transport": "sse",
      "auth": {
        "type": "oauth",
        "authorize_url": "https://mcp.cloudflare.com/auth"
      }
    }
  }
}
```

#### 5. Restart Claude Code

After saving the configuration:
1. Completely quit Claude Code (Cmd+Q on Mac)
2. Relaunch Claude Code
3. Verify connection with `/mcp`

### Verification

To verify the Cloudflare MCP is working:

```
# Type in Claude Code:
/mcp

# You should see:
cloudflare: connected ✓
```

### Testing the Connection

Try these natural language commands:

1. **List Workers:**
   "Show me all my Cloudflare Workers"

2. **Create KV Namespace:**
   "Create a new KV namespace called shopify-sessions"

3. **Check D1 Databases:**
   "List all my D1 databases"

## Usage Examples for Shopify App Deployment

### 1. Setting Up Infrastructure
```
"Create a new D1 database called sku-discount-db for my Shopify app"
"Create a KV namespace for storing Shopify sessions"
"Deploy my Remix app to Cloudflare Workers from the current directory"
```

### 2. Configuration Management
```
"Add environment variables to my Worker for Shopify API keys"
"Configure custom domain shopify-app.mydomain.com for my Worker"
"Set up preview deployments for my branches"
```

### 3. Monitoring and Debugging
```
"Show me the logs for my sku-discount Worker"
"Check the error rate for my Worker in the last hour"
"Display current usage and costs for my account"
```

## Troubleshooting

### Common Issues

1. **MCP Not Connecting**
   - Verify API token has correct permissions
   - Check Account ID is correct
   - Ensure no typos in configuration

2. **Permission Errors**
   - Create a new API token with all required permissions
   - Use "Edit" permissions, not just "Read"

3. **Command Not Found**
   - Make sure you have Node.js installed
   - Try using `npx` instead of `npm`

### Debug Commands

```bash
# Check if npx is available
which npx

# Test Cloudflare CLI separately
npx wrangler whoami

# View Claude Code logs
# On macOS:
tail -f ~/Library/Logs/Claude Code/main.log
```

## Security Best Practices

1. **API Token Management**
   - Never commit tokens to Git
   - Use environment-specific tokens
   - Rotate tokens regularly

2. **Scope Limitations**
   - Create tokens with minimal required permissions
   - Use separate tokens for dev/prod

3. **Audit Trail**
   - Monitor API token usage in Cloudflare dashboard
   - Review audit logs regularly

## Advanced Configuration

### Multiple Cloudflare Accounts

If you work with multiple Cloudflare accounts:

```json
{
  "mcpServers": {
    "cloudflare-dev": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "dev-token",
        "CLOUDFLARE_ACCOUNT_ID": "dev-account-id"
      }
    },
    "cloudflare-prod": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "prod-token",
        "CLOUDFLARE_ACCOUNT_ID": "prod-account-id"
      }
    }
  }
}
```

### Custom MCP Wrapper

For additional functionality, create a wrapper script:

```javascript
// mcp-cloudflare-wrapper.js
import { CloudflareMCP } from '@cloudflare/mcp-server-cloudflare';

// Add custom logging, validation, etc.
const server = new CloudflareMCP({
  onRequest: (req) => console.log('Request:', req),
  onResponse: (res) => console.log('Response:', res)
});

server.start();
```

## Integration with Shopify Development Workflow

The Cloudflare MCP integrates seamlessly with the Shopify MCP you already have:

1. **Shopify MCP**: Handles app configuration, API queries, documentation
2. **Cloudflare MCP**: Manages deployment, infrastructure, performance

Example workflow:
```
1. "Use Shopify MCP to check my app's discount function configuration"
2. "Deploy the updated discount function to Cloudflare Workers"
3. "Configure the Worker environment variables for production"
4. "Set up monitoring alerts for the Worker"
```

## Next Steps

1. Install the Cloudflare MCP following this guide
2. Test basic commands to ensure connectivity
3. Proceed to the [Deployment Guide](./deployment-guide.md)
4. Use natural language to manage your infrastructure

---

*Note: MCP is rapidly evolving. Check https://github.com/cloudflare/mcp-server-cloudflare for the latest updates.*