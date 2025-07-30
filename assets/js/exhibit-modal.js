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
    this.setupDOMReferences();
    this.loadContent();
    this.setupEventListeners();
    this.interceptCheckbox();
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
    
    if (!this.modal || !this.modalBody || !this.modalContent || !this.checkboxElement) {
      console.error('ExhibitModal: Required DOM elements not found');
      return false;
    }
    
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
    
    // Scroll tracking
    if (this.modalBody) {
      this.modalBody.addEventListener('scroll', () => this.handleScroll());
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
    if (!this.checkboxElement) return;
    
    // Add visual indicator that checkbox is interactive
    const label = this.checkboxElement.nextElementSibling;
    if (label && label.tagName === 'LABEL') {
      label.style.cursor = 'pointer';
      label.title = 'Click to view Exhibit A airport rules';
    }
    
    // Intercept checkbox clicks
    this.checkboxElement.addEventListener('click', (e) => {
      if (!this.hasBeenViewed) {
        e.preventDefault();
        e.stopPropagation();
        this.show();
      }
    });
    
    // Also intercept label clicks
    if (label) {
      label.addEventListener('click', (e) => {
        if (!this.hasBeenViewed) {
          e.preventDefault();
          this.show();
        }
      });
    }
  },
  
  /**
   * Show the modal
   */
  show() {
    if (!this.modal || this.isOpen) return;
    
    // Store current focus
    this.focusBeforeModal = document.activeElement;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.classList.add('show');
    this.isOpen = true;
    
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
    this.isOpen = false;
    
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
    if (!this.scrolledToBottom) {
      // Scroll to bottom if not already there
      if (this.modalBody) {
        this.modalBody.scrollTop = this.modalBody.scrollHeight;
      }
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
    if (!this.modalBody || !this.progressBar) return;
    
    const scrollTop = this.modalBody.scrollTop;
    const scrollHeight = this.modalBody.scrollHeight;
    const clientHeight = this.modalBody.clientHeight;
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    // Update progress bar
    this.progressBar.style.height = `${Math.min(scrollPercentage, 100)}%`;
    
    // Check if scrolled to bottom (with small tolerance)
    const tolerance = 10;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - tolerance;
    
    if (isAtBottom && !this.scrolledToBottom) {
      this.scrolledToBottom = true;
      this.enableAcknowledgeButton();
    }
  },
  
  /**
   * Enable the acknowledge button when user has scrolled to bottom
   */
  enableAcknowledgeButton() {
    if (this.acknowledgeButton) {
      this.acknowledgeButton.disabled = false;
      this.acknowledgeButton.textContent = 'I Have Read and Understand';
    }
    
    if (this.scrollNotice) {
      this.scrollNotice.textContent = 'Thank you for reading the complete terms';
      this.scrollNotice.classList.add('completed');
    }
  },
  
  /**
   * Reset scroll state when modal is opened
   */
  resetScrollState() {
    this.scrolledToBottom = false;
    
    if (this.acknowledgeButton) {
      this.acknowledgeButton.disabled = true;
      this.acknowledgeButton.textContent = 'Please scroll to read all terms';
    }
    
    if (this.scrollNotice) {
      this.scrollNotice.textContent = 'Please scroll to read all terms';
      this.scrollNotice.classList.remove('completed');
    }
    
    if (this.progressBar) {
      this.progressBar.style.height = '0%';
    }
    
    if (this.modalBody) {
      this.modalBody.scrollTop = 0;
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
   * Force show modal (for testing or admin purposes)
   */
  forceShow() {
    this.show();
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