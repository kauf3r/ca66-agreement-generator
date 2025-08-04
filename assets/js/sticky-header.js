/**
 * Sticky Header Implementation
 * Handles smooth sticky header behavior with scroll detection
 */

class StickyHeader {
    constructor() {
        this.header = document.querySelector('.site-header');
        this.lastScroll = 0;
        this.scrollThreshold = 50;
        
        if (this.header) {
            this.init();
        }
    }
    
    init() {
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Start without scrolled class - will be added based on scroll
        this.header.classList.remove('scrolled');
        
        // Initial scroll check
        this.handleScroll();
        
        // Listen for scroll events with throttling (reduced for better performance if motion reduced)
        const throttleRate = this.prefersReducedMotion ? 32 : 16;
        this.handleScroll = this.throttle(this.handleScroll.bind(this), throttleRate);
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Handle resize events
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 100));
    }
    
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled styling based on scroll position
        if (currentScroll > this.scrollThreshold) {
            if (!this.header.classList.contains('scrolled')) {
                this.header.classList.add('scrolled');
                // Update ARIA attributes for accessibility
                this.header.setAttribute('aria-label', 'Scrolled navigation header');
            }
        } else {
            if (this.header.classList.contains('scrolled')) {
                this.header.classList.remove('scrolled');
                this.header.removeAttribute('aria-label');
            }
        }
        
        this.lastScroll = currentScroll;
    }
    
    handleResize() {
        // Handle any resize-specific logic if needed
        this.handleScroll();
    }
    
    // Throttle function to limit scroll event frequency
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
        }
    }
}

// Initialize sticky header when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new StickyHeader();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StickyHeader;
}