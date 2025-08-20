/**
 * Contact Page Functionality
 * Handles contact form validation, map integration, and form submission
 */
class ContactPage {
    constructor() {
        this.form = null;
        this.map = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupMap();
        this.setupAccessibility();
    }

    setupElements() {
        this.form = document.getElementById('contact-form');
        this.mapContainer = document.getElementById('map');
    }

    setupEventListeners() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
            this.form.addEventListener('input', this.handleFormInput.bind(this));
            this.form.addEventListener('blur', this.handleFormBlur.bind(this), true);
        }

        // Reset form
        const resetBtn = this.form?.querySelector('button[type="reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', this.handleFormReset.bind(this));
        }
    }

    setupAccessibility() {
        // Add ARIA labels and descriptions
        const formGroups = this.form?.querySelectorAll('.form-group');
        formGroups?.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            const errorDiv = group.querySelector('.error-message');

            if (input && label) {
                input.setAttribute('aria-labelledby', label.id || label.htmlFor);
                if (errorDiv) {
                    input.setAttribute('aria-describedby', errorDiv.id);
                }
            }
        });

        // Live region for form announcements
        this.setupLiveRegion();
    }

    setupLiveRegion() {
        // Create live region for screen reader announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    setupMap() {
        if (!this.mapContainer || typeof L === 'undefined') {
            return;
        }

        try {
            // Initialize map with practice location
            this.map = L.map('map').setView([48.1351, 11.5820], 15);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18
            }).addTo(this.map);

            // Add practice marker
            const practiceMarker = L.marker([48.1351, 11.5820]).addTo(this.map);
            practiceMarker.bindPopup(`
                <div class="map-popup">
                    <h3>Dr. Schmidt & Kollegen</h3>
                    <p>Maximilianstraße 123<br>80539 München</p>
                    <p><strong>Telefon:</strong> 089 123 456 78</p>
                </div>
            `);

            // Add custom marker icon
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="
                        background: var(--primary-color);
                        color: white;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        border: 3px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            practiceMarker.setIcon(customIcon);

            // Handle map resize
            window.addEventListener('resize', this.handleMapResize.bind(this));

        } catch (error) {
            console.error('Error initializing map:', error);
            this.showMapError();
        }
    }

    handleMapResize() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }

    showMapError() {
        if (this.mapContainer) {
            this.mapContainer.innerHTML = `
                <div class="map-error">
                    <p>Karte konnte nicht geladen werden.</p>
                    <a href="https://maps.google.com/?q=Maximilianstraße+123,+80539+München" target="_blank" rel="noopener" class="btn btn-secondary">
                        In Google Maps öffnen
                    </a>
                </div>
            `;
        }
    }

    handleFormInput(event) {
        const field = event.target;
        this.clearFieldError(field);
    }

    handleFormBlur(event) {
        const field = event.target;
        if (field.matches('input, select, textarea')) {
            this.validateField(field);
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.validateForm()) {
            this.submitForm();
        } else {
            this.announceFormErrors();
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Dieses Feld ist erforderlich.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{6,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein.';
            }
        }

        // Message length validation
        if (field.tagName === 'TEXTAREA' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Die Nachricht sollte mindestens 10 Zeichen lang sein.';
            }
        }

        // Show error if validation failed
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorDiv = document.getElementById(`${field.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = document.getElementById(`${field.id}-error`);
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }

    submitForm() {
        const submitBtn = this.form.querySelector('#submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');

        // Show loading state
        this.showLoadingState(submitBtn, btnText, spinner);

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            this.hideLoadingState(submitBtn, btnText, spinner);
            this.showFormSuccess();
            this.form.reset();
        }, 2000);
    }

    showLoadingState(submitBtn, btnText, spinner) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        spinner.style.display = 'inline-block';
        submitBtn.setAttribute('aria-busy', 'true');
    }

    hideLoadingState(submitBtn, btnText, spinner) {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
        submitBtn.removeAttribute('aria-busy');
    }

    showFormSuccess() {
        this.showNotification('Nachricht erfolgreich gesendet!', 'success');
        this.announceToScreenReader('Formular erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.');
    }

    showFormError(message) {
        this.showNotification(message, 'error');
        this.announceToScreenReader(`Fehler beim Senden des Formulars: ${message}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                ${this.getNotificationIcon(type)}
                <div>
                    <h4>${this.getNotificationTitle(type)}</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        return icons[type] || icons.info;
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'Erfolgreich gesendet',
            error: 'Fehler aufgetreten',
            info: 'Information'
        };
        return titles[type] || titles.info;
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }

    handleFormReset() {
        // Clear all errors
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            this.clearFieldError(field);
        });

        this.announceToScreenReader('Formular wurde zurückgesetzt');
    }

    announceFormErrors() {
        const errorCount = this.form.querySelectorAll('.error').length;
        this.announceToScreenReader(`${errorCount} Fehler im Formular gefunden. Bitte überprüfen Sie die Eingaben.`);
    }

    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    // Public methods for external use
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    setFormData(data) {
        Object.keys(data).forEach(key => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    }

    validateSpecificField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            return this.validateField(field);
        }
        return false;
    }

    destroy() {
        if (this.map) {
            this.map.remove();
        }
        if (this.liveRegion) {
            this.liveRegion.remove();
        }
    }
}

// Initialize contact page functionality
document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactPage;
}

