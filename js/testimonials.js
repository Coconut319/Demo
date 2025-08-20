/**
 * Testimonials Slider
 * Handles the testimonials carousel/slider functionality
 */

class TestimonialsSlider {
    constructor() {
        this.slider = document.getElementById('testimonials-slider');
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.testimonial-nav-btn.prev');
        this.nextBtn = document.querySelector('.testimonial-nav-btn.next');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        if (!this.slider || this.slideCount === 0) return;
        
        this.setupEventListeners();
        this.setupAccessibility();
        this.startAutoPlay();
        this.updateSlider();
    }

    setupEventListeners() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
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
        this.slider.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });

        this.slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

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

        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        });

        this.slider.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diffX = startX - endX;
            const threshold = 50; // Minimum swipe distance

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
            }

            isDragging = false;
        });
    }

    setupAccessibility() {
        // Set initial ARIA attributes
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Testimonial ${index + 1} von ${this.slideCount}`);
        });

        this.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('aria-label', `Gehe zu Testimonial ${index + 1}`);
        });

        if (this.prevBtn) {
            this.prevBtn.setAttribute('aria-label', 'Vorheriger Testimonial');
        }

        if (this.nextBtn) {
            this.nextBtn.setAttribute('aria-label', 'Nächster Testimonial');
        }

        // Add live region for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        this.slider.appendChild(liveRegion);
        this.liveRegion = liveRegion;
    }

    updateSlider() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Update slides
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add('active');
                slide.setAttribute('aria-hidden', 'false');
            } else {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            }
        });

        // Update navigation buttons
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 0;
            this.prevBtn.setAttribute('aria-disabled', this.currentSlide === 0);
        }

        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.slideCount - 1;
            this.nextBtn.setAttribute('aria-disabled', this.currentSlide === this.slideCount - 1);
        }

        // Update live region for screen readers
        if (this.liveRegion) {
            const currentSlide = this.slides[this.currentSlide];
            const testimonialText = currentSlide.querySelector('.testimonial-text');
            const authorName = currentSlide.querySelector('.author-name');
            
            if (testimonialText && authorName) {
                this.liveRegion.textContent = `Testimonial ${this.currentSlide + 1}: ${testimonialText.textContent} von ${authorName.textContent}`;
            }
        }

        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.slideCount;
        this.updateSlider();
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = this.currentSlide === 0 ? this.slideCount - 1 : this.currentSlide - 1;
        this.updateSlider();
    }

    goToSlide(index) {
        if (this.isAnimating || index < 0 || index >= this.slideCount || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateSlider();
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
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

    // Public methods for external control
    play() {
        this.startAutoPlay();
    }

    pause() {
        this.pauseAutoPlay();
    }

    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        if (this.autoPlayInterval) {
            this.pauseAutoPlay();
            this.startAutoPlay();
        }
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getSlideCount() {
        return this.slideCount;
    }

    // Method to add new testimonials dynamically
    addTestimonial(testimonialData) {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('role', 'tabpanel');
        
        slide.innerHTML = `
            <div class="testimonial-content">
                <div class="testimonial-stars">${'★'.repeat(testimonialData.rating || 5)}</div>
                <p class="testimonial-text">${testimonialData.text}</p>
                <div class="testimonial-author">
                    <img src="${testimonialData.authorImage || 'assets/images/default-avatar.jpg'}" 
                         alt="${testimonialData.authorName}" class="author-image">
                    <div class="author-info">
                        <h4 class="author-name">${testimonialData.authorName}</h4>
                        <span class="author-treatment">${testimonialData.treatment || ''}</span>
                    </div>
                </div>
            </div>
        `;

        this.slider.appendChild(slide);
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.slideCount = this.slides.length;

        // Add dot
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', 'false');
        dot.setAttribute('aria-label', `Gehe zu Testimonial ${this.slideCount}`);
        
        dot.addEventListener('click', () => {
            this.goToSlide(this.slideCount - 1);
        });

        const dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            dotsContainer.appendChild(dot);
            this.dots = document.querySelectorAll('.testimonial-dots .dot');
        }

        // Update accessibility
        this.setupAccessibility();
    }

    // Method to remove testimonials
    removeTestimonial(index) {
        if (index < 0 || index >= this.slideCount) return;

        // Remove slide
        const slideToRemove = this.slides[index];
        if (slideToRemove) {
            slideToRemove.remove();
        }

        // Remove dot
        const dotToRemove = this.dots[index];
        if (dotToRemove) {
            dotToRemove.remove();
        }

        // Update references
        this.slides = document.querySelectorAll('.testimonial-slide');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.slideCount = this.slides.length;

        // Adjust current slide if necessary
        if (this.currentSlide >= this.slideCount) {
            this.currentSlide = this.slideCount - 1;
        }

        // Update slider
        this.setupAccessibility();
        this.updateSlider();
    }

    // Method to get all testimonial data
    getTestimonialsData() {
        return Array.from(this.slides).map(slide => {
            const text = slide.querySelector('.testimonial-text');
            const authorName = slide.querySelector('.author-name');
            const authorImage = slide.querySelector('.author-image');
            const treatment = slide.querySelector('.author-treatment');
            const stars = slide.querySelector('.testimonial-stars');

            return {
                text: text ? text.textContent : '',
                authorName: authorName ? authorName.textContent : '',
                authorImage: authorImage ? authorImage.src : '',
                treatment: treatment ? treatment.textContent : '',
                rating: stars ? stars.textContent.length : 5
            };
        });
    }

    // Method to filter testimonials
    filterTestimonials(filterFunction) {
        const testimonialsData = this.getTestimonialsData();
        const filteredIndices = testimonialsData
            .map((testimonial, index) => ({ testimonial, index }))
            .filter(({ testimonial }) => filterFunction(testimonial))
            .map(({ index }) => index);

        // Show only filtered testimonials
        this.slides.forEach((slide, index) => {
            if (filteredIndices.includes(index)) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });

        this.dots.forEach((dot, index) => {
            if (filteredIndices.includes(index)) {
                dot.style.display = 'block';
            } else {
                dot.style.display = 'none';
            }
        });

        // Update current slide if it's not in filtered results
        if (!filteredIndices.includes(this.currentSlide)) {
            this.currentSlide = filteredIndices[0] || 0;
        }

        this.updateSlider();
    }

    // Method to reset filter
    resetFilter() {
        this.slides.forEach(slide => {
            slide.style.display = 'block';
        });

        this.dots.forEach(dot => {
            dot.style.display = 'block';
        });

        this.updateSlider();
    }

    // Cleanup method
    destroy() {
        this.pauseAutoPlay();
        
        // Remove event listeners
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }

        this.dots.forEach(dot => {
            dot.removeEventListener('click', this.goToSlide);
        });

        // Clear references
        this.slider = null;
        this.slides = null;
        this.dots = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.liveRegion = null;
    }
}

// Initialize testimonials slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsSlider;
}

