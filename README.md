## affise-web-sdk

Build sdk files:

`npm run build`

Set the file bundle.js from dist folder to <head></head> of HTML page

Configure the SDK before doing any tracking:

```javascript
ASDK.configure({
    tracking_domain: 'https://<tracking-domain>.com',
})
```

On the tracking page call click method:

```
AffiseSDK.click({
    offer_id: 1, // Required. The offer id
    affiliate_id: 1, //Required. The affiliate id

    goal: '',
    status: '',
    currency: '',
    comment: '',
    secure: '',
    promo_code: '',
    user_id: '',

    custom_field_1: '',
    custom_field_2: '',
    custom_field_3: '',
    custom_field_4: '',
    custom_field_5: '',
    custom_field_6: '',
    custom_field_7: '',
});
```
