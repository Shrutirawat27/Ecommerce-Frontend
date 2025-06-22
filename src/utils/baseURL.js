export const getBaseUrl = () => {
    // Check if environment variable is available (Render will set this)
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL;
    }
    
    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
        // For local development, use explicitly port 3000
        return "http://localhost:3000";
    } else {
        // For production environments like Render
        // This will be overridden by VITE_BACKEND_URL in production
        return window.location.origin;
    }
}