# Simplified Cloudflare MCP Installation Guide

## Good News! 🎉

You only need to install **ONE** MCP package that includes everything:
- 📚 Documentation access
- 🔧 Bindings (D1, KV, R2)
- 📊 Observability & Analytics
- 🚀 Workers deployment
- 🔒 Security features

## Installation Steps

### Step 1: Open Claude Code Config

On macOS:
```bash
open ~/Library/Application\ Support/Claude\ Code/claude_desktop_config.json
```

### Step 2: Add Cloudflare MCP

Add this to your existing MCPs:

```json
{
  "mcpServers": {
    // ... your existing 7 MCPs ...
    
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

### Step 3: Get Your Credentials

1. **Account ID**:
   - Go to https://dash.cloudflare.com
   - Look on the right sidebar
   - Copy the ID (looks like: `a1b2c3d4e5f6`)

2. **API Token**:
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click "Create Token"
   - Use "Edit Cloudflare Workers" template
   - Add these permissions:
     ```
     ✅ Account > Cloudflare Workers Scripts:Edit
     ✅ Account > Workers KV Storage:Edit
     ✅ Account > D1:Edit
     ✅ Account > Workers Analytics:Read
     ```

### Step 4: Save & Restart

1. Replace `your-api-token-here` with your actual token
2. Replace `your-account-id-here` with your actual account ID
3. Save the file
4. Quit Claude Code completely (Cmd+Q)
5. Reopen Claude Code

### Step 5: Verify It Works

Type `/mcp` and you should see:
```
cloudflare: connected ✓
```

## What You Can Now Do

### 📚 Learning/Documentation:
- "How do I create a D1 database?"
- "Show me Workers KV examples"
- "What are Cloudflare's best practices?"

### 🔧 Building/Actions:
- "Create a D1 database called sku-discount-db"
- "Create a KV namespace for sessions"
- "Deploy my app to Workers"

### 📊 Monitoring:
- "Show me Worker logs"
- "Check error rates"
- "Display analytics"

## Test Commands

Try these to confirm everything works:

1. **Info Query**: "What Cloudflare services do I have access to?"
2. **List Resources**: "List all my Workers"
3. **Create Test**: "Create a KV namespace called test-namespace"

## Troubleshooting

### If Not Connecting:
1. Check token has ALL required permissions
2. Verify Account ID (no spaces!)
3. Make sure you saved the file
4. Completely quit and restart Claude Code

### Check Logs:
```bash
tail -f ~/Library/Logs/Claude\ Code/main.log
```

## That's It! 🚀

You now have:
- ✅ Documentation at your fingertips
- ✅ Ability to create infrastructure
- ✅ Deployment capabilities
- ✅ Monitoring and debugging tools

All in ONE package!