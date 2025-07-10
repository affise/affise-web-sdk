!(function (t, e) {
    var r = "afclick",
        o = "__tr_clid",
        z = "afgoal",
        n = "tr_utm_camp",
        a = "__tr_utms",
        i = "__tr_utmd",
        c = "__tr_isnu",
        u = "__tr_db",
        s = "__tr_jr",
        p = "__tr_luptv",
        f = "session_store",
        m = (function () {
            "use strict";
            var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return {
                encode: function (e) {
                    var r,
                        o,
                        n,
                        a,
                        i,
                        c,
                        u,
                        s = "",
                        p = 0;
                    for (
                        e = (function (t) {
                            var e,
                                r,
                                o = "";
                            for (t = t.replace(/\r\n/g, "\n"), r = 0; r < t.length; r++)
                                (e = t.charCodeAt(r)) < 128
                                    ? (o += String.fromCharCode(e))
                                    : e > 127 && e < 2048
                                        ? ((o += String.fromCharCode((e >> 6) | 192)), (o += String.fromCharCode((63 & e) | 128)))
                                        : ((o += String.fromCharCode((e >> 12) | 224)), (o += String.fromCharCode(((e >> 6) & 63) | 128)), (o += String.fromCharCode((63 & e) | 128)));
                            return o;
                        })(e);
                        p < e.length;
                    )
                        (a = (r = e.charCodeAt(p++)) >> 2),
                            (i = ((3 & r) << 4) | ((o = e.charCodeAt(p++)) >> 4)),
                            (c = ((15 & o) << 2) | ((n = e.charCodeAt(p++)) >> 6)),
                            (u = 63 & n),
                            isNaN(o) ? (c = u = 64) : isNaN(n) && (u = 64),
                            (s += t.charAt(a)),
                            (s += t.charAt(i)),
                            (s += t.charAt(c)),
                            (s += t.charAt(u));
                    return s;
                },
                decode: function (e) {
                    var r,
                        o,
                        n,
                        a,
                        i,
                        c,
                        u = "",
                        s = 0;
                    for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); s < e.length;)
                        (r = (t.indexOf(e.charAt(s++)) << 2) | ((a = t.indexOf(e.charAt(s++))) >> 4)),
                            (o = ((15 & a) << 4) | ((i = t.indexOf(e.charAt(s++))) >> 2)),
                            (n = ((3 & i) << 6) | (c = t.indexOf(e.charAt(s++)))),
                            (u += String.fromCharCode(r)),
                        64 !== i && (u += String.fromCharCode(o)),
                        64 !== c && (u += String.fromCharCode(n));
                    return (function (t) {
                        for (var e = "", r = 0, o = 0, n = 0, a = 0; r < t.length;)
                            (o = t.charCodeAt(r)) < 128
                                ? ((e += String.fromCharCode(o)), r++)
                                : o > 191 && o < 224
                                    ? ((n = t.charCodeAt(r + 1)), (e += String.fromCharCode(((31 & o) << 6) | (63 & n))), (r += 2))
                                    : ((n = t.charCodeAt(r + 1)), (a = t.charCodeAt(r + 2)), (e += String.fromCharCode(((15 & o) << 12) | ((63 & n) << 6) | (63 & a))), (r += 3));
                        return e;
                    })(u);
                },
            };
        })();

    function l(t, e) {
        return "string" != typeof t && (t = String(t)), ("number" != typeof e || e < 0) && (e = 100), t.length <= e ? t : t.slice(0, e);
    }

    function d(t) {
        t = t.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var e = new RegExp("[\\?&]" + t + "=([^&#]*)").exec(location.search);
        return null === e ? "" : decodeURIComponent(e[1].replace(/\+/g, " "));
    }

    function g() {
        return t.localStorage ? t.localStorage.getItem(u) == f : _(u) == f;
    }

    function h(e) {
        if (g()) return t.sessionStorage ? t.sessionStorage.getItem(e) : "";
        var r = _(e);
        return !r && t.localStorage && (r = t.localStorage.getItem(e)), r
    }

    function _(t) {
        var r = e.cookie.split("; "), o = null;
        return r.forEach((function (e) {
            if (0 === e.indexOf(t + "=")) return o = e.split("=")[1], !1
        })), o
    }

    function v(t) {
        var e = [];
        [
            "afid",
            // "afprice",
            "afcomment",
            "afsecure",
            "afoffer_id",
            "pf_order_id",
            "pf_sku",
            "pf_quantity",
            "pf_price",
            "custom_field1",
            "custom_field2",
            "custom_field3",
            "custom_field4",
            "custom_field5",
            "custom_field6",
            "custom_field7",
            "afuser_id",
            "afgoal",
            "afstatus",
            "afpromo_code",
            "afcurrency",
        ].forEach(function (r) {
            var o = (t && t[r]) || "";
            ((o && "string" == typeof o) || (o && "number" == typeof o)) && e.push(r + "=" + encodeURIComponent(o));
        });
        var r = {};
        // (r[a] = "utms"),
        //    (r[i] = "utmd"),
        //    (r[n] = "utmc"),
        //    (r[s] = "j"),
        // [a, i, n, s].forEach(function (t) {
        //     var o = h(t);
        //     o && "string" == typeof o && e.push(r[t] + "=" + encodeURIComponent(o));
        // });

        var o = t ? t.afprice : null;
        if ("string" == typeof o) {
            o = o.replace(/,/g, "");
            var c = Number(o);
            isNaN(c) || e.push("afprice=" + c);
        } else "number" == typeof o && e.push("afprice=" + o);
        return e.push("__v=0.1"), e.push("s=websdk"), e;
    }

    function S(t) {
        return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
    }

    function y(e, r, o, n) {
        t.Sentry.captureException(e, function (e) {
            return e.clear(), r && e.setExtra("tdomain", r), o && e.setExtra("token", o), n && e.setExtra("opts", JSON.stringify(n)), e.setExtra("href", t.location.href), e.setExtra("user_agent", navigator.userAgent), e;
        });
    }

    function C(r, n) {
        var a = (n && n.is_iframe) || (n && n.isIframe) ? "iframe" : "image",
            i = (n && n.custom_field2) || "";
        if (
            (!i && t.Shopify && t.Shopify.checkout && (i = t.Shopify.checkout.updated_at || t.Shopify.checkout.created_at),
            i &&
            n &&
            ((n.custom_field2 = i),
                !(function (t) {
                    try {
                        var e = new Date(t);
                        if (!e.toJSON()) return !0;
                        var r = new Date();
                        return S(r) == S(e) && (r.getTime() - e.getTime()) / 1e3 < 86400;
                    } catch (t) {
                        return !0;
                    }
                })(i)))
        )
            console.log("[log.INFO AffiseWebSDK] Skip order tracking as it is not of current date");
        else {
            var c = v(n).join("&"),
                u = O(),
                g = X(),
                s = r + "/success.jpg?success=1&afclick=" + u + "&" + c;

            g && "string" == typeof g && g.length > 0 && (s += "&afgoal=" + g)

            if ("iframe" == a) {
                var p = e.createElement("iframe");
                p.setAttribute("src", s), (p.style.display = "none"), e.body.appendChild(p);
            } else {
                new Image().src = s;
            }
        }
    }

    function I(t, r) {
        try {
            C(t, r);
        } catch (o) {
            r && r.capture_error;
        }
    }

    function w() {
        var t = new Date();
        D(p, t.getTime());
    }

    function x(s, p) {
        var m,
            l,
            g,
            h = d("utm_source");
        if (
            ((m = e.referrer),
                (l = d("gclid")),
                (g = d("fbclid")),
            (/^https:\/\/www\.google\./.test(m) ||
                "https://www.google.com/" == m ||
                "https://www.bing.com/" == m ||
                "https://search.yahoo.com/" == m ||
                "https://in.search.yahoo.com/" == m ||
                /search\.yahoo\.com/.test(m) ||
                ("string" == typeof l && l.length > 10) ||
                ("string" == typeof g && g.length > 10)) &&
            !h)
        )
            return (
                (e.cookie = r + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                    (e.cookie = o + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                    (e.cookie = n + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                    (e.cookie = a + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                    (e.cookie = i + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                    (e.cookie = c + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT"),
                t.sessionStorage && (t.sessionStorage.removeItem(r), t.sessionStorage.removeItem(o), t.sessionStorage.removeItem(n), t.sessionStorage.removeItem(a), t.sessionStorage.removeItem(i), t.sessionStorage.removeItem(c)),
                t.localStorage && (t.localStorage.removeItem(r), t.localStorage.removeItem(o), t.localStorage.removeItem(n), t.localStorage.removeItem(a), t.localStorage.removeItem(i), t.localStorage.removeItem(c)),
                    E("organic"),
                    void w()
            );
        t.localStorage && (s == f ? t.localStorage.setItem(u, f) : t.localStorage.setItem(u, "ck")), N(d("click_id"), d("utm_campaign"), p);
    }

    function T(e) {
        var r = JSON.stringify(e);
        t.btoa ? D(s, t.btoa(r)) : D(s, m.encode(r));
    }

    function A(e, r) {
        try {
            var o = (function (e) {
                    var r;
                    r = t.atob ? t.atob(e) : m.decode(e);
                    var o = JSON.parse(r);
                    return o || (o = []), o;
                })(r),
                n = o[o.length - 1];
            return n.utms != e.utms || (e.utmc && e.utmc != n.utmc) ? (o.length >= 5 && o.shift(), o.push(e), T(o), !0) : ((n.ts = e.ts), (n.utmd = e.utmd), (n.utmc = e.utmc), (o[o.length - 1] = n), T(o), !0);
        } catch (t) {
        }
        return !1;
    }

    function E(t) {
        if (!t) return !1;
        var e = (function (t) {
                var e = new Date(),
                    r = {utms: l(t || d("utm_source")), ts: e.toJSON()},
                    o = d("utm_campaign");
                o && (r.utmc = l(o));
                var n = d("utm_medium");
                return (
                    n && (r.utmd = l(n)),
                        (r.enc = "yes"),
                        ["utms", "utmc", "utmd"].forEach(function (t) {
                            r[t] && (r[t] = encodeURIComponent(r[t]));
                        }),
                        r
                );
            })(t),
            r = h(s);
        return r ? A(e, r) : (T([e]), !0);
    }

    function N(t, e, r) {
        var c = d("utm_source"),
            u = h(a);

        (function () {
            try {
                var t = h(p);
                if (t && !Number.isNaN(Number(t))) return (new Date().getTime() - Number(t)) / 1e3 > 20;
            } catch (t) {
            }
            return !0;
        })() &&
        (c && u != c && !e && (e = "__EMPTY__"),
        E(c) &&
        r &&
        r.cf_prb &&
        (function (t) {
            if (t && t.tdomain) {
                var e = d("click_id") || O(),
                    f = d("goal_value") || O(),
                    r = "https://" + t.tdomain + "/prbcl?click_id=" + e + "&goal_value" + f + "&j=" + h(s);
                fetch(r)
                    .then(function (t) {
                    })
                    .catch(function (t) {
                    });
            }
        })(r),
            D(o, t),
            D(n, e),
            D(a, c),
            D(i, d("utm_medium")),
            D(z, d("goal_value")),
            w());
    }

    function D(r, o) {
        g()
            ? t.sessionStorage && o && t.sessionStorage.setItem(r, o)
            : (!(function (t, r) {
                var o = new Date();
                o.setTime(o.getTime() + 31536e6), r && (e.cookie = t + "=" + r + ";path=/;expires=" + o.toUTCString());
            })(r, o),
            t.localStorage && o && t.localStorage.setItem(r, o));
    }

    function O() {
        var t = h(o);
        return t || (h(r) || "")
    }

    function X() {
        var t = h(z);
        return t || (h(z) || "")
    }

    var J = (function () {
        var t = null;

        function r() {
        }

        return (
            (r.prototype.init = function (t, e) {
                x(t, e);
            }),
                (r.prototype.setClickPixelCb = function (e) {
                    e && "function" == typeof e && (t = e);
                }),
                (r.prototype.clickPixelCb = function (e) {
                    try {
                        t && "function" == typeof t && t(e.click_id);
                    } catch (t) {
                    }
                    N(e.click_id, d("utm_campaign") || "affise_", {});
                }),
                (r.prototype.hasSessionId = function () {
                    var t = O();
                    return t && "string" == typeof t && 24 === t.length;
                }),
                (r.prototype.getTrackingToken = function () {
                    return O() || "";
                }),
                (r.prototype.getVersion = function () {
                    return "4.9";
                }),
                (r.prototype.setIsNewUser = function (t) {
                    D(c, !0 === t ? "true" : "false");
                }),
                (r.prototype.getShopifyCheckoutData = function (t, e) {
                    if ("gokwik" == e) {
                        return {
                            afprice: t.customData.total_price || t.total || t.data.checkout.totalPrice.amount,
                            afid: t.customData.order_name || t.order.id || t.data.checkout.order.id,
                            custom_field1: t.customData.total_price || t.total || t.data.checkout.totalPrice.amount,
                            custom_field2: t.currency,
                            custom_field3: t.date,
                            custom_field6: t.customData.order_name || t.order.id || t.data.checkout.order.id,
                        }
                    }

                    if ("direct" == e) {
                        return {
                            afprice: t.total,
                            afid: t.order.id,
                            custom_field1: t.total,
                            custom_field2: t.currency,
                            custom_field3: t.date,
                            custom_field6: t.order.id,
                        }
                    }

                    return this.getShopifyCheckoutEventData(t);
                }),
                (r.prototype.getShopifyCheckoutEventData = function (t) {
                    var e = t.data.checkout,
                        n = [],
                        a = e.discountApplications;

                    return (
                        a &&
                        a.constructor === Array &&
                        a.length > 0 &&
                        a.forEach(function (t) {
                            !t || ("discount_code" !== t.type && "DISCOUNT_CODE" != t.type && "CODE" != t.type && "code" != t.type) || n.push(t.title);
                        }),
                            {
                                afprice: e.totalPrice.amount,
                                afid: e.order.id,
                                custom_field1: e.totalPrice.amount,
                                custom_field2: e.totalPrice.currencyCode,
                                custom_field3: t.timestamp,
                                custom_field6: e.order.id,
                            }
                    );
                }),
                (r.prototype.isNewUser = function (t) {
                    return "true" == h(c);
                }),
                (r.prototype.trackClick = function (t, r) {
                    !(function (t) {
                        var r = e.createElement("script"),
                            o = d("campaign_id"),
                            n = d("pub_id"),
                            a = d("fbclid"),
                            i = d("gclid");
                        if (o && n) {
                            var c = "https://" + t + "/click_pixel?campaign_id=" + o + "&pub_id=" + n;
                            a && (c += "&fbclid=" + a),
                            i && (c += "&gclid=" + i),
                                ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9", "p10", "p11", "p12", "p13", "p14", "p15", "source"].forEach(function (t) {
                                    var e = d(t);
                                    e && "string" == typeof e && (c += "&" + t + "=" + encodeURIComponent(e));
                                }),
                                (c += "&callback=window.AffiseWebSDK.clickPixelCb"),
                                r.setAttribute("src", c),
                                r.setAttribute("type", "text/javascript"),
                                r.setAttribute("async", !0),
                                e.body.appendChild(r);
                        } else x("");
                    })(t);
                }),
                (r.prototype.trackConv = function (t, r) {
                    I(t, r);
                }),
                (r.prototype.trackConvForBrand = function (t, e, r) {
                    return;
                }),
                (r.prototype.getUrlParam = function (t) {
                    return d(t);
                }),
                r
        );
    })();
    t.AffiseWebSDK = new J();
})(window, window.document);