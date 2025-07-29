# Claude Code MCP Token Limit Solutions

## Solution 1: Increased Token Limit (Implemented)

I've updated your Claude Code settings to increase the MCP token limit:

```json
{
  "env": {
    "MAX_MCP_OUTPUT_TOKENS": "100000"
  }
}
```

**Important:** Restart Claude Code for this change to take effect.

## Solution 2: Smart Search Strategies

When searching with Shopify MCP, use these strategies to avoid token limits:

### 1. Be More Specific
Instead of:
```
"polaris components"
```

Use:
```
"s-button polaris web component specific usage"
```

### 2. Use Filter Parameters
When using `introspect_admin_schema`, always use filters:
```
filter: ["types"]  // or ["queries"], ["mutations"]
```

### 3. Target Specific Documentation
Instead of searching broadly, fetch specific docs:
```
paths: ["/docs/api/polaris/components/specific-component"]
```

## Solution 3: Chunked Searches

Use the helper script I created:

```bash
# Basic search
node scripts/shopify-mcp-search.js "s-button polaris"

# Limited results
node scripts/shopify-mcp-search.js "admin ui extension" --max-results 3

# Filtered search
node scripts/shopify-mcp-search.js "polaris components" --include "s-button,s-page" --exclude "deprecated"
```

## Solution 4: Alternative Approaches

1. **Use Web Search First**: For general questions, use web search to get an overview, then use MCP for specific details.

2. **Browse Documentation Manually**: Sometimes it's faster to use:
   - https://shopify.dev/docs/api/polaris
   - https://shopify.dev/docs/api/admin

3. **Use Multiple Specific Queries**: Instead of one large query, break it into smaller, targeted queries.

## Solution 5: Custom MCP Wrapper (Advanced)

If token limits continue to be an issue, consider creating a custom MCP server wrapper that:
- Caches responses
- Implements pagination
- Pre-filters results
- Compresses responses

## Environment Variables Reference

You can set these in `~/.claude/settings.json`:

```json
{
  "env": {
    "MAX_MCP_OUTPUT_TOKENS": "100000",  // Increase token limit
    "MCP_TOOL_TIMEOUT": "60000"         // Increase timeout to 60 seconds
  }
}
```

Or set them when running Claude Code:
```bash
MAX_MCP_OUTPUT_TOKENS=100000 claude
```