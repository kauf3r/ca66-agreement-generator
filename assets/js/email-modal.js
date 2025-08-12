/**
 * Email Modal Component
 * CA-66 Airport Agreement Generator - Email Modal UI
 * 
 * Professional modal interface for sending agreements via email
 */

export class EmailModal {
    constructor() {
        this.modal = document.getElementById('email-modal');
        this.form = document.getElementById('email-form');
        this.recipientEmailField = document.getElementById('email-recipient');
        this.recipientNameField = document.getElementById('email-recipient-name');
        this.includePdfCheckbox = document.getElementById('include-pdf-attachment');
        this.subjectPreview = document.getElementById('email-subject-preview');
        this.sendButton = document.getElementById('send-email');
        this.cancelButton = document.getElementById('cancel-email');
        this.closeButton = document.querySelector('.modal-close');
        
        this.onSendCallback = null;
        this.agreementData = null;
        
        this.init();
    }

    /**
     * Initialize modal event listeners
     */
    init() {
        if (!this.modal) {
            console.error('Email modal not found in DOM');
            return;
        }

        // Close modal events
        this.cancelButton?.addEventListener('click', () => this.hide());
        this.closeButton?.addEventListener('click', () => this.hide());
        
        // Close on overlay click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.getAttribute('aria-hidden')) {
                this.hide();
            }
        });
        
        // Send button click
        this.sendButton?.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSend();
        });
        
        // Form submission
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSend();
        });
        
        // Real-time validation
        this.recipientEmailField?.addEventListener('input', () => this.validateForm());
        this.recipientNameField?.addEventListener('input', () => this.validateForm());
        
        // Update preview when recipient name changes
        this.recipientNameField?.addEventListener('input', () => this.updatePreview());
        
        console.log('✅ Email modal initialized');
    }

    /**
     * Show modal with form data
     */
    show(defaultEmail = '', defaultName = '', agreementData = null, onSendCallback = null) {
        if (!this.modal) return;

        // Store callback and agreement data
        this.onSendCallback = onSendCallback;
        this.agreementData = agreementData;
        
        // Populate form fields
        if (this.recipientEmailField) {
            this.recipientEmailField.value = defaultEmail;
        }
        
        if (this.recipientNameField) {
            this.recipientNameField.value = defaultName;
        }
        
        // Reset PDF attachment checkbox to checked
        if (this.includePdfCheckbox) {
            this.includePdfCheckbox.checked = true;
        }
        
        // Update preview
        this.updatePreview();
        
        // Validate form
        this.validateForm();
        
        // Show modal
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.style.display = 'flex';
        
        // Focus on email field if empty, otherwise name field
        setTimeout(() => {
            if (!defaultEmail && this.recipientEmailField) {
                this.recipientEmailField.focus();
            } else if (this.recipientNameField) {
                this.recipientNameField.focus();
            }
        }, 100);
        
        // Add body scroll lock
        document.body.style.overflow = 'hidden';
        
        console.log('📧 Email modal opened');
    }

    /**
     * Hide modal
     */
    hide() {
        if (!this.modal) return;

        this.modal.setAttribute('aria-hidden', 'true');
        this.modal.style.display = 'none';
        
        // Remove body scroll lock
        document.body.style.overflow = '';
        
        // Clear form
        if (this.form) {
            this.form.reset();
        }
        
        // Clear callbacks
        this.onSendCallback = null;
        this.agreementData = null;
        
        console.log('📧 Email modal closed');
    }

    /**
     * Validate form and update send button state
     */
    validateForm() {
        if (!this.sendButton) return;

        const email = this.recipientEmailField?.value.trim() || '';
        const name = this.recipientNameField?.value.trim() || '';
        
        const isValidEmail = this.isValidEmail(email);
        const isValidName = name.length > 0;
        
        const isValid = isValidEmail && isValidName;
        
        this.sendButton.disabled = !isValid;
        this.sendButton.textContent = isValid ? '📧 Send Agreement' : '📧 Complete Form to Send';
        
        // Update field validation states
        this.updateFieldValidation(this.recipientEmailField, isValidEmail && email.length > 0);
        this.updateFieldValidation(this.recipientNameField, isValidName);
        
        return isValid;
    }

    /**
     * Update field validation visual state
     */
    updateFieldValidation(field, isValid) {
        if (!field) return;

        field.classList.remove('valid', 'invalid');
        
        if (field.value.trim()) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Update email preview
     */
    updatePreview() {
        if (!this.subjectPreview) return;

        const recipientName = this.recipientNameField?.value.trim() || '';
        let subject = 'CA-66 Airport Usage License Agreement';
        
        if (recipientName && this.agreementData?.licensee) {
            subject = `CA-66 Airport Usage License Agreement - ${this.agreementData.licensee}`;
        } else if (recipientName) {
            subject = `CA-66 Airport Usage License Agreement - ${recipientName}`;
        }
        
        this.subjectPreview.textContent = subject;
    }

    /**
     * Handle send button click
     */
    async handleSend() {
        if (!this.validateForm()) {
            return;
        }

        if (!this.onSendCallback) {
            console.error('No send callback provided');
            return;
        }

        const formData = this.getFormData();
        
        try {
            // Disable send button and show loading state
            this.setSendingState(true);
            
            // Call the callback with form data
            await this.onSendCallback(formData);
            
            // Close modal on success (callback handles success/error notifications)
            this.hide();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            // Keep modal open on error so user can retry
        } finally {
            this.setSendingState(false);
        }
    }

    /**
     * Get form data
     */
    getFormData() {
        return {
            email: this.recipientEmailField?.value.trim() || '',
            name: this.recipientNameField?.value.trim() || '',
            includePdf: this.includePdfCheckbox?.checked !== false
        };
    }

    /**
     * Set sending state (loading)
     */
    setSendingState(sending) {
        if (!this.sendButton) return;

        if (sending) {
            this.sendButton.disabled = true;
            this.sendButton.innerHTML = '⏳ Sending...';
            this.sendButton.classList.add('loading');
        } else {
            this.sendButton.disabled = false;
            this.sendButton.innerHTML = '📧 Send Agreement';
            this.sendButton.classList.remove('loading');
            this.validateForm(); // Re-validate to set proper state
        }
    }

    /**
     * Show error in modal
     */
    showError(message) {
        // Remove existing error
        const existingError = this.modal?.querySelector('.modal-error');
        if (existingError) {
            existingError.remove();
        }

        // Create error element
        const errorElement = document.createElement('div');
        errorElement.className = 'modal-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button type="button" class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Insert at top of modal body
        const modalBody = this.modal?.querySelector('.modal-body');
        if (modalBody) {
            modalBody.insertBefore(errorElement, modalBody.firstChild);
        }

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 10000);
    }
}

// CSS styles for email modal components
const emailModalStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(2px);
    }

    .modal-container {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease-out;
    }

    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal-header {
        padding: 24px 24px 0 24px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .modal-header h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #2d3748;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        color: #a0aec0;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-close:hover {
        background: #edf2f7;
        color: #4a5568;
    }

    .modal-body {
        padding: 0 24px 24px 24px;
    }

    .email-form .form-group {
        margin-bottom: 20px;
    }

    .email-form label {
        display: block;
        margin-bottom: 6px;
        font-weight: 600;
        color: #4a5568;
        font-size: 14px;
    }

    .email-form input[type="email"],
    .email-form input[type="text"] {
        width: 100%;
        padding: 12px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 16px;
        transition: border-color 0.2s ease;
    }

    .email-form input:focus {
        outline: none;
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }

    .email-form input.valid {
        border-color: #48bb78;
    }

    .email-form input.invalid {
        border-color: #f56565;
    }

    .form-help {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: #718096;
    }

    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .checkbox-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
    }

    .email-preview {
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        margin-top: 20px;
    }

    .email-preview h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #4a5568;
    }

    .preview-summary p {
        margin: 6px 0;
        font-size: 14px;
        color: #718096;
    }

    .preview-summary strong {
        color: #4a5568;
    }

    .modal-footer {
        padding: 0 24px 24px 24px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        border-top: 1px solid #e2e8f0;
        padding-top: 20px;
        margin-top: 20px;
    }

    .modal-error {
        background: #fed7d7;
        border: 1px solid #feb2b2;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .error-content {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .error-icon {
        flex-shrink: 0;
        font-size: 16px;
    }

    .error-message {
        flex: 1;
        color: #c53030;
        font-size: 14px;
    }

    .error-close {
        background: none;
        border: none;
        color: #c53030;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
    }

    .error-close:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    /* Button styles for modal */
    .btn-success {
        background: #48bb78;
        color: white;
        border: 2px solid #48bb78;
    }

    .btn-success:hover:not(:disabled) {
        background: #38a169;
        border-color: #38a169;
    }

    .btn-success:disabled {
        background: #a0aec0;
        border-color: #a0aec0;
        cursor: not-allowed;
    }

    .btn.loading {
        opacity: 0.7;
        cursor: wait;
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
        .modal-container {
            width: 95%;
            max-height: 95vh;
        }

        .modal-header,
        .modal-body,
        .modal-footer {
            padding-left: 16px;
            padding-right: 16px;
        }

        .modal-footer {
            flex-direction: column;
        }

        .modal-footer .btn {
            width: 100%;
        }
    }
`;

// Add styles to document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = emailModalStyles;
    document.head.appendChild(styleSheet);
}

// Create global instance
let emailModalInstance = null;

// Initialize modal when DOM is ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            emailModalInstance = new EmailModal();
        });
    } else {
        emailModalInstance = new EmailModal();
    }
}

export { emailModalInstance };