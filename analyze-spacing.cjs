const fs = require('fs');
const path = require('path');
const helper = require('./spacing-migration-helper.cjs');

// Function to analyze a specific file
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = helper.findSpacingValues(content);
    
    if (findings.length > 0) {
      console.log(`\n📄 File: ${path.basename(filePath)}`);
      console.log('Found spacing values to convert:');
      console.log('─'.repeat(80));
      
      findings.forEach(finding => {
        console.log(`Line ${finding.line}: ${finding.property}="${finding.oldValue}" → "${finding.newValue}"`);
        console.log(`  ${finding.lineContent}`);
        console.log('');
      });
      
      return findings;
    }
    return [];
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

// Main function
function main() {
  const targetFile = process.argv[2];
  
  if (!targetFile) {
    console.log('Usage: node analyze-spacing.cjs <file-path>');
    console.log('Example: node analyze-spacing.cjs ./extensions/discount-function-settings/src/DiscountFunctionSettingsNew.jsx');
    return;
  }
  
  console.log('🔍 Analyzing spacing values...\n');
  
  const findings = analyzeFile(targetFile);
  
  if (findings.length === 0) {
    console.log('✅ No old spacing values found that need conversion!');
  } else {
    console.log(`\n📊 Summary: Found ${findings.length} spacing values that need conversion.`);
    console.log('\nTo apply these changes, run:');
    console.log(`node apply-spacing-fix.cjs "${targetFile}"`);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { analyzeFile };