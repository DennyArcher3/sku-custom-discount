// Debug version - minimal UI extension setup
import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useState } from 'preact/hooks';

// Main component
function App() {
  const [count, setCount] = useState(0);
  
  console.log('Extension rendering...');
  
  return (
    <s-box padding="large">
      <s-stack direction="block" gap="base">
        <s-text variant="headingMd">SKU Discount Settings - Debug Mode</s-text>
        <s-text>If you can see this, the extension is loading!</s-text>
        
        <s-button 
          variant="primary" 
          onclick={() => setCount(count + 1)}
        >
          Clicked {count} times
        </s-button>
        
        <s-text variant="bodySm" tone="subdued">
          Extension is working correctly. Check console for more details.
        </s-text>
      </s-stack>
    </s-box>
  );
}

// Export the extension entry point
export default async () => {
  console.log('Extension initializing...');
  
  try {
    // Check if we're in the right environment
    if (typeof window === 'undefined') {
      console.error('Window is undefined - not running in browser context');
      return;
    }
    
    // Check for Shopify global
    console.log('Shopify global:', typeof window.shopify !== 'undefined' ? 'Available' : 'Not available');
    
    // Render the app
    render(<App />, document.body);
    console.log('Extension rendered successfully');
  } catch (error) {
    console.error('Extension render error:', error);
  }
};