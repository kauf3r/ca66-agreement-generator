// Main Application - Milestone 1 Setup
import { AppConfig } from './config.js';
import { UIManager } from './ui.js';

class AgreementApp {
  constructor() {
    this.config = AppConfig;
    this.formData = {};
    this.init();
  }
  
  init() {
    console.log('CA-66 Agreement Generator - Application starting...');
    console.log('Configuration:', this.config);
    
    // Initialize UI Manager
    UIManager.init();
    
    // Set up form event listeners (basic for Milestone 1)
    this.setupFormListeners();
    
    console.log('CA-66 Agreement Generator - Application initialized for Milestone 1');
  }
  
  setupFormListeners() {
    const form = document.getElementById('agreement-form');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submission prevented - functionality will be implemented in later milestones');
      });
    }
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AgreementApp();
});

console.log('CA-66 Agreement Generator - App module loaded');
