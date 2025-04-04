/**
 * Custom error class for the AffiseSDK
 */
export class AffiseSDKError extends Error {
    constructor(code, message, details = {}) {
        super(message);
        this.name = 'AffiseSDKError';
        this.code = code;
        this.details = details;
    }
}

/**
 * Error codes used by the SDK
 */
export const ErrorCodes = {
    MISSING_REQUIRED_PARAMS: 'MISSING_REQUIRED_PARAMS',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    CONFIG_ERROR: 'CONFIG_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};