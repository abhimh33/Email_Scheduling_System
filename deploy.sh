#!/bin/bash

# ReachInbox Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 ReachInbox Deployment Script"
echo "================================"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env not found!"
    echo "Please copy backend/.env.example to backend/.env and configure it"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "❌ frontend/.env.local not found!"
    echo "Please copy frontend/.env.example to frontend/.env.local and configure it"
    exit 1
fi

echo "✅ Environment files found"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"

echo "🗄️  Running database migrations..."
npx prisma migrate deploy
echo "✅ Database migrations complete"

echo "🏗️  Building backend..."
npm run build
echo "✅ Backend built successfully"

cd ..

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

echo "🏗️  Building frontend..."
npm run build
echo "✅ Frontend built successfully"

cd ..

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: cd backend && npm start"
echo "2. Start frontend: cd frontend && npm start"
echo ""
echo "Or use PM2 for production:"
echo "  pm2 start backend/dist/server.js --name reachinbox-backend"
echo "  pm2 start npm --name reachinbox-frontend -- start"
echo ""
