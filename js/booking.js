/**
 * Booking System
 * Handles the appointment booking functionality and contact form
 */
class BookingSystem {
    constructor() {
        this.modal = null;
        this.form = null;
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAccessibility();
    }
    
    setupElements() {
        this.modal = document.getElementById('contact-modal');
        this.form = document.getElementById('contact-form');
    }
    
    setupEventListeners() {
        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeContactForm();
            }
        });
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
                this.closeContactForm();
            }
        });
        
        // Form field validation
        this.setupFormValidation();
    }
    
    setupAccessibility() {
        // Set up ARIA attributes for modal
        if (this.modal) {
            this.modal.setAttribute('aria-hidden', 'true');
            this.modal.setAttribute('role', 'dialog');
            this.modal.setAttribute('aria-labelledby', 'modal-title');
        }
        
        // Set up focus trap
        this.setupFocusTrap();
    }
    
    setupFocusTrap() {
        if (!this.modal) return;
        
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    setupFormValidation() {
        if (!this.form) return;
        
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
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
        
        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Bitte wählen Sie ein zukünftiges Datum.';
            }
        }
        
        // Name validation
        if ((fieldName === 'first-name' || fieldName === 'last-name') && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Der Name muss mindestens 2 Zeichen lang sein.';
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Die Nachricht muss mindestens 10 Zeichen lang sein.';
            }
        }
        
        // Privacy checkbox validation
        if (fieldName === 'privacy') {
            if (!field.checked) {
                isValid = false;
                errorMessage = 'Sie müssen der Datenschutzerklärung zustimmen.';
            }
        }
        
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    validateForm() {
        if (!this.form) return false;
        
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormError('Bitte überprüfen Sie Ihre Eingaben.');
            return;
        }
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate form submission (in real implementation, this would send to server)
        setTimeout(() => {
            this.hideLoadingState();
            this.showFormSuccess();
            this.resetForm();
            this.closeContactForm();
        }, 2000);
    }
    
    showLoadingState() {
        const submitButton = this.form?.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Wird gesendet...
            `;
        }
    }
    
    hideLoadingState() {
        const submitButton = this.form?.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Anfrage senden';
        }
    }
    
    showFormSuccess() {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'form-notification success';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <h4>Anfrage erfolgreich gesendet!</h4>
                    <p>Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    showFormError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'form-notification error';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div>
                    <h4>Fehler beim Senden</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    resetForm() {
        if (!this.form) return;
        
        this.form.reset();
        
        // Clear all error states
        const fields = this.form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            this.clearFieldError(field);
        });
    }
    
    openContactForm() {
        if (!this.modal) return;
        
        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Focus first input
        const firstInput = this.modal.querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Announce to screen readers
        this.announceModalOpen();
    }
    
    closeContactForm() {
        if (!this.modal) return;
        
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset form
        this.resetForm();
        
        // Announce to screen readers
        this.announceModalClose();
    }
    
    announceModalOpen() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Kontaktformular geöffnet';
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }
    
    announceModalClose() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = 'Kontaktformular geschlossen';
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }
    
    // Public methods for external control
    getFormData() {
        if (!this.form) return null;
        
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    setFormData(data) {
        if (!this.form) return;
        
        Object.entries(data).forEach(([key, value]) => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = value;
            }
        });
    }
    
    destroy() {
        // Remove event listeners
        if (this.form) {
            this.form.removeEventListener('submit', this.handleFormSubmit);
        }
        
        // Close modal if open
        this.closeContactForm();
    }
}

// Global functions for onclick handlers
function openContactForm() {
    if (window.bookingSystem) {
        window.bookingSystem.openContactForm();
    }
}

function closeContactForm() {
    if (window.bookingSystem) {
        window.bookingSystem.closeContactForm();
    }
}

function openDoctolib() {
    // In a real implementation, this would open the Doctolib booking page
    const doctolibUrl = 'https://www.doctolib.de/kieferorthopaedie/muenchen/dr-schmidt-kollegen';
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'form-notification info';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <div>
                <h4>Weiterleitung zu Doctolib</h4>
                <p>Sie werden zur Doctolib-Terminbuchung weitergeleitet...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.open(doctolibUrl, '_blank');
        notification.remove();
    }, 2000);
}

function openCalendly() {
    // In a real implementation, this would open the Calendly booking page
    const calendlyUrl = 'https://calendly.com/dr-schmidt-kollegen';
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'form-notification info';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
            </svg>
            <div>
                <h4>Weiterleitung zu Calendly</h4>
                <p>Sie werden zur Calendly-Terminbuchung weitergeleitet...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.open(calendlyUrl, '_blank');
        notification.remove();
    }, 2000);
}

// Initialize the booking system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookingSystem = new BookingSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingSystem;
}

