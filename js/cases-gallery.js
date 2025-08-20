/**
 * Cases Gallery
 * Handles the interactive gallery with filtering functionality
 */
class CasesGallery {
    constructor() {
        this.currentFilter = 'all';
        this.cases = [];
        this.filterButtons = [];
        this.galleryGrid = null;
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAccessibility();
        this.loadCases();
    }
    
    setupElements() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        if (!this.galleryGrid) {
            console.warn('Gallery grid not found');
            return;
        }
    }
    
    setupEventListeners() {
        // Filter button clicks
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
        
        // Keyboard navigation for filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const filter = e.target.dataset.filter;
                    this.setFilter(filter);
                }
            });
        });
        
        // Case item interactions
        this.setupCaseInteractions();
    }
    
    setupCaseInteractions() {
        const caseItems = document.querySelectorAll('.case-item');
        
        caseItems.forEach(item => {
            // Click to expand/collapse details
            const infoSection = item.querySelector('.case-info');
            const imagesSection = item.querySelector('.case-images');
            
            if (infoSection && imagesSection) {
                imagesSection.addEventListener('click', () => {
                    this.toggleCaseDetails(item);
                });
                
                // Keyboard support
                imagesSection.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleCaseDetails(item);
                    }
                });
            }
            
            // Hover effects
            item.addEventListener('mouseenter', () => {
                this.handleCaseHover(item, true);
            });
            
            item.addEventListener('mouseleave', () => {
                this.handleCaseHover(item, false);
            });
        });
    }
    
    setupAccessibility() {
        // Set ARIA attributes for filter buttons
        this.filterButtons.forEach(button => {
            button.setAttribute('role', 'tab');
            button.setAttribute('aria-selected', button.classList.contains('active') ? 'true' : 'false');
        });
        
        // Set ARIA attributes for case items
        const caseItems = document.querySelectorAll('.case-item');
        caseItems.forEach((item, index) => {
            item.setAttribute('role', 'article');
            item.setAttribute('aria-labelledby', `case-title-${index}`);
            
            const title = item.querySelector('h3');
            if (title) {
                title.id = `case-title-${index}`;
            }
        });
        
        // Live region for filter announcements
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        this.galleryGrid?.parentElement?.appendChild(this.liveRegion);
    }
    
    loadCases() {
        // Get all case items
        this.cases = Array.from(document.querySelectorAll('.case-item'));
        
        // Add data attributes for filtering
        this.cases.forEach(caseItem => {
            const category = caseItem.dataset.category;
            if (category) {
                caseItem.setAttribute('data-filter-category', category);
            }
        });
    }
    
    setFilter(filter) {
        if (this.currentFilter === filter) return;
        
        this.currentFilter = filter;
        
        // Update filter buttons
        this.filterButtons.forEach(button => {
            if (button.dataset.filter === filter) {
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
            } else {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            }
        });
        
        // Filter cases
        this.filterCases();
        
        // Announce filter change
        this.announceFilterChange(filter);
    }
    
    filterCases() {
        const visibleCases = [];
        
        this.cases.forEach(caseItem => {
            const category = caseItem.dataset.category;
            const shouldShow = this.currentFilter === 'all' || category === this.currentFilter;
            
            if (shouldShow) {
                caseItem.style.display = 'block';
                caseItem.classList.add('visible');
                visibleCases.push(caseItem);
                
                // Trigger animation
                setTimeout(() => {
                    caseItem.classList.add('fade-in');
                }, 50);
            } else {
                caseItem.style.display = 'none';
                caseItem.classList.remove('visible', 'fade-in');
            }
        });
        
        // Update grid layout
        this.updateGridLayout(visibleCases);
        
        // Update results count
        this.updateResultsCount(visibleCases.length);
    }
    
    updateGridLayout(visibleCases) {
        if (!this.galleryGrid) return;
        
        // Add staggered animation delays
        visibleCases.forEach((caseItem, index) => {
            caseItem.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    updateResultsCount(count) {
        const totalCount = this.cases.length;
        const resultsText = `${count} von ${totalCount} Fällen`;
        
        // Update or create results counter
        let counter = document.querySelector('.results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'results-counter';
            counter.setAttribute('aria-live', 'polite');
            
            const filterSection = document.querySelector('.cases-filter .container');
            if (filterSection) {
                filterSection.appendChild(counter);
            }
        }
        
        counter.textContent = resultsText;
    }
    
    toggleCaseDetails(caseItem) {
        const infoSection = caseItem.querySelector('.case-info');
        const isExpanded = caseItem.classList.contains('expanded');
        
        if (isExpanded) {
            caseItem.classList.remove('expanded');
            infoSection.setAttribute('aria-expanded', 'false');
        } else {
            caseItem.classList.add('expanded');
            infoSection.setAttribute('aria-expanded', 'true');
        }
    }
    
    handleCaseHover(caseItem, isHovering) {
        if (isHovering) {
            caseItem.classList.add('hovered');
        } else {
            caseItem.classList.remove('hovered');
        }
    }
    
    announceFilterChange(filter) {
        const filterNames = {
            'all': 'Alle Fälle',
            'invisalign': 'Invisalign Fälle',
            'feste-spange': 'Feste Spange Fälle',
            'lingual': 'Lingualtechnik Fälle',
            'fruehbehandlung': 'Frühbehandlung Fälle'
        };
        
        const filterName = filterNames[filter] || filter;
        const visibleCount = this.cases.filter(caseItem => {
            const category = caseItem.dataset.category;
            return filter === 'all' || category === filter;
        }).length;
        
        if (this.liveRegion) {
            this.liveRegion.textContent = `${filterName} angezeigt: ${visibleCount} Fälle`;
        }
    }
    
    // Public methods for external control
    getCurrentFilter() {
        return this.currentFilter;
    }
    
    getVisibleCases() {
        return this.cases.filter(caseItem => {
            const category = caseItem.dataset.category;
            return this.currentFilter === 'all' || category === this.currentFilter;
        });
    }
    
    getTotalCases() {
        return this.cases.length;
    }
    
    filterByCategory(category) {
        this.setFilter(category);
    }
    
    resetFilter() {
        this.setFilter('all');
    }
    
    // Search functionality
    searchCases(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            this.filterCases();
            return;
        }
        
        const term = searchTerm.toLowerCase().trim();
        const matchingCases = [];
        
        this.cases.forEach(caseItem => {
            const title = caseItem.querySelector('h3')?.textContent?.toLowerCase() || '';
            const description = caseItem.querySelector('.case-description')?.textContent?.toLowerCase() || '';
            const features = Array.from(caseItem.querySelectorAll('.feature-tag'))
                .map(tag => tag.textContent.toLowerCase())
                .join(' ');
            
            const matches = title.includes(term) || 
                          description.includes(term) || 
                          features.includes(term);
            
            if (matches) {
                caseItem.style.display = 'block';
                caseItem.classList.add('visible', 'search-match');
                matchingCases.push(caseItem);
            } else {
                caseItem.style.display = 'none';
                caseItem.classList.remove('visible', 'search-match');
            }
        });
        
        this.updateResultsCount(matchingCases.length);
    }
    
    // Export case data
    exportCaseData() {
        return this.cases.map(caseItem => {
            const title = caseItem.querySelector('h3')?.textContent || '';
            const treatment = caseItem.querySelector('.case-treatment')?.textContent || '';
            const duration = caseItem.querySelector('.case-duration')?.textContent || '';
            const description = caseItem.querySelector('.case-description')?.textContent || '';
            const category = caseItem.dataset.category || '';
            const features = Array.from(caseItem.querySelectorAll('.feature-tag'))
                .map(tag => tag.textContent);
            
            return {
                title,
                treatment,
                duration,
                description,
                category,
                features
            };
        });
    }
    
    destroy() {
        // Remove event listeners
        this.filterButtons.forEach(button => {
            button.removeEventListener('click', this.setFilter);
            button.removeEventListener('keydown', this.handleKeydown);
        });
        
        // Remove live region
        this.liveRegion?.remove();
        
        // Clear arrays
        this.cases = [];
        this.filterButtons = [];
    }
}

// Initialize the cases gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.casesGallery = new CasesGallery();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CasesGallery;
}

