# Email System Debug & Fix Guide

## Issues Found & Fixed

### ✅ 1. Gmail App Password Format
**Problem:** Environment variable had spaces which breaks authentication
**Fixed:** Removed spaces from `GMAIL_APP_PASSWORD` in `.env.local`

```bash
# Before (❌)
GMAIL_APP_PASSWORD=iaod yqcb kkxa aems

# After (✅)
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### ⚠️ 2. Vercel Environment Variables (ACTION REQUIRED)
**Problem:** Environment variables only exist locally, not on Vercel
**Solution:** Set environment variables in Vercel dashboard

#### Steps to Fix on Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NODE_ENV=production
```

4. **Important:** Redeploy after adding environment variables

### ✅ 3. Enhanced Error Logging
**Added:** Better debugging information in serverless function to identify SMTP connection issues

## Testing Steps

### Local Testing (Limited)
```bash
# 1. Start local server
npm start

# 2. Open browser developer tools
# 3. Try sending email through UI
# 4. Check console for error messages
```

### Production Testing (Recommended)
1. Deploy to Vercel with environment variables set
2. Use Vercel function logs: `vercel logs`
3. Test email functionality on live site

## Manual Test Script

Create this test file to verify SMTP connection:

```javascript
// test-gmail-smtp.js
const nodemailer = require('nodemailer');

async function testGmailSMTP() {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD  // App password from environment
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail SMTP connection successful!');
    
    // Send test email
    const result = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: 'Test Email - CA-66 System',
      text: 'This is a test email from the CA-66 agreement system.'
    });
    
    console.log('✅ Test email sent:', result.messageId);
  } catch (error) {
    console.error('❌ Gmail SMTP failed:', error);
  }
}

testGmailSMTP();
```

## Common Error Solutions

### "Invalid login"
- **Cause:** Wrong app password or spaces in password
- **Fix:** Regenerate Gmail app password, ensure no spaces

### "Less secure app access"
- **Cause:** Using regular Gmail password instead of app password
- **Fix:** Use 16-character app password from Google

### "2FA required"
- **Cause:** 2-Factor Authentication not enabled
- **Fix:** Enable 2FA in Google Account settings

### Environment variables not found
- **Cause:** Variables not set in Vercel dashboard
- **Fix:** Add environment variables in Vercel project settings

## Debug Console Commands

Check these in browser console on the live site:

```javascript
// Test API endpoint availability
fetch('/api/send-email', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test email client loading
console.log('EmailClient available:', typeof EmailClient);

// Test modal functionality
document.getElementById('email-modal');
```

## Production Deployment Checklist

- [ ] Gmail app password has no spaces
- [ ] Environment variables set in Vercel dashboard
- [ ] Project redeployed after env var changes
- [ ] Test email sending on live site
- [ ] Check Vercel function logs for errors
- [ ] Verify recipient receives email
- [ ] Confirm CC to admin works

## Troubleshooting Resources

1. **Vercel Logs:** `vercel logs --follow`
2. **Gmail App Passwords:** https://myaccount.google.com/apppasswords
3. **Nodemailer Docs:** https://nodemailer.com/smtp/
4. **Browser Developer Tools:** F12 → Console/Network tabs

## Expected Behavior

When working correctly:
1. User clicks "Email Agreement" button
2. Modal opens with form fields
3. User enters email/name, clicks Send
4. Loading spinner appears
5. Success notification shows
6. Email delivered to recipient + CC to admin
7. Modal closes automatically

## Current Status

✅ **Fixed Issues:**
- Gmail app password format
- Enhanced error logging
- Code structure verified

⚠️ **Remaining Actions:**
- Set environment variables in Vercel dashboard  
- Redeploy to Vercel
- Test on live site