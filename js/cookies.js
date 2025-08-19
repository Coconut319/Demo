/**
 * Cookie Consent Management
 * Handles GDPR-compliant cookie consent banner and cookie management
 */

class CookieManager {
    constructor() {
        this.banner = document.getElementById('cookie-banner');
        this.acceptBtn = document.getElementById('accept-cookies');
        this.declineBtn = document.getElementById('decline-cookies');
        
        this.cookieName = 'cookie-consent';
        this.cookieExpiry = 365; // days
        this.consentStatus = this.getConsentStatus();
        
        console.log('CookieManager initialized', {
            banner: this.banner,
            acceptBtn: this.acceptBtn,
            declineBtn: this.declineBtn,
            consentStatus: this.consentStatus
        });
        
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
        } else {
            console.warn('Accept cookies button not found');
        }

        if (this.declineBtn) {
            this.declineBtn.addEventListener('click', () => {
                console.log('Decline cookies clicked');
                this.declineCookies();
            });
        } else {
            console.warn('Decline cookies button not found');
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
        
        // If user has already made a choice (accepted or declined), respect that choice
        if (this.consentStatus === 'accepted') {
            console.log('Cookies accepted, loading analytics');
            this.hideBanner();
            this.loadAcceptedCookies();
            return;
        } else if (this.consentStatus === 'declined') {
            console.log('Cookies declined, loading essential only');
            this.hideBanner();
            this.loadEssentialCookies();
            return;
        }
        
        // No consent given yet - check if banner was already shown in this session
        const bannerShown = sessionStorage.getItem('cookie-banner-shown');
        if (bannerShown === 'true') {
            console.log('Banner already shown in this session, hiding');
            this.hideBanner();
            return;
        }
        
        // No consent given and banner not shown yet, show banner
        console.log('No consent given, showing banner');
        this.showBanner();
        // Mark banner as shown in this session
        sessionStorage.setItem('cookie-banner-shown', 'true');
    }

    showBanner() {
        if (this.banner) {
            console.log('Showing cookie banner');
            this.banner.classList.add('show');
            
            // Focus management
            setTimeout(() => {
                if (this.acceptBtn) {
                    this.acceptBtn.focus();
                }
            }, 100);
        } else {
            console.warn('Cookie banner element not found');
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
        this.loadAcceptedCookies();
        this.showSuccessMessage('Cookies akzeptiert');
        // Keep session storage to prevent banner from showing again in this session
        sessionStorage.setItem('cookie-banner-shown', 'true');
    }

    declineCookies() {
        console.log('Declining cookies');
        this.setConsentStatus('declined');
        this.hideBanner();
        this.loadEssentialCookies();
        this.showSuccessMessage('Cookies abgelehnt');
        // Keep session storage to prevent banner from showing again in this session
        sessionStorage.setItem('cookie-banner-shown', 'true');
    }

    setConsentStatus(status) {
        console.log('Setting consent status:', status);
        this.consentStatus = status;
        
        const cookieValue = JSON.stringify({
            status: status,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });
        
        this.setCookie(this.cookieName, cookieValue, this.cookieExpiry);
        
        // Dispatch custom event for other scripts
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
        
        // Add secure flag if on HTTPS
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

    loadAcceptedCookies() {
        // Load analytics and tracking cookies
        this.loadGoogleAnalytics();
        this.loadFacebookPixel();
        this.loadOtherTrackingScripts();
        
        // Enable enhanced functionality
        this.enableEnhancedFeatures();
    }

    loadEssentialCookies() {
        // Only load essential cookies (session, security, etc.)
        this.loadEssentialFeatures();
        
        // Disable tracking
        this.disableTracking();
    }

    loadGoogleAnalytics() {
        if (this.consentStatus === 'accepted') {
            // Google Analytics 4
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
            });
        }
    }

    loadFacebookPixel() {
        if (this.consentStatus === 'accepted') {
            // Facebook Pixel
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
        }
    }

    loadOtherTrackingScripts() {
        if (this.consentStatus === 'accepted') {
            // Add other tracking scripts here
            console.log('Loading other tracking scripts');
        }
    }

    loadEssentialFeatures() {
        // Load essential features regardless of consent
        this.loadSessionManagement();
        this.loadSecurityFeatures();
    }

    loadSessionManagement() {
        // Session management features
        console.log('Loading session management');
    }

    loadSecurityFeatures() {
        // Security features
        console.log('Loading security features');
    }

    enableEnhancedFeatures() {
        // Enable enhanced features for accepted cookies
        console.log('Enabling enhanced features');
    }

    disableTracking() {
        // Disable all tracking for declined cookies
        this.disableGoogleAnalytics();
        this.disableFacebookPixel();
        this.disableOtherTracking();
    }

    disableGoogleAnalytics() {
        // Disable Google Analytics
        console.log('Disabling Google Analytics');
    }

    disableFacebookPixel() {
        // Disable Facebook Pixel
        console.log('Disabling Facebook Pixel');
    }

    disableOtherTracking() {
        // Disable other tracking
        console.log('Disabling other tracking');
    }

    showSuccessMessage(message) {
        // Create a temporary success notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Public methods for external access
    hasConsent() {
        return this.consentStatus === 'accepted';
    }

    updateConsent(newStatus) {
        if (newStatus === 'accepted' || newStatus === 'declined') {
            this.setConsentStatus(newStatus);
            
            if (newStatus === 'accepted') {
                this.loadAcceptedCookies();
            } else {
                this.loadEssentialCookies();
            }
        }
    }

    resetConsent() {
        this.deleteCookie(this.cookieName);
        this.consentStatus = null;
        this.showBanner();
    }

    // Method to check if specific cookie category is allowed
    isCategoryAllowed(category) {
        if (this.consentStatus === 'accepted') {
            return true;
        }
        
        if (this.consentStatus === 'declined') {
            return category === 'essential';
        }
        
        return false;
    }

    // Method to get detailed consent information
    getDetailedConsent() {
        const consentData = this.getConsentData();
        
        if (!consentData) {
            return {
                analytics: false,
                marketing: false,
                essential: true,
                preferences: false
            };
        }
        
        return {
            analytics: this.consentStatus === 'accepted',
            marketing: this.consentStatus === 'accepted',
            essential: true, // Always allowed
            preferences: this.consentStatus === 'accepted'
        };
    }

    // Method to export consent data
    exportConsentData() {
        return {
            consentStatus: this.consentStatus,
            consentData: this.getConsentData(),
            detailedConsent: this.getDetailedConsent(),
            timestamp: new Date().toISOString()
        };
    }

    // Method to import consent data
    importConsentData(data) {
        if (data && data.consentStatus) {
            this.updateConsent(data.consentStatus);
        }
    }

    // Cleanup method
    destroy() {
        // Remove event listeners
        if (this.acceptBtn) {
            this.acceptBtn.removeEventListener('click', this.acceptCookies);
        }
        if (this.declineBtn) {
            this.declineBtn.removeEventListener('click', this.declineCookies);
        }
        
        // Clear references
        this.banner = null;
        this.acceptBtn = null;
        this.declineBtn = null;
    }
}

// Initialize cookie manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing CookieManager');
    window.cookieManager = new CookieManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
