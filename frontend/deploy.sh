#!/bin/bash

# URL Shortener Frontend Deployment Script
# This script helps deploy the React frontend to various platforms

echo "🚀 URL Shortener Frontend Deployment Script"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Copy environment variables
if [ -f ".env.example" ]; then
    if [ ! -f ".env.local" ]; then
        print_status "Creating .env.local from .env.example"
        cp .env.example .env.local
    fi
fi

# Build the project
print_status "Building the React application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
    print_status "Build files are available in the 'build' directory"
else
    print_error "Build failed"
    exit 1
fi

# Optional: Test the build locally
read -p "Do you want to test the build locally? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Starting local server to test the build..."
    npx serve -s build -l 3000 &
    SERVER_PID=$!
    
    print_success "Local server started at http://localhost:3000"
    print_warning "Press Ctrl+C to stop the server"
    
    # Wait for user to stop the server
    wait $SERVER_PID
fi

print_success "Deployment script completed!"
echo
echo "Next steps:"
echo "1. Deploy the 'build' folder to your hosting platform"
echo "2. Common platforms:"
echo "   - Netlify: Drag and drop the 'build' folder"
echo "   - Vercel: Connect your GitHub repo"
echo "   - Firebase: Use 'firebase deploy'"
echo "   - GitHub Pages: Use 'gh-pages' package"
echo
echo "Your backend is already deployed at:"
echo "https://url-shortener-backend-k0pv.onrender.com"
echo
print_success "Happy deploying! 🎉"
