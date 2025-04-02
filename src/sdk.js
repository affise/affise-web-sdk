import 'whatwg-fetch';
import 'url-polyfill';
import 'promise-polyfill/src/polyfill';

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
        // check required options "offer_id" and "affiliate_id"
        if (!this._isDefined(options.affiliate_id) || !this._isDefined(options.offer_id)) {
            console.warn(`Unable to track. Missing "offer_id" or "affiliate_id" parameter.`)
            return Promise.resolve("");
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
                .then((response) => response.json(),
                    (error) => {
                        console.error(error);
                        resolve("");
                    })
                .then((response) => {
                    if (response.clickid && response.clickid.length > 0) {
                        // Tracking domain will set cookie "afclick" with clickid,
                        // but this cookie will be allowed only for 1st party,
                        // so let's copy clickid to our cookie
                        // additionally let's associate clickid with offer_id
                        // to allow tracking of multiple offers from page
                        this._persist(`afclick_${options.offer_id}`, response.clickid, 365);
                        resolve(response.clickid);
                    }
                })
        });
    }

    conversion(options) {
        return new Promise((resolve, reject) => {
            const trackingDomain = this._isDefined(options.tracking_domain) ? options.tracking_domain : this._trackingDomain;
            const url = new URL(`${trackingDomain}/success.jpg`)
            const queryParams = new URLSearchParams(url.search + '&success=1');

            // options parameters and their mapping to API parameters
            const paramsMap = {
                'afclick': 'click_id',
                'afstatus': 'status',
                'offer_id': 'offer_id',
                'afsecure': 'secure',
                'afcomment': 'comment',
                'afid': 'action_id',
                'afprice': 'sum',
                'afgoal': 'goal',
                'promo_code': 'promo_code',
                'order_sum': 'order_sum',
                'order_currency': 'order_currency',
                'user_id': 'user_id',
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
                        // Success case - no need to process body
                        return true;
                    } else {
                        console.error(`Error: Received status code ${response.status}`);
                        return false;
                    }
                })
                .catch((err) => {
                    console.log(err);
                    resolve();
                })
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
