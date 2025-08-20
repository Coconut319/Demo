/**
 * FAQ Accordion Functionality
 * Handles the interactive FAQ accordion sections
 */

class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
    }

    setupEventListeners() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    this.toggleFAQ(item, question, answer);
                });

                // Keyboard support
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(item, question, answer);
                    }
                });
            }
        });
    }

    toggleFAQ(item, question, answer) {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        this.closeAllFAQs();
        
        // Toggle current item
        if (!isExpanded) {
            this.openFAQ(item, question, answer);
        }
    }

    openFAQ(item, question, answer) {
        // Update ARIA attributes
        question.setAttribute('aria-expanded', 'true');
        
        // Add active class for styling
        answer.classList.add('active');
        
        // Calculate the height for smooth animation
        const answerHeight = answer.scrollHeight;
        answer.style.maxHeight = answerHeight + 'px';
        
        // Add focus management
        setTimeout(() => {
            // Focus the first focusable element in the answer
            const focusableElements = answer.querySelectorAll('a, button, input, textarea, select');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }, 300);
    }

    closeFAQ(item, question, answer) {
        // Update ARIA attributes
        question.setAttribute('aria-expanded', 'false');
        
        // Remove active class
        answer.classList.remove('active');
        
        // Reset max-height for smooth animation
        answer.style.maxHeight = '0';
    }

    closeAllFAQs() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                this.closeFAQ(item, question, answer);
            }
        });
    }

    setupAccessibility() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // Set initial ARIA attributes
                question.setAttribute('aria-expanded', 'false');
                question.setAttribute('aria-controls', answer.id || this.generateId(answer));
                
                // Ensure answer has an ID for ARIA
                if (!answer.id) {
                    answer.id = this.generateId(answer);
                }
                
                // Add role attributes
                question.setAttribute('role', 'button');
                answer.setAttribute('role', 'region');
                answer.setAttribute('aria-labelledby', question.id || this.generateId(question));
            }
        });
    }

    generateId(element) {
        const text = element.textContent || element.innerText;
        const id = 'faq-' + text.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        element.id = id;
        return id;
    }

    // Public method to open a specific FAQ by index
    openFAQByIndex(index) {
        if (index >= 0 && index < this.faqItems.length) {
            const item = this.faqItems[index];
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                this.closeAllFAQs();
                this.openFAQ(item, question, answer);
            }
        }
    }

    // Public method to open a specific FAQ by question text
    openFAQByQuestion(questionText) {
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            if (question && question.textContent.includes(questionText)) {
                this.openFAQByIndex(index);
            }
        });
    }

    // Public method to get all FAQ data
    getFAQData() {
        return Array.from(this.faqItems).map(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            return {
                question: question ? question.textContent.trim() : '',
                answer: answer ? answer.textContent.trim() : '',
                isExpanded: question ? question.getAttribute('aria-expanded') === 'true' : false
            };
        });
    }

    // Public method to search FAQs
    searchFAQs(searchTerm) {
        const results = [];
        const term = searchTerm.toLowerCase();
        
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                const questionText = question.textContent.toLowerCase();
                const answerText = answer.textContent.toLowerCase();
                
                if (questionText.includes(term) || answerText.includes(term)) {
                    results.push({
                        index,
                        question: question.textContent.trim(),
                        answer: answer.textContent.trim(),
                        relevance: this.calculateRelevance(questionText, answerText, term)
                    });
                }
            }
        });
        
        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        return results;
    }

    calculateRelevance(questionText, answerText, searchTerm) {
        let relevance = 0;
        
        // Question matches are more relevant
        if (questionText.includes(searchTerm)) {
            relevance += 10;
        }
        
        // Answer matches
        if (answerText.includes(searchTerm)) {
            relevance += 5;
        }
        
        // Exact matches get bonus points
        if (questionText === searchTerm) {
            relevance += 20;
        }
        
        return relevance;
    }
}

// Initialize FAQ functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FAQAccordion();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FAQAccordion;
}

