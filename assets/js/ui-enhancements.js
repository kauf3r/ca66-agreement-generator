/**
 * UI Enhancements Module
 * Handles loading states, animations, and user experience improvements
 */

export const UIEnhancements = {
  // Loading overlay element
  loadingOverlay: null,
  
  // Toast container
  toastContainer: null,
  
  // Local storage key for form data
  STORAGE_KEY: 'ca66-form-progress',
  
  /**
   * Initialize UI enhancements
   */
  init() {
    this.createLoadingOverlay();
    this.createToastContainer();
    this.setupFormAutoSave();
    this.enhanceButtons();
    this.enhanceFormFields();
    this.loadSavedProgress();
    
    console.log('UI Enhancements initialized');
  },
  
  /**
   * Create loading overlay for full-screen loading states
   */
  createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner large dark"></div>
        <div class="loading-title">Processing...</div>
        <div class="loading-description">Please wait while we process your request</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.loadingOverlay = overlay;
  },
  
  /**
   * Create toast notification container
   */
  createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 3000;
      pointer-events: none;
    `;
    
    document.body.appendChild(container);
    this.toastContainer = container;
  },
  
  /**
   * Show loading overlay with custom message
   */
  showLoading(title = 'Processing...', description = 'Please wait while we process your request') {
    if (this.loadingOverlay) {
      const titleEl = this.loadingOverlay.querySelector('.loading-title');
      const descEl = this.loadingOverlay.querySelector('.loading-description');
      
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = description;
      
      this.loadingOverlay.classList.add('show');
    }
  },
  
  /**
   * Hide loading overlay
   */
  hideLoading() {
    if (this.loadingOverlay) {
      this.loadingOverlay.classList.remove('show');
    }
  },
  
  /**
   * Show button loading state
   */
  showButtonLoading(button, loadingText = 'Processing...') {
    if (!button) return;
    
    // Store original content
    button.dataset.originalText = button.innerHTML;
    button.dataset.originalDisabled = button.disabled;
    
    // Set loading state
    button.disabled = true;
    button.classList.add('btn-loading');
    button.innerHTML = `
      <div class="loading-spinner"></div>
      <span class="btn-text">${loadingText}</span>
    `;
  },
  
  /**
   * Hide button loading state
   */
  hideButtonLoading(button) {
    if (!button) return;
    
    // Restore original state
    button.innerHTML = button.dataset.originalText || button.innerHTML.replace(/<div class="loading-spinner"><\/div>/, '');
    button.disabled = button.dataset.originalDisabled === 'true';
    button.classList.remove('btn-loading');
    
    // Clean up data attributes
    delete button.dataset.originalText;
    delete button.dataset.originalDisabled;
  },
  
  /**
   * Show success state for button
   */
  showButtonSuccess(button, successText = 'Success!', duration = 2000) {
    if (!button) return;
    
    const originalText = button.innerHTML;
    button.innerHTML = `
      <div class="success-checkmark"></div>
      <span>${successText}</span>
    `;
    
    button.classList.add('btn-success');
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
    }, duration);
  },
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'success', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">&times;</button>
      </div>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hideToast(toast));
    
    // Add to container
    this.toastContainer.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-hide after duration
    setTimeout(() => this.hideToast(toast), duration);
    
    return toast;
  },
  
  /**
   * Hide toast notification
   */
  hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  },
  
  /**
   * Save form progress to localStorage
   */
  saveFormProgress() {
    try {
      const form = document.getElementById('agreement-form');
      if (!form) return;
      
      const formData = new FormData(form);
      const data = {};
      
      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        if (form.elements[key].type === 'checkbox') {
          data[key] = form.elements[key].checked;
        } else {
          data[key] = value;
        }
      }
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        data: data,
        timestamp: Date.now()
      }));
      
      // Show subtle save indicator
      this.showSaveIndicator();
      
    } catch (error) {
      console.error('Error saving form progress:', error);
    }
  },
  
  /**
   * Load saved form progress
   */
  loadSavedProgress() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (!saved) return;
      
      const { data, timestamp } = JSON.parse(saved);
      
      // Don't load data older than 24 hours
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(this.STORAGE_KEY);
        return;
      }
      
      const form = document.getElementById('agreement-form');
      if (!form) return;
      
      // Restore form data
      Object.entries(data).forEach(([key, value]) => {
        const field = form.elements[key];
        if (!field) return;
        
        if (field.type === 'checkbox') {
          field.checked = value;
        } else {
          field.value = value;
        }
        
        // Trigger change event for validation
        field.dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      // Show restore notification
      this.showToast('Form progress restored from previous session', 'info', 3000);
      
    } catch (error) {
      console.error('Error loading saved progress:', error);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  },
  
  /**
   * Clear saved progress
   */
  clearSavedProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
  },
  
  /**
   * Show subtle save indicator
   */
  showSaveIndicator() {
    // Add a subtle pulse to indicate saving
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.classList.add('field-saving');
      setTimeout(() => {
        progressIndicator.classList.remove('field-saving');
      }, 1000);
    }
  },
  
  /**
   * Setup automatic form saving
   */
  setupFormAutoSave() {
    const form = document.getElementById('agreement-form');
    if (!form) return;
    
    // Save on input change with debouncing
    let saveTimeout;
    const debouncedSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveFormProgress(), 1000);
    };
    
    form.addEventListener('input', debouncedSave);
    form.addEventListener('change', debouncedSave);
  },
  
  /**
   * Enhance buttons with smooth transitions
   */
  enhanceButtons() {
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
      if (!button.classList.contains('modal-close')) {
        button.classList.add('btn-enhanced');
      }
    });
  },
  
  /**
   * Enhance form fields with smooth focus effects
   */
  enhanceFormFields() {
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.classList.add('form-field-enhanced');
    });
  },
  
  /**
   * Add smooth scroll to element
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },
  
  /**
   * Animate element entrance
   */
  animateIn(element, animation = 'fade-in') {
    if (!element) return;
    
    element.classList.add(animation);
    
    // Clean up animation class after completion
    setTimeout(() => {
      element.classList.remove(animation);
    }, 500);
  }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  UIEnhancements.init();
});

// Expose for debugging
if (window) {
  window.UIEnhancements = UIEnhancements;
}

console.log('UI Enhancements module loaded');