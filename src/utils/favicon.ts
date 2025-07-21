// Import favicon assets
import hypredgeFavicon from "../login/assets/favicon-hypredge.svg";
import trellixFavicon from "../login/assets/favicon-trellix.svg";

/**
 * Utility function to dynamically change the favicon based on product ID
 */
export function setFavicon(productId: string): void {
    // Get the appropriate favicon URL based on product ID
    const faviconUrl = productId.toLowerCase() === "trellix" ? trellixFavicon : hypredgeFavicon;
    
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = faviconUrl;
    
    // Add error handling for favicon loading
    link.onerror = () => {
        console.warn(`Failed to load favicon: ${faviconUrl}`);
        // Fallback to default favicon if available
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'icon';
        fallbackLink.type = 'image/png';
        fallbackLink.href = '/favicon-32x32.png';
        document.head.appendChild(fallbackLink);
    };
    
    // Add to head
    document.head.appendChild(link);
}

/**
 * Get product ID from environment or default to 'hypredge'
 */
export function getProductId(): string {
    // Check if we're in a Keycloak context
    if (window.kcContext?.properties?.ZS_PRODUCT_ID) {
        return window.kcContext.properties.ZS_PRODUCT_ID;
    }
    
    // Fallback to default
    return 'hypredge';
} 