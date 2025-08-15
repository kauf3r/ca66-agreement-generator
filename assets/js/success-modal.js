/**
 * Success Modal Module
 * Handles the beautiful success modal that appears after PDF generation
 */

export const SuccessModal = {
  modal: null,
  closeButton: null,
  successButton: null,
  autoCloseTimer: null,
  
  /**
   * Initialize the success modal
   */
  init() {
    this.modal = document.getElementById('success-modal');
    this.closeButton = this.modal?.querySelector('.success-close');
    this.successButton = document.getElementById('success-close-btn');
    
    if (!this.modal) {
      console.error('Success modal not found in DOM');
      return;
    }
    
    this.setupEventListeners();
    console.log('Success Modal initialized');
  },
  
  /**
   * Set up event listeners for modal interaction
   */
  setupEventListeners() {
    // Close button in header
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
      });
    }
    
    // Main success button
    if (this.successButton) {
      this.successButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
      });
    }
    
    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) {
        this.hide();
      }
    });
  },
  
  /**
   * Show the success modal with user data
   * @param {Object} userData - The user's form data
   */
  show(userData = {}) {
    if (!this.modal) {
      console.error('Cannot show success modal - modal not found');
      return;
    }
    
    // Populate the modal with user data
    this.populateUserData(userData);
    
    // Show the modal with animation
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.style.display = 'flex';
    
    // Trigger entrance animation
    requestAnimationFrame(() => {
      this.modal.classList.add('show');
    });
    
    // Focus management for accessibility
    const firstFocusable = this.modal.querySelector('.success-close');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 400);
    }
    
    // Set up auto-close timer (8 seconds)
    this.setAutoCloseTimer();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log('Success modal shown');
  },
  
  /**
   * Hide the success modal
   */
  hide() {
    if (!this.modal || !this.isVisible()) return;
    
    // Clear auto-close timer
    this.clearAutoCloseTimer();
    
    // Trigger exit animation
    this.modal.classList.remove('show');
    
    // Hide after animation completes
    setTimeout(() => {
      this.modal.setAttribute('aria-hidden', 'true');
      this.modal.style.display = 'none';
      
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Return focus to the generate button
      const generateButton = document.getElementById('generate-pdf');
      if (generateButton) {
        generateButton.focus();
      }
      
    }, 400); // Match CSS transition duration
    
    console.log('Success modal hidden');
  },
  
  /**
   * Check if modal is currently visible
   */
  isVisible() {
    return this.modal && this.modal.classList.contains('show');
  },
  
  /**
   * Populate the modal with user-specific data
   * @param {Object} userData - The user's form data
   */
  populateUserData(userData) {
    // Update email address in the modal
    const emailSpan = document.getElementById('success-email-address');
    if (emailSpan && userData.email) {
      emailSpan.textContent = userData.email;
      emailSpan.style.fontWeight = '600';
      emailSpan.style.color = '#059669';
    }
    
    // Add subtle personalization to the title if we have a name
    const titleElement = this.modal.querySelector('.success-title');
    if (titleElement && userData.licenseeName) {
      const firstName = userData.licenseeName.split(' ')[0];
      titleElement.innerHTML = `Agreement Generated Successfully, ${firstName}! 🎉`;
    }
    
    // Update the thank you message with more personal touch
    const messageElement = this.modal.querySelector('.success-message');
    if (messageElement && userData.licenseeName) {
      messageElement.innerHTML = `
        Thank you, <strong>${userData.licenseeName}</strong>, for completing your CA-66 Airport Usage License Agreement. 
        Your application has been processed and is ready for review.
      `;
    }
  },
  
  /**
   * Set auto-close timer
   */
  setAutoCloseTimer() {
    this.clearAutoCloseTimer();
    
    // Auto-close after 8 seconds
    this.autoCloseTimer = setTimeout(() => {
      this.hide();
    }, 8000);
    
    // Visual countdown on the button (optional)
    this.startButtonCountdown();
  },
  
  /**
   * Clear auto-close timer
   */
  clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  },
  
  /**
   * Start visual countdown on the success button
   */
  startButtonCountdown() {
    if (!this.successButton) return;
    
    const originalText = this.successButton.textContent;
    let countdown = 8;
    
    const updateButton = () => {
      if (countdown > 0 && this.isVisible()) {
        this.successButton.textContent = `${originalText} (${countdown})`;
        countdown--;
        setTimeout(updateButton, 1000);
      } else if (this.isVisible()) {
        this.successButton.textContent = originalText;
      }
    };
    
    // Start countdown after initial animations complete
    setTimeout(updateButton, 2000);
  },
  
  /**
   * Add celebratory effects (optional)
   */
  addCelebration() {
    // Simple confetti effect using CSS animations
    const celebration = document.createElement('div');
    celebration.className = 'celebration-overlay';
    celebration.innerHTML = `
      <div class="confetti-piece" style="--delay: 0s; --x: 20%;">🎉</div>
      <div class="confetti-piece" style="--delay: 0.2s; --x: 40%;">✨</div>
      <div class="confetti-piece" style="--delay: 0.4s; --x: 60%;">🎊</div>
      <div class="confetti-piece" style="--delay: 0.6s; --x: 80%;">⭐</div>
    `;
    
    // Add to modal
    this.modal.querySelector('.success-container').appendChild(celebration);
    
    // Remove after animation
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
    }, 3000);
  },
  
  /**
   * Show with email sending status
   * @param {Object} userData - User data
   * @param {boolean} emailSent - Whether email was sent successfully
   */
  showWithEmailStatus(userData, emailSent = true) {
    this.show(userData);
    
    // Update email status in the modal
    const emailItem = this.modal.querySelector('.success-detail-item:first-child');
    if (emailItem && !emailSent) {
      const emailIcon = emailItem.querySelector('.success-detail-icon');
      const emailContent = emailItem.querySelector('.success-detail-content');
      
      if (emailIcon) emailIcon.textContent = '⚠️';
      if (emailContent) {
        emailContent.innerHTML = `
          <h3>Email Issue</h3>
          <p>There was an issue sending the email. Please download the PDF below.</p>
        `;
      }
    }
  }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  SuccessModal.init();
});

console.log('Success Modal module loaded');