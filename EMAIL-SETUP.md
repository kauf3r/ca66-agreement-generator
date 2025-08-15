# Email System Setup Guide

This guide explains how to configure the Gmail SMTP email system for the CA-66 Agreement Generator.

## Overview

The application automatically sends generated agreements via email with PDF attachments using Gmail SMTP. Each email includes:
- Professional HTML email template
- Complete 9-page CA-66 agreement as PDF attachment
- Automatic CC to kaufman@airspaceintegration.com for records

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### 2. Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Generate a 16-character app password
4. Save this password securely

### 3. Configure Environment Variables

**For Local Development:**
Create or update `.env.local` file:
```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NODE_ENV=development
```

**For Production (Vercel):**
Set environment variables in Vercel dashboard:
- `GMAIL_USER`: Your Gmail address
- `GMAIL_APP_PASSWORD`: Your 16-character app password

## Development Server Setup

### Option 1: Using Startup Script (Recommended)
```bash
./start-dev.sh
```
This script automatically loads environment variables from `.env.local` and starts Vercel dev.

### Option 2: Manual Setup
```bash
# Load environment variables and start server
source .env.local && vercel dev --listen 3003
```

### Option 3: Explicit Environment Variables
```bash
GMAIL_USER=your-email@gmail.com GMAIL_APP_PASSWORD=your-app-password vercel dev --listen 3003
```

## Testing Email Functionality

### Test Gmail Authentication
```bash
node test-gmail-auth.cjs
```
This will verify your Gmail credentials and send a test email.

### Test API Endpoint
```bash
curl -X POST http://localhost:3003/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "test@example.com",
    "recipientName": "Test User",
    "agreementData": {
      "licensee": "Test Pilot",
      "aircraft": "N123 - Cessna 172",
      "startDate": "2025-08-15",
      "endDate": "2026-08-15"
    },
    "includeAttachment": false
  }'
```

## Email Flow

### Automatic Email (Form Submission)
1. User fills out agreement form
2. Clicks "Generate PDF Agreement"
3. PDF is generated (291KB agreement)
4. PDF opens in new tab for preview
5. Email is automatically sent with PDF attachment

### Email Recipients
- **TO**: User's email address (from form)
- **CC**: kaufman@airspaceintegration.com (automatic)
- **FROM**: AirSpace Integration <your-gmail@gmail.com>

### Email Content
- **With PDF Attachment**: Green notification box indicating PDF is attached
- **Without PDF Attachment**: Yellow notification box for reference only
- Complete agreement details in HTML format
- Professional styling with AirSpace Integration branding

## File Structure

```
/api/send-email.cjs          # Gmail SMTP serverless function
/assets/js/email-client.js   # Frontend email client
/start-dev.sh               # Development startup script
/test-gmail-auth.cjs        # Gmail authentication test
/.env                       # Template values (tracked by git)
/.env.local                 # Real credentials (gitignored)
```

## Security Notes

- ✅ `.env` file contains only placeholder values and is tracked by git
- ✅ `.env.local` contains real credentials and is gitignored
- ✅ Real credentials are never committed to the repository
- ✅ App passwords are used instead of account passwords
- ✅ All emails automatically CC kaufman@airspaceintegration.com

## Troubleshooting

### "Invalid login" Error
1. Verify 2-factor authentication is enabled
2. Generate a new app password
3. Update environment variables
4. Restart development server

### "PDF attachment missing"
1. Check that `includeAttachment: true` is set
2. Verify PDF buffer is properly generated
3. Ensure PDF is valid (should be ~291KB for agreements)

### "Environment variables not loaded"
1. Use the startup script: `./start-dev.sh`
2. Verify `.env.local` file exists and has correct format
3. Check that Vercel dev server restarted after changes

## Production Deployment

1. Set environment variables in Vercel dashboard
2. Deploy application
3. Test email functionality with production URLs
4. Verify automatic CC to kaufman@airspaceintegration.com works

For support, contact the development team or refer to the main project documentation.