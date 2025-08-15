#!/bin/bash
# Development startup script for CA-66 Agreement Generator
# Ensures Gmail credentials are properly loaded from .env.local

echo "🚀 Starting CA-66 Agreement Generator Development Server"
echo "📧 Loading Gmail credentials from .env.local..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Gmail credentials:"
    echo "GMAIL_USER=your-email@gmail.com"
    echo "GMAIL_APP_PASSWORD=your-app-password"
    exit 1
fi

# Load environment variables from .env.local
if [ -f ".env.local" ]; then
    echo "✅ Loading environment variables from .env.local"
    export $(cat .env.local | grep -E '^[A-Z_]+=.*' | xargs)
fi

# Verify Gmail credentials are loaded
if [ -z "$GMAIL_USER" ] || [ -z "$GMAIL_APP_PASSWORD" ]; then
    echo "❌ Error: Gmail credentials not found in .env.local"
    echo "Please add to .env.local:"
    echo "GMAIL_USER=your-email@gmail.com"
    echo "GMAIL_APP_PASSWORD=your-app-password"
    exit 1
fi

echo "✅ Gmail credentials loaded: $GMAIL_USER"
echo "🔧 Starting Vercel development server..."

# Start Vercel with environment variables
vercel dev --listen 3003