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
        
        this.init();
    }

    init() {
        if (!this.banner) return;
        
        this.setupEventListeners();
        this.checkConsent();
    }

    setupEventListeners() {
        if (this.acceptBtn) {
            this.acceptBtn.addEventListener('click', () => {
                this.acceptCookies();
            });
        }

        if (this.declineBtn) {
            this.declineBtn.addEventListener('click', () => {
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
        if (this.consentStatus === null) {
            // No consent given yet, show banner
            this.showBanner();
        } else if (this.consentStatus === 'accepted') {
            // Cookies accepted, load analytics and other tracking
            this.loadAcceptedCookies();
        } else if (this.consentStatus === 'declined') {
            // Cookies declined, only load essential cookies
            this.loadEssentialCookies();
        }
    }

    showBanner() {
        if (this.banner) {
            this.banner.classList.add('show');
            
            // Focus management
            setTimeout(() => {
                if (this.acceptBtn) {
                    this.acceptBtn.focus();
                }
            }, 100);
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    }

    acceptCookies() {
        this.setConsentStatus('accepted');
        this.hideBanner();
        this.loadAcceptedCookies();
        this.showSuccessMessage('Cookies akzeptiert');
    }

    declineCookies() {
        this.setConsentStatus('declined');
        this.hideBanner();
        this.loadEssentialCookies();
        this.showSuccessMessage('Cookies abgelehnt');
    }

    setConsentStatus(status) {
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
        
        const cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
        
        // Add secure flag if on HTTPS
        if (window.location.protocol === 'https:') {
            cookieString += '; Secure';
        }
        
        document.cookie = cookieString;
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
            
            // Set consent mode
            gtag('consent', 'default', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
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
            // Load other tracking scripts here
            // Example: Hotjar, Crazy Egg, etc.
        }
    }

    loadEssentialFeatures() {
        // Load essential functionality that doesn't require tracking
        this.loadSessionManagement();
        this.loadSecurityFeatures();
    }

    loadSessionManagement() {
        // Session management cookies
        if (!this.getCookie('session-id')) {
            const sessionId = this.generateSessionId();
            this.setCookie('session-id', sessionId, 1); // 1 day
        }
    }

    loadSecurityFeatures() {
        // CSRF protection, etc.
        if (!this.getCookie('csrf-token')) {
            const csrfToken = this.generateCSRFToken();
            this.setCookie('csrf-token', csrfToken, 1);
        }
    }

    enableEnhancedFeatures() {
        // Enable features that require consent
        this.enablePersonalization();
        this.enableAnalytics();
        this.enableMarketing();
    }

    disableTracking() {
        // Disable all tracking scripts
        this.disableGoogleAnalytics();
        this.disableFacebookPixel();
        this.disableOtherTracking();
    }

    disableGoogleAnalytics() {
        // Disable Google Analytics
        if (window.gtag) {
            gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
    }

    disableFacebookPixel() {
        // Disable Facebook Pixel
        if (window.fbq) {
            fbq('consent', 'revoke');
        }
    }

    disableOtherTracking() {
        // Disable other tracking scripts
    }

    enablePersonalization() {
        // Enable personalized content
        document.body.classList.add('personalization-enabled');
    }

    enableAnalytics() {
        // Enable analytics features
        document.body.classList.add('analytics-enabled');
    }

    enableMarketing() {
        // Enable marketing features
        document.body.classList.add('marketing-enabled');
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9);
    }

    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'cookie-notification success';
        notification.setAttribute('role', 'alert');
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">✓</span>
                <span class="notification-text">${message}</span>
                <button class="notification-close" aria-label="Benachrichtigung schließen">×</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 16px;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-toast);
            transform: translateX(100%);
            transition: transform var(--transition-base);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Public methods for external use
    hasConsent() {
        return this.consentStatus === 'accepted';
    }

    hasDeclined() {
        return this.consentStatus === 'declined';
    }

    getConsentData() {
        const cookieValue = this.getCookie(this.cookieName);
        if (cookieValue) {
            try {
                return JSON.parse(cookieValue);
            } catch (e) {
                return null;
            }
        }
        return null;
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
    window.cookieManager = new CookieManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
