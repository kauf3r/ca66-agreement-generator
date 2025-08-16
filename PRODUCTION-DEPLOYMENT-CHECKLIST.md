# Production Deployment Checklist

## Gmail Integration Setup

### 1. Environment Variables in Vercel
- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Add `GMAIL_USER` with your Gmail address
- [ ] Add `GMAIL_APP_PASSWORD` with your 16-character app password
- [ ] Set both variables to "Production" environment
- [ ] **Important**: No spaces in the app password!

### 2. Gmail Account Security
- [ ] 2-Factor Authentication is enabled
- [ ] App password is generated for "Mail" application
- [ ] App password is exactly 16 characters (no spaces)
- [ ] Old app passwords are revoked (security best practice)

### 3. Test Local Setup First
```bash
# Test your local environment
node test-gmail-auth.cjs
```

### 4. Deploy and Test Production
- [ ] Deploy to Vercel
- [ ] Test email functionality in production
- [ ] Check Vercel function logs for errors

## Common Production Issues

### "Username and Password not accepted"
**Cause**: Environment variables not set correctly in Vercel
**Solution**:
1. Check Vercel dashboard environment variables
2. Ensure variables are set for "Production" environment
3. Redeploy after adding variables

### "Invalid login" Error
**Cause**: App password is incorrect or expired
**Solution**:
1. Generate new app password at https://myaccount.google.com/apppasswords
2. Update Vercel environment variable
3. Redeploy application

### Environment Variables Not Loading
**Cause**: Variables not set for correct environment
**Solution**:
1. In Vercel dashboard, ensure variables are set for "Production"
2. Check variable names match exactly (case-sensitive)
3. Redeploy after changes

## Debugging Production Issues

### 1. Check Vercel Function Logs
- Go to Vercel Dashboard → Your Project → Functions
- Click on `/api/send-email` function
- Check "Logs" tab for error messages

### 2. Test Environment Variables
Add this to your API function temporarily:
```javascript
console.log('Production environment check:', {
    hasGmailUser: !!process.env.GMAIL_USER,
    hasGmailPassword: !!process.env.GMAIL_APP_PASSWORD,
    gmailUserLength: process.env.GMAIL_USER?.length || 0,
    gmailPasswordLength: process.env.GMAIL_APP_PASSWORD?.length || 0
});
```

### 3. Verify Gmail Settings
- Check Google Account security settings
- Ensure no security alerts or account locks
- Verify 2FA is still enabled

## Security Best Practices

### ✅ Do's
- Use different app passwords for development and production
- Rotate app passwords regularly
- Use environment variables (never hardcode credentials)
- Enable 2-Factor Authentication
- Monitor for security alerts

### ❌ Don'ts
- Don't commit credentials to version control
- Don't use regular Gmail password (use app password)
- Don't share app passwords
- Don't log credentials in production

## Quick Fix Commands

### Generate New App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" → "Other"
3. Name: "Airport Agreement System"
4. Copy 16-character password

### Update Vercel Environment
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update `GMAIL_APP_PASSWORD` with new password
3. Redeploy

### Test Production Email
```bash
# After deployment, test the email functionality
# Check browser console for any errors
# Verify email is received
```

## Emergency Contact
If you need immediate help:
1. Check Vercel function logs first
2. Verify environment variables are set
3. Test with new app password
4. Contact support if issues persist
