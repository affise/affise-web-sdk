import { globalInstance } from './src/vanilla_sdk';

// Export the SDK as default
export default globalInstance;

// Also add it to the window object for direct browser usage
if (typeof window !== 'undefined') {
    window.ASDK = globalInstance;
}