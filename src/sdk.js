// file: src/sdk.js
import 'whatwg-fetch';
import 'url-polyfill';
import 'promise-polyfill/src/polyfill';
import { AffiseSDKError, ErrorCodes } from './errors';

export default class AffiseSDK {
    constructor() {
        if (this.constructor === AffiseSDK) {
            throw new TypeError("Can not construct abstract class.");
        }

        if (this._persist === AffiseSDK.prototype._persist) {
            throw new TypeError("Please implement abstract method _persist.");
        }

        if (this._fetch === AffiseSDK.prototype._fetch) {
            throw new TypeError("Please implement abstract method _fetch.");
        }

        this._trackingDomain = '<<.TrackingDomain>>';
    }

    /**
     * Configures the SDK with the provided options
     * @param {Object} options
     * @param {string} options.tracking_domain - Tracking domain to be used for tracking clicks
     */
    configure(options) {
        if (this._isDefined(options.tracking_domain)) {
            this._trackingDomain = options.tracking_domain;
        }
    }

    /**
     * Tracks a click with the provided options
     * @param {Object} options - Click tracking options
     * @param {string} options.affiliate_id - (Required) Affiliate ID
     * @param {string} options.offer_id - (Required) Offer ID
     * @param {string} [options.tracking_domain] - Optional tracking domain to override the default
     * @param {string} [options.ip] - User IP address
     * @param {string} [options.user_agent] - User agent string
     * @param {string} [options.ref_id] - Reference ID
     * @param {string} [options.ref_android_id] - Android reference ID
     * @param {string} [options.ref_device_id] - Device reference ID
     * @param {string} [options.mac_address] - MAC address
     * @param {string} [options.os_id] - Operating system ID
     * @param {string} [options.user_id] - User ID
     * @param {string} [options.ext1] - Extra parameter 1
     * @param {string} [options.ext2] - Extra parameter 2
     * @param {string} [options.ext3] - Extra parameter 3
     * @param {string} [options.imp_id] - Impression ID
     * @param {string} [options.unid] - Unique identifier
     * @param {string} [options.fbclid] - Facebook click ID
     * @param {string} [options.landing_id] - Landing page ID
     * @param {string} [options.sub1] - Custom subparameter 1
     * @param {string} [options.sub2] - Custom subparameter 2
     * ... up to sub30
     * @returns {Promise<string>} - Promise resolving to the click ID
     */
    click(options) {
        // Validate required parameters
        if (!this._isDefined(options.affiliate_id) || !this._isDefined(options.offer_id)) {
            const error = new AffiseSDKError(
                ErrorCodes.MISSING_REQUIRED_PARAMS,
                'Missing required parameters: offer_id and/or affiliate_id',
                { provided: Object.keys(options) }
            );
            console.warn(error.message);
            return Promise.reject(error);
        }

        return new Promise((resolve, reject) => {
            const trackingDomain = this._isDefined(options.tracking_domain) ? options.tracking_domain : this._trackingDomain;
            const url = new URL(`${trackingDomain}/click`)
            const queryParams = new URLSearchParams(url.search + '&format=json&websdk=1');

            // required parameters
            queryParams.set('pid', options.affiliate_id);
            queryParams.set('offer_id', options.offer_id);

            // options parameters and their mapping to API parameters
            const paramsMap = {
                'ip': 'ip',
                'ua': 'user_agent',
                'ref_id': 'ref_id',
                'ref_android_id': 'ref_android_id',
                'ref_device_id': 'ref_device_id',
                'mac_address': 'mac_address',
                'os_id': 'os_id',
                'user_id': 'user_id',
                'ext1': 'ext1',
                'ext2': 'ext2',
                'ext3': 'ext3',
                'imp_id': 'imp_id',
                'unid': 'unid',
                'fbclid': 'fbclid',
                'l': 'landing_id',
            };
            for (let i = 1; i <= 30; i++) {
                paramsMap[`sub${i}`] = `sub${i}`;
            }

            for (const [key, value] of Object.entries(paramsMap)) {
                if (this._isDefined(options[value])) {
                    queryParams.set(key, options[value]);
                }
            }

            // filter out empty values
            for (const [key, value] of queryParams.entries()) {
                if (value === '' || value === null || value === undefined) {
                    queryParams.delete(key);
                }
            }

            url.search = queryParams.toString();

            /**
             * @typedef {object} response
             * @property {string} clickid
             */
            fetch(url.toString(), {
                method: 'GET',
                credentials: 'include',
            })
                .then(
                    (response) => {
                        if (!response.ok) {
                            throw new AffiseSDKError(
                                ErrorCodes.SERVER_ERROR,
                                `Server responded with status: ${response.status}`,
                                { status: response.status, url: url.toString() }
                            );
                        }
                        return response.json();
                    },
                    (error) => {
                        const networkError = new AffiseSDKError(
                            ErrorCodes.NETWORK_ERROR,
                            'Network error occurred while tracking click',
                            { originalError: error.message }
                        );
                        console.error(networkError);
                        reject(networkError);
                    }
                )
                .then((response) => {
                    if (response.clickid && response.clickid.length > 0) {
                        this._persist(`afclick_${options.offer_id}`, response.clickid, 365);
                        resolve(response.clickid);
                    } else {
                        const invalidResponse = new AffiseSDKError(
                            ErrorCodes.INVALID_RESPONSE,
                            'Invalid response: missing clickid',
                            { response }
                        );
                        console.error(invalidResponse);
                        reject(invalidResponse);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Tracks a conversion with the provided options
     * @param {object} options
     * @param {string} options.tracking_domain - Tracking domain to be used for tracking conversions
     * @param {string} options.click_id - Click ID
     * @param {string} options.status - Conversion status (1 - confirmed, 2 - pending, 3 - decline, 5 - hold)
     * @param {string} options.offer_id - Offer ID
     * @param {string} options.secure - Postback secure code
     * @param {string} options.comment - Conversion comment
     * @param {string} options.action_id - External conversion ID
     * @param {string} options.sum - Conversion sum
     * @param {string} options.goal - Conversion goal
     * @param {string} options.promo_code - Promotion code
     * @param {string} options.order_sum - Updated conversion sum (optional)
     * @param {string} options.order_currency - Updated conversion currency (optional)
     * @param {string} options.user_id - Affise user ID
     * @param {string} options.custom_field1 - Custom field 1
     * @param {string} options.custom_field2 - Custom field 2
     * @param {string} options.custom_field3 - Custom field 3
     * @param {string} options.custom_field4 - Custom field 4
     * @param {string} options.custom_field5 - Custom field 5
     * @param {string} options.custom_field6 - Custom field 6
     * @param {string} options.custom_field7 - Custom field 7
     * @param {string} options.custom_field8 - Custom field 8
     * @param {string} options.custom_field9 - Custom field 9
     * @param {string} options.custom_field10 - Custom field 10
     * @param {string} options.custom_field11 - Custom field 11
     * @param {string} options.custom_field12 - Custom field 12
     * @param {string} options.custom_field13 - Custom field 13
     * @param {string} options.custom_field14 - Custom field 14
     * @param {string} options.custom_field15 - Custom field 15
     * @param {Array} options.items - Array of product feed items
     * @param {string} options.items[].order_id - Order ID
     * @param {string} options.items[].sku - SKU
     * @param {string} options.items[].quantity - Quantity
     * @param {string} options.items[].price - Price
     *
     * @returns {Promise}
     */
    conversion(options) {
        // Validate minimum required parameters
        if (!this._isDefined(options.click_id) && !this._isDefined(options.promo_code)) {
            const error = new AffiseSDKError(
                ErrorCodes.MISSING_REQUIRED_PARAMS,
                'Missing required parameter: click_id or promo_code',
                { provided: Object.keys(options) }
            );
            console.warn(error.message);
            return Promise.reject(error);
        }

        return new Promise((resolve, reject) => {
            const trackingDomain = this._isDefined(options.tracking_domain) ? options.tracking_domain : this._trackingDomain;
            const url = new URL(`${trackingDomain}/success.jpg`)
            const queryParams = new URLSearchParams(url.search + '&success=1');

            // options parameters and their mapping to API parameters
            const paramsMap = {
                'afclick': 'click_id', // mongoid, affise click id
                'afstatus': 'status', // integer, possible values: 1 - confirmed, 2 - pending, 3 - decline, 5 - hold
                'offer_id': 'offer_id', // integer, affise offer id
                'afsecure': 'secure', // string, postback secure code
                'afcomment': 'comment', // conversion comment
                'afid': 'action_id', // external conversion id
                'afprice': 'sum', // conversion sum
                'afgoal': 'goal', // conversion goal
                'promo_code': 'promo_code', // promotion code
                'order_sum': 'order_sum', // updated conversion sum, use it only if you need to update conversion sum
                'order_currency': 'order_currency', // updated conversion currency, use it only if you need to update conversion currency
                'user_id': 'user_id', // affise user id
            };

            for (let i = 1; i <= 15; i++) {
                paramsMap[`custom_field${i}`] = `custom_field${i}`;
            }

            for (const [key, value] of Object.entries(paramsMap)) {
                if (this._isDefined(options[value])) {
                    queryParams.set(key, options[value]);
                }
            }

            if (this._isDefined(options.items)) {
                // product feed parameters
                // tracking structure of product feeds: items[0].order_id, items[0].sku, items[0].quantity, items[0].price
                for (let i = 0; i < options.items.length; i++) {
                    if (this._isDefined(options.items[i])) {
                        /**
                         * @type {object} item
                         * @property {string} order_id
                         * @property {string} sku
                         * @property {string} quantity
                         * @property {string} price
                         */
                        const item = options.items[i];
                        if (this._isDefined(item.order_id)) {
                            queryParams.set(`items[${i}][order_id]`, item.order_id);
                        }
                        if (this._isDefined(item.sku)) {
                            queryParams.set(`items[${i}][sku]`, item.sku);
                        }
                        if (this._isDefined(item.quantity)) {
                            queryParams.set(`items[${i}][quantity]`, item.quantity);
                        }
                        if (this._isDefined(item.price)) {
                            queryParams.set(`items[${i}][price]`, item.price);
                        }
                    }
                }
            }

            url.search = queryParams.toString();

            fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            })
                .then((response) => {
                    if (response.status === 200) {
                        resolve(true);
                    } else {
                        const serverError = new AffiseSDKError(
                            ErrorCodes.SERVER_ERROR,
                            `Error: Received status code ${response.status}`,
                            { status: response.status, url: url.toString() }
                        );
                        console.error(serverError);
                        reject(serverError);
                    }
                })
                .catch((err) => {
                    const networkError = new AffiseSDKError(
                        ErrorCodes.NETWORK_ERROR,
                        'Network error occurred while tracking conversion',
                        { originalError: err.message }
                    );
                    console.error(networkError);
                    reject(networkError);
                });
        });
    }

    _fetch(key) {
        throw new TypeError("Do not call abstract method _fetch")
    }

    _persist(key, value, expirationDays = 30) {
        throw new TypeError("Do not call abstract method _persist")
    }

    _isDefined(value) {
        return typeof value !== 'undefined' && value !== undefined && value !== null;
    }

    /**
     * Get the value of a URL parameter by name
     * @param {string} name
     * @returns {string}
     */
    urlParameter(name) {
        return new URL(window.location.href).searchParams.get(name);
    }

    /**
     * Get the click ID
     * @param {string} offerId
     * @returns {string|any}
     */
    clickId(offerId) {
        return this._fetch(`afclick_${offerId}`);
    }
}