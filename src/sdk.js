import 'whatwg-fetch';
import 'url-polyfill';
import 'promise-polyfill/src/polyfill';

export default class AffiseSDK {
    constructor(customParamProvider) {
        if (this.constructor === AffiseSDK) {
            throw new TypeError("Can not construct abstract class.");
        }

        if (this._persist === AffiseSDK.prototype._persist) {
            throw new TypeError("Please implement abstract method _persist.");
        }

        if (this._fetch === AffiseSDK.prototype._fetch) {
            throw new TypeError("Please implement abstract method _fetch.");
        }

        this.customParamProvider = customParamProvider;
        this._trackingDomain = '<<.TrackingDomain>>';
        this._organicEnabled = false;
    }

    configure(options) {
        if (this._isDefined(options.tracking_domain)) {
            this._trackingDomain = options.tracking_domain;
        }
        if (this._isDefined(options.afoffer_id)) {
            this._tld = options.afoffer_id;
        }
        if (this._isDefined(options.organic)) {
            if (this._isDefined(options.organic.offer_id) && this._isDefined(options.organic.affiliate_id)) {
                this._organicEnabled = true;
                this._organicOptions = Object.assign(
                    this._getDefaultOrganicClickOptions(),
                    options.organic.options || {},
                    { affiliate_id: options.organic.affiliate_id, offer_id: options.organic.offer_id }
                );
            }
            else {
                console.warn(`Unable to setup organic tracking. Missing "organic.offer_id" or "organic.affiliate_id" parameter.`)
            }
        }
    }

    click(options) {
        if (options.do_not_track === true) {
            return Promise.resolve("");
        }

        if (!options.offer_id) {
            if (this._organicEnabled && !this._fetch('aff_witness')) {
                options = this._organicOptions;
            } else {
                console.warn(`Unable to track. Missing "offer_id" or "transaction_id" parameter.`)
                return Promise.resolve("");
            }
        }

        return new Promise((resolve, reject) => {
            this._getCustomParams().then((customParams) => {
                const trackingDomain = this._isDefined(options.tracking_domain) ? options.tracking_domain : this._trackingDomain;

                const url = new URL(`${trackingDomain}/sdk/click`)

                const queryParams = new URLSearchParams(url.search + '&format=json&websdk=1');

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('affid', options.affiliate_id || '');
                queryParams.set('afoffer_id', options.offer_id || '');

                queryParams.set('afclick', options.click || '');
                queryParams.set('affgoal', options.goal || '');
                queryParams.set('afstatus', options.status || '');
                queryParams.set('afcurrency', options.currency || '');
                queryParams.set('afcomment', options.comment || '');
                queryParams.set('afsecure', options.secure || '');
                queryParams.set('afpromo_code', options.promo_code || '');
                queryParams.set('afuser_id', options.user_id || '');

                queryParams.set('async', 'json')

                if (this._isDefined(options.custom_field_1)) {
                    queryParams.set('custom_field_1', options.custom_field_1)
                }
                if (this._isDefined(options.custom_field_2)) {
                    queryParams.set('custom_field_2', options.custom_field_2)
                }
                if (this._isDefined(options.custom_field_3)) {
                    queryParams.set('custom_field_3', options.custom_field_3)
                }
                if (this._isDefined(options.custom_field_4)) {
                    queryParams.set('custom_field_4', options.custom_field_4)
                }
                if (this._isDefined(options.custom_field_5)) {
                    queryParams.set('custom_field_5', options.custom_field_5)
                }
                if (this._isDefined(options.custom_field_6)) {
                    queryParams.set('custom_field_6', options.custom_field_6)
                }
                if (this._isDefined(options.custom_field_7)) {
                    queryParams.set('custom_field_7', options.custom_field_7)
                }

                url.search = queryParams.toString();

                fetch(url.toString(), {
                    method: 'GET',
                    credentials: 'include'
                })
                    .then((response) => response.json(),
                        (error) => {
                            console.error(error);
                            resolve("");
                        })
                    .then((response) => {
                        if (response.transaction_id && response.transaction_id.length > 0) {
                            this._persist('aff_witness', '1');
                            const tidOffer = this._fetch(`aff_tid_c_o_${response.oid || options.offer_id}`);
                            this._persist(`aff_tid_c_o_${response.oid || options.offer_id}`, tidOffer && tidOffer.length > 0 ? `${tidOffer}|${response.transaction_id}` : response.transaction_id);
                            const tidAdv = this._fetch(`aff_tid_c_a_${response.aid}`);
                            this._persist(`aff_tid_c_a_${response.aid}`, tidAdv && tidAdv.length > 0 ? `${tidAdv}|${response.transaction_id}` : response.transaction_id);
                            resolve(response.transaction_id);
                        }
                    })
            });
        });
    }

    _getCustomParams() {
        return Promise.all([
            this.customParamProvider,
            this._getClientHints()
        ]).then((params) => {
            return params.reduce((a, b) => Object.assign(a, b), {})
        })
    }

    _getClientHints() {
        if (window.navigator.userAgentData) {
            return navigator.userAgentData.getHighEntropyValues(
                [
                    "platform",
                    "platformVersion",
                    "model"
                ])
                .then((ua) => {
                    return {
                        sec_ch_ua_platform: ua.platform,
                        sec_ch_ua_platform_version: ua.platformVersion,
                        sec_ch_ua_model: ua.model,
                    }
                });
        }
        return Promise.resolve({})
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

    urlParameter(name) {
        return new URL(window.location.href).searchParams.get(name);
    }
}
