const fs = require('fs');
const path = require('path');
const helper = require('./spacing-migration-helper.cjs');
const { analyzeFile } = require('./analyze-spacing.cjs');

// Function to apply fixes to a file
function applyFixes(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const findings = helper.findSpacingValues(content);
    
    if (findings.length === 0) {
      console.log('✅ No changes needed!');
      return;
    }
    
    console.log(`\n${dryRun ? '🔍 DRY RUN -' : '🔧'} Applying fixes to: ${path.basename(filePath)}`);
    console.log('─'.repeat(80));
    
    // Show what will be changed
    findings.forEach(finding => {
      console.log(`Line ${finding.line}: ${finding.property}="${finding.oldValue}" → "${finding.newValue}"`);
    });
    
    if (!dryRun) {
      // Apply the conversions
      const updatedContent = helper.applyConversions(content, findings);
      
      // Create backup
      const backupPath = filePath + '.backup-spacing-' + Date.now();
      fs.writeFileSync(backupPath, content);
      console.log(`\n📦 Backup created: ${path.basename(backupPath)}`);
      
      // Write updated content
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ File updated successfully!`);
      console.log(`📊 Applied ${findings.length} spacing conversions.`);
    } else {
      console.log(`\n📊 Would apply ${findings.length} spacing conversions.`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error.message);
  }
}

// Interactive mode to confirm changes
async function interactiveMode(filePath) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const question = (prompt) => new Promise(resolve => readline.question(prompt, resolve));
  
  try {
    // First, analyze the file
    console.log('\n🔍 Analyzing file...');
    const findings = analyzeFile(filePath);
    
    if (findings.length === 0) {
      console.log('✅ No old spacing values found!');
      readline.close();
      return;
    }
    
    // Ask for confirmation
    const answer = await question('\nDo you want to apply these changes? (y/n): ');
    
    if (answer.toLowerCase() === 'y') {
      applyFixes(filePath, false);
    } else {
      console.log('❌ Changes cancelled.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    readline.close();
  }
}

// Main function
async function main() {
  const targetFile = process.argv[2];
  const mode = process.argv[3]; // --dry-run or --auto
  
  if (!targetFile) {
    console.log('Usage: node apply-spacing-fix.cjs <file-path> [--dry-run|--auto]');
    console.log('');
    console.log('Options:');
    console.log('  --dry-run   Show what would be changed without applying');
    console.log('  --auto      Apply changes without confirmation');
    console.log('  (default)   Interactive mode with confirmation');
    console.log('');
    console.log('Example:');
    console.log('  node apply-spacing-fix.cjs ./src/Component.jsx');
    console.log('  node apply-spacing-fix.cjs ./src/Component.jsx --dry-run');
    return;
  }
  
  console.log('🚀 Shopify 2025-10 RC Spacing Migration Tool\n');
  
  if (mode === '--dry-run') {
    applyFixes(targetFile, true);
  } else if (mode === '--auto') {
    applyFixes(targetFile, false);
  } else {
    await interactiveMode(targetFile);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { applyFixes };