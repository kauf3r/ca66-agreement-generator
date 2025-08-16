/**
 * Vercel Serverless Function for Email Integration
 * CA-66 Airport Agreement Generator - Gmail SMTP Email Service
 * 
 * This function handles sending generated agreements via email using Gmail SMTP
 */

const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
    // Detailed logging for debugging
    console.log('Gmail Email function called:', {
        method: req.method,
        hasGmailUser: !!process.env.GMAIL_USER,
        hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
        gmailUserLength: process.env.GMAIL_USER?.length || 0,
        gmailPasswordLength: process.env.GMAIL_APP_PASSWORD?.length || 0,
        timestamp: new Date().toISOString()
    });

    // Set CORS headers for frontend integration (hardened security)
    const allowedOrigins = [
        'https://ca66-agreement-generator.vercel.app',
        'https://ca66-airport-use-agreement.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3003'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

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
        // Check if Gmail credentials are available
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
            console.error('Gmail credentials not found in environment variables');
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
            pdfBufferLength: pdfBuffer ? pdfBuffer.length : 0,
            includeAttachment
        });

        // Enhanced input validation and sanitization
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

        // Sanitize input strings to prevent injection
        const sanitizeString = (str) => String(str).replace(/[<>'"&]/g, '');
        const sanitizedRecipientName = sanitizeString(recipientName);
        const sanitizedRecipientEmail = sanitizeString(recipientEmail);

        // Validate name length (prevent abuse)
        if (sanitizedRecipientName.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Recipient name too long (max 100 characters)'
            });
        }

        // Create Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        // Verify SMTP connection
        try {
            console.log('🔍 Testing Gmail SMTP connection...');
            await transporter.verify();
            console.log('✅ Gmail SMTP connection verified successfully');
        } catch (smtpError) {
            console.error('❌ Gmail SMTP connection failed:', {
                error: smtpError.message,
                code: smtpError.code,
                responseCode: smtpError.responseCode,
                gmailUser: process.env.GMAIL_USER,
                passwordLength: process.env.GMAIL_APP_PASSWORD?.length
            });
            throw new Error(`Gmail SMTP connection failed: ${smtpError.message}`);
        }

        // Prepare email content (using sanitized values)
        const subject = `CA-66 Airport Usage License Agreement - ${agreementData.licensee || sanitizedRecipientName}`;
        
        // HTML email template
        const htmlContent = generateEmailTemplate(sanitizedRecipientName, agreementData, includeAttachment, pdfBuffer);
        
        // Plain text fallback
        const textContent = generateTextEmail(sanitizedRecipientName, agreementData);

        // Email options with CC to admin
        const adminCC = 'kaufman@airspaceintegration.com';
        const mailOptions = {
            from: `"AirSpace Integration" <${process.env.GMAIL_USER}>`,
            to: sanitizedRecipientEmail,
            cc: adminCC,
            replyTo: process.env.GMAIL_USER,
            subject: subject,
            html: htmlContent,
            text: textContent,
        };

        console.log('📧 Email recipients configured:');
        console.log('   TO:', sanitizedRecipientEmail);
        console.log('   CC:', adminCC);
        console.log('   FROM:', process.env.GMAIL_USER);

        // Add PDF attachment if provided and requested
        if (includeAttachment && pdfBuffer) {
            try {
                console.log('🔄 Processing PDF attachment, base64 length:', pdfBuffer.length);
                
                // Validate base64 format
                if (typeof pdfBuffer !== 'string') {
                    throw new Error('PDF buffer must be base64 string');
                }
                
                if (pdfBuffer.length < 13000) { // ~10KB base64 encoded
                    throw new Error(`PDF base64 too small (${pdfBuffer.length} chars) - likely invalid`);
                }
                
                const pdfData = Buffer.from(pdfBuffer, 'base64');
                console.log('📄 PDF buffer converted, size:', pdfData.length, 'bytes');
                
                // Validate decoded PDF size
                if (pdfData.length < 10000) {
                    throw new Error(`PDF too small (${pdfData.length} bytes) - appears corrupted`);
                }
                
                if (pdfData.length > 25 * 1024 * 1024) { // 25MB Gmail limit
                    throw new Error(`PDF too large (${pdfData.length} bytes) - exceeds Gmail limit`);
                }
                
                // Validate PDF header (should start with %PDF)
                const pdfHeader = pdfData.subarray(0, 4).toString();
                if (pdfHeader !== '%PDF') {
                    throw new Error(`Invalid PDF format - header: ${pdfHeader}`);
                }
                
                const timestamp = new Date().toISOString().slice(0, 10);
                const filename = `CA66_Agreement_${agreementData.licensee?.replace(/\s+/g, '_') || 'Agreement'}_${timestamp}.pdf`;
                
                mailOptions.attachments = [{
                    filename: filename,
                    content: pdfData,
                    contentType: 'application/pdf'
                }];
                
                console.log('✅ PDF attachment validated and added to email:');
                console.log('   Filename:', filename);
                console.log('   Size:', pdfData.length, 'bytes');
                console.log('   Recipients: TO =', sanitizedRecipientEmail, '| CC =', adminCC);
                
            } catch (pdfError) {
                console.error('❌ PDF attachment validation failed:', pdfError.message);
                throw new Error(`Failed to attach PDF: ${pdfError.message}`);
            }
        } else if (includeAttachment) {
            throw new Error('PDF attachment requested but no PDF buffer provided to server');
        } else {
            console.log('📧 Email configured to send without PDF attachment (includeAttachment=false)');
        }

        // Send email with retry logic
        const result = await sendEmailWithRetry(transporter, mailOptions, 3);

        return res.status(200).json({
            success: true,
            messageId: result.messageId,
            message: 'Agreement sent successfully via Gmail'
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
};

/**
 * Send email with retry logic
 */
async function sendEmailWithRetry(transporter, mailOptions, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Email attempt ${attempt}/${maxRetries}`);
            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`Email attempt ${attempt} failed:`, error.message);
            
            // Don't retry on authentication errors (4xx)
            if (error.responseCode >= 400 && error.responseCode < 500) {
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
function generateEmailTemplate(recipientName, agreementData, includeAttachment = false, pdfBuffer = null) {
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
        .logo {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        @media (max-width: 600px) {
            .detail-row {
                flex-direction: column;
            }
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
        
        <p>Your CA-66 Airport Usage License Agreement has been generated and is ready for your review.</p>
        
        ${includeAttachment && pdfBuffer ? 
            '<div style="background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;"><strong>📎 PDF Agreement Attached:</strong> Your complete 9-page CA-66 Agreement is attached to this email as a PDF file. Please download and review the attached document.</div>' : 
            '<div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;"><strong>📄 Agreement Reference:</strong> This email contains agreement details for your records. The complete agreement document will be provided separately.</div>'
        }
        
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
            <li><strong>E-signing & Submit Documentation:</strong> We'll prepare and send an email with e-signing, document submission and payment info.</li>
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
        <p>For support, please contact: ${process.env.GMAIL_USER}</p>
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
2. E-signing & Submit Documentation: We'll prepare and send an email with e-signing, document submission and payment info.

IMPORTANT REMINDERS:
- Minimum 300 flight hours required
- $1,000,000 minimum insurance coverage
- Single engine reciprocating aircraft only (MTOW < 12,500 lbs)
- No Saturday operations (Sabbath observance)

If you have any questions, please contact us at ${process.env.GMAIL_USER}.

Welcome to the Monterey Bay Academy Airport community!

Best regards,
AirSpace Integration, Inc.
Airport Operations Team

---
This email was generated automatically by the CA-66 Agreement System.
For support: ${process.env.GMAIL_USER}
© 2025 AirSpace Integration, Inc. All rights reserved.
    `.trim();
}