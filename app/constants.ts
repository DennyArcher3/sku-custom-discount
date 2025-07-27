// App constants that don't change between environments
// These IDs are generated when the discount function is created and remain constant

export const APP_CONSTANTS = {
  // Function IDs - these are specific to your app and don't change
  DISCOUNT_FUNCTION_ID: "fe78075e-5113-4962-a155-4a63009f85c7",
  DISCOUNT_SETTINGS_UI_ID: "9ea9971c-b54a-414f-8fc3-111ceacbf1e8",
  
  // App metadata
  APP_NAME: "SKU Custom Discount",
  APP_HANDLE: "sku-custom-discount",
} as const;

// For sensitive data, still use environment variables
export const getApiKey = () => process.env.SHOPIFY_API_KEY;
export const getApiSecret = () => process.env.SHOPIFY_API_SECRET;