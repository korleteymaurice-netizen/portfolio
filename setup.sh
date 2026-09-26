#!/bin/bash

# Portfolio Project - Automated Setup Script
# This script automates the setup process for local development

set -e

echo "================================================"
echo "Portfolio Project - Automated Setup"
echo "================================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Step 1: Environment Setup
echo "Step 1: Setting up environment variables..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✓ Created .env.local from .env.example"
        echo ""
        echo "⚠️  IMPORTANT: Edit .env.local and add:"
        echo "   - DATABASE_URL (PostgreSQL connection string)"
        echo "   - AUTH_SECRET (32-character random secret)"
        echo ""
        echo "To generate AUTH_SECRET, run:"
        echo "  node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
        echo ""
        read -p "Press Enter after updating .env.local... "
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✓ .env.local already exists (skipping)"
fi

# Step 2: Install dependencies
echo ""
echo "Step 2: Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Step 3: Verify environment
echo ""
echo "Step 3: Verifying environment..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Please set it in .env.local"
fi
if [ -z "$AUTH_SECRET" ]; then
    echo "⚠️  AUTH_SECRET not set. Please set it in .env.local"
fi

# Step 4: Build frontend
echo ""
echo "Step 4: Building frontend..."
npm run build
echo "✓ Frontend built successfully"

# Step 5: Database setup prompt
echo ""
echo "Step 5: Database setup"
echo "Run this command to set up the PostgreSQL schema:"
echo "  psql \$DATABASE_URL -f database/schema.sql"
echo ""
echo "Then create an admin user with:"
echo "  psql \$DATABASE_URL -c \"INSERT INTO users (email, password_hash) VALUES ('admin@example.com', '\$2a\$10...');\" "
echo ""

echo "================================================"
echo "✓ Setup Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database URL and auth secret"
echo "2. Set up the PostgreSQL database schema"
echo "3. Create an admin user"
echo "4. Run: npm run dev"
echo "5. Visit: http://localhost:5173/"
echo ""
