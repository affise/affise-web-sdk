# AffiseSDK Documentation

## Overview

AffiseSDK is a JavaScript library for integrating affiliate tracking into web applications. 
The SDK provides functionality to track clicks and conversions, helping you attribute user actions to affiliate sources.

## Building the SDK

### Using npm

```bash
npm run build
```

### Direct script inclusion

```html
<script src="path/to/bundle.js"></script>
```

After including the script, the SDK will be available globally as `ASDK`.

## Configuration

Before using the SDK, you need to configure it with your tracking domain:

```javascript
// Configure the SDK
ASDK.configure({
    tracking_domain: 'https://your-tracking-domain.com',
});
```

## Usage

### Tracking Clicks

The `click()` method is used to track when a user clicks on an affiliate link. This should typically be implemented on your landing pages.

```javascript
// Basic click tracking
ASDK.click({
    offer_id: 'OFFER123',
    affiliate_id: 'AFF456'
}).then(clickId => {
    console.log('Click tracked successfully:', clickId);
}).catch(error => {
    console.error('Error tracking click:', error);
});
```

### Tracking Conversions

The `conversion()` method is used to track when a user completes a desired action (purchase, signup, etc.). This should be implemented on your conversion/thank-you pages.

```javascript
// Basic conversion tracking
ASDK.conversion({
    click_id: ASDK.clickId('OFFER123'), // Get the click ID for this offer
    offer_id: 'OFFER123',
    status: 'approved',
    sum: '99.99',
    goal: 'purchase'
}).then(() => {
    console.log('Conversion tracked successfully');
}).catch(error => {
    console.error('Error tracking conversion:', error);
});
```

### Complete Example with Product Feed

```javascript
// Landing page - track the click
document.addEventListener('DOMContentLoaded', async function() {
    // Configure the SDK
    ASDK.configure({
        tracking_domain: 'https://tracking.example.com',
    });

    // Check if we have URL parameters for tracking
    const offerId = ASDK.urlParameter('offer_id');
    const affiliateId = ASDK.urlParameter('aff_id');

    if (offerId && affiliateId) {
        const clickOptions = {
            offer_id: offerId,
            affiliate_id: affiliateId,
            ip: '123.45.67.89',  // Optional - user's IP
            user_agent: navigator.userAgent,  // Optional
            ref_id: 'reference123'  // Optional
        };

        // Generate click
        const clickId = await ASDK.click(clickOptions);
        console.log('Click tracked:', clickId);
    }
});

// Conversion/thank-you page - track the conversion
document.addEventListener('DOMContentLoaded', async function() {
    // Configure the SDK
    ASDK.configure({
        tracking_domain: 'https://tracking.example.com',
    });

    // Get the offer ID (from URL parameter or hardcoded)
    const offerId = ASDK.urlParameter('offer_id') || 'OFFER123';
    
    // Get the click ID from cookies
    const clickId = ASDK.clickId(offerId);
    
    // Order information
    const orderData = {
        id: 'ORDER789',
        total: 149.99,
        products: [
            {
                id: 'SKU001',
                name: 'Premium Headphones',
                price: 99.99,
                quantity: 1
            },
            {
                id: 'SKU002',
                name: 'Phone Case',
                price: 24.99,
                quantity: 2
            }
        ]
    };
    
    // Track the conversion
    const conversionOptions = {
        click_id: clickId,
        offer_id: offerId,
        status: 'approved',
        sum: orderData.total.toString(),
        goal: 'purchase',
        comment: `Order ${orderData.id}`,
        order_sum: orderData.total.toString(),
        order_currency: 'USD',
        user_id: 'user_12345',
        items: orderData.products.map(product => ({
            order_id: orderData.id,
            sku: product.id,
            quantity: product.quantity.toString(),
            price: product.price.toString()
        }))
    };

    await ASDK.conversion(conversionOptions);
    console.log('Conversion tracked successfully');
});
```

## API Reference

### Configuration Options

| Parameter | Type | Description |
|-----------|------|-------------|
| tracking_domain | string | The domain used for tracking clicks and conversions |

### Click Method Parameters

The `click()` method accepts an options object with the following parameters:

#### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| offer_id | string | **Required.** Identifier for the offer |
| affiliate_id | string | **Required.** Identifier for the affiliate |

#### Optional Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| tracking_domain | string | Override the default tracking domain for this specific click |
| ip | string | User's IP address |
| user_agent | string | User's browser user agent string |
| ref_id | string | Reference ID |
| ref_android_id | string | Android reference ID |
| ref_device_id | string | Device reference ID |
| mac_address | string | MAC address |
| os_id | string | Operating system ID |
| user_id | string | User ID |
| ext1 | string | Extra parameter 1 |
| ext2 | string | Extra parameter 2 |
| ext3 | string | Extra parameter 3 |
| imp_id | string | Impression ID |
| unid | string | Unique identifier |
| fbclid | string | Facebook click ID |
| landing_id | string | Landing page ID |
| sub1 through sub30 | string | Custom sub-parameters (up to 30) |

### Conversion Method Parameters

The `conversion()` method accepts an options object with the following parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| click_id | string | The click ID (obtained from `ASDK.clickId()`) |
| status | string | Conversion status (e.g., 'approved', 'pending') |
| offer_id | string | Identifier for the offer |
| secure | string | Security token |
| comment | string | Additional comment about the conversion |
| action_id | string | Action identifier |
| sum | string | Conversion amount |
| goal | string | Goal identifier |
| promo_code | string | Promotion code used |
| order_sum | string | Order total amount |
| order_currency | string | Order currency |
| user_id | string | User identifier |
| custom_field1 through custom_field15 | string | Custom fields (up to 15) |
| items | array | Product feed items (see below) |

#### Product Feed Items Format

```javascript
{
    order_id: string,    // Order identifier
    sku: string,         // Product SKU
    quantity: string,    // Product quantity
    price: string        // Product price
}
```

### Utility Methods

| Method | Description |
|--------|-------------|
| ASDK.urlParameter(name) | Get the value of a URL parameter by name |
| ASDK.clickId(offerId) | Get the click ID for a specific offer ID from cookies |

## Troubleshooting

### Common Issues

#### No Click ID Generated

If no click ID is generated, check that:
- The required parameters `offer_id` and `affiliate_id` are provided
- The tracking domain is correctly configured
- There are no network issues preventing the request

#### Conversion Not Tracked

If conversions are not being tracked, check that:
- A valid click ID exists (check cookies with browser dev tools)
- The offer ID matches the one used for the click
- All required conversion parameters are provided
- The tracking domain is correctly configured

### Debugging

The SDK logs errors to the console. Check your browser's developer tools console for any error messages.

You can also check the cookies set by the SDK:
- `afclick_[offer_id]` contains the click ID for a specific offer

## Browser Compatibility

The SDK includes polyfills for fetch, URL, and Promise, ensuring compatibility with:
- Chrome 45+
- Firefox 38+
- Safari 9+
- Edge 12+
- Internet Explorer 11

## Security Considerations

- The SDK stores data in cookies, which are subject to browser cookie policies
- Cross-domain tracking may be affected by third-party cookie restrictions
- Consider implementing server-side tracking for more reliable conversion attribution in environments with strict cookie policies
