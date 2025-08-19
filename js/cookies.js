/**
 * GDPR-Compliant Cookie Consent Management
 * Blocks all non-essential scripts until explicit consent is given
 */

class CookieManager {
    constructor() {
        this.banner = document.getElementById('cookie-banner');
        this.acceptBtn = document.getElementById('accept-cookies');
        this.declineBtn = document.getElementById('decline-cookies');
        
        this.cookieName = 'cookie-consent';
        this.cookieExpiry = 365; // days
        this.consentStatus = this.getConsentStatus();
        
        // Script categories
        this.scriptCategories = {
            essential: ['js/main.js', 'js/cookies.js'],
            analytics: ['js/analytics.js', 'js/3d-scene.js', 'js/testimonials.js'],
            marketing: ['js/tracking.js'],
            external: ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js']
        };
        
        // Block all non-essential scripts initially
        this.blockNonEssentialScripts();
        
        console.log('CookieManager initialized with GDPR compliance');
        this.init();
    }

    init() {
        if (!this.banner) {
            console.warn('Cookie banner not found');
            return;
        }
        
        this.setupEventListeners();
        this.checkConsent();
    }

    setupEventListeners() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => {
                console.log('Accept cookies clicked');
                this.acceptCookies();
            });
        }

        if (this.declineBtn) {
            this.declineBtn.addEventListener('click', () => {
                console.log('Decline cookies clicked');
                this.declineCookies();
            });
        }

        // Close banner when clicking outside
        document.addEventListener('click', (e) => {
            if (this.banner && !this.banner.contains(e.target) && this.banner.classList.contains('show')) {
                this.hideBanner();
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.banner && this.banner.classList.contains('show')) {
                this.hideBanner();
            }
        });
    }

    checkConsent() {
        console.log('Checking consent status:', this.consentStatus);
        
        if (this.consentStatus === 'accepted') {
            console.log('Cookies accepted, loading all scripts');
            this.hideBanner();
            this.loadAllScripts();
            return;
        } else if (this.consentStatus === 'declined') {
            console.log('Cookies declined, loading essential only');
            this.hideBanner();
            this.loadEssentialScripts();
            return;
        }
        
        // No consent given yet - check if banner was already shown in this session
        const bannerShown = sessionStorage.getItem('cookie-banner-shown');
        if (bannerShown === 'true') {
            console.log('Banner already shown in this session, hiding');
            this.hideBanner();
            this.loadEssentialScripts(); // Load only essential scripts
            return;
        }
        
        // No consent given and banner not shown yet, show banner
        console.log('No consent given, showing banner');
        this.showBanner();
        sessionStorage.setItem('cookie-banner-shown', 'true');
        
        // Load only essential scripts until consent is given
        this.loadEssentialScripts();
    }

    showBanner() {
        if (this.banner) {
            console.log('Showing cookie banner');
            this.banner.classList.add('show');
            
            setTimeout(() => {
                if (this.acceptBtn) {
                    this.acceptBtn.focus();
                }
            }, 100);
        }
    }

    hideBanner() {
        if (this.banner) {
            console.log('Hiding cookie banner');
            this.banner.classList.remove('show');
        }
    }

    acceptCookies() {
        console.log('Accepting cookies');
        this.setConsentStatus('accepted');
        this.hideBanner();
        this.loadAllScripts();
        this.showSuccessMessage('Cookies akzeptiert');
        sessionStorage.setItem('cookie-banner-shown', 'true');
    }

    declineCookies() {
        console.log('Declining cookies');
        this.setConsentStatus('declined');
        this.hideBanner();
        this.loadEssentialScripts();
        this.showSuccessMessage('Cookies abgelehnt');
        sessionStorage.setItem('cookie-banner-shown', 'true');
    }

    setConsentStatus(status) {
        console.log('Setting consent status:', status);
        this.consentStatus = status;
        
        const cookieValue = JSON.stringify({
            status: status,
            timestamp: new Date().toISOString(),
            version: '2.0'
        });
        
        this.setCookie(this.cookieName, cookieValue, this.cookieExpiry);
        
        const event = new CustomEvent('cookieConsentChanged', {
            detail: { status: status }
        });
        document.dispatchEvent(event);
    }

    getConsentStatus() {
        const cookieValue = this.getCookie(this.cookieName);
        
        if (!cookieValue) {
            return null;
        }
        
        try {
            const consentData = JSON.parse(cookieValue);
            return consentData.status;
        } catch (e) {
            console.warn('Invalid cookie consent data:', e);
            return null;
        }
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        
        let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        if (window.location.protocol === 'https:') {
            cookieString += '; Secure';
        }
        
        document.cookie = cookieString;
        console.log('Cookie set:', name, value);
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    // Block all non-essential scripts initially
    blockNonEssentialScripts() {
        // Remove all script tags except essential ones
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (!this.isEssentialScript(src)) {
                console.log('Blocking non-essential script:', src);
                script.setAttribute('data-blocked', 'true');
                script.style.display = 'none';
            }
        });
    }

    // Check if a script is essential
    isEssentialScript(src) {
        return this.scriptCategories.essential.some(essential => src.includes(essential));
    }

    // Load only essential scripts
    loadEssentialScripts() {
        console.log('Loading essential scripts only');
        
        // Load essential scripts
        this.scriptCategories.essential.forEach(scriptPath => {
            this.loadScript(scriptPath, 'essential');
        });
        
        // Enable basic functionality
        this.enableBasicFeatures();
    }

    // Load all scripts when consent is given
    loadAllScripts() {
        console.log('Loading all scripts with consent');
        
        // Load essential scripts
        this.loadEssentialScripts();
        
        // Load analytics scripts
        if (this.consentStatus === 'accepted') {
            this.scriptCategories.analytics.forEach(scriptPath => {
                this.loadScript(scriptPath, 'analytics');
            });
            
            this.scriptCategories.external.forEach(scriptPath => {
                this.loadScript(scriptPath, 'external');
            });
            
            // Enable enhanced features
            this.enableEnhancedFeatures();
        }
    }

    // Load a specific script
    loadScript(src, category) {
        console.log(`Loading ${category} script:`, src);
        
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log('Script already loaded:', src);
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.setAttribute('data-category', category);
        
        // Add integrity and crossorigin for external scripts
        if (src.includes('https://')) {
            if (src.includes('three.js')) {
                script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
                script.crossOrigin = '';
            }
        }
        
        document.head.appendChild(script);
        
        script.onload = () => {
            console.log(`Successfully loaded ${category} script:`, src);
        };
        
        script.onerror = () => {
            console.error(`Failed to load ${category} script:`, src);
        };
    }

    enableBasicFeatures() {
        // Enable basic website functionality
        console.log('Enabling basic features');
        
        // Initialize basic functionality
        if (typeof window.OrthodonticsWebsite !== 'undefined') {
            window.orthodonticsWebsite = new window.OrthodonticsWebsite();
        }
    }

    enableEnhancedFeatures() {
        // Enable enhanced features for accepted cookies
        console.log('Enabling enhanced features');
        
        // Initialize 3D scene if Three.js is loaded
        if (typeof THREE !== 'undefined' && typeof window.init3DScene === 'function') {
            window.init3DScene();
        }
        
        // Initialize map if Leaflet is loaded
        if (typeof L !== 'undefined' && typeof window.initMap === 'function') {
            window.initMap();
        }
        
        // Initialize other enhanced features
        if (typeof window.initEnhancedFeatures === 'function') {
            window.initEnhancedFeatures();
        }
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: inherit;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Public methods
    hasConsent() {
        return this.consentStatus === 'accepted';
    }

    updateConsent(newStatus) {
        if (newStatus === 'accepted' || newStatus === 'declined') {
            this.setConsentStatus(newStatus);
            
            if (newStatus === 'accepted') {
                this.loadAllScripts();
            } else {
                this.loadEssentialScripts();
            }
        }
    }

    resetConsent() {
        this.deleteCookie(this.cookieName);
        this.consentStatus = null;
        this.showBanner();
    }

    isCategoryAllowed(category) {
        if (this.consentStatus === 'accepted') {
            return true;
        }
        
        if (this.consentStatus === 'declined') {
            return category === 'essential';
        }
        
        return false;
    }

    getDetailedConsent() {
        return {
            analytics: this.consentStatus === 'accepted',
            marketing: this.consentStatus === 'accepted',
            essential: true,
            preferences: this.consentStatus === 'accepted'
        };
    }

    destroy() {
        if (this.acceptBtn) {
            this.acceptBtn.removeEventListener('click', this.acceptCookies);
        }
        if (this.declineBtn) {
            this.declineBtn.removeEventListener('click', this.declineCookies);
        }
        
        this.banner = null;
        this.acceptBtn = null;
        this.declineBtn = null;
    }
}

// Initialize cookie manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing GDPR-compliant CookieManager');
    window.cookieManager = new CookieManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
