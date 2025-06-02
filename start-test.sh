#!/bin/bash

echo "🚀 Starting CoachingKart Authentication Test..."

# Check if database exists, if not create it
if [ ! -f "prisma/dev.db" ]; then
    echo "📊 Setting up database..."
    npx prisma db push
    echo "🌱 Seeding demo data..."
    npm run db:seed
fi

echo "🏃‍♂️ Starting development server..."
echo "🌐 Server will be available at: http://localhost:3000"
echo ""
echo "🔑 Demo accounts:"
echo "  Student: student@demo.com / password123"
echo "  Coach:   coach@demo.com / password123" 
echo "  Admin:   admin@demo.com / password123"
echo ""
echo "Press Ctrl+C to stop the server"

npm run dev
