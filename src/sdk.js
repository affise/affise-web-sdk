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

    getAdvertiserTransactionId(advertiserId) {
        let tid = this._fetch(`aff_tid_c_a_${advertiserId}`).split("|");
        if (tid) {
            tid = tid[tid.length - 1];
        } else {
            tid = this._fetch(`aff_tid_i_a_${advertiserId}`);
        }
        return tid;
    }

    getTransactionId(offerId) {
        let tid = this._fetch(`aff_tid_c_o_${offerId}`).split("|");
        if (tid) {
            tid = tid[tid.length - 1];
        } else {
            tid = this._fetch(`aff_tid_i_o_${offerId}`);
        }
        // Fallback for previous cookies when we did not have advertiser and offer cookies
        if (!tid) {
            tid = this._fetch(`aff_tid_${offerId}`);
        }
        return tid;
    }

    _getDefaultOrganicClickOptions() {
        let sub1 = "";

        if (this.urlParameter('fbclid')) {
            sub1 = "Facebook";
            if (this.urlParameter('fbclid').slice(0, 3) === "PAA") {
                sub1 = "Instagram";
            }
        }

        if (this.urlParameter('gclid')) {
            sub1 = "Google"
        }

        if (this.urlParameter('ttclid')) {
            sub1 = "Tiktok"
        }

        if (this.urlParameter('MSCLKID') || this.urlParameter('msclkid')) {
            sub1 = "Microsoft"
        }

        if (this.urlParameter('OutbrainClickId')) {
            sub1 = "Outbrain"
        }

        if (this.urlParameter('TCLID')) {
            sub1 = "Taboola"
        }

        return {
            sub1: this.urlParameter('sub1') || sub1,
            sub2: this.urlParameter('sub2') || document.referrer,
            sub3: this.urlParameter('sub3') || '/' + window.location.pathname.split('/')[1],
            sub4: this.urlParameter('sub4') || window.location.pathname,
            sub5: this.urlParameter('sub5') || window.location.search,
            source_id: this.urlParameter('source_id') || "organic",
            transaction_id: this.urlParameter('_aff_transaction_id'),
            organic: 1
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

                const queryParams = new URLSearchParams(url.search);

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('affid', options.affiliate_id || '');

                queryParams.set('afclick', options.click || '');
                queryParams.set('afoffer_id', options.offer_id || '');
                queryParams.set('affgoal', options.goal || '');
                queryParams.set('afstatus', options.status || '');
                queryParams.set('afcurrency', options.currency || '');
                queryParams.set('afcomment', options.comment || '');
                queryParams.set('afsecure', options.secure || '');
                queryParams.set('afpromo_code', options.promo_code || '');
                queryParams.set('afuser_id', options.user_id || '');
                queryParams.set('afprice', options.price || '');
                queryParams.set('pf_order_id', options.pf_order_id || '');
                queryParams.set('pf_sku', options.pf_sku || '');
                queryParams.set('pf_quantity', options.pf_quantity || '');
                queryParams.set('pf_price', options.pf_price || '');

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

    conversion(options) {
        if (!options.transaction_id) {
            if (this._isDefined(options.offer_id)) {
                options.transaction_id = this._fetch(`aff_tid_c_o_${options.offer_id}`);
                if (!options.transaction_id) {
                    options.transaction_id = this._fetch(`aff_tid_i_o_${options.offer_id}`);
                }
                // Fallback for previous cookies when we did not have advertiser and offer cookies
                if (!options.transaction_id) {
                    options.transaction_id = this._fetch(`aff_tid_${options.offer_id}`);
                }
            }
        }

        if (options.transaction_id && options.transaction_id.length > 332) {
            options.transaction_id = options.transaction_id.substring(0, 33) + options.transaction_id.substring(options.transaction_id.length - 297, options.transaction_id.length);
        }

        return new Promise((resolve, reject) => {
            this._getCustomParams().then((customParams) => {
                const trackingDomain = this._isDefined(options.tracking_domain) ? options.tracking_domain : this._trackingDomain;

                const url = new URL(`${trackingDomain}/success.jpg`)

                const queryParams = new URLSearchParams(url.search + '&success=1');

                for (const k in customParams) {
                    if (customParams.hasOwnProperty(k)) {
                        queryParams.set(k, customParams[k])
                    }
                }

                queryParams.set('transaction_id', options.transaction_id || '');
                queryParams.set('event_id', options.event_id || 0);

                if (this._isDefined(options.offer_id)) {
                    queryParams.set('afoffer_id', options.offer_id);
                }

                if (this._isDefined(options.affiliate_id)) {
                    queryParams.set('affid', options.affiliate_id);
                }

                if (this._isDefined(options.advertiser_id)) {
                    queryParams.set('afadv_id', options.advertiser_id);
                }

                if (this._isDefined(options.promo_code)) {
                    queryParams.set('promo_code', options.promo_code);
                }

                if (this._isDefined(options.amount)) {
                    queryParams.set('amount', options.amount);
                }

                if (this._isDefined(options.adv1)) {
                    queryParams.set('adv1', options.adv1)
                }

                if (this._isDefined(options.adv2)) {
                    queryParams.set('adv2', options.adv2)
                }

                if (this._isDefined(options.adv3)) {
                    queryParams.set('adv3', options.adv3)
                }

                if (this._isDefined(options.adv4)) {
                    queryParams.set('adv4', options.adv4)
                }

                if (this._isDefined(options.adv5)) {
                    queryParams.set('adv5', options.adv5)
                }

                if (this._isDefined(options.sub1)) {
                    queryParams.set('sub1', options.sub1)
                }

                if (this._isDefined(options.sub2)) {
                    queryParams.set('sub2', options.sub2)
                }

                if (this._isDefined(options.sub3)) {
                    queryParams.set('sub3', options.sub3)
                }

                if (this._isDefined(options.sub4)) {
                    queryParams.set('sub4', options.sub4)
                }

                if (this._isDefined(options.sub5)) {
                    queryParams.set('sub5', options.sub5)
                }

                if (this._isDefined(options.order_id)) {
                    queryParams.set('order_id', options.order_id)
                }

                if (this._isDefined(options.verification_token)) {
                    queryParams.set('verification_token', options.verification_token)
                }

                if (this._isDefined(options.email)) {
                    queryParams.set('email', options.email)
                }

                if (this._isDefined(options.order)) {
                    queryParams.set('order', JSON.stringify(options.order));
                }

                if (this._isDefined(options.user_id)) {
                    queryParams.set('user_id', options.user_id);
                }

                if (options.disable_fingerprinting === true) {
                    queryParams.delete('asdkfp');
                }

                if (this._isDefined(options.parameters)) {
                    Object.keys(options.parameters).forEach(p => queryParams.set(p, options.parameters[p]));
                }

                queryParams.set('event_source_url', window.location.hostname)

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
                            return response.json();
                        } else {
                            return { conversion_id: '', transaction_id: '', html_pixel: '' };
                        }
                    })
                    .then((response) => {
                        if (response.html_pixel != '') {
                            const script = document.createElement('iframe');
                            script.width = 1;
                            script.height = 1;
                            script.frameBorder = 0;

                            const src = "https://" + trackingDomain + "/success.jpg" + queryParams + "&success=1";
                            script.setAttribute("src", src)

                            document.getElementsByTagName('body')[0].appendChild(script);

                            script.contentWindow.document.open();
                            script.contentWindow.document.close();
                        }
                        resolve({ transaction_id: response.transaction_id, conversion_id: response.conversion_id });
                    })
                    .catch((err) => {
                        console.log(err);
                        resolve({ conversion_id: '', transaction_id: '', html_pixel: '' });
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

    _setDefaultFromURL(queryParams, paramName) {
        const paramValue = this.urlParameter(paramName);
        if (this._isDefined(paramValue)) {
            queryParams.set(paramName, paramValue);
        }
    }

    urlParameter(name) {
        return new URL(window.location.href).searchParams.get(name);
    }
}
