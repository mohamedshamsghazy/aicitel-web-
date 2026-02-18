#!/bin/bash

# Production Deployment Script
# Automates the deployment process for Aicitel web application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Aicitel Production Deployment Script"
echo "========================================"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Error: package.json not found. Please run from the frontend directory."
    exit 1
fi

# Step 1: Environment Check
echo "Step 1: Checking environment variables..."
REQUIRED_VARS=(
    "NEXT_PUBLIC_STRAPI_URL"
    "STRAPI_API_TOKEN"
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY"
    "TURNSTILE_SECRET_KEY"
    "UPSTASH_REDIS_REST_URL"
    "UPSTASH_REDIS_REST_TOKEN"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_error "Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo ""
    print_warning "Please set these in your .env.local file or Vercel dashboard"
    exit 1
fi

print_success "All required environment variables are set"

# Step 2: Run tests
echo ""
echo "Step 2: Running tests..."
if npm test; then
    print_success "All tests passed"
else
    print_warning "Some tests failed, but continuing..."
fi

# Step 3: Security audit
echo ""
echo "Step 3: Running security audit..."
npm audit --production --audit-level=high
if [ $? -eq 0 ]; then
    print_success "No high/critical vulnerabilities found"
else
    print_error "Security vulnerabilities detected!"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 4: Build application
echo ""
echo "Step 4: Building application..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 5: Check bundle size
echo ""
echo "Step 5: Checking bundle size..."
BUNDLE_SIZE=$(du -sh .next/static | cut -f1)
print_success "Bundle size: $BUNDLE_SIZE"

# Step 6: Deploy to Vercel
echo ""
echo "Step 6: Deploying to Vercel..."
read -p "Deploy to production? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v vercel &> /dev/null; then
        vercel --prod
        print_success "Deployment initiated"
    else
        print_error "Vercel CLI not installed. Install with: npm i -g vercel"
        exit 1
    fi
else
    print_warning "Deployment skipped"
fi

# Step 7: Post-deployment checks
echo ""
echo "Step 7: Post-deployment checklist..."
echo "  [ ] Visit production URL and verify it loads"
echo "  [ ] Submit test application form"
echo "  [ ] Submit test inquiry form"
echo "  [ ] Check Sentry dashboard for errors"
echo "  [ ] Verify HubSpot contacts created (if configured)"
echo "  [ ] Set up uptime monitoring"
echo ""
print_success "Deployment script complete!"
echo ""
echo "📊 Monitor your deployment:"
echo "  - Vercel Dashboard: https://vercel.com/dashboard"
echo "  - Sentry: https://sentry.io"
echo "  - Analytics: Check Vercel Analytics"
