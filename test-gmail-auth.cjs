/**
 * Gmail Authentication Test Script
 * Tests Gmail SMTP connection with current environment variables
 */

const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testGmailAuth() {
    console.log('🔍 Gmail Authentication Test');
    console.log('============================\n');

    // Check environment variables
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    console.log('1. Environment Variables Check:');
    console.log(`   GMAIL_USER: ${gmailUser ? '✅ Set' : '❌ Missing'} ${gmailUser ? `(${gmailUser})` : ''}`);
    console.log(`   GMAIL_APP_PASSWORD: ${gmailPassword ? '✅ Set' : '❌ Missing'} ${gmailPassword ? `(${gmailPassword.length} chars)` : ''}`);
    
    if (!gmailUser || !gmailPassword) {
        console.log('\n❌ Missing environment variables!');
        console.log('Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local');
        console.log('\nExample:');
        console.log('GMAIL_USER=your-email@gmail.com');
        console.log('GMAIL_APP_PASSWORD=your-16-character-app-password');
        process.exit(1);
    }

    // Validate app password format
    console.log('\n2. App Password Validation:');
    if (gmailPassword.length !== 16) {
        console.log(`❌ App password should be 16 characters (current: ${gmailPassword.length})`);
        console.log('   Generate a new app password at: https://myaccount.google.com/apppasswords');
        process.exit(1);
    }
    
    if (gmailPassword.includes(' ')) {
        console.log('❌ App password contains spaces - remove them!');
        console.log('   Current password:', `"${gmailPassword}"`);
        process.exit(1);
    }
    
    console.log('✅ App password format looks correct');

    // Test SMTP connection
    console.log('\n3. SMTP Connection Test:');
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPassword
        }
    });

    try {
        console.log('   Testing connection...');
        await transporter.verify();
        console.log('✅ SMTP connection successful!');
    } catch (error) {
        console.log('❌ SMTP connection failed:');
        console.log(`   Error: ${error.message}`);
        
        if (error.message.includes('Invalid login')) {
            console.log('\n🔧 Troubleshooting steps:');
            console.log('1. Go to https://myaccount.google.com/apppasswords');
            console.log('2. Generate a new app password for "Mail"');
            console.log('3. Copy the 16-character password (no spaces)');
            console.log('4. Update GMAIL_APP_PASSWORD in .env.local');
            console.log('5. For production: Update in Vercel dashboard');
        }
        
        if (error.message.includes('Less secure app')) {
            console.log('\n🔧 You need to use an App Password, not your regular password');
            console.log('1. Enable 2-Factor Authentication first');
            console.log('2. Then generate an App Password');
        }
        
        process.exit(1);
    }

    // Test sending a simple email
    console.log('\n4. Test Email Send:');
    try {
        const testMailOptions = {
            from: `"Test" <${gmailUser}>`,
            to: gmailUser, // Send to yourself
            subject: 'Gmail SMTP Test - Airport Agreement System',
            text: `This is a test email sent at ${new Date().toISOString()}\n\nIf you receive this, your Gmail SMTP is working correctly!`,
            html: `
                <h2>Gmail SMTP Test</h2>
                <p>This is a test email sent at <strong>${new Date().toISOString()}</strong></p>
                <p>If you receive this, your Gmail SMTP is working correctly!</p>
                <hr>
                <p><em>Airport Agreement System</em></p>
            `
        };

        console.log('   Sending test email...');
        const result = await transporter.sendMail(testMailOptions);
        console.log('✅ Test email sent successfully!');
        console.log(`   Message ID: ${result.messageId}`);
        console.log(`   Sent to: ${gmailUser}`);
        
    } catch (error) {
        console.log('❌ Test email failed:');
        console.log(`   Error: ${error.message}`);
        process.exit(1);
    }

    console.log('\n🎉 Gmail authentication test completed successfully!');
    console.log('Your Gmail SMTP is properly configured.');
    console.log('\nNext steps:');
    console.log('1. For local development: Your .env.local is working');
    console.log('2. For production: Set these same values in Vercel dashboard');
    console.log('3. Deploy to test production email functionality');
}

// Run the test
testGmailAuth().catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
});