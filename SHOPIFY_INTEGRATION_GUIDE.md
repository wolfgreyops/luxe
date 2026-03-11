# Six Thirteen — Shopify Configurator Integration Guide

## Overview

This integrates the Six Thirteen product configurator into your Shopify store at 613dtf.com. The configurator runs on Vercel and is embedded as a full-page iframe on a custom Shopify page. When a customer designs their tee and clicks "Checkout," the item is added directly to their Shopify cart.

## Architecture

```
┌─────────────────────────────────────────┐
│  613dtf.com (Shopify)                   │
│  ┌───────────────────────────────────┐  │
│  │  /pages/design-your-own           │  │
│  │  (Liquid template with iframe)    │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ configurator-shopify.html   │  │  │
│  │  │ (Vercel iframe)             │  │  │
│  │  │                             │  │  │
│  │  │  Customer designs tee       │  │  │
│  │  │  Clicks "Checkout"          │  │  │
│  │  │  → postMessage to parent    │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  Parent receives message          │  │
│  │  → calls /cart/add.js             │  │
│  │  → shows "Added to cart" toast    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Customer proceeds to Shopify checkout  │
└─────────────────────────────────────────┘
```

## Files

| File | Purpose |
|------|---------|
| `configurator-shopify.html` | Modified configurator (Stripe removed, postMessage added) |
| `shopify-page-configurator.liquid` | Shopify page template that embeds the iframe |
| `configurator.html` | **Original** — unchanged, still uses Stripe |

## Setup Steps

### Step 1: Deploy the Shopify Configurator to Vercel

The `configurator-shopify.html` file needs to be deployed alongside your existing Vercel project. It shares the same `tees/` images folder.

1. The file is already in your project folder
2. Deploy to Vercel: `vercel --prod`
3. Note the URL: `https://your-project.vercel.app/configurator-shopify.html`

### Step 2: Create the Shopify Product

In Shopify Admin:

1. Go to **Products → Add product**
2. Name: `Custom DTF Tee` (or whatever you prefer)
3. Price: `$12.99`
4. Create variants for sizes: **S, M, L, XL, 2XL**
5. **Note down each variant's ID** — you'll need these
   - To find variant IDs: go to the product page in Shopify Admin, the URL will be like `/admin/products/12345`. Then use the Shopify API or check the page source for variant IDs.
   - Or use the Shopify Admin API: `GET /admin/api/2024-01/products/{id}/variants.json`

### Step 3: Install the Liquid Template

1. Go to **Online Store → Themes → Actions → Edit Code**
2. Under **Templates**, click **Add a new template**
3. Select **page**, name it `configurator`
4. Delete the default content and paste the contents of `shopify-page-configurator.liquid`
5. **Update these values in the template:**
   - `configurator_url` — your Vercel URL
   - `VARIANT_MAP` — your Shopify variant IDs for each size
   - OR `SINGLE_VARIANT_ID` if using a single variant

### Step 4: Create the Shopify Page

1. Go to **Online Store → Pages → Add page**
2. Title: `Design Your Own`
3. Under **Template**, select `page.configurator`
4. Save and publish

### Step 5: Update the Configurator Domain

In `configurator-shopify.html`, update the `SHOPIFY_STORE` constant if needed:

```javascript
const SHOPIFY_STORE = 'https://613dtf.com';
```

### Step 6: Add Navigation Link

In your Shopify theme, add a link to the new page:
- Go to **Online Store → Navigation**
- Add a menu item pointing to `/pages/design-your-own`
- Label it "Design Your Own" or "Custom Tee"

## How It Works

1. Customer visits `613dtf.com/pages/design-your-own`
2. Shopify loads the Liquid template, which embeds the Vercel configurator in a full-screen iframe
3. Customer uploads artwork, picks colors, selects sizes, and clicks "Checkout"
4. The configurator sends a `postMessage` to the parent Shopify page with order details
5. The Liquid template's JavaScript receives the message and calls Shopify's `/cart/add.js` API
6. Each size is added as a separate line item with "Shirt Color" as a line item property
7. A toast notification confirms items were added
8. Customer can continue designing or go to `/cart` to checkout through Shopify

## Line Item Properties

Each cart item will have these properties visible in the order:

- **Shirt Color**: The selected tee color (e.g., "Black", "Navy")
- **Size**: (only if using SINGLE_VARIANT_ID mode)

## Design File Handling

Currently the design preview is generated in-browser. For production, consider:

1. **Email-based**: Have the customer email their design file to your production email
2. **Upload endpoint**: Add a Vercel API route that accepts the design file and stores it (S3, Cloudinary, etc.), then attach the URL as a line item property
3. **Shopify Files API**: Upload the design to Shopify's file storage via the Admin API

## Troubleshooting

- **Cart not adding**: Check browser console for errors. Make sure variant IDs are correct.
- **CORS errors**: The iframe and postMessage approach avoids CORS issues. If you see CORS errors, make sure the configurator URL origin matches.
- **Design not showing**: The design preview is generated client-side. For order fulfillment, you'll need one of the design file handling approaches above.
