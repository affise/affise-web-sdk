# AffiseSDK Documentation

## Overview

AffiseSDK is a lightweight JavaScript library for tracking affiliate marketing campaigns in web applications. It enables seamless integration with the Affise platform to track user interactions without redirecting through third-party tracking systems.

Key features:
- Client-side click generation without redirecting users
- Conversion tracking with support for product feeds
- Multiple storage mechanisms with fallbacks for browser restrictions
- Cross-browser compatibility with built-in polyfills

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

## Basic Setup

Configure the SDK with your tracking domain before using it:

```javascript
// Configure the SDK with your tracking domain
ASDK.configure({
  tracking_domain: 'https://your-tracking-domain.com',
});
```

## Tracking Clicks

The `click()` method generates a click without redirecting the user, ideal for landing pages:

```javascript
// Basic click tracking
ASDK.click({
  offer_id: 'OFFER123',     // Required
  affiliate_id: 'AFF456'    // Required
})
.then(clickId => {
  console.log('Click tracked successfully:', clickId);
})
.catch(error => {
  console.error('Error tracking click:', error);
});
```

## Tracking Conversions

The `conversion()` method tracks when a user completes a desired action (purchase, signup, etc.):

```javascript
// Basic conversion tracking using click ID
ASDK.conversion({
  click_id: ASDK.clickId('OFFER123'),  // Get the stored click ID for this offer
  offer_id: 'OFFER123',
  status: '1',  // 1 = confirmed
  sum: '99.99'
})
.then(() => {
  console.log('Conversion tracked successfully');
})
.catch(error => {
  console.error('Error tracking conversion:', error);
});

// Alternative: conversion tracking using promo code
ASDK.conversion({
  promo_code: 'SUMMER20',
  offer_id: 'OFFER123',
  status: '1',
  sum: '99.99'
})
.then(() => {
  console.log('Conversion tracked successfully');
})
.catch(error => {
  console.error('Error tracking conversion:', error);
});
```

## Integration Examples

### E-commerce Landing Page

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 1. Configure the SDK
    ASDK.configure({
        tracking_domain: 'https://track.your-domain.com',
    });

    // 2. Get tracking parameters from URL
    const offerId = ASDK.urlParameter('offer_id') || 'DEFAULT_OFFER';
    const affiliateId = ASDK.urlParameter('aff_id') || 'DEFAULT_AFFILIATE';

    // 3. Generate a click
    ASDK.click({
        offer_id: offerId,
        affiliate_id: affiliateId,
        user_agent: navigator.userAgent
    })
    .then(clickId => {
        console.log('Tracking initialized:', clickId);
    })
    .catch(error => {
        console.error('Tracking error:', error.message);
    });
});
```

### E-commerce Checkout/Thank You Page

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // 1. Configure the SDK
    ASDK.configure({
        tracking_domain: 'https://track.your-domain.com',
    });

    // 2. Get order information
    const orderDetails = {
        id: 'ORD-12345',
        total: 149.99,
        currency: 'USD',
        products: [
            { id: 'SKU001', name: 'Product 1', price: 99.99, quantity: 1 },
            { id: 'SKU002', name: 'Product 2', price: 24.99, quantity: 2 }
        ]
    };
    
    // 3. Get the offer ID and click ID
    const offerId = ASDK.urlParameter('offer_id') || 'DEFAULT_OFFER';
    const clickId = ASDK.clickId(offerId);
    
    // 4. Track the conversion with product feed
    ASDK.conversion({
        click_id: clickId,
        offer_id: offerId,
        status: '1',  // 1 = confirmed
        sum: orderDetails.total.toString(),
        order_currency: orderDetails.currency,
        comment: `Order ${orderDetails.id}`,
        items: orderDetails.products.map(product => ({
            order_id: orderDetails.id,
            sku: product.id,
            quantity: product.quantity.toString(),
            price: product.price.toString()
        }))
    })
    .then(() => {
        console.log('Conversion tracked successfully');
    })
    .catch(error => {
        console.error('Error tracking conversion:', error);
    });
});
```


## Error Handling

```javascript
ASDK.click({
  offer_id: 'OFFER123',
  affiliate_id: 'AFF456'
})
.then(clickId => {
  console.log('Click tracked successfully:', clickId);
})
.catch(error => {
  // Handle specific error types
  switch(error.code) {
    case 'NETWORK_ERROR':
      console.error('Network unavailable:', error.message);
      // Retry logic or offline handling
      break;
    case 'SERVER_ERROR':
      console.error('Server error:', error.details.status);
      // Log to your monitoring system
      break;
    case 'MISSING_REQUIRED_PARAMS':
      console.error('Missing parameters:', error.details.provided);
      // Show feedback about missing data
      break;
    default:
      console.error('Error tracking click:', error.message);
  }
});
```

## API Reference

### Configuration Options

| Parameter       | Type   | Description                                      |
|-----------------|--------|--------------------------------------------------|
| tracking_domain | string | The domain used for tracking clicks and conversions |

### Click Method Parameters

The `click()` method accepts an options object with the following parameters:

#### Required Parameters

| Parameter    | Type   | Description                               | API Parameter |
|--------------|--------|-------------------------------------------|---------------|
| offer_id     | string | **Required.** Identifier for the offer    | offer_id      |
| affiliate_id | string | **Required.** Identifier for the affiliate | pid           |

#### Optional Parameters

| Parameter       | Type   | Description                                      | API Parameter |
|-----------------|--------|--------------------------------------------------|---------------|
| tracking_domain | string | Override the default tracking domain             | -             |
| ip              | string | User's IP address                                | ip            |
| user_agent      | string | User's browser user agent string                 | ua            |
| ref_id          | string | Reference ID                                     | ref_id        |
| ref_android_id  | string | Android reference ID                             | ref_android_id |
| ref_device_id   | string | Device reference ID                              | ref_device_id |
| mac_address     | string | MAC address                                      | mac_address   |
| os_id           | string | Operating system ID                              | os_id         |
| user_id         | string | User ID                                          | user_id       |
| ext1            | string | Extra parameter 1                                | ext1          |
| ext2            | string | Extra parameter 2                                | ext2          |
| ext3            | string | Extra parameter 3                                | ext3          |
| imp_id          | string | Impression ID                                    | imp_id        |
| unid            | string | Unique identifier                                | unid          |
| fbclid          | string | Facebook click ID                                | fbclid        |
| landing_id      | string | Landing page ID                                  | l             |
| sub1            | string | Custom sub-parameter 1                           | sub1          |
| sub2            | string | Custom sub-parameter 2                           | sub2          |
| sub3            | string | Custom sub-parameter 3                           | sub3          |
| sub4            | string | Custom sub-parameter 4                           | sub4          |
| sub5            | string | Custom sub-parameter 5                           | sub5          |

_Note: sub6 through sub30 are also supported with the same pattern._

### Conversion Method Parameters

The `conversion()` method accepts an options object with the following parameters:

#### Required Parameters (one of these must be provided)

| Parameter  | Type   | Description                                   | API Parameter |
|------------|--------|-----------------------------------------------|---------------|
| click_id   | string | The click ID (obtained via SDK)               | afclick       |
| promo_code | string | Promotion code (alternative to click_id)      | promo_code    |

#### Optional Parameters

| Parameter       | Type   | Description                                  | API Parameter |
|-----------------|--------|----------------------------------------------|---------------|
| tracking_domain | string | Override the default tracking domain         | -             |
| offer_id        | string | Identifier for the offer                     | offer_id      |
| status          | string | Conversion status (see status codes below)   | afstatus      |
| secure          | string | Security token for postback validation       | afsecure      |
| comment         | string | Additional comment about the conversion      | afcomment     |
| action_id       | string | External conversion ID                       | afid          |
| sum             | string | Conversion amount                            | afprice       |
| goal            | string | Conversion goal identifier                   | afgoal        |
| order_sum       | string | Total order amount (for updates)             | order_sum     |
| order_currency  | string | Order currency                               | order_currency|
| user_id         | string | User identifier                              | user_id       |
| custom_field1   | string | Custom field 1                               | custom_field1 |
| custom_field2   | string | Custom field 2                               | custom_field2 |
| custom_field3   | string | Custom field 3                               | custom_field3 |
| custom_field4   | string | Custom field 4                               | custom_field4 |
| custom_field5   | string | Custom field 5                               | custom_field5 |

_Note: custom_field6 through custom_field15 are also supported with the same pattern._

#### Status Codes

| Value | Description |
|-------|-------------|
| 1     | Confirmed   |
| 2     | Pending     |
| 3     | Declined    |
| 5     | Hold        |

#### Product Feed Item Format

Each item in the `items` array should be an object with the following properties:

```javascript
{
    order_id: string,  // Order identifier
    sku: string,       // Product SKU
    quantity: string,  // Product quantity
    price: string      // Product price
}
```

### Utility Methods

| Method                  | Description                                            |
|-------------------------|--------------------------------------------------------|
| ASDK.urlParameter(name) | Get the value of a URL parameter by name               |
| ASDK.clickId(offerId)   | Get the stored click ID for a specific offer ID        |

## Troubleshooting

### Common Issues and Solutions

#### Click Not Generated

**Symptoms:** No click ID returned, Promise rejected.

**Solutions:**
1. Verify required parameters `offer_id` and `affiliate_id` are provided
2. Check that the tracking domain is correctly configured
3. Verify network connectivity to the tracking domain
4. Check browser console for specific error messages

#### Click ID Not Stored

**Symptoms:** Click generated but not available when using `ASDK.clickId()`.

**Solutions:**
1. Check if cookies are being blocked by the browser
2. Verify your domain is not in Incognito/Private mode
3. Ensure the offer ID matches between click and retrieval

#### Conversion Not Tracked

**Symptoms:** Conversion method completes but no conversion appears in dashboard.

**Solutions:**
1. Verify you're providing either a valid `click_id` or `promo_code`
2. Check if the click ID matches the one from the original click
3. Ensure the `offer_id` matches the one used for the click
4. Verify status code is correct (use '1' for confirmed)

### Storage Mechanism

The SDK uses multiple storage mechanisms with fallbacks:
1. Cookies (primary storage)
2. localStorage (secondary storage)
3. sessionStorage (fallback)

If one mechanism fails, the SDK will try the next one automatically.

## Browser Compatibility

The SDK includes polyfills for modern JavaScript features, ensuring compatibility with:

- Chrome 45+
- Firefox 38+
- Safari 9+
- Edge 12+
- Internet Explorer 11

## Security Considerations

- The SDK stores data in cookies and browser storage, which are subject to browser policies
- Modern browsers restrict third-party cookies, which may affect cross-domain tracking
- The SDK implements a robust storage approach to work around restrictions when possible
- For environments with strict privacy settings, consider additional server-side tracking