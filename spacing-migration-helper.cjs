// Spacing Migration Helper for Shopify 2025-10 RC API
// This script helps convert old spacing values to new ones

const spacingMap = {
  // Extra tight values (smallest spacing)
  'extra-tight': 'small-300',      // Smallest available
  'extraTight': 'small-300',       // camelCase variant
  'extra-small': 'small-300',      // Alternative naming
  'extraSmall': 'small-300',
  
  // Tight values
  'tight': 'small-200',            // Small but not smallest
  
  // Small values
  'small': 'small',                // Direct mapping (might need small-100)
  
  // Base/normal values  
  'base': 'base',                  // Direct mapping
  'normal': 'base',                // Alternative name
  'medium': 'base',                // Alternative name
  
  // Large values
  'large': 'large',                // Direct mapping
  
  // Loose values
  'loose': 'large-100',            // Large but not largest
  
  // Extra loose values
  'extra-loose': 'large-300',      // Largest available
  'extraLoose': 'large-300',       // camelCase variant
  'extra-large': 'large-300',
  'extraLarge': 'large-300',
  
  // Numeric values (if using a numeric scale)
  '100': 'small-300',
  '200': 'small-200', 
  '300': 'small-100',
  '400': 'small',
  '500': 'base',
  '600': 'large',
  '700': 'large-100',
  '800': 'large-200',
  '900': 'large-300',
  
  // Values that don't have direct mapping (convert to nearest valid)
  'small-400': 'small',  // 400 doesn't exist in new API, use 'small'
  'small-500': 'base',   // 500 doesn't exist in new API, use 'base'
  'large tight': 'base', // Composite value
  
  // Special values that might exist
  'extra-small-100': 'small-300',  // If this pattern exists
  
  // Special case
  'none': 'none'                   // Direct mapping
};

// Properties that use spacing values
const spacingProperties = [
  'padding',
  'padding-block',
  'padding-inline', 
  'padding-block-start',
  'padding-block-end',
  'padding-inline-start',
  'padding-inline-end',
  'margin',
  'margin-block',
  'margin-inline',
  'margin-block-start',
  'margin-block-end',
  'margin-inline-start',
  'margin-inline-end',
  'gap'
];

// Function to convert a single spacing value
function convertSpacingValue(oldValue) {
  // Return mapped value if exists, otherwise return original
  return spacingMap[oldValue] || oldValue;
}

// Function to analyze a file and find spacing values
function findSpacingValues(fileContent) {
  const findings = [];
  const lines = fileContent.split('\n');
  
  lines.forEach((line, index) => {
    spacingProperties.forEach(prop => {
      // Look for patterns like padding="value" or padding-block="value"
      const regex = new RegExp(`${prop}\\s*=\\s*["']([^"']+)["']`, 'g');
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const value = match[1];
        const newValue = convertSpacingValue(value);
        
        if (value !== newValue) {
          findings.push({
            line: index + 1,
            property: prop,
            oldValue: value,
            newValue: newValue,
            lineContent: line.trim()
          });
        }
      }
    });
  });
  
  return findings;
}

// Function to apply conversions to file content
function applyConversions(fileContent, conversions) {
  let updatedContent = fileContent;
  
  // Sort conversions by line number in reverse to avoid offset issues
  conversions.sort((a, b) => b.line - a.line);
  
  conversions.forEach(conversion => {
    const oldPattern = `${conversion.property}="${conversion.oldValue}"`;
    const newPattern = `${conversion.property}="${conversion.newValue}"`;
    
    // Replace in the content
    updatedContent = updatedContent.replace(oldPattern, newPattern);
  });
  
  return updatedContent;
}

// Export for use in other scripts
module.exports = {
  spacingMap,
  spacingProperties,
  convertSpacingValue,
  findSpacingValues,
  applyConversions
};

// Example usage:
// const helper = require('./spacing-migration-helper');
// const fileContent = fs.readFileSync('myfile.jsx', 'utf8');
// const findings = helper.findSpacingValues(fileContent);
// console.log('Found spacing values to convert:', findings);