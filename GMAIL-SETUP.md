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

## Step 3: Update Environment Variables
Edit your `.env.local` file:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-actual-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

## Step 4: Test the Setup
The email service is now configured to use Gmail SMTP instead of Resend.

## Security Notes
- ✅ Use App Password (not your regular Gmail password)
- ✅ App passwords are 16 characters long
- ✅ Each app password is unique and can be revoked
- ✅ 2-Factor Authentication must be enabled

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

## Troubleshooting
- **"Invalid login"**: Check your app password is correct
- **"Less secure app" error**: Make sure you're using an app password, not your regular password
- **"2FA required"**: Enable 2-Factor Authentication first
