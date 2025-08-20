/**
 * Main JavaScript for Dr. Schmidt & Kollegen Kieferorthopädie Website
 * Handles navigation, scroll effects, mobile menu, and general interactions
 */

class OrthodonticsWebsite {
    constructor() {
        console.log('OrthodonticsWebsite constructor called');
        this.header = document.getElementById('header');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.nav = document.querySelector('.nav');
        this.mobileNav = document.querySelector('.mobile-nav');
        
        console.log('Elements found:');
        console.log('- Header:', this.header);
        console.log('- Mobile menu toggle:', this.mobileMenuToggle);
        console.log('- Nav:', this.nav);
        console.log('- Mobile nav:', this.mobileNav);
        
        this.isMobileMenuOpen = false;
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupNavigation();
        this.setupSmoothScrolling();
        this.setupLazyLoading();
        this.setupFormValidation();
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Document events
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // Form events
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Link events
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
    }

    setupScrollEffects() {
        // Header scroll effect
        this.handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for header styling
            if (scrollTop > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (scrollTop > this.lastScrollTop && scrollTop > this.scrollThreshold) {
                // Scrolling down
                this.header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.header.style.transform = 'translateY(0)';
            }

            this.lastScrollTop = scrollTop;

            // Trigger scroll animations
            this.triggerScrollAnimations();
        };

        // Parallax effect for hero section
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            const heroBackground = hero.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupMobileMenu() {
        console.log('Setting up mobile menu...');
        if (!this.mobileMenuToggle) {
            console.error('Mobile menu toggle button not found!');
            return;
        }

        console.log('Adding click event listener to mobile menu toggle');
        this.mobileMenuToggle.addEventListener('click', (e) => {
            console.log('Mobile menu toggle clicked!');
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMobileMenuOpen && 
                !this.mobileNav.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            this.openMobileMenu();
        } else {
            this.closeMobileMenu();
        }
    }

    openMobileMenu() {
        if (this.mobileNav) {
            this.mobileNav.classList.add('show');
        }
        this.mobileMenuToggle.classList.add('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Animate hamburger to X
        const lines = this.mobileMenuToggle.querySelectorAll('.hamburger-line');
        if (lines.length >= 3) {
            lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            lines[1].style.opacity = '0';
            lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        if (this.mobileNav) {
            this.mobileNav.classList.remove('show');
        }
        this.mobileMenuToggle.classList.remove('active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Reset hamburger
        const lines = this.mobileMenuToggle.querySelectorAll('.hamburger-line');
        lines.forEach(line => {
            line.style.transform = 'none';
            line.style.opacity = '1';
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
        this.isMobileMenuOpen = false;
    }

    setupNavigation() {
        // Active navigation highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupSmoothScrolling() {
        this.handleSmoothScroll = (e) => {
            const href = e.currentTarget.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            }
        };
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Check if required field is empty
        if (required && !value) {
            this.showFieldError(field, 'Dieses Feld ist erforderlich.');
            return false;
        }
        
        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
                return false;
            }
        }
        
        // Phone validation
        if (type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'Bitte geben Sie eine gültige Telefonnummer ein.');
                return false;
            }
        }
        
        // Min length validation
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            this.showFieldError(field, `Mindestens ${minLength} Zeichen erforderlich.`);
            return false;
        }
        
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    setupAccessibility() {
        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }

        // Focus management for modals and dropdowns
        this.setupFocusManagement();
    }

    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isMobileMenuOpen) {
                const focusableContent = this.nav.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    triggerScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('aos-animate');
            }
        });
    }

    handleResize() {
        // Close mobile menu on resize if screen becomes larger
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleLoad() {
        // Remove loading state
        document.body.classList.remove('loading');
        
        // Initialize any components that need the page to be fully loaded
        this.initializeComponents();
    }

    handleDOMContentLoaded() {
        // Set initial states
        this.setupInitialStates();
    }

    handleDocumentClick(e) {
        // Handle dropdown clicks
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.parentElement.contains(e.target)) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            }
        });
    }

    handleKeydown(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Show success message (in real implementation, this would submit to server)
        this.showFormSuccess(form);
    }

    showFormSuccess(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Wird gesendet...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            form.reset();
            submitButton.textContent = 'Erfolgreich gesendet!';
            submitButton.classList.add('success');
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('success');
            }, 3000);
        }, 1500);
    }

    setupInitialStates() {
        // Set initial scroll position
        this.handleScroll();
        
        // Initialize animations
        this.triggerScrollAnimations();
    }

    initializeComponents() {
        // Initialize any additional components
        this.initializeCounters();
        this.initializeProgressBars();
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const fill = bar.querySelector('.progress-fill');
            
            if (fill) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            fill.style.width = `${progress}%`;
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(bar);
            }
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing website...');
    new OrthodonticsWebsite();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrthodonticsWebsite;
}
