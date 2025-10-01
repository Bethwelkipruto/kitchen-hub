#!/bin/bash

echo "🚀 Starting Kitchen Hub Application..."

# Check if virtual environment exists
if [ ! -d "server/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd server
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "📦 Installing backend dependencies..."
cd server
source venv/bin/activate

# Install required packages (excluding psycopg2-binary for local dev)
pip install "Flask>=2.3.3" "Flask-SQLAlchemy>=3.1.0" "SQLAlchemy>=2.0.0" "Flask-Migrate>=4.0.5" "Flask-RESTful>=0.3.10" "Flask-CORS>=4.0.0" "SQLAlchemy-Serializer>=1.4.1" "Werkzeug>=2.3.7" "PyJWT>=2.8.0" "Faker>=19.0.0" > /dev/null 2>&1

# Seed database if it doesn't exist
if [ ! -f "instance/app.db" ]; then
    echo "🌱 Seeding database..."
    python seed.py
fi

# Start backend server in background
echo "🔧 Starting Flask backend server..."
python app.py &
BACKEND_PID=$!

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install > /dev/null 2>&1

# Start frontend server
echo "🎨 Starting React frontend server..."
npm start &
FRONTEND_PID=$!

cd ..

echo "✅ Kitchen Hub is starting up!"
echo "🔧 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "🔐 Admin Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "👤 Test User Login:"
echo "   Username: john_doe"
echo "   Password: password123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait