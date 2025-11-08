#!/bin/bash

echo "🎨 Inner Garden Art - Quick Start"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "✅ .env created! Please edit it with your credentials:"
    echo "   nano .env"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start server
echo "🚀 Starting Inner Garden Art server..."
echo ""
npm start
