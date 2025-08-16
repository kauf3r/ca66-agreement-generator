# Gmail SMTP Setup Guide

## Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate App Password
1. In Google Account settings, go to "Security"
2. Find "2-Step Verification" and click "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter a name like "Airport Agreement System"
5. Click "Generate"
6. **Copy the 16-character app password** (you won't see it again!)

## Step 3: Environment Variables Setup

### Local Development (.env.local)
```bash
# Gmail SMTP Configuration
GMAIL_USER=your-actual-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### Production (Vercel)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:
   - `GMAIL_USER`: your-actual-gmail@gmail.com
   - `GMAIL_APP_PASSWORD`: your-16-character-app-password
5. **Important**: Set environment to "Production" for both variables
6. Redeploy your application

## Step 4: Security Best Practices
- ✅ Use App Password (not your regular Gmail password)
- ✅ App passwords are 16 characters long (no spaces)
- ✅ Each app password is unique and can be revoked
- ✅ 2-Factor Authentication must be enabled
- ✅ Never commit credentials to version control
- ✅ Use different app passwords for development and production

## Step 5: Test the Setup
The email service is now configured to use Gmail SMTP instead of Resend.

## Troubleshooting Production Issues

### "Username and Password not accepted" Error
This error occurs when:
1. **App password is incorrect or expired**
2. **Environment variables not set in Vercel**
3. **2FA settings changed**
4. **Google security policies blocked the connection**

#### Fix Steps:
1. **Check Vercel Environment Variables**:
   ```bash
   # In Vercel dashboard, verify these are set:
   GMAIL_USER=your-actual-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

2. **Generate New App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Revoke old app passwords
   - Generate a new one for "Airport Agreement System"
   - Update Vercel environment variable

3. **Check Google Account Security**:
   - Ensure 2FA is still enabled
   - Check for any security alerts
   - Verify account hasn't been locked

4. **Test Connection**:
   ```bash
   # Run this locally to test credentials
   node test-gmail-auth.cjs
   ```

### Environment Variable Debugging
Add this to your API function to debug:
```javascript
console.log('Environment check:', {
    hasGmailUser: !!process.env.GMAIL_USER,
    hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
    gmailUserLength: process.env.GMAIL_USER?.length || 0,
    gmailPasswordLength: process.env.GMAIL_APP_PASSWORD?.length || 0
});
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Invalid login" | Wrong app password | Generate new app password |
| "Less secure app" | Using regular password | Use app password only |
| "2FA required" | 2FA not enabled | Enable 2-Step Verification |
| "Connection timeout" | Network/firewall | Check Vercel deployment region |
| "Rate limit exceeded" | Too many requests | Implement retry logic |

## Usage
```typescript
import { sendAgreementNotification } from './src/lib/email';

await sendAgreementNotification(
  'client@example.com',
  {
    recipientName: 'John Doe',
    agreementType: 'Standard Hangar License',
    agreementNumber: 'CA66-2024-001',
    effectiveDate: '2024-01-01',
    expirationDate: '2024-12-31'
  },
  pdfBuffer
);
```

## Security Notes
- ✅ Use App Password (not your regular Gmail password)
- ✅ App passwords are 16 characters long
- ✅ Each app password is unique and can be revoked
- ✅ 2-Factor Authentication must be enabled
- ✅ Never log credentials in production
- ✅ Rotate app passwords regularly
- ✅ Use different passwords for dev/prod environments
