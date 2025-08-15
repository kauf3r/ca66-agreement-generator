# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CA-66 Airport Use Agreement Generator** - A single-page web application that generates legal usage license agreements for Monterey Bay Academy Airport. Built for AirSpace Integration, Inc. to streamline pilot onboarding while ensuring strict safety, insurance, and operational compliance.

## Architecture

**Technology Stack:**
- Vanilla JavaScript (ES6+ with modules) - zero dependencies for security
- HTML5 + CSS3 (Grid & Flexbox) - no frameworks
- PDF-lib for client-side PDF generation
- Gmail SMTP via Vercel serverless functions for email delivery
- Deployment: Vercel with automatic HTTPS

**Email System (Added August 2025):**
- Automated email delivery after PDF generation
- Gmail SMTP integration with proper authentication
- Automatic CC to kaufman@airspaceintegration.com for all agreements
- PDF attachment with complete 9-page legal agreement (316KB template)
- Comprehensive error handling and user feedback

**Core Components:**
```javascript
const FormValidator = {
  validateEmail: (email) => { /* ... */ },
  validatePilotHours: (hours) => { /* min 300 required */ },
  validateInsurance: (coverage) => { /* min $1M required */ }
};

const PDFLibGenerator = {
  generateFilledPDF: (formData) => { /* generates complete PDF with user data */ },
  templatePath: 'assets/examples/CA66_Agreement_Template.pdf', // 316KB full agreement
  previewPDF: (pdfBytes) => { /* opens PDF in new tab */ }
};

const EmailClient = {
  sendAgreementEmail: (emailData) => { /* sends via Gmail SMTP with CC */ },
  convertPdfToBase64: (pdfBuffer) => { /* prepares PDF for email */ }
};

// Automated Workflow (August 2025)
const AutomatedWorkflow = {
  generatePDFAgreement: async () => {
    // 1. Generate complete 9-page PDF
    // 2. Open PDF preview in new tab
    // 3. Automatically email to user + CC kaufman@airspaceintegration.com
    // 4. Show success confirmation
  }
};
```

[... rest of existing content remains the same ...]

## Memories

- **July 29, 2025**: **v1.0 Release** - Complete CA-66 Agreement Generator with fillable PDF system production-ready
- **July 30, 2025**: Created comprehensive development roadmap for future document management features
- **August 1, 2025**: Git pushed
- **August 14, 2025**: **UI/UX Polish Update**
  - Removed Company Name field from form (not used in final agreement)
  - Fixed checkbox hover effects to eliminate text movement
  - Shortened Required Acknowledgments text for single-line display
  - Updated logo file references to kebab-case naming convention
  - Enhanced form visual stability and user experience
- Email functional - secrets removed