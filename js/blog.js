/**
 * Blog System
 * Handles the blog functionality including filtering, search, and newsletter signup
 */
class BlogSystem {
    constructor() {
        this.currentFilter = 'all';
        this.articles = [];
        this.filteredArticles = [];
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.loadArticles();
        this.setupAccessibility();
    }
    
    setupElements() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.articlesGrid = document.getElementById('articles-grid');
        this.articleCount = document.getElementById('article-count');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.newsletterForm = document.getElementById('newsletter-form');
    }
    
    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreArticles());
        }
        
        // Newsletter form
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
        
        // Article card interactions
        this.setupArticleInteractions();
    }
    
    setupAccessibility() {
        // Set up ARIA attributes for filter buttons
        this.filterButtons.forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
        });
        
        // Set up live region for filter announcements
        this.setupLiveRegion();
    }
    
    setupLiveRegion() {
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
    }
    
    loadArticles() {
        // Get all article cards from the DOM
        const articleCards = document.querySelectorAll('.article-card');
        
        this.articles = Array.from(articleCards).map(card => ({
            element: card,
            category: card.dataset.category,
            title: card.querySelector('.article-title a')?.textContent || '',
            excerpt: card.querySelector('.article-excerpt')?.textContent || '',
            tags: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent),
            date: card.querySelector('.article-date')?.textContent || '',
            author: card.querySelector('.article-author')?.textContent || ''
        }));
        
        this.filteredArticles = [...this.articles];
        this.updateArticleCount();
    }
    
    handleFilterClick(e) {
        e.preventDefault();
        
        const button = e.currentTarget;
        const filter = button.dataset.filter;
        
        // Update active button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        // Apply filter
        this.applyFilter(filter);
        
        // Announce to screen readers
        this.announceFilterChange(filter);
    }
    
    applyFilter(filter) {
        this.currentFilter = filter;
        
        if (filter === 'all') {
            this.filteredArticles = [...this.articles];
        } else {
            this.filteredArticles = this.articles.filter(article => 
                article.category === filter
            );
        }
        
        this.updateArticleDisplay();
        this.updateArticleCount();
    }
    
    updateArticleDisplay() {
        if (!this.articlesGrid) return;
        
        // Hide all articles first
        this.articles.forEach(article => {
            article.element.style.display = 'none';
            article.element.classList.remove('visible');
        });
        
        // Show filtered articles with animation
        this.filteredArticles.forEach((article, index) => {
            article.element.style.display = 'block';
            
            // Add staggered animation
            setTimeout(() => {
                article.element.classList.add('visible');
            }, index * 100);
        });
        
        // Show/hide load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.style.display = this.filteredArticles.length > 6 ? 'block' : 'none';
        }
    }
    
    updateArticleCount() {
        if (this.articleCount) {
            this.articleCount.textContent = this.filteredArticles.length;
        }
    }
    
    announceFilterChange(filter) {
        if (!this.liveRegion) return;
        
        const filterNames = {
            'all': 'Alle Artikel',
            'behandlung': 'Behandlung',
            'pflege': 'Zahnpflege',
            'technologie': 'Technologie',
            'tipps': 'Tipps & Tricks',
            'forschung': 'Forschung'
        };
        
        const count = this.filteredArticles.length;
        const filterName = filterNames[filter] || filter;
        
        this.liveRegion.textContent = `${filterName} ausgewählt: ${count} Artikel gefunden`;
    }
    
    loadMoreArticles() {
        // In a real implementation, this would load more articles from a server
        // For now, we'll just show a notification
        this.showNotification('Weitere Artikel werden geladen...', 'info');
        
        // Simulate loading
        setTimeout(() => {
            this.showNotification('Alle verfügbaren Artikel sind bereits geladen.', 'info');
        }, 2000);
    }
    
    setupArticleInteractions() {
        // Add hover effects and click handlers to article cards
        const articleCards = document.querySelectorAll('.article-card');
        
        articleCards.forEach(card => {
            // Add hover effect
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovered');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovered');
            });
            
            // Add click handler for read more link
            const readMoreLink = card.querySelector('.read-more');
            if (readMoreLink) {
                readMoreLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleArticleClick(card);
                });
            }
        });
    }
    
    handleArticleClick(articleCard) {
        // In a real implementation, this would navigate to the full article
        const title = articleCard.querySelector('.article-title a')?.textContent || 'Artikel';
        this.showNotification(`Artikel "${title}" wird geöffnet...`, 'info');
    }
    
    handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.currentTarget;
        const emailInput = form.querySelector('#newsletter-email');
        const privacyCheckbox = form.querySelector('#newsletter-privacy');
        
        // Validate form
        if (!this.validateNewsletterForm(emailInput, privacyCheckbox)) {
            return;
        }
        
        // Show loading state
        this.showNewsletterLoading(form);
        
        // Simulate form submission
        setTimeout(() => {
            this.hideNewsletterLoading(form);
            this.showNewsletterSuccess();
            form.reset();
        }, 2000);
    }
    
    validateNewsletterForm(emailInput, privacyCheckbox) {
        let isValid = true;
        
        // Email validation
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(emailInput, 'E-Mail-Adresse ist erforderlich.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            this.showFieldError(emailInput, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            isValid = false;
        } else {
            this.clearFieldError(emailInput);
        }
        
        // Privacy checkbox validation
        if (!privacyCheckbox.checked) {
            this.showFieldError(privacyCheckbox, 'Sie müssen der Datenschutzerklärung zustimmen.');
            isValid = false;
        } else {
            this.clearFieldError(privacyCheckbox);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.id = `${field.id}-error`;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    showNewsletterLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Wird abonniert...
            `;
        }
    }
    
    hideNewsletterLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Abonnieren';
        }
    }
    
    showNewsletterSuccess() {
        this.showNotification('Newsletter erfolgreich abonniert! Sie erhalten eine Bestätigungs-E-Mail.', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${this.getNotificationIcon(type)}
                </svg>
                <div>
                    <h4>${this.getNotificationTitle(type)}</h4>
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
    
    getNotificationIcon(type) {
        const icons = {
            success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
            error: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
            info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
        };
        
        return icons[type] || icons.info;
    }
    
    getNotificationTitle(type) {
        const titles = {
            success: 'Erfolgreich!',
            error: 'Fehler!',
            info: 'Information'
        };
        
        return titles[type] || titles.info;
    }
    
    // Public methods for external control
    getCurrentFilter() {
        return this.currentFilter;
    }
    
    getFilteredArticles() {
        return this.filteredArticles;
    }
    
    getAllArticles() {
        return this.articles;
    }
    
    searchArticles(searchTerm) {
        if (!searchTerm.trim()) {
            return this.filteredArticles;
        }
        
        const term = searchTerm.toLowerCase();
        
        return this.filteredArticles.filter(article => 
            article.title.toLowerCase().includes(term) ||
            article.excerpt.toLowerCase().includes(term) ||
            article.tags.some(tag => tag.toLowerCase().includes(term)) ||
            article.author.toLowerCase().includes(term)
        );
    }
    
    getArticlesByCategory(category) {
        return this.articles.filter(article => article.category === category);
    }
    
    getArticlesByAuthor(author) {
        return this.articles.filter(article => 
            article.author.toLowerCase().includes(author.toLowerCase())
        );
    }
    
    getArticlesByDateRange(startDate, endDate) {
        return this.articles.filter(article => {
            const articleDate = new Date(article.date);
            return articleDate >= startDate && articleDate <= endDate;
        });
    }
    
    exportArticleData() {
        return this.articles.map(article => ({
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            tags: article.tags,
            date: article.date,
            author: article.author
        }));
    }
    
    destroy() {
        // Remove event listeners
        this.filterButtons.forEach(button => {
            button.removeEventListener('click', this.handleFilterClick);
        });
        
        if (this.loadMoreBtn) {
            this.loadMoreBtn.removeEventListener('click', this.loadMoreArticles);
        }
        
        if (this.newsletterForm) {
            this.newsletterForm.removeEventListener('submit', this.handleNewsletterSubmit);
        }
        
        // Remove live region
        if (this.liveRegion) {
            this.liveRegion.remove();
        }
    }
}

// Initialize the blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogSystem = new BlogSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogSystem;
}

