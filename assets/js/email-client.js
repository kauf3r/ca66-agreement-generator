/**
 * Email Client Module
 * CA-66 Airport Agreement Generator - Frontend Email Integration
 * 
 * Handles sending generated agreements via email through Vercel serverless function
 */

class EmailClient {
    constructor() {
        this.apiEndpoint = '/api/send-email';
        this.maxRetries = 3;
        this.retryDelay = 1000; // Start with 1 second
    }

    /**
     * Send agreement via email
     * @param {Object} emailData - Email data object
     * @param {string} emailData.recipientEmail - Recipient's email address
     * @param {string} emailData.recipientName - Recipient's name
     * @param {Object} emailData.agreementData - Agreement form data
     * @param {string|ArrayBuffer} emailData.pdfBuffer - PDF data (optional)
     * @param {boolean} emailData.includeAttachment - Whether to include PDF attachment
     * @returns {Promise<Object>} Result object with success status and message
     */
    async sendAgreementEmail(emailData) {
        try {
            // Validate required fields
            this._validateEmailData(emailData);

            // Show loading state
            this._showLoadingState('Sending email...');

            // Convert PDF buffer to base64 if provided
            let pdfBase64 = null;
            if (emailData.pdfBuffer && emailData.includeAttachment !== false) {
                console.log('📎 Converting PDF buffer to base64, input type:', typeof emailData.pdfBuffer, 'size:', emailData.pdfBuffer?.length);
                pdfBase64 = await this._convertPdfToBase64(emailData.pdfBuffer);
                console.log('✅ PDF converted to base64, output size:', pdfBase64?.length, 'characters');
            } else if (emailData.includeAttachment !== false) {
                console.warn('⚠️ PDF attachment requested but no PDF buffer provided');
            } else {
                console.log('📧 Sending email without PDF attachment as requested');
            }

            // Prepare request payload
            const payload = {
                recipientEmail: emailData.recipientEmail,
                recipientName: emailData.recipientName,
                agreementData: emailData.agreementData,
                pdfBuffer: pdfBase64,
                includeAttachment: emailData.includeAttachment !== false
            };

            // Send email with retry logic
            const result = await this._sendWithRetry(payload);

            // Show success message with CC confirmation
            this._showSuccessMessage(
                `Agreement sent successfully to ${emailData.recipientEmail}!\n\n` +
                `✅ A copy was also sent to kaufman@airspaceintegration.com for records.`, 
                result
            );

            return {
                success: true,
                messageId: result.messageId,
                message: result.message
            };

        } catch (error) {
            console.error('Email sending failed:', error);
            
            // Show error message
            this._showErrorMessage(error.message || 'Failed to send email');

            return {
                success: false,
                error: error.message || 'Failed to send email'
            };
        } finally {
            // Hide loading state
            this._hideLoadingState();
        }
    }

    /**
     * Send email with retry logic
     * @private
     */
    async _sendWithRetry(payload, attempt = 1) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Email sending failed');
            }

            return result;

        } catch (error) {
            console.error(`Email attempt ${attempt} failed:`, error.message);

            // Don't retry on client errors (4xx) or if max attempts reached
            if (attempt >= this.maxRetries || this._isClientError(error)) {
                throw error;
            }

            // Wait before retry with exponential backoff
            const delay = this.retryDelay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delay}ms...`);
            
            await this._sleep(delay);
            return this._sendWithRetry(payload, attempt + 1);
        }
    }

    /**
     * Validate email data
     * @private
     */
    _validateEmailData(emailData) {
        const { recipientEmail, recipientName, agreementData } = emailData;

        if (!recipientEmail) {
            throw new Error('Recipient email is required');
        }

        if (!recipientName) {
            throw new Error('Recipient name is required');
        }

        if (!agreementData) {
            throw new Error('Agreement data is required');
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
            throw new Error('Please enter a valid email address');
        }
    }

    /**
     * Convert PDF buffer to base64 string
     * @private
     */
    async _convertPdfToBase64(pdfBuffer) {
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Empty or null PDF buffer provided for conversion');
        }

        console.log('🔄 Converting PDF to base64 - Input type:', typeof pdfBuffer, 'Size:', pdfBuffer.length, 'bytes');

        try {
            // If it's already a string (base64), validate and return
            if (typeof pdfBuffer === 'string') {
                if (pdfBuffer.length < 1000) {
                    throw new Error('Base64 string appears too short to be a valid PDF');
                }
                console.log('✅ PDF is already base64 string, size:', pdfBuffer.length, 'characters');
                return pdfBuffer;
            }

            let bytes;
            
            // If it's an ArrayBuffer or Uint8Array, convert to base64
            if (pdfBuffer instanceof ArrayBuffer || pdfBuffer instanceof Uint8Array) {
                bytes = new Uint8Array(pdfBuffer);
            }
            // If it's a Blob, read as ArrayBuffer first
            else if (pdfBuffer instanceof Blob) {
                const arrayBuffer = await pdfBuffer.arrayBuffer();
                bytes = new Uint8Array(arrayBuffer);
            }
            else {
                throw new Error(`Unsupported PDF buffer format: ${typeof pdfBuffer}`);
            }

            // Validate PDF size
            if (bytes.byteLength < 10000) {
                throw new Error(`PDF buffer too small (${bytes.byteLength} bytes) - likely invalid`);
            }
            
            if (bytes.byteLength > 25 * 1024 * 1024) { // 25MB Gmail limit
                throw new Error(`PDF buffer too large (${bytes.byteLength} bytes) - exceeds Gmail limit`);
            }

            // Convert to binary string
            let binary = '';
            const chunkSize = 8192; // Process in chunks to avoid call stack issues
            
            for (let i = 0; i < bytes.byteLength; i += chunkSize) {
                const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.byteLength));
                binary += String.fromCharCode.apply(null, chunk);
            }
            
            // Convert to base64
            const base64 = btoa(binary);
            
            console.log('✅ PDF base64 conversion complete - Output size:', base64.length, 'characters');
            console.log('📊 Compression ratio:', ((base64.length / bytes.byteLength) * 100).toFixed(1) + '%');
            
            return base64;
            
        } catch (error) {
            console.error('❌ Failed to convert PDF to base64:', error);
            throw new Error('PDF conversion failed: ' + error.message);
        }
    }

    /**
     * Check if error is a client error (4xx)
     * @private
     */
    _isClientError(error) {
        return error.message.includes('HTTP 4') || 
               error.message.includes('400') || 
               error.message.includes('401') || 
               error.message.includes('403') || 
               error.message.includes('404');
    }

    /**
     * Sleep utility for retry delays
     * @private
     */
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show loading state
     * @private
     */
    _showLoadingState(message = 'Sending email...') {
        // Create or update loading indicator
        let loadingElement = document.getElementById('email-loading');
        
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'email-loading';
            loadingElement.className = 'email-loading-overlay';
            loadingElement.innerHTML = `
                <div class="email-loading-content">
                    <div class="loading-spinner"></div>
                    <p class="loading-message">${message}</p>
                </div>
            `;
            document.body.appendChild(loadingElement);
        } else {
            const messageElement = loadingElement.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
        }

        loadingElement.style.display = 'flex';
    }

    /**
     * Hide loading state
     * @private
     */
    _hideLoadingState() {
        const loadingElement = document.getElementById('email-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    /**
     * Show success message
     * @private
     */
    _showSuccessMessage(message, result) {
        this._showNotification(message, 'success');
        console.log('Email sent successfully:', result);
    }

    /**
     * Show error message
     * @private
     */
    _showErrorMessage(message) {
        this._showNotification(message, 'error');
    }

    /**
     * Show notification message
     * @private
     */
    _showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.email-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `email-notification email-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification with animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-hide after delay (except for errors)
        if (type !== 'error') {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }
            }, 5000);
        }
    }
}

// CSS styles for email client UI components
const emailClientStyles = `
    .email-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }

    .email-loading-content {
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 300px;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #3182ce;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-message {
        color: #4a5568;
        font-size: 16px;
        font-weight: 500;
        margin: 0;
    }

    .email-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        transform: translateX(450px);
        transition: transform 0.3s ease;
        border-left: 4px solid;
    }

    .email-notification.show {
        transform: translateX(0);
    }

    .email-notification-success {
        border-left-color: #48bb78;
    }

    .email-notification-error {
        border-left-color: #f56565;
    }

    .email-notification-info {
        border-left-color: #3182ce;
    }

    .notification-content {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-icon {
        font-size: 18px;
        font-weight: bold;
        flex-shrink: 0;
    }

    .email-notification-success .notification-icon {
        color: #48bb78;
    }

    .email-notification-error .notification-icon {
        color: #f56565;
    }

    .email-notification-info .notification-icon {
        color: #3182ce;
    }

    .notification-message {
        flex: 1;
        color: #4a5568;
        font-size: 14px;
        line-height: 1.4;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        color: #a0aec0;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        flex-shrink: 0;
    }

    .notification-close:hover {
        background: #edf2f7;
        color: #4a5568;
    }

    /* Mobile responsiveness */
    @media (max-width: 480px) {
        .email-notification {
            left: 10px;
            right: 10px;
            max-width: none;
            transform: translateY(-100px);
        }

        .email-notification.show {
            transform: translateY(0);
        }
    }
`;

// Add styles to document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = emailClientStyles;
    document.head.appendChild(styleSheet);
}

// Export EmailClient class
export { EmailClient };