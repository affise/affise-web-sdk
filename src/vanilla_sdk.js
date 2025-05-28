import ASDK from './sdk.js';
import { AffiseStorage } from './storage.js';

class SDK extends ASDK {
    constructor() {
        super();
        this.storage = new AffiseStorage();
    }

    _fetch(key) {
        return this.storage.retrieve(key);
    }

    _persist(key, value, expirationDays = 30) {
        return this.storage.store(key, value, expirationDays);
    }
}

// Create a global instance
const globalInstance = new SDK();

// Export the instance (not as default to avoid multiple default export conflicts)
export { globalInstance };