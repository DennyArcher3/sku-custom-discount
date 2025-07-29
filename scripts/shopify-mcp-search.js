#!/usr/bin/env node

/**
 * Shopify MCP Search Helper
 * 
 * This script helps handle large responses from Shopify MCP by:
 * 1. Breaking down searches into smaller, more specific queries
 * 2. Filtering results before returning
 * 3. Providing pagination support
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function searchShopifyDocs(query, options = {}) {
  const {
    maxResults = 5,
    filterKeywords = [],
    excludeKeywords = []
  } = options;

  try {
    // Build a more specific search query
    let searchQuery = query;
    if (filterKeywords.length > 0) {
      searchQuery += ' ' + filterKeywords.join(' ');
    }

    // Use the MCP command with specific parameters
    const command = `npx @shopify/dev-mcp@latest search "${searchQuery}"`;
    
    console.log(`Searching for: ${searchQuery}`);
    console.log('Options:', { maxResults, filterKeywords, excludeKeywords });
    
    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });

    if (stderr) {
      console.error('Error:', stderr);
    }

    // Parse and filter results
    let results = stdout;
    
    // Apply exclude keywords
    if (excludeKeywords.length > 0) {
      const lines = results.split('\n');
      results = lines.filter(line => 
        !excludeKeywords.some(keyword => 
          line.toLowerCase().includes(keyword.toLowerCase())
        )
      ).join('\n');
    }

    // Limit results
    const resultLines = results.split('\n');
    if (resultLines.length > maxResults * 10) { // Rough estimate
      results = resultLines.slice(0, maxResults * 10).join('\n');
    }

    return results;
  } catch (error) {
    console.error('Search failed:', error.message);
    return null;
  }
}

// Example usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
Usage: node shopify-mcp-search.js <query> [options]

Options:
  --max-results <n>     Maximum number of results (default: 5)
  --include <keywords>  Include only results with these keywords (comma-separated)
  --exclude <keywords>  Exclude results with these keywords (comma-separated)

Examples:
  node shopify-mcp-search.js "s-button polaris"
  node shopify-mcp-search.js "admin ui extension" --max-results 3
  node shopify-mcp-search.js "polaris components" --include "s-button,s-page" --exclude "deprecated"
    `);
    return;
  }

  const query = args[0];
  const options = {
    maxResults: 5,
    filterKeywords: [],
    excludeKeywords: []
  };

  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--max-results' && args[i + 1]) {
      options.maxResults = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--include' && args[i + 1]) {
      options.filterKeywords = args[i + 1].split(',');
      i++;
    } else if (args[i] === '--exclude' && args[i + 1]) {
      options.excludeKeywords = args[i + 1].split(',');
      i++;
    }
  }

  const results = await searchShopifyDocs(query, options);
  if (results) {
    console.log('\n--- Search Results ---\n');
    console.log(results);
  }
}

if (require.main === module) {
  main();
}

module.exports = { searchShopifyDocs };