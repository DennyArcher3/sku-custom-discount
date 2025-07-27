# Complete Cloudflare MCP Options for Claude Code

## Understanding the 13 Cloudflare MCP Servers

Cloudflare offers 13 specialized MCP servers, each focused on a specific service:

1. **Documentation** - Real-time docs and guides
2. **Workers Bindings** - D1, KV, R2 management
3. **Workers Observability** - Logs and monitoring
4. **Container** - Isolated test environments
5. **Browser Rendering** - Screenshots and testing
6. **Radar** - Internet insights
7. **Logpush** - Log analysis
8. **AI Gateway** - AI model monitoring
9. **AutoRAG** - Dynamic information retrieval
10. **Audit Logs** - Security and compliance
11. **DNS Analytics** - DNS performance
12. **Digital Experience Monitoring** - User experience metrics
13. **CASB** - Cloud security

## Your 3 Setup Options

### Option 1: Use Remote MCP Servers (Recommended) 🌐

**Pros:**
- Official Cloudflare servers
- Always up-to-date
- OAuth authentication (more secure)
- Specialized permissions per server

**Setup:**
```json
{
  "mcpServers": {
    // Documentation for learning
    "cloudflare-docs": {
      "command": "npx",
      "args": ["mcp-remote", "https://documentation.mcp.cloudflare.com/sse"]
    },
    
    // Bindings for creating D1/KV
    "cloudflare-bindings": {
      "command": "npx",
      "args": ["mcp-remote", "https://bindings.mcp.cloudflare.com/sse"]
    },
    
    // Observability for debugging
    "cloudflare-observability": {
      "command": "npx",
      "args": ["mcp-remote", "https://observability.mcp.cloudflare.com/sse"]
    }
  }
}
```

**Note**: Requires `npm install -g mcp-remote` first

### Option 2: Use Local NPM Package 📦

**Pros:**
- One package with many features
- Works offline
- Direct API token authentication

**Setup:**
```json
{
  "mcpServers": {
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

### Option 3: Mix Both Approaches 🎯

Use remote servers for specialized tasks and local for general use:

```json
{
  "mcpServers": {
    // Local package for general use
    "cloudflare": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "your-token",
        "CLOUDFLARE_ACCOUNT_ID": "your-account-id"
      }
    },
    
    // Remote documentation server for learning
    "cloudflare-docs": {
      "command": "npx",
      "args": ["mcp-remote", "https://documentation.mcp.cloudflare.com/sse"]
    }
  }
}
```

## Which Should You Choose?

### For Your Shopify App Deployment:

**Recommended: Option 1 (Remote Servers)**

Install these 3 remote servers:
1. **Documentation** - For learning
2. **Bindings** - For creating infrastructure
3. **Observability** - For debugging

**Why?**
- More secure (OAuth vs API token)
- Specialized permissions
- Always latest version
- Official Cloudflare approach

### If You Want Simplicity:

**Use Option 2 (Local Package)**
- Just one installation
- Covers most needs
- Easier to set up

## Installation Prerequisites

For remote servers:
```bash
npm install -g mcp-remote
```

## Authentication Methods

### Remote Servers (OAuth):
- First use opens browser
- Login to Cloudflare
- Grant specific permissions
- Token stored securely

### Local Package (API Token):
- Create token manually
- Add to config file
- Full account access

## Security Comparison

| Method | Security | Convenience |
|--------|----------|-------------|
| Remote + OAuth | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Local + API Token | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

## Final Recommendation

For production work on your Shopify app, use the **3 remote servers** approach. It's more secure and follows Cloudflare's intended architecture for the 13 specialized MCP servers.