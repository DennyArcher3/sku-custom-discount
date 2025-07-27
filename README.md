# SKU Custom Discount

A Shopify app that allows merchants to create percentage-based discounts for specific products identified by their SKU.

## Features

- **SKU-based Discounting**: Target specific products by their SKU for percentage-based discounts
- **Bulk Import**: Import multiple SKUs and their discount percentages at once
- **Easy Configuration**: Intuitive UI for selecting products and setting discount percentages
- **Real-time Preview**: See which products will be affected before saving
- **Flexible Discounts**: Set different discount percentages for different SKUs (0-100%)

## How It Works

1. Install the app from the Shopify App Store
2. Navigate to Discounts in your Shopify Admin
3. Click "Create discount" and select "SKU Custom Discount"
4. Add products by:
   - Searching and selecting individual products
   - Using bulk import with SKU and percentage pairs
5. Set the discount percentage for each SKU
6. Save and activate your discount

## Development

### Prerequisites

- Node.js 18+
- Shopify Partner account
- Shopify development store

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Deployment

See the [deployment guide](./docs/shopify-app-deployment/README.md) for detailed instructions on deploying to production and submitting to the Shopify App Store.

## Tech Stack

- **Framework**: Remix
- **UI**: React with Shopify Polaris
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Discount Function**: Rust/WebAssembly
- **Authentication**: OAuth 2.0 via Shopify

## Project Structure

```
sku-custom-discount/
├── app/                    # Remix app code
├── extensions/
│   ├── discount-function/  # Rust discount function
│   └── discount-function-settings/  # UI extension
├── docs/                   # Documentation
└── prisma/                # Database schema
```

## Support

For issues or questions, please contact: support@[yourdomain].com

## License

[Your License]