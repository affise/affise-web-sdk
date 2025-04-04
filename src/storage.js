/**
 * Storage manager for handling persistence across different storage mechanisms
 */
export class AffiseStorage {
    constructor() {
        this.storageAvailability = {
            cookie: this._isCookieAvailable(),
            localStorage: this._isLocalStorageAvailable(),
            sessionStorage: this._isSessionStorageAvailable()
        };

        // Use console.log instead of console.debug for broader browser support
        console.log('AffiseStorage availability:', this.storageAvailability);
    }

    // Check if cookies are available
    _isCookieAvailable() {
        try {
            document.cookie = "testcookie=1; max-age=10";
            const result = document.cookie.indexOf("testcookie=") !== -1;
            document.cookie = "testcookie=1; max-age=0"; // Clean up
            return result;
        } catch (e) {
            return false;
        }
    }

    // Check if localStorage is available
    _isLocalStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    // Check if sessionStorage is available
    _isSessionStorageAvailable() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }

    // Store value with fallbacks
    store(key, value, expirationDays = 30) {
        const expirationMs = expirationDays * 24 * 60 * 60 * 1000;
        const expirationDate = new Date(Date.now() + expirationMs);
        const storageItem = {
            value: value,
            expires: expirationDate.getTime()
        };

        // Try all available storage methods
        const stored = [];

        // 1. Try cookies first (for better cross-site compatibility)
        if (this.storageAvailability.cookie) {
            try {
                const d = new Date();
                d.setTime(d.getTime() + expirationMs);

                if (value.length > 1650) {
                    value = value.substring(0, 33) + value.substring(value.length - 1616, value.length);
                }

                document.cookie = `${key}=${value};expires=${d.toUTCString()};path=/`;
                stored.push('cookie');
            } catch (e) {
                console.warn('Failed to store in cookie:', e);
            }
        }

        // 2. Try localStorage (for persistence)
        if (this.storageAvailability.localStorage) {
            try {
                localStorage.setItem(key, JSON.stringify(storageItem));
                stored.push('localStorage');
            } catch (e) {
                console.warn('Failed to store in localStorage:', e);
            }
        }

        // 3. Try sessionStorage (as last resort)
        if (this.storageAvailability.sessionStorage) {
            try {
                sessionStorage.setItem(key, JSON.stringify(storageItem));
                stored.push('sessionStorage');
            } catch (e) {
                console.warn('Failed to store in sessionStorage:', e);
            }
        }

        if (stored.length === 0) {
            console.error('All storage methods failed');
            return false;
        }

        return true;
    }

    // Retrieve value from any available storage
    retrieve(key) {
        // 1. Try cookies first
        if (this.storageAvailability.cookie) {
            const cookies = document.cookie
                .split(';')
                .map(v => v.split('='))
                .reduce((acc, v) => {
                    try {
                        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
                    } catch (e) {
                        // Skip this cookie if it can't be decoded
                    }
                    return acc;
                }, {});

            if (cookies[key]) {
                return cookies[key].trim();
            }
        }

        // 2. Try localStorage
        if (this.storageAvailability.localStorage) {
            try {
                const item = JSON.parse(localStorage.getItem(key));
                if (item && item.expires > Date.now()) {
                    return item.value;
                } else if (item) {
                    // Clean up expired items
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Continue to next storage option
            }
        }

        // 3. Try sessionStorage
        if (this.storageAvailability.sessionStorage) {
            try {
                const item = JSON.parse(sessionStorage.getItem(key));
                if (item && item.expires > Date.now()) {
                    return item.value;
                } else if (item) {
                    // Clean up expired items
                    sessionStorage.removeItem(key);
                }
            } catch (e) {
                // Continue with empty result
            }
        }

        return '';
    }

    // Remove item from all storages
    remove(key) {
        if (this.storageAvailability.cookie) {
            document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }

        if (this.storageAvailability.localStorage) {
            localStorage.removeItem(key);
        }

        if (this.storageAvailability.sessionStorage) {
            sessionStorage.removeItem(key);
        }
    }
}