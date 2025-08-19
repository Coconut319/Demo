/**
 * Animations and Scroll Effects
 * Handles scroll-triggered animations and interactive effects
 */

class AnimationManager {
    constructor() {
        this.animatedElements = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupEventListeners();
    }

    setupScrollAnimations() {
        // Find all elements with data-aos attributes
        this.animatedElements = document.querySelectorAll('[data-aos]');
        
        // Add initial classes
        this.animatedElements.forEach(element => {
            element.classList.add('aos-init');
        });
    }

    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers
            this.animateAll();
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupEventListeners() {
        // Handle scroll events for parallax effects
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Handle resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    animateElement(element) {
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        setTimeout(() => {
            element.classList.add('aos-animate');
            element.classList.add(`aos-${animation}`);
        }, parseInt(delay));
    }

    animateAll() {
        this.animatedElements.forEach((element, index) => {
            setTimeout(() => {
                this.animateElement(element);
            }, index * 100);
        });
    }

    handleScroll() {
        // Parallax effects
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Header scroll effect
        const header = document.getElementById('header');
        if (header) {
            if (scrolled > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    handleResize() {
        // Recalculate positions and sizes if needed
        this.animatedElements.forEach(element => {
            if (element.classList.contains('aos-animate')) {
                // Force reflow for elements that might need repositioning
                element.style.transform = 'translateZ(0)';
            }
        });
    }

    // Utility functions
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

    // Public methods
    refresh() {
        this.animatedElements = document.querySelectorAll('[data-aos]');
        this.setupIntersectionObserver();
    }

    destroy() {
        // Cleanup if needed
        this.animatedElements = [];
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
