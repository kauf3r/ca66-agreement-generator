/**
 * Exhibit A Modal Module
 * Handles display and interaction with the airport rules modal popup
 * Ensures users read and acknowledge Exhibit A before checking the agreement box
 */

import { getExhibitAContent } from './exhibit-content.js';

export const ExhibitModal = {
  // DOM Elements
  modal: null,
  modalBody: null,
  modalContent: null,
  closeButton: null,
  acknowledgeButton: null,
  scrollNotice: null,
  progressBar: null,
  checkboxElement: null,
  
  // State
  isOpen: false,
  hasBeenViewed: false,
  scrolledToBottom: false,
  focusBeforeModal: null,
  
  /**
   * Initialize the modal system
   */
  init() {
    console.log('ExhibitModal: Initializing...');
    
    if (!this.setupDOMReferences()) {
      console.error('ExhibitModal: Initialization failed - DOM elements not found');
      return;
    }
    
    this.loadContent();
    this.setupEventListeners();
    this.interceptCheckbox();
    
    console.log('ExhibitModal: Initialization complete');
  },
  
  /**
   * Set up DOM element references
   */
  setupDOMReferences() {
    this.modal = document.getElementById('exhibit-modal');
    this.modalBody = this.modal?.querySelector('.modal-body');
    this.modalContent = this.modal?.querySelector('.exhibit-content');
    this.closeButton = this.modal?.querySelector('.modal-close');
    this.acknowledgeButton = this.modal?.querySelector('.modal-acknowledge');
    this.scrollNotice = this.modal?.querySelector('.scroll-notice');
    this.progressBar = this.modal?.querySelector('.scroll-progress-bar');
    this.checkboxElement = document.getElementById('airport-rules');
    
    // Debug logging
    console.log('ExhibitModal: Setting up DOM references...');
    console.log('Modal element:', this.modal ? 'Found' : 'NOT FOUND');
    console.log('Modal body:', this.modalBody ? 'Found' : 'NOT FOUND');
    console.log('Modal content:', this.modalContent ? 'Found' : 'NOT FOUND');
    console.log('Checkbox element:', this.checkboxElement ? 'Found' : 'NOT FOUND');
    
    if (!this.modal || !this.modalBody || !this.modalContent || !this.checkboxElement) {
      console.error('ExhibitModal: Required DOM elements not found - modal initialization failed');
      return false;
    }
    
    console.log('ExhibitModal: All required DOM elements found');
    
    // Initialize modal state
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.classList.remove('show');
    this.isOpen = false;
    console.log('ExhibitModal: Initial state set');
    
    return true;
  },
  
  /**
   * Load Exhibit A content into the modal
   */
  loadContent() {
    if (this.modalContent) {
      this.modalContent.innerHTML = getExhibitAContent();
    }
  },
  
  /**
   * Set up modal event listeners
   */
  setupEventListeners() {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.hide());
    }
    
    // Acknowledge button
    if (this.acknowledgeButton) {
      this.acknowledgeButton.addEventListener('click', () => this.acknowledge());
    }
    
    // Modal overlay click to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.hide();
        }
      });
    }
    
    // Proper scroll tracking to detect when user reaches bottom
    if (this.modalBody) {
      this.modalBody.addEventListener('scroll', () => {
        this.handleScroll();
      });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Resize handler for mobile
    window.addEventListener('resize', () => this.handleResize());
  },
  
  /**
   * Intercept checkbox clicks to show modal first
   */
  interceptCheckbox() {
    if (!this.checkboxElement) {
      console.error('ExhibitModal: Checkbox element not found for interception');
      return;
    }
    
    console.log('ExhibitModal: Setting up checkbox interception...');
    
    // Add visual indicator that checkbox is interactive
    const label = this.checkboxElement.nextElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.style.cursor = 'pointer';
      label.title = 'Click to view Exhibit A airport rules';
      console.log('ExhibitModal: Label styling applied');
    }
    
    // Intercept checkbox clicks
    this.checkboxElement.addEventListener('click', (e) => {
      console.log('ExhibitModal: Checkbox clicked, hasBeenViewed:', this.hasBeenViewed);
      if (!this.hasBeenViewed) {
        console.log('ExhibitModal: Preventing default and showing modal');
        e.preventDefault();
        e.stopPropagation();
        this.show();
      } else {
        console.log('ExhibitModal: Allowing checkbox to be checked (already viewed)');
      }
    });
    
    // Also intercept label clicks
    if (label) {
      label.addEventListener('click', (e) => {
        console.log('ExhibitModal: Label clicked, hasBeenViewed:', this.hasBeenViewed);
        if (!this.hasBeenViewed) {
          console.log('ExhibitModal: Preventing label default and showing modal');
          e.preventDefault();
          this.show();
        }
      });
    }
  },
  
  /**
   * Force show the modal (for testing)
   */
  forceShow() {
    console.log('ExhibitModal: Force showing modal for testing...');
    this.hasBeenViewed = false;
    this.show();
  },
  
  /**
   * Show the modal
   */
  show() {
    console.log('ExhibitModal.show() called, modal exists:', !!this.modal, 'isOpen:', this.isOpen);
    
    // Reset mechanism - check if modal is actually visible when isOpen is true
    if (this.isOpen && this.modal) {
      const isActuallyVisible = this.modal.style.display !== 'none' && 
                                this.modal.classList.contains('show') &&
                                this.modal.getAttribute('aria-hidden') === 'false';
      if (!isActuallyVisible) {
        console.log('ExhibitModal: Detected stuck state, resetting...');
        this.isOpen = false;
      }
    }
    
    if (!this.modal) {
      console.log('ExhibitModal: Modal element not found');
      return;
    }
    
    if (this.isOpen) {
      console.log('ExhibitModal: Not showing modal (already open)');
      return;
    }
    
    console.log('ExhibitModal: Proceeding to show modal...');
    
    // Store current focus
    this.focusBeforeModal = document.activeElement;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.classList.add('show');
    this.modal.style.display = 'flex'; // Force display
    this.isOpen = true;
    
    console.log('ExhibitModal: Modal shown with display:', this.modal.style.display, 'classes:', this.modal.className);
    
    // Focus management
    setTimeout(() => {
      const modalContainer = this.modal.querySelector('.modal-container');
      if (modalContainer) {
        modalContainer.focus();
      }
    }, 100);
    
    // Reset scroll state
    this.resetScrollState();
    
    // Track modal view for analytics (if needed)
    this.trackModalView();
  },
  
  /**
   * Hide the modal
   */
  hide() {
    if (!this.modal || !this.isOpen) return;
    
    // Hide modal
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.classList.remove('show');
    this.modal.style.display = 'none'; // Force hide
    this.isOpen = false;
    
    console.log('ExhibitModal: Modal hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.focusBeforeModal) {
      this.focusBeforeModal.focus();
      this.focusBeforeModal = null;
    }
  },
  
  /**
   * Handle user acknowledgment
   */
  acknowledge() {
    // Only allow acknowledgment if user has scrolled to bottom
    if (!this.scrolledToBottom) {
      console.log('❌ Cannot acknowledge - user has not scrolled to bottom');
      return;
    }
    
    // Mark as viewed and acknowledged
    this.hasBeenViewed = true;
    
    // Check the checkbox
    if (this.checkboxElement) {
      this.checkboxElement.checked = true;
      
      // Trigger change event for form validation
      const changeEvent = new Event('change', { bubbles: true });
      this.checkboxElement.dispatchEvent(changeEvent);
    }
    
    // Close modal
    this.hide();
    
    // Show confirmation (optional)
    this.showAcknowledgmentConfirmation();
  },
  
  /**
   * Handle scroll events to track reading progress
   */
  handleScroll() {
    if (!this.modalBody) return;
    
    const { scrollTop, scrollHeight, clientHeight } = this.modalBody;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    // Update progress bar
    if (this.progressBar) {
      this.progressBar.style.width = Math.min(scrollPercentage, 100) + '%';
    }
    
    // Check if user has scrolled to bottom (with 50px threshold)
    const threshold = 50;
    const hasReachedBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    
    if (hasReachedBottom && !this.scrolledToBottom) {
      this.scrolledToBottom = true;
      this.enableAcknowledgeButton();
      console.log('✅ User has scrolled to bottom - acknowledge button enabled');
    }
  },
  
  /**
   * Enable the acknowledge button when user has scrolled to bottom
   */
  enableAcknowledgeButton() {
    if (this.acknowledgeButton) {
      this.acknowledgeButton.disabled = false;
      this.acknowledgeButton.textContent = '✓ I Have Read and Understand These Rules';
      this.acknowledgeButton.style.cursor = 'pointer';
      this.acknowledgeButton.classList.add('enabled');
    }
    
    if (this.scrollNotice) {
      this.scrollNotice.textContent = '✅ Ready to acknowledge - you have read all terms';
      this.scrollNotice.classList.add('completed');
    }
  },
  
  /**
   * Reset scroll state when modal is opened
   */
  resetScrollState() {
    // Properly disable button until user scrolls to bottom
    this.scrolledToBottom = false;
    
    if (this.acknowledgeButton) {
      this.acknowledgeButton.disabled = true;
      this.acknowledgeButton.textContent = '📜 Please Scroll to Read All Terms';
      this.acknowledgeButton.style.cursor = 'not-allowed';
    }
    
    if (this.scrollNotice) {
      this.scrollNotice.textContent = 'Please scroll down to read all terms and regulations';
      this.scrollNotice.classList.remove('completed');
    }
    
    if (this.modalBody) {
      this.modalBody.scrollTop = 0;
    }
    
    // Update progress bar
    if (this.progressBar) {
      this.progressBar.style.width = '0%';
    }
  },
  
  /**
   * Handle keyboard events
   */
  handleKeydown(e) {
    if (!this.isOpen) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.hide();
        break;
        
      case 'Tab':
        this.handleTabKey(e);
        break;
        
      case 'Enter':
        if (e.target === this.acknowledgeButton && !this.acknowledgeButton.disabled) {
          e.preventDefault();
          this.acknowledge();
        }
        break;
    }
  },
  
  /**
   * Handle tab key for focus trapping
   */
  handleTabKey(e) {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  },
  
  /**
   * Handle window resize for mobile optimization
   */
  handleResize() {
    if (this.isOpen && this.modalBody) {
      // Recalculate scroll position on resize
      setTimeout(() => this.handleScroll(), 100);
    }
  },
  
  /**
   * Show acknowledgment confirmation
   */
  showAcknowledgmentConfirmation() {
    // Could add a brief toast notification here
    console.log('User has acknowledged Exhibit A airport rules');
  },
  
  /**
   * Track modal view for analytics
   */
  trackModalView() {
    // Could integrate with analytics here
    console.log('Exhibit A modal viewed');
  },
  
  /**
   * Check if user has already acknowledged
   */
  hasUserAcknowledged() {
    return this.hasBeenViewed && this.checkboxElement?.checked;
  },
  
  
  /**
   * Reset acknowledgment state (for testing)
   */
  resetAcknowledgment() {
    this.hasBeenViewed = false;
    if (this.checkboxElement) {
      this.checkboxElement.checked = false;
    }
  }
};

// Expose to global scope for testing
if (typeof window !== 'undefined') {
  window.ExhibitModal = ExhibitModal;
  // Add manual test function
  window.testExhibitModal = () => {
    console.log('Testing Exhibit Modal...');
    console.log('Modal element:', ExhibitModal.modal);
    console.log('Checkbox element:', ExhibitModal.checkboxElement);
    console.log('Is Open:', ExhibitModal.isOpen);
    console.log('Has Been Viewed:', ExhibitModal.hasBeenViewed);
    console.log('Manually calling show()...');
    ExhibitModal.show();
  };
}