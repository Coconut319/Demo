/**
 * Practice Tour Slider
 * Handles the interactive image slider for the practice tour
 */
class PracticeSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAccessibility();
        this.startAutoPlay();
    }
    
    setupElements() {
        this.slider = document.getElementById('tour-slider');
        this.track = this.slider?.querySelector('.slider-track');
        this.slides = this.slider?.querySelectorAll('.slide');
        this.dots = this.slider?.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        
        if (!this.slider || !this.track || !this.slides || !this.dots) {
            console.warn('Practice slider elements not found');
            return;
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.slider && this.slider.contains(document.activeElement)) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            }
        });
        
        // Touch/swipe support
        this.setupTouchSupport();
        
        // Pause autoplay on hover
        this.slider?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.slider?.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Pause autoplay when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }
    
    setupTouchSupport() {
        let startX = 0;
        let endX = 0;
        let isDragging = false;
        
        this.slider?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.pauseAutoPlay();
        });
        
        this.slider?.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.slider?.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            endX = e.changedTouches[0].clientX;
            isDragging = false;
            
            const diffX = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.startAutoPlay();
        });
    }
    
    setupAccessibility() {
        // Set ARIA attributes
        this.slider?.setAttribute('role', 'region');
        this.slider?.setAttribute('aria-label', 'Praxis-Rundgang');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            slide.setAttribute('role', 'tabpanel');
        });
        
        this.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('aria-controls', `slide-${index + 1}`);
        });
        
        // Live region for screen readers
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        this.slider?.appendChild(this.liveRegion);
    }
    
    updateSlider() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        // Update slides
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            if (slideNumber === this.currentSlide) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Update dots
        this.dots.forEach((dot, index) => {
            const dotNumber = index + 1;
            if (dotNumber === this.currentSlide) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
        
        // Update navigation buttons
        this.prevBtn?.setAttribute('aria-disabled', this.currentSlide === 1 ? 'true' : 'false');
        this.nextBtn?.setAttribute('aria-disabled', this.currentSlide === this.totalSlides ? 'true' : 'false');
        
        // Announce to screen readers
        this.announceSlideChange();
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
    
    announceSlideChange() {
        const slideTitles = [
            'Rezeption',
            'Wartezimmer', 
            'Behandlungsraum',
            '3D-Diagnostik',
            'Beratungsraum'
        ];
        
        const currentTitle = slideTitles[this.currentSlide - 1];
        this.liveRegion.textContent = `Aktuelles Bild: ${currentTitle}`;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
        } else {
            this.currentSlide = 1;
        }
        this.updateSlider();
    }
    
    prevSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
        } else {
            this.currentSlide = this.totalSlides;
        }
        this.updateSlider();
    }
    
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlider();
        }
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        if (this.autoPlayInterval) {
            this.startAutoPlay();
        }
    }
    
    // Public methods for external control
    play() {
        this.startAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.totalSlides;
    }
    
    isAutoPlaying() {
        return this.autoPlayInterval !== null;
    }
    
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        this.prevBtn?.removeEventListener('click', () => this.prevSlide());
        this.nextBtn?.removeEventListener('click', () => this.nextSlide());
        
        this.dots.forEach((dot, index) => {
            dot.removeEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Remove live region
        this.liveRegion?.remove();
    }
}

// Initialize the practice slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.practiceSlider = new PracticeSlider();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PracticeSlider;
}

