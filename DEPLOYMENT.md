# LegalEase AI Deployment Guide

## Prerequisites

1. **Firebase CLI**: Install globally
   \`\`\`bash
   npm install -g firebase-tools
   \`\`\`

2. **Firebase Login**: Authenticate with your Google account
   \`\`\`bash
   firebase login
   \`\`\`

3. **Environment Variables**: Ensure `NEXT_PUBLIC_GOOGLE_AI_API_KEY` is set

## Quick Deployment

### Option 1: Using the deployment script
\`\`\`bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
\`\`\`

### Option 2: Using npm scripts
\`\`\`bash
npm run deploy
\`\`\`

### Option 3: Manual deployment
\`\`\`bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
\`\`\`

## Firebase Hosting Configuration

The app is configured to deploy to:
- **Site ID**: `legalease-ai-931f0-1c00b`
- **URL**: https://legalease-ai-931f0-1c00b.web.app
- **Build Output**: `out/` directory (Next.js static export)

## Environment Variables

Make sure to set the following environment variable:

\`\`\`bash
export NEXT_PUBLIC_GOOGLE_AI_API_KEY="your-google-ai-api-key"
\`\`\`

Or create a `.env.local` file:
\`\`\`
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your-google-ai-api-key
\`\`\`

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`
- Verify environment variables are set

### Deployment Issues
- Verify Firebase CLI is logged in: `firebase login`
- Check Firebase project permissions
- Ensure the site ID matches in `firebase.json`

### API Issues
- Verify the Google AI API key is valid
- Check API quotas and billing in Google Cloud Console
- Ensure the API key has proper permissions for Vertex AI

## Local Development

\`\`\`bash
# Start development server
npm run dev

# Test Firebase hosting locally
npm run build
firebase serve --only hosting
\`\`\`

## Production Monitoring

After deployment, monitor:
- Firebase Hosting analytics
- Google Cloud Console for API usage
- Application logs for errors
