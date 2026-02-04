#!/bin/bash
echo "👻 Summoning GHOSTLY..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in your PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
  echo "✨ Dependencies installed."
  echo "🚀 Starting the portal..."
  echo "-------------------------------------------------------"
  echo "👉 OPEN THIS IN YOUR BROWSER: http://localhost:3000"
  echo "-------------------------------------------------------"
  npm run dev
else
  echo "❌ Failed to install dependencies."
fi
