# Kitchen Hub - Restaurant Management System

A full-stack web application for restaurant management with user authentication, menu browsing, cart functionality, and admin dashboard.

## 🚀 Live Demo

- **Frontend:** [Kitchen Hub App](https://your-frontend-url.render.com)
- **Backend API:** [Kitchen Hub API](https://your-backend-url.render.com)

## 📋 Features

### User Features
- **Authentication:** User registration and login
- **Menu Browsing:** View categorized menu items with images and descriptions
- **Cart Management:** Add items to cart and manage quantities
- **Order Placement:** Create and track orders
- **User Profile:** View account information and order history

### Admin Features
- **Admin Dashboard:** Comprehensive management interface
- **Menu Management:** Add, edit, and delete menu items
- **Category Management:** Organize menu items by categories
- **Order Management:** View and update order statuses
- **User Management:** View registered users

## 🛠 Tech Stack

### Backend
- **Flask** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-RESTful** - REST API endpoints
- **Flask-CORS** - Cross-origin resource sharing
- **PostgreSQL** - Production database
- **SQLite** - Development database

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS3** - Styling and responsive design

## 📁 Project Structure

```
kitchen-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── context/       # React context providers
│   └── package.json
├── server/                # Flask backend
│   ├── routes/           # API route blueprints
│   ├── models.py         # Database models
│   ├── app.py           # Main Flask application
│   ├── config.py        # App configuration
│   └── requirements.txt # Python dependencies
└── README.md
```

## 🗄 Database Models

- **User** - User accounts with authentication
- **Category** - Menu item categories
- **MenuItem** - Restaurant menu items
- **Order** - Customer orders
- **OrderItem** - Individual items in orders
- **Cart** - Shopping cart functionality

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Menu & Categories
- `GET /api/categories/` - Get all categories
- `POST /api/categories/` - Create category (Admin)
- `GET /api/menu/` - Get all menu items
- `POST /api/menu/` - Create menu item (Admin)

### Orders
- `GET /api/orders/` - Get user orders
- `POST /api/orders/` - Create new order
- `PUT /api/orders/<id>` - Update order status (Admin)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Get all users (Admin)

## 🚀 Local Development

### Prerequisites
- Python 3.11+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Install dependencies
pipenv install
pipenv shell

# Run database migrations
flask db upgrade

# Seed database
python seed.py

# Start server
python app.py
```

### Frontend Setup
```bash
# Install dependencies
npm install --prefix client

# Start development server
npm start --prefix client
```

## 🔐 Admin Access

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## 🌐 Deployment

Deployed on **Render.com** with:
- Backend: Flask web service with PostgreSQL
- Frontend: Static site deployment
- Automatic deployments from GitHub

## 👥 Team

- **Lead Developer:** [Your Name]
- **Frontend Developer:** [Teammate Name]

## 📄 License

This project is licensed under the MIT License.