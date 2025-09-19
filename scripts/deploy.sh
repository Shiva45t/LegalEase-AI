#!/bin/bash

# LegalEase AI Deployment Script
# This script builds and deploys the app to Firebase Hosting

echo "🚀 Starting LegalEase AI deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please login to Firebase first:"
    firebase login
fi

# Build the Next.js app for static export
echo "📦 Building Next.js app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Deploy to Firebase Hosting
echo "🌐 Deploying to Firebase Hosting..."
firebase deploy --only hosting --project legalease-ai-931f0

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo "🔗 Your app is live at: https://legalease-ai-931f0-1c00b.web.app"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

echo "✨ LegalEase AI deployment complete!"
