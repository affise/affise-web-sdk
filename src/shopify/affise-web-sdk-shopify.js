var sdkUri = "https://cdn.affise.com/shopify/affise-web-sdk.js?v=" + Date.now();
!(function (i, n, t) {
    var e = n.getElementsByTagName("script")[0];
    (j = n.createElement("script")), (j.async = !0), (j.src = t), e.parentNode.insertBefore(j, e);
})(window, document, sdkUri),
    (function (i) {
        var n = {},
            t = null,
            useHtmlParsing = false,
            affisePostbackStatus = null,
            e = (function () {
                function e() {
                }

                return (
                    (e.prototype.init = function (t, e, a, c, options) {
                        (n.domain = e),
                            (n.pixelToken = a),
                            (n.method = "trackConv" == c || "trackConvForBrand" == c ? c : "trackConv"),
                            (useHtmlParsing = options && options.useHtmlParsing);

                        if (useHtmlParsing) {
                            console.info("[AffiseWebSDK] HTML parsing mode enabled, skipping event subscription.");

                            t.subscribe("page_viewed", function (event) {
                                var orderData = extractOrderDataFromHtml();
                                if (orderData) {
                                    console.info("[AffiseWebSDK] Extracted order data:", orderData);
                                    r(orderData, "direct"); // Use extracted data to fire pixel
                                } else {
                                    console.info("[AffiseWebSDK] Thank you page is not reached.");
                                }
                            });
                        } else {
                            console.log("[AffiseWebSDK] Using default event-based tracking.");
                            (function (t) {
                                t.subscribe("page_viewed", function () {
                                    o(function () {
                                        n.initCb && "function" == typeof n.initCb ? n.initCb() : i.AffiseWebSDK.init();
                                    });
                                }),
                                    t.subscribe("checkout_completed", function (i) {
                                        o(function () {
                                            r(i, "shopify");
                                        });
                                    }),
                                    t.subscribe("gokwik_purchase_event", function (i) {
                                        o(function () {
                                            r(i, "gokwik");
                                        });
                                    });
                            })(t);
                        }
                    }),
                        (e.prototype.setShopifyApiObj = function (i) {
                            i && (t = i);
                        }),
                        (e.prototype.getVersion = function () {
                            return "v1.3";
                        }),
                        (e.prototype.setCallbacks = function (i, t) {
                            (n.orderDataCb = i), (n.initCb = t);
                        }),
                        (e.prototype.setAffisePostbackStatus = function (status) {
                            // Validate status is integer between 1 and 6
                            if (typeof status === 'number' && Number.isInteger(status) && status >= 1 && status <= 6) {
                                affisePostbackStatus = status;
                            }
                        }),
                        e
                );
            })();

        function o(n) {
            if (i.AffiseWebSDK) n();
            else {
                var t = document.createElement("script");
                (t.onload = function () {
                    n();
                }),
                    (t.src = sdkUri),
                    document.body.appendChild(t);
            }
        }

        function extractOrderDataFromHtml() {
            let orderNumberElement = document.querySelector(".os-order-number");
            let totalPriceElement = document.querySelector(".payment-due__price");
            let currencyElement = document.querySelector(".payment-due__currency");

            if (!orderNumberElement || !totalPriceElement || !currencyElement) {
                console.warn("[AffiseWebSDK] Failed to locate required order details in HTML.");
                return null;
            }

            let orderNumber = orderNumberElement.innerText.replace("Order", "").trim();
            let orderTotal = totalPriceElement.innerText.replace(/[^\d.]/g, ""); // Remove currency symbols
            let currency = currencyElement.innerText.trim();

            if (!orderNumber || !orderTotal || !currency) {
                console.warn("[AffiseWebSDK] Parsed values are empty. Something might be wrong.");
                return null;
            }

            return {
                total: orderTotal,
                order: orderNumber,
                currency: currency,
                date: Date.now(),
            };
        }

        function r(e, o) {
            var r = i.AffiseWebSDK.getShopifyCheckoutData(e, o);
            if (affisePostbackStatus !== null) {
                r.afstatus = affisePostbackStatus;
            }
            n.orderDataCb && "function" == typeof n.orderDataCb && (r = n.orderDataCb(e, r)),
                (r.is_iframe = !0),
            t && t.init && t.init.data && t.init.data.shop && ((r.sub10 = t.init.data.shop.myshopifyDomain), (r.shopify_shop_id = t.init.data.shop.myshopifyDomain)),
            n.domain && (i.AffiseWebSDK.trackConv(n.domain, r));
        }

        i.AffShopifyWrapper = new e();
    })(window);