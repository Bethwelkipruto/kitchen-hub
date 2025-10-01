#!/bin/bash

echo "🚀 Kitchen Hub Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Kitchen Hub Restaurant Management System"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing latest changes..."
    git add .
    git commit -m "Update: Professional UI improvements and deployment preparation"
fi

echo ""
echo "🔧 Deployment Steps:"
echo "1. Push code to GitHub"
echo "2. Deploy Backend to Render"
echo "3. Deploy Frontend to Render"
echo ""

echo "📋 Backend Deployment (Render Web Service):"
echo "   - Root Directory: server"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: python app.py"
echo "   - Environment Variables:"
echo "     * DATABASE_URL=postgresql://..."
echo "     * SECRET_KEY=your-secret-key"
echo "     * FRONTEND_URL=https://your-frontend.onrender.com"
echo "     * FLASK_ENV=production"
echo "     * PORT=5000"
echo ""

echo "🎨 Frontend Deployment (Render Static Site):"
echo "   - Root Directory: client"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: build"
echo "   - Environment Variables:"
echo "     * REACT_APP_API_BASE_URL=https://your-backend.onrender.com"
echo ""

echo "🔐 Admin Credentials:"
echo "   - Username: admin"
echo "   - Password: admin123"
echo ""

read -p "Push to GitHub now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing to GitHub..."
    
    # Check if remote exists
    if ! git remote get-url origin > /dev/null 2>&1; then
        echo "❌ No GitHub remote found. Please add your repository:"
        echo "   git remote add origin https://github.com/yourusername/kitchen-hub.git"
        exit 1
    fi
    
    git push -u origin main || git push -u origin master
    echo "✅ Code pushed to GitHub!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Go to https://render.com"
    echo "2. Create new Web Service for backend"
    echo "3. Create new Static Site for frontend"
    echo "4. Use the configuration above"
else
    echo "⏸️  Deployment paused. Run this script again when ready."
fi