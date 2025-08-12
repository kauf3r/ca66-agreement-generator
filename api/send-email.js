/**
 * Vercel Serverless Function for Email Integration
 * CA-66 Airport Agreement Generator - Email Service
 * 
 * This function handles sending generated agreements via email using Resend API
 */

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration - Using Resend's test domain for development
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'support@airspaceintegration.com';

module.exports = async function handler(req, res) {
    // Detailed logging for debugging
    console.log('Email function called:', {
        method: req.method,
        hasResendKey: !!process.env.RESEND_API_KEY,
        fromEmail: FROM_EMAIL,
        timestamp: new Date().toISOString()
    });

    // Set CORS headers for frontend integration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed. Use POST.' 
        });
    }

    try {
        // Check if Resend API key is available
        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY not found in environment variables');
            return res.status(500).json({
                success: false,
                error: 'Email service not configured properly'
            });
        }
        const { 
            recipientEmail, 
            recipientName, 
            agreementData,
            pdfBuffer, // Base64 encoded PDF
            includeAttachment = true 
        } = req.body;

        console.log('Request data received:', {
            recipientEmail,
            recipientName,
            hasAgreementData: !!agreementData,
            hasPdfBuffer: !!pdfBuffer,
            includeAttachment
        });

        // Input validation
        if (!recipientEmail || !recipientName || !agreementData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: recipientEmail, recipientName, or agreementData'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(recipientEmail)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address format'
            });
        }

        // Prepare email content
        const subject = `CA-66 Airport Usage License Agreement - ${agreementData.licensee || recipientName}`;
        
        // HTML email template
        const htmlContent = generateEmailTemplate(recipientName, agreementData);
        
        // Plain text fallback
        const textContent = generateTextEmail(recipientName, agreementData);

        // Email options
        const emailOptions = {
            from: FROM_EMAIL,
            to: recipientEmail,
            replyTo: REPLY_TO_EMAIL,
            subject: subject,
            html: htmlContent,
            text: textContent,
        };

        // Add PDF attachment if provided and requested
        if (includeAttachment && pdfBuffer) {
            try {
                const pdfData = Buffer.from(pdfBuffer, 'base64');
                emailOptions.attachments = [{
                    filename: `CA66_Agreement_${agreementData.licensee?.replace(/\s+/g, '_') || 'Agreement'}.pdf`,
                    content: pdfData,
                    type: 'application/pdf'
                }];
            } catch (pdfError) {
                console.error('PDF attachment error:', pdfError);
                // Continue without attachment rather than failing
            }
        }

        // Send email with retry logic
        const result = await sendEmailWithRetry(emailOptions, 3);

        return res.status(200).json({
            success: true,
            messageId: result.data?.id,
            message: 'Agreement sent successfully via email'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        
        // Return appropriate error response
        const statusCode = error.statusCode || 500;
        const errorMessage = error.message || 'Failed to send email';

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

/**
 * Send email with retry logic
 */
async function sendEmailWithRetry(emailOptions, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Email attempt ${attempt}/${maxRetries}`);
            const result = await resend.emails.send(emailOptions);
            console.log('Email sent successfully:', result.data?.id);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`Email attempt ${attempt} failed:`, error.message);
            
            // Don't retry on client errors (4xx)
            if (error.statusCode >= 400 && error.statusCode < 500) {
                break;
            }
            
            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(recipientName, agreementData) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CA-66 Airport Usage License Agreement</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #2c5282 0%, #3182ce 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .agreement-details {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3182ce;
        }
        .detail-row {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
        }
        .detail-label {
            font-weight: 600;
            color: #2d3748;
        }
        .detail-value {
            color: #4a5568;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #edf2f7;
            border-radius: 8px;
            font-size: 14px;
            color: #718096;
        }
        .button {
            display: inline-block;
            background: #3182ce;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">✈️ AirSpace Integration</div>
        <h1>CA-66 Airport Usage License Agreement</h1>
        <p>Monterey Bay Academy Airport</p>
    </div>
    
    <div class="content">
        <div class="greeting">
            Dear ${recipientName},
        </div>
        
        <p>Your CA-66 Airport Usage License Agreement has been generated and is ready for your review. This agreement grants you access to the Monterey Bay Academy Airport under the terms and conditions specified.</p>
        
        <div class="agreement-details">
            <h3>Agreement Details</h3>
            <div class="detail-row">
                <span class="detail-label">Licensee:</span>
                <span class="detail-value">${agreementData.licensee || recipientName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Aircraft:</span>
                <span class="detail-value">${agreementData.aircraft || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Agreement Start:</span>
                <span class="detail-value">${agreementData.startDate || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Agreement End:</span>
                <span class="detail-value">${agreementData.endDate || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Annual Fee:</span>
                <span class="detail-value">$250.00</span>
            </div>
        </div>
        
        <h3>Next Steps:</h3>
        <ol>
            <li><strong>Review the Agreement:</strong> Please carefully review all terms and conditions</li>
            <li><strong>Sign and Date:</strong> Print, sign, and date the agreement</li>
            <li><strong>Submit Documentation:</strong> Return the signed agreement with required insurance certificates</li>
            <li><strong>Payment:</strong> Submit the annual license fee of $250.00</li>
        </ol>
        
        <p><strong>Important Reminders:</strong></p>
        <ul>
            <li>Minimum 300 flight hours required</li>
            <li>$1,000,000 minimum insurance coverage</li>
            <li>Single engine reciprocating aircraft only (MTOW < 12,500 lbs)</li>
            <li>No Saturday operations (Sabbath observance)</li>
        </ul>
        
        <p>If you have any questions about this agreement or the airport usage requirements, please don't hesitate to contact us.</p>
        
        <p>Welcome to the Monterey Bay Academy Airport community!</p>
        
        <p>Best regards,<br>
        <strong>AirSpace Integration, Inc.</strong><br>
        Airport Operations Team</p>
    </div>
    
    <div class="footer">
        <p>This email was generated automatically by the CA-66 Agreement System.</p>
        <p>For support, please contact: support@airspaceintegration.com</p>
        <p>© 2025 AirSpace Integration, Inc. All rights reserved.</p>
    </div>
</body>
</html>
    `;
}

/**
 * Generate plain text email
 */
function generateTextEmail(recipientName, agreementData) {
    return `
CA-66 Airport Usage License Agreement
Monterey Bay Academy Airport

Dear ${recipientName},

Your CA-66 Airport Usage License Agreement has been generated and is ready for your review.

AGREEMENT DETAILS:
- Licensee: ${agreementData.licensee || recipientName}
- Aircraft: ${agreementData.aircraft || 'N/A'}
- Start Date: ${agreementData.startDate || 'N/A'}
- End Date: ${agreementData.endDate || 'N/A'}
- Annual Fee: $250.00

NEXT STEPS:
1. Review the Agreement: Please carefully review all terms and conditions
2. Sign and Date: Print, sign, and date the agreement
3. Submit Documentation: Return the signed agreement with required insurance certificates
4. Payment: Submit the annual license fee of $250.00

IMPORTANT REMINDERS:
- Minimum 300 flight hours required
- $1,000,000 minimum insurance coverage
- Single engine reciprocating aircraft only (MTOW < 12,500 lbs)
- No Saturday operations (Sabbath observance)

If you have any questions, please contact us at support@airspaceintegration.com.

Welcome to the Monterey Bay Academy Airport community!

Best regards,
AirSpace Integration, Inc.
Airport Operations Team

---
This email was generated automatically by the CA-66 Agreement System.
For support: support@airspaceintegration.com
© 2025 AirSpace Integration, Inc. All rights reserved.
    `.trim();
}